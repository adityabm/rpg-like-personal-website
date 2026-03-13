import React, { useMemo } from 'react';
import { ScrollText, Trophy } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { QUESTS_BASE } from '../lib/data';

export const QuestLog = ({ t, cardClasses, experiencesData }) => {
  const finalQuests = useMemo(() => {
    if (experiencesData && experiencesData.length > 0) {
      return experiencesData.map((exp, i) => {
        // Collect all positions into a single description summary or just use the most recent
        const positions = exp.positions || [];
        const latestPosition = positions[0] || {};
        
        // aggregate all skills across all positions
        const allSkills = new Set();
        positions.forEach(p => {
           if(p.skills) p.skills.forEach(s => allSkills.add(s));
        });

        // Determine years
        let period = '';
        if (positions.length > 0) {
           const startDates = positions.map(p => new Date(p.start_date)).sort((a,b) => a-b);
           const firstDate = startDates[0];
           period = firstDate ? firstDate.getFullYear() : '';
           
           const hasCurrent = positions.some(p => !p.end_date);
           if(hasCurrent) {
               period += ' - Present';
           } else {
               const endDates = positions.filter(p => p.end_date).map(p => new Date(p.end_date)).sort((a,b) => b-a);
               const lastDate = endDates[0];
               if(lastDate) period += ` - ${lastDate.getFullYear()}`;
           }
        }
        
        return {
          id: exp.id,
          typeKey: i === 0 ? "epic" : "side",
          type: i === 0 ? "Current Epic" : "Past Campaign",
          period: period,
          title: latestPosition.name || "Adventurer",
          guild: exp.company_name,
          description: latestPosition.description || "",
          spellsUsed: Array.from(allSkills).slice(0, 10), // Limit to 10 maybe
          positions: positions,
        }
      });
    }

    const data = t.questsData || [];
    return QUESTS_BASE.map((q, i) => ({ ...q, ...(data[i] || {}) }));
  }, [t.questsData, experiencesData]);

  return (
    <section id="quests">
      <SectionHeading icon={ScrollText} title={t.sections?.quests?.title} subtitle={t.sections?.quests?.subtitle} />
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:w-0.5 before:bg-slate-800">
        {finalQuests.map((quest, i) => (
          <div key={quest.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <Trophy className={`w-5 h-5 ${quest.typeKey === 'epic' ? 'text-amber-500' : 'text-slate-500'}`} />
            </div>
            <div className={`w-[calc(100%-4rem)] md:w-[45%] p-8 rounded-2xl border transition-all hover:-translate-y-2 ${cardClasses}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">{quest.type}</span>
                <span className="text-xs font-mono opacity-40">{quest.period}</span>
              </div>
              {quest.positions.map((pos, i) => (
                <div key={i} className={`flex flex-col ${i === quest.positions.length - 1 ? "mb-0" : "mb-4"}`}>
                  <h3 className="text-2xl font-bold mb-1">{pos.name}</h3>
                  <p className="text-amber-500 font-bold mb-4">{pos.company_name}</p>
                  <p className="text-sm opacity-60 leading-relaxed mb-6 whitespace-pre-wrap">{pos.description}</p>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.ui?.spellsCast}</p>
                    <div className="flex flex-wrap gap-2">
                      {(pos.skills || []).map((spell, si) => (
                        <span key={si} className="text-[10px] px-2 py-1 rounded bg-black/30 border border-white/10 font-mono text-amber-500/80">{spell}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
