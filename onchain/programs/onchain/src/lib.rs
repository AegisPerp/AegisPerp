use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("6h1imPy2SzZNBUa535uy2hcCWj2WFYbeMw5Qgnurtbom");

// ── constants ────────────────────────────────────────────────────────────────
const LAUNCH_FEE_LAMPORTS: u64 = 300_000_000; // 0.3 SOL
const BPS: u128 = 10_000;
const CREATOR_FEE_SHARE_BPS: u128 = 1_000; // 10% of trading fee to market creator
const FUNDING_SCALE: i128 = 1_000_000_000; // 1e9 fixed-point for funding index
const FUNDING_K: i128 = 100; // funding sensitivity per second (tuning)
const MAX_FUNDING_DT: i64 = 3_600; // cap funding accrual window (s)
const MAINT_MARGIN_BPS: u128 = 500; // 5% maintenance margin
const LIQ_REWARD_BPS: u128 = 100; // 1% of notional to the liquidator

#[program]
pub mod onchain {
    use super::*;

    /// One-time global setup: USDC collateral mint, vault + insurance PDAs, fee.
    pub fn initialize_exchange(ctx: Context<InitializeExchange>, taker_fee_bps: u16) -> Result<()> {
        let ex = &mut ctx.accounts.exchange;
        ex.admin = ctx.accounts.admin.key();
        ex.usdc_mint = ctx.accounts.usdc_mint.key();
        ex.vault = ctx.accounts.vault.key();
        ex.insurance = ctx.accounts.insurance.key();
        ex.market_count = 0;
        ex.taker_fee_bps = taker_fee_bps;
        ex.bump = ctx.bumps.exchange;
        Ok(())
    }

    /// Permissionless market creation for ANY base mint. Pays 0.3 SOL.
    pub fn create_market(
        ctx: Context<CreateMarket>,
        max_leverage: u16,
        virtual_base: u128,
        virtual_quote: u128,
    ) -> Result<()> {
        require!(max_leverage >= 2 && max_leverage <= 100, PerpError::BadLeverage);
        require!(virtual_base > 0 && virtual_quote > 0, PerpError::BadParams);

        // pay launch fee → exchange treasury PDA
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.key(),
                system_program::Transfer {
                    from: ctx.accounts.creator.to_account_info(),
                    to: ctx.accounts.exchange.to_account_info(),
                },
            ),
            LAUNCH_FEE_LAMPORTS,
        )?;

        let m = &mut ctx.accounts.market;
        m.exchange = ctx.accounts.exchange.key();
        m.base_mint = ctx.accounts.base_mint.key();
        m.creator = ctx.accounts.creator.key();
        m.base_reserve = virtual_base;
        m.quote_reserve = virtual_quote;
        m.k = virtual_base.checked_mul(virtual_quote).ok_or(PerpError::MathOverflow)?;
        m.max_leverage = max_leverage;
        m.taker_fee_bps = ctx.accounts.exchange.taker_fee_bps;
        m.cum_volume = 0;
        m.oi_long = 0;
        m.oi_short = 0;
        m.creator_fees = 0;
        m.cumulative_funding = 0;
        m.last_funding_ts = Clock::get()?.unix_timestamp;
        m.status = 0;
        m.bump = ctx.bumps.market;

        ctx.accounts.exchange.market_count = ctx.accounts.exchange.market_count.saturating_add(1);
        Ok(())
    }

    /// Open an isolated-margin position against the market vAMM.
    pub fn open_position(
        ctx: Context<OpenPosition>,
        collateral: u64,
        leverage: u16,
        is_long: bool,
    ) -> Result<()> {
        let m = &mut ctx.accounts.market;
        require!(m.status == 0, PerpError::MarketClosed);
        require!(leverage >= 2 && leverage as u16 <= m.max_leverage, PerpError::BadLeverage);
        require!(collateral > 0, PerpError::BadParams);

        // pull collateral USDC into the vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.key(),
                Transfer {
                    from: ctx.accounts.user_usdc.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                    authority: ctx.accounts.owner.to_account_info(),
                },
            ),
            collateral,
        )?;

        let notional = (collateral as u128)
            .checked_mul(leverage as u128)
            .ok_or(PerpError::MathOverflow)?;

        // vAMM swap (constant product, k held fixed)
        let size: u128;
        if is_long {
            let new_quote = m.quote_reserve.checked_add(notional).ok_or(PerpError::MathOverflow)?;
            let new_base = m.k.checked_div(new_quote).ok_or(PerpError::MathOverflow)?;
            size = m.base_reserve.checked_sub(new_base).ok_or(PerpError::MathOverflow)?;
            m.quote_reserve = new_quote;
            m.base_reserve = new_base;
            m.oi_long = m.oi_long.saturating_add(notional);
        } else {
            let new_quote = m.quote_reserve.checked_sub(notional).ok_or(PerpError::InsufficientLiquidity)?;
            let new_base = m.k.checked_div(new_quote).ok_or(PerpError::MathOverflow)?;
            size = new_base.checked_sub(m.base_reserve).ok_or(PerpError::MathOverflow)?;
            m.quote_reserve = new_quote;
            m.base_reserve = new_base;
            m.oi_short = m.oi_short.saturating_add(notional);
        }
        require!(size > 0, PerpError::ZeroSize);

        // trading fee + creator share accrual
        let fee = notional.checked_mul(m.taker_fee_bps as u128).ok_or(PerpError::MathOverflow)? / BPS;
        let creator_cut = (fee.checked_mul(CREATOR_FEE_SHARE_BPS).ok_or(PerpError::MathOverflow)?) / BPS;
        m.creator_fees = m.creator_fees.saturating_add(creator_cut as u64);
        m.cum_volume = m.cum_volume.saturating_add(notional);

        let p = &mut ctx.accounts.position;
        p.owner = ctx.accounts.owner.key();
        p.market = m.key();
        p.collateral = collateral;
        p.size = size;
        p.entry_notional = notional;
        p.entry_funding = m.cumulative_funding;
        p.is_long = is_long;
        p.is_open = true;
        p.bump = ctx.bumps.position;
        Ok(())
    }

    /// Close the position, settle PnL against the vAMM, return collateral ± PnL.
    pub fn close_position(ctx: Context<ClosePosition>) -> Result<()> {
        let m = &mut ctx.accounts.market;
        let p = &ctx.accounts.position;
        require!(p.is_open, PerpError::NoPosition);

        // reverse the vAMM swap to realize PnL (quote terms)
        let pnl: i128;
        if p.is_long {
            let new_base = m.base_reserve.checked_add(p.size).ok_or(PerpError::MathOverflow)?;
            let new_quote = m.k.checked_div(new_base).ok_or(PerpError::MathOverflow)?;
            let quote_out = m.quote_reserve.checked_sub(new_quote).ok_or(PerpError::MathOverflow)?;
            m.base_reserve = new_base;
            m.quote_reserve = new_quote;
            m.oi_long = m.oi_long.saturating_sub(p.entry_notional);
            pnl = quote_out as i128 - p.entry_notional as i128;
        } else {
            let new_base = m.base_reserve.checked_sub(p.size).ok_or(PerpError::MathOverflow)?;
            let new_quote = m.k.checked_div(new_base).ok_or(PerpError::MathOverflow)?;
            let quote_in = new_quote.checked_sub(m.quote_reserve).ok_or(PerpError::MathOverflow)?;
            m.base_reserve = new_base;
            m.quote_reserve = new_quote;
            m.oi_short = m.oi_short.saturating_sub(p.entry_notional);
            pnl = p.entry_notional as i128 - quote_in as i128;
        }

        // apply accrued funding (longs pay shorts when funding index is positive)
        let funding_delta = m.cumulative_funding - p.entry_funding;
        let funding_pay = (p.entry_notional as i128).saturating_mul(funding_delta) / FUNDING_SCALE;
        let pnl = if p.is_long { pnl.saturating_sub(funding_pay) } else { pnl.saturating_add(funding_pay) };

        // payout = collateral + pnl (clamped at 0; capped to vault balance)
        let mut payout = (p.collateral as i128) + pnl;
        if payout < 0 { payout = 0; }
        let mut payout = payout as u64;
        let vault_balance = ctx.accounts.vault.amount;
        if payout > vault_balance { payout = vault_balance; }

        if payout > 0 {
            let bump = ctx.accounts.exchange.bump;
            let seeds: &[&[u8]] = &[b"exchange", core::slice::from_ref(&bump)];
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.key(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.user_usdc.to_account_info(),
                        authority: ctx.accounts.exchange.to_account_info(),
                    },
                    &[seeds],
                ),
                payout,
            )?;
        }
        Ok(())
    }

    /// Permissionless funding update (keeper). Skew-based: long-heavy → longs pay shorts.
    pub fn update_funding(ctx: Context<UpdateFunding>) -> Result<()> {
        let m = &mut ctx.accounts.market;
        let now = Clock::get()?.unix_timestamp;
        let mut dt = now - m.last_funding_ts;
        if dt < 0 { dt = 0; }
        if dt > MAX_FUNDING_DT { dt = MAX_FUNDING_DT; }
        let total = m.oi_long as i128 + m.oi_short as i128;
        if total > 0 && dt > 0 {
            let skew = m.oi_long as i128 - m.oi_short as i128;
            let rate = skew.saturating_mul(FUNDING_K).saturating_mul(dt as i128) / total;
            m.cumulative_funding = m.cumulative_funding.saturating_add(rate);
        }
        m.last_funding_ts = now;
        Ok(())
    }

    /// Liquidate an underwater position. Anyone may call; liquidator earns a reward.
    pub fn liquidate(ctx: Context<Liquidate>) -> Result<()> {
        let m = &mut ctx.accounts.market;
        let p = &ctx.accounts.position;
        require!(p.is_open, PerpError::NoPosition);

        let pnl: i128;
        if p.is_long {
            let new_base = m.base_reserve.checked_add(p.size).ok_or(PerpError::MathOverflow)?;
            let new_quote = m.k.checked_div(new_base).ok_or(PerpError::MathOverflow)?;
            let quote_out = m.quote_reserve.checked_sub(new_quote).ok_or(PerpError::MathOverflow)?;
            m.base_reserve = new_base;
            m.quote_reserve = new_quote;
            m.oi_long = m.oi_long.saturating_sub(p.entry_notional);
            pnl = quote_out as i128 - p.entry_notional as i128;
        } else {
            let new_base = m.base_reserve.checked_sub(p.size).ok_or(PerpError::MathOverflow)?;
            let new_quote = m.k.checked_div(new_base).ok_or(PerpError::MathOverflow)?;
            let quote_in = new_quote.checked_sub(m.quote_reserve).ok_or(PerpError::MathOverflow)?;
            m.base_reserve = new_base;
            m.quote_reserve = new_quote;
            m.oi_short = m.oi_short.saturating_sub(p.entry_notional);
            pnl = p.entry_notional as i128 - quote_in as i128;
        }
        let funding_delta = m.cumulative_funding - p.entry_funding;
        let funding_pay = (p.entry_notional as i128).saturating_mul(funding_delta) / FUNDING_SCALE;
        let pnl = if p.is_long { pnl.saturating_sub(funding_pay) } else { pnl.saturating_add(funding_pay) };

        let equity = (p.collateral as i128) + pnl;
        let maintenance = (p.entry_notional as i128) * (MAINT_MARGIN_BPS as i128) / (BPS as i128);
        require!(equity < maintenance, PerpError::NotLiquidatable);

        let mut equity_pos = if equity < 0 { 0 } else { equity };
        let mut reward = (p.entry_notional as i128) * (LIQ_REWARD_BPS as i128) / (BPS as i128);
        if reward > equity_pos { reward = equity_pos; }
        equity_pos -= reward;
        let remainder = equity_pos;

        let bump = ctx.accounts.exchange.bump;
        let seeds: &[&[u8]] = &[b"exchange", core::slice::from_ref(&bump)];
        let vbal = ctx.accounts.vault.amount;
        let reward_u = (reward as u64).min(vbal);
        if reward_u > 0 {
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.key(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.liquidator_usdc.to_account_info(),
                        authority: ctx.accounts.exchange.to_account_info(),
                    },
                    &[seeds],
                ),
                reward_u,
            )?;
        }
        let rem_u = (remainder as u64).min(vbal - reward_u);
        if rem_u > 0 {
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.key(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.owner_usdc.to_account_info(),
                        authority: ctx.accounts.exchange.to_account_info(),
                    },
                    &[seeds],
                ),
                rem_u,
            )?;
        }
        Ok(())
    }
}

// ── accounts state ─────────────────────────────────────────────────────────────
#[account]
#[derive(InitSpace)]
pub struct Exchange {
    pub admin: Pubkey,
    pub usdc_mint: Pubkey,
    pub vault: Pubkey,
    pub insurance: Pubkey,
    pub market_count: u64,
    pub taker_fee_bps: u16,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub exchange: Pubkey,
    pub base_mint: Pubkey,
    pub creator: Pubkey,
    pub base_reserve: u128,
    pub quote_reserve: u128,
    pub k: u128,
    pub max_leverage: u16,
    pub taker_fee_bps: u16,
    pub cum_volume: u128,
    pub oi_long: u128,
    pub oi_short: u128,
    pub creator_fees: u64,
    pub cumulative_funding: i128,
    pub last_funding_ts: i64,
    pub status: u8,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Position {
    pub owner: Pubkey,
    pub market: Pubkey,
    pub collateral: u64,
    pub size: u128,
    pub entry_notional: u128,
    pub entry_funding: i128,
    pub is_long: bool,
    pub is_open: bool,
    pub bump: u8,
}

// ── instruction contexts ────────────────────────────────────────────────────────
#[derive(Accounts)]
pub struct InitializeExchange<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    pub usdc_mint: Account<'info, Mint>,
    #[account(init, payer = admin, space = 8 + Exchange::INIT_SPACE, seeds = [b"exchange"], bump)]
    pub exchange: Account<'info, Exchange>,
    #[account(init, payer = admin, seeds = [b"vault"], bump, token::mint = usdc_mint, token::authority = exchange)]
    pub vault: Account<'info, TokenAccount>,
    #[account(init, payer = admin, seeds = [b"insurance"], bump, token::mint = usdc_mint, token::authority = exchange)]
    pub insurance: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    pub base_mint: Account<'info, Mint>,
    #[account(mut, seeds = [b"exchange"], bump = exchange.bump)]
    pub exchange: Account<'info, Exchange>,
    #[account(init, payer = creator, space = 8 + Market::INIT_SPACE, seeds = [b"market", base_mint.key().as_ref()], bump)]
    pub market: Account<'info, Market>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct OpenPosition<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, seeds = [b"exchange"], bump = exchange.bump)]
    pub exchange: Account<'info, Exchange>,
    #[account(mut, seeds = [b"market", market.base_mint.as_ref()], bump = market.bump)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user_usdc: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: Account<'info, TokenAccount>,
    #[account(init, payer = owner, space = 8 + Position::INIT_SPACE, seeds = [b"position", market.key().as_ref(), owner.key().as_ref()], bump)]
    pub position: Account<'info, Position>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClosePosition<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, seeds = [b"exchange"], bump = exchange.bump)]
    pub exchange: Account<'info, Exchange>,
    #[account(mut, seeds = [b"market", market.base_mint.as_ref()], bump = market.bump)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user_usdc: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut, close = owner, seeds = [b"position", market.key().as_ref(), owner.key().as_ref()], bump = position.bump, has_one = owner)]
    pub position: Account<'info, Position>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateFunding<'info> {
    #[account(mut, seeds = [b"market", market.base_mint.as_ref()], bump = market.bump)]
    pub market: Account<'info, Market>,
}

#[derive(Accounts)]
pub struct Liquidate<'info> {
    #[account(mut)]
    pub liquidator: Signer<'info>,
    #[account(mut, seeds = [b"exchange"], bump = exchange.bump)]
    pub exchange: Account<'info, Exchange>,
    #[account(mut, seeds = [b"market", market.base_mint.as_ref()], bump = market.bump)]
    pub market: Account<'info, Market>,
    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: Account<'info, TokenAccount>,
    /// CHECK: position owner; receives any remainder and the position rent
    #[account(mut)]
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    pub owner_usdc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub liquidator_usdc: Account<'info, TokenAccount>,
    #[account(mut, close = owner, has_one = owner, has_one = market,
        seeds = [b"position", market.key().as_ref(), owner.key().as_ref()], bump = position.bump)]
    pub position: Account<'info, Position>,
    pub token_program: Program<'info, Token>,
}

// ── errors ──────────────────────────────────────────────────────────────────────
#[error_code]
pub enum PerpError {
    #[msg("leverage must be between 2x and the market max")]
    BadLeverage,
    #[msg("invalid parameters")]
    BadParams,
    #[msg("math overflow")]
    MathOverflow,
    #[msg("market is not active")]
    MarketClosed,
    #[msg("insufficient vAMM liquidity")]
    InsufficientLiquidity,
    #[msg("resulting position size is zero")]
    ZeroSize,
    #[msg("no open position")]
    NoPosition,
    #[msg("position is not liquidatable")]
    NotLiquidatable,
}
