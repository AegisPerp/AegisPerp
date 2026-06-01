import { useWallet } from "../../lib/wallet";

export function WalletModal() {
  const { chooserOpen, closeChooser, connect, connecting, address, walletName, disconnect } = useWallet();
  if (!chooserOpen) return null;
  const short = address ? address.slice(0, 4) + "…" + address.slice(-4) : "";

  return (
    <div className="modal-backdrop" onClick={closeChooser}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{address ? "Wallet" : "Connect a wallet"}</h3>
          <button className="modal-x" onClick={closeChooser} aria-label="Close">✕</button>
        </div>

        {address ? (
          <>
            <div className="wallet-connected">
              <img src={`/logos/${walletName}.svg`} alt={walletName ?? ""} />
              <div>
                <div className="wn">{walletName === "phantom" ? "Phantom" : "Solflare"}</div>
                <div className="wa">{short}</div>
              </div>
            </div>
            <button className="wallet-opt danger" onClick={disconnect}>Disconnect</button>
          </>
        ) : (
          <>
            <button className="wallet-opt" onClick={() => connect("phantom")} disabled={connecting}>
              <img src="/logos/phantom.svg" alt="Phantom" />
              <span className="nm">Phantom</span>
              <span className="tag">Popular</span>
            </button>
            <button className="wallet-opt" onClick={() => connect("solflare")} disabled={connecting}>
              <img src="/logos/solflare.svg" alt="Solflare" />
              <span className="nm">Solflare</span>
            </button>
            <div className="wallet-note">{connecting ? "Opening wallet…" : "Pick your main wallet to connect."}</div>
          </>
        )}
      </div>
    </div>
  );
}
