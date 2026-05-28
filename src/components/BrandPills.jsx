import React from "react";
import { BRANDS } from "../data/novaData";

export default function BrandPills({ onPick, selected }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BRANDS.map((b, i) => (
        <button
          key={b.id}
          onClick={() => onPick?.(b.name)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150
            ${selected === b.name
              ? "bg-black text-white border-black shadow-hard"
              : "bg-white text-black/70 border-black/10 hover:border-gold hover:text-black hover:shadow-[0_2px_8px_rgba(212,175,55,0.2)]"
            }`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {b.name}
        </button>
      ))}
    </div>
  );
}