import React, { useState, useMemo } from 'react';
import { Package, X, Search, Briefcase } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { PROJECTS_BASE } from '../lib/data';

export const Portfolio = ({ t, isDarkMode, projectsData }) => {
  const [inspectedProjectIndex, setInspectedProjectIndex] = useState(null);

  const finalProjects = useMemo(() => {
    if (projectsData && projectsData.length > 0) {
      return projectsData.map((project, i) => {
         return {
           id: project.id || i,
           rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : i === 2 ? "Rare" : "Common",
           title: project.name || "Unknown Artifact",
           desc: project.description || "",
           loot: project.stack || [],
           link: project.url || "#",
           preview: project.preview || "",
           icon: PROJECTS_BASE[i % PROJECTS_BASE.length].icon
         }
      });
    }

    const data = t.projectsData || [];
    return PROJECTS_BASE.map((p, i) => ({ ...p, ...(data[i] || {}) }));
  }, [t.projectsData, projectsData]);

  const inspectedProject = inspectedProjectIndex !== null ? finalProjects[inspectedProjectIndex] : null;

  return (
    <>
      <section id="portfolio">
        <SectionHeading icon={Package} title={t.sections?.portfolio?.title} subtitle={t.sections?.portfolio?.subtitle} />
        <div className={`p-10 md:p-14 rounded-[3rem] border shadow-2xl transition-all ${isDarkMode ? 'bg-[#2a1b15] border-[#3e2723]' : 'bg-[#e5d5c5] border-[#c0a890] shadow-inner'} relative`}>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 relative z-10">
            {finalProjects.map((project, i) => (
              <button 
                key={project.id}
                onClick={() => setInspectedProjectIndex(i)}
                className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-4 border-black/30 bg-black/10 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-2 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] relative group overflow-hidden focus:outline-none cursor-pointer"
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40">
                  <img src={`https://cms.adit.dev/assets/${project.preview}`} alt={project.title} className="w-full h-full object-cover grayscale" />
                </div>
                <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${
                  project.rarity === 'Legendary' ? 'bg-orange-500 shadow-[0_0_5px_#f97316]' :
                  project.rarity === 'Epic' ? 'bg-purple-500' :
                  project.rarity === 'Rare' ? 'bg-blue-500' : 'bg-slate-400'
                }`} />
                <div className="relative z-10 text-white/80 drop-shadow-md group-hover:text-amber-500">
                  {project.icon}
                </div>
              </button>
            ))}
            
            {/* Fill with empty decorative slots */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`empty-${i}`} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-4 border-black/10 bg-black/5 opacity-30 cursor-default" />
            ))}
          </div>

          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-8 py-1 bg-[#3e2723] rounded-full border-2 border-amber-500/30 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg text-center">
             {t.ui?.itemBox}
          </div>
        </div>
      </section>

      {/* INSPECTION MODAL (FOR BACKPACK ITEMS) - FIXED SCROLLING */}
      {inspectedProject && (
        <div className="fixed inset-0 h-[100vh] z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-md animate-in fade-in duration-300">
          {/* Scrollable Container Card */}
          <div className={`relative max-w-2xl w-full p-8 md:p-10 rounded-[3rem] border-8 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide ${isDarkMode ? 'bg-[#2a1b15] border-[#3e2723]' : 'bg-[#e5d5c5] border-[#c0a890]'}`}>
            <button 
              onClick={() => setInspectedProjectIndex(null)}
              className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors z-20 text-white focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest ${
                      inspectedProject.rarity === 'Legendary' ? 'bg-orange-500 text-black' :
                      inspectedProject.rarity === 'Epic' ? 'bg-purple-500 text-white' :
                      'bg-slate-600 text-white'
                    }`}>
                      {inspectedProject.rarity}
                    </span>
                    <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Serial: {inspectedProject.id}-MAX</span>
                  </div>
                  <h3 className="text-4xl font-black italic uppercase text-amber-500 leading-none tracking-tighter">
                    {inspectedProject.title}
                  </h3>
                </div>
                <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-amber-500">
                  {inspectedProject.icon}
                </div>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden border-4 border-black/20 shadow-inner">
                <img  src={`https://cms.adit.dev/assets/${inspectedProject.preview}`} alt={inspectedProject.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase opacity-40 flex items-center gap-2 tracking-widest">
                    <Search className="w-3 h-3" /> {t.ui?.inspect}
                  </h4>
                  <p className="text-lg font-serif italic leading-relaxed opacity-90">
                    "{inspectedProject.desc}"
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase opacity-40 flex items-center gap-2 tracking-widest">
                    <Briefcase className="w-3 h-3" /> {t.ui?.loot}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(inspectedProject.loot || []).map((loot, li) => (
                      <span key={li} className="text-[11px] font-bold px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-500 uppercase tracking-wider">
                        {loot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex items-center justify-center">
                 <a 
                  href={inspectedProject.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-10 py-4 bg-amber-500 rounded-2xl text-black font-black uppercase text-sm hover:scale-105 transition-all active:scale-95 shadow-xl shadow-amber-500/20 focus:outline-none"
                >
                  {t.ui?.visit}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
