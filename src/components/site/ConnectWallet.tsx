import { useWallet } from "../../lib/wallet";

export function ConnectWallet({ className = "btn btn-primary btn-lg" }: { className?: string }) {
  const { address, walletName, openChooser } = useWallet();
  const short = address ? address.slice(0, 4) + "…" + address.slice(-4) : "";
  return (
    <button className={className} onClick={openChooser}>
      {address ? (
        <>
          <img src={`/logos/${walletName}.svg`} alt="" style={{ width: 18, height: 18, borderRadius: 5 }} />
          {short}
        </>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
}
