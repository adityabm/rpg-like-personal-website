import React from 'react';

export const D20 = ({ rolling, value, resultType }) => {
  const color = resultType === 'crit' ? 'text-yellow-400' : resultType === 'fail' ? 'text-red-500' : 'text-amber-500';
  return (
    <div className={`relative w-16 h-16 flex items-center justify-center transition-all duration-300 ${rolling ? 'animate-bounce' : 'scale-110'}`}>
      <svg viewBox="0 0 100 100" className={`w-full h-full fill-none stroke-current transition-transform duration-700 ${rolling ? 'animate-spin' : ''} ${color}`}>
        <path strokeWidth="3" d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" />
        <path strokeWidth="1" d="M50 5 L50 35 M90 25 L50 35 M10 25 L50 35" />
        <path strokeWidth="1" d="M50 95 L50 65 M90 75 L50 65 M10 75 L50 65" />
        <path strokeWidth="1" d="M50 35 L90 75 M50 35 L10 75 M50 65 L90 25 M50 65 L10 25" />
      </svg>
      <span className={`absolute font-black text-xl text-white transition-all duration-300 ${rolling ? 'opacity-0' : 'opacity-100 scale-100'}`}>
        {rolling ? '?' : value}
      </span>
    </div>
  );
};
