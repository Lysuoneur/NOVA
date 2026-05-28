import React from "react";
import { STORE_CONFIG } from "../data/novaData";

export default function Ticker({ variant = "dark" }) {
  const items = STORE_CONFIG.announcementItems;
  const repeated = [...items, ...items, ...items, ...items];

  if (variant === "gold") {
    return (
      <div className="w-full overflow-hidden border-y border-gold/30 bg-gold/5">
        <div className="whitespace-nowrap py-2.5 flex" style={{ animation: "ticker 30s linear infinite" }}>
          {repeated.map((item, i) => (
            <span key={i} className="mx-6 text-xs font-mono uppercase tracking-widest text-black/60">
              ✦ {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-black border-y border-black">
      <div className="whitespace-nowrap py-3 flex" style={{ animation: "ticker 25s linear infinite" }}>
        {repeated.map((item, i) => (
          <span key={i} className="mx-6 text-sm font-mono tracking-widest text-white/80 uppercase">
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  );
}