'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Shield, Wand2, BookOpen, Users, Sun, Moon, ScrollText, Languages, ExternalLink, Package, Castle } from 'lucide-react';
import { INITIAL_STATS_DATA, translations, getInitialStats } from '../lib/data';
import { HeroSection } from '../components/HeroSection';
import { QuestLog } from '../components/QuestLog';
import { SkillTree } from '../components/SkillTree';
import { Library } from '../components/Library';
import { Party } from '../components/Party';
import { Portfolio } from '../components/Portfolio';
import { GuildHall } from '../components/GuildHall';
import { BackgroundAtmosphere } from '../components/BackgroundAtmosphere';

// SSR-safe initial HP/Mana snapshot. HP/Mana depend on `new Date()` and
// `Math.random()` (see `getInitialStats` in lib/data.js), so they cannot be
// evaluated at module scope — server-rendered HTML and the first client
// render must match exactly. `useSyncExternalStore` is the right primitive:
//   - `getServerSnapshot` returns a fixed 100/100 (deterministic SSR),
//   - `getSnapshot` returns the real sampled value, computed once and
//     cached at module scope so each call returns the same reference,
//   - `subscribe` is a no-op because the value never changes after mount.
// No `setState` is ever called inside an effect, which keeps the
// `react-hooks/set-state-in-effect` rule happy.
const SERVER_STATS = { hp: 100, mana: 100 };
let cachedClientStats = null;
const subscribeNoop = () => () => {};
const getClientStatsSnapshot = () => {
  if (cachedClientStats === null) cachedClientStats = getInitialStats();
  return cachedClientStats;
};

export default function ClientPage({ homepageData, experiencesData, projectsData, libraryBooksData }) {
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(20);
  const [luckStatus, setLuckStatus] = useState(null);
  // `useSyncExternalStore` — server returns 100/100, client returns the real
  // sampled value. See the comment block at the top of this file for the
  // full rationale. The bars rerender with real HP/Mana on the very next
  // paint after hydration with no warning.
  const stats = useSyncExternalStore(subscribeNoop, getClientStatsSnapshot, () => SERVER_STATS);
  const [screenEffect, setScreenEffect] = useState(null);

  const t = translations[lang] || translations.en;

  // Scroll Sync
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    const sections = ['profile', 'quests', 'portfolio', 'skills', 'library', 'party', 'guild'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { 
        if (entry.isIntersecting) setActiveTab(entry.target.id); 
      });
    }, { threshold: 0.2 });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Persist language/theme prefs so the standalone BookReader route
  // (/library/[slug]) can pick them up from localStorage on mount. This is
  // write-only by design — the toggles keep their current behavior.
  useEffect(() => {
    localStorage.setItem('lang', lang);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [lang, isDarkMode]);

  const rollDice = () => {
    if (diceRolling) return;
    setDiceRolling(true);
    setLuckStatus(null);
    setScreenEffect(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      setDiceValue(roll);
      setDiceRolling(false);

      if (roll === 1) {
        setLuckStatus('fail');
        setScreenEffect('shake-red');
        setStats(prev => ({ ...prev, hp: 40 }));
        setTimeout(() => setStats(prev => ({ ...prev, hp: 100 })), 4000);
      } else if (roll === 20) {
        setLuckStatus('crit');
        setScreenEffect('shake-gold');
        setStats(prev => ({ ...prev, mana: 130 })); 
        setTimeout(() => setStats(prev => ({ ...prev, mana: 85 })), 4000);
      } else {
        setLuckStatus('normal');
      }
      setTimeout(() => setScreenEffect(null), 1000);
    }, 1200);
  };

  const getFateMessageLocal = (roll) => {
    if (!t.fate) return "";
    if (roll === 1) return t.fate.critFail;
    if (roll <= 5) return t.fate.fail;
    if (roll <= 10) return t.fate.mid;
    if (roll <= 15) return t.fate.good;
    if (roll <= 19) return t.fate.great;
    if (roll === 20) return t.fate.critSuccess;
    return "";
  };

  const themeClasses = isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#faf9f6] text-slate-900";
  const cardClasses = isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm";

  return (
    <div className={`relative isolate min-h-screen transition-colors duration-500 font-sans ${themeClasses} ${screenEffect === 'shake-red' ? 'animate-shake' : screenEffect === 'shake-gold' ? 'animate-vibrate' : ''}`}>
      
      <style>{`
        @keyframes shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-10px, 5px); } 50% { transform: translate(10px, -5px); } }
        @keyframes vibrate { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(6px, 6px); } 40% { transform: translate(-4px, 4px); } }
        .animate-shake { animation: shake 0.1s ease-in-out infinite; }
        .animate-vibrate { animation: vibrate 0.08s ease-in-out infinite; }
      `}</style>

      <BackgroundAtmosphere isDarkMode={isDarkMode} />

      {/* XP Bar */}
      <div className="fixed top-0 left-0 w-full h-2 z-50 bg-black/20">
        <div className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-150 shadow-[0_0_15px_#f59e0b]" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl border flex gap-4 items-center transition-all ${cardClasses} backdrop-blur-md shadow-xl`}>
        {/* <button onClick={() => setLang(lang === 'en' ? 'id' : 'en')} className="flex flex-col items-center gap-1 text-amber-500 hover:scale-110 transition-transform">
          <Languages className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase">{lang.toUpperCase()}</span>
        </button> */}
        {/* <div className="w-px h-8 bg-slate-700/30 mx-1" /> */}
        {[
          { id: 'profile', icon: Shield, label: t.nav?.hero },
          { id: 'quests', icon: ScrollText, label: t.nav?.quests },
          { id: 'portfolio', icon: Package, label: t.nav?.portfolio },
          { id: 'skills', icon: Wand2, label: t.nav?.skills },
          { id: 'library', icon: BookOpen, label: t.nav?.library },
          { id: 'party', icon: Users, label: t.nav?.party },
          { id: 'guild', icon: Castle, label: t.nav?.guild }
        ].map((item) => (
          <button key={item.id} onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })} className={`cursor-pointer flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-amber-500 scale-110' : 'opacity-40 hover:opacity-100'}`}>
            <item.icon className="w-5 h-5" />
            <span className="hidden md:block text-[9px] font-black uppercase">{item.label}</span>
          </button>
        ))}
        <div className="w-px h-8 bg-slate-700/30 mx-1" />
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-amber-500">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 space-y-40">
        
        <HeroSection 
          t={t} 
          stats={stats} 
          luckStatus={luckStatus} 
          diceRolling={diceRolling} 
          diceValue={diceValue} 
          getFateMessageLocal={getFateMessageLocal} 
          rollDice={rollDice} 
          homepageData={homepageData}
        />

        <QuestLog t={t} cardClasses={cardClasses} experiencesData={experiencesData} />

        <Portfolio t={t} isDarkMode={isDarkMode} projectsData={projectsData} />

        <SkillTree t={t} cardClasses={cardClasses} />

        <Library t={t} isDarkMode={isDarkMode} library={libraryBooksData} />

        <Party t={t} cardClasses={cardClasses} />

        <GuildHall t={t} />

      </main>
    </div>
  );
}
