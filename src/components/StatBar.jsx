import React from 'react';

export const StatBar = ({ label, value, max, color, icon }) => (
  <div className="flex flex-col gap-1 w-full">
    <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-wider">
      <span className="flex items-center gap-1">{icon}{label}</span>
      <span>{Math.round(value)} / {max}</span>
    </div>
    <div className="h-2 md:h-3 w-full bg-black/30 rounded-full border border-white/10 overflow-hidden">
      <div 
        className={`h-full transition-all duration-500 ${color}`} 
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  </div>
);
