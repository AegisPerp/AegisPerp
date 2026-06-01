const API_BASE = "/api";

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getMarkets(params?: { status?: string; sort?: string; limit?: number; offset?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  return request(`/markets?${qs}`);
}

export async function getMarket(slug: string) {
  return request(`/markets/${slug}`);
}

export async function createMarket(data: { token_mint: string; token_symbol: string; token_name: string; max_leverage: number; trading_fee: number; creator_wallet: string; launch_tx?: string }) {
  return request("/markets", { method: "POST", body: JSON.stringify(data) });
}

export async function getPositions(wallet: string, status?: string) {
  const qs = new URLSearchParams({ wallet });
  if (status) qs.set("status", status);
  return request(`/positions?${qs}`);
}

export async function openPosition(data: { market_id: string; wallet: string; side: string; leverage: number; collateral: number; order_type?: string }) {
  return request("/positions/open", { method: "POST", body: JSON.stringify(data) });
}

export async function closePosition(id: string, wallet: string) {
  return request(`/positions/${id}/close`, { method: "POST", body: JSON.stringify({ wallet }) });
}

export async function getStats() {
  return request("/stats");
}

export async function getPrices() {
  return request("/prices");
}

export async function getLeaderboard(period?: string) {
  const qs = new URLSearchParams();
  if (period) qs.set("period", period);
  return request(`/leaderboard?${qs}`);
}
