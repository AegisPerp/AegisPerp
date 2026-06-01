import { createContext, useContext, useRef, useState, type ReactNode } from "react";

const RPC = "https://api.mainnet-beta.solana.com";
export type WName = "phantom" | "solflare";

const INSTALL: Record<WName, string> = {
  phantom: "https://phantom.app/download",
  solflare: "https://solflare.com/download",
};

function getProvider(name: WName): any {
  const w = window as any;
  if (name === "phantom") return w.phantom?.solana ?? (w.solana?.isPhantom ? w.solana : undefined);
  return w.solflare ?? (w.solana?.isSolflare ? w.solana : undefined);
}

interface WalletValue {
  address: string;
  balance: number | null;
  walletName: WName | null;
  connecting: boolean;
  chooserOpen: boolean;
  openChooser(): void;
  closeChooser(): void;
  connect(name: WName): Promise<void>;
  disconnect(): void;
}
const Ctx = createContext<WalletValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [walletName, setWalletName] = useState<WName | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const provRef = useRef<any>(null);

  const fetchBal = async (pk: string) => {
    try {
      const r = await fetch(RPC, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [pk] }),
      });
      const j = await r.json();
      setBalance((j?.result?.value ?? 0) / 1e9);
    } catch { setBalance(null); }
  };

  const connect = async (name: WName) => {
    const p = getProvider(name);
    if (!p) { window.open(INSTALL[name], "_blank"); return; }
    setConnecting(true);
    try {
      const res = await p.connect();
      const pk = (res?.publicKey ?? p.publicKey)?.toString?.();
      if (pk) {
        provRef.current = p;
        setWalletName(name);
        setAddress(pk);
        setChooserOpen(false);
        fetchBal(pk);
      }
    } catch { /* user rejected */ }
    setConnecting(false);
  };

  const disconnect = () => {
    try { provRef.current?.disconnect?.(); } catch {}
    provRef.current = null;
    setAddress(""); setBalance(null); setWalletName(null); setChooserOpen(false);
  };

  return (
    <Ctx.Provider value={{
      address, balance, walletName, connecting, chooserOpen,
      openChooser: () => setChooserOpen(true),
      closeChooser: () => setChooserOpen(false),
      connect, disconnect,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWallet(): WalletValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWallet must be used within WalletProvider");
  return v;
}
