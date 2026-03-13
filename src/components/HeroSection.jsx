import React from 'react';
import { Mail, Zap, Flame, Dices } from 'lucide-react';
import { StatBar } from './StatBar';
import { D20 } from './D20';
import { INITIAL_STATS_DATA } from '../lib/data';

export const HeroSection = ({ t, stats, luckStatus, diceRolling, diceValue, getFateMessageLocal, rollDice, homepageData }) => {
  const heroNameParts = (t.hero?.name || INITIAL_STATS_DATA.name).split(' ');
  const firstWord = heroNameParts[0] || '';
  const restOfName = heroNameParts.slice(1).join(' ');

  return (
    <section id="profile" className="grid md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-5 relative">
        <div className={`absolute -inset-6 bg-gradient-to-tr from-amber-600 to-transparent rounded-full blur-3xl opacity-10`} />
        <div className={`relative aspect-square rounded-3xl border-4 overflow-hidden border-white dark:border-slate-800 shadow-2xl`}>
          <img src="myimage.jpeg" alt="Hero Avatar" className={`w-full h-full object-cover transition-all duration-700 ${luckStatus === 'fail' ? 'grayscale brightness-50 sepia' : 'grayscale-0'}`} />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded shadow-lg">{t.ui?.lvl} {INITIAL_STATS_DATA.level}</div>
              <span className="text-white font-bold tracking-tight uppercase">{t.hero?.class}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 space-y-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
          {firstWord} <span className="text-amber-500">{restOfName}</span>
        </h1>
        <p className="text-lg leading-relaxed opacity-70 italic border-l-4 border-amber-500 pl-6">"{homepageData?.about_me || t.hero?.bio}"</p>

        {homepageData?.hero_stacks && (
          <div className="flex flex-wrap gap-2 pt-2">
            {homepageData.hero_stacks.map((stack, i) => (
              <span key={i} className="text-[10px] px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-bold uppercase tracking-widest">{stack}</span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatBar label={t.ui?.health} value={stats.hp} max={100} color={luckStatus === 'fail' ? 'bg-red-500 animate-pulse' : 'bg-red-600'} icon={<Zap className="w-3 h-3" />} />
          <StatBar label={t.ui?.mana} value={stats.mana} max={100} color={luckStatus === 'crit' ? 'bg-yellow-400 shadow-[0_0_15px_#f59e0b]' : 'bg-blue-600'} icon={<Flame className="w-3 h-3" />} />
        </div>

        <div className="flex flex-wrap gap-4 pt-4 items-center">
          <button onClick={() => window.open('mailto:me@adit.dev', '_blank')} className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer">
            <Mail className="w-5 h-5" /> {t.ui?.message}
          </button>
          
          <div className="flex items-center gap-4 bg-black/5 p-1 pr-6 rounded-2xl border border-white/5 dark:bg-white/5">
            <button onClick={rollDice} disabled={diceRolling} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-500 rounded-xl transition-all active:scale-90 cursor-pointer">
              <Dices className={`w-8 h-8 ${diceRolling ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.ui?.fateTitle}</span>
              <span className="text-sm font-bold">{t.ui?.rollBtn}</span>
            </div>
          </div>
        </div>
        
        <div className={`mt-8 min-h-[100px] transition-all duration-500 p-6 rounded-2xl border ${luckStatus ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${luckStatus === 'crit' ? 'bg-yellow-400/10 border-yellow-400/30' : luckStatus === 'fail' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/5 border-amber-500/20'}`}>
          <div className="flex items-center gap-6">
            <D20 rolling={diceRolling} value={diceValue} resultType={luckStatus} />
            <div className="flex flex-col">
              <p className={`text-2xl font-black uppercase tracking-tighter ${luckStatus === 'crit' ? 'text-yellow-400' : luckStatus === 'fail' ? 'text-red-500' : 'text-amber-500'}`}>
                {diceRolling ? t.ui?.rolling : (diceValue === 20 ? "Natural 20!" : diceValue === 1 ? "Natural 1..." : `Rolled a ${diceValue}`)}
              </p>
              <p className="text-sm italic opacity-80 leading-snug">{diceRolling ? "" : getFateMessageLocal(diceValue)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
