export function Partners() {
  const partners = [
    { name: "SOLANA", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="3" fill="currentColor"/></svg> },
    { name: "PHANTOM" },
    { name: "RAYDIUM" },
    { name: "PUMP.FUN" },
    { name: "JUPITER" },
  ];

  return (
    <section className="partners rise d4">
      <div className="eyebrow">Ecosystem</div>
      <div className="partners-row">
        {partners.map((p) => (
          <div className="partner-badge" key={p.name}>
            {p.icon ?? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4"/></svg>}
            {p.name}
          </div>
        ))}
      </div>
    </section>
  );
}
