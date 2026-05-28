import React from "react";
import { STORE_CONFIG } from "../data/novaData";

export default function FeatureStrip() {
  const feats = STORE_CONFIG.features;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {feats.map((f, i) => (
        <div
          key={f.title}
          className="nova-card p-5 flex flex-col gap-2 group"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <span className="text-2xl">{f.icon}</span>
          <div className="font-mono text-[11px] uppercase tracking-wider text-black/40">{f.title}</div>
          <div className="text-sm text-black/60">{f.desc}</div>
        </div>
      ))}
    </div>
  );
}