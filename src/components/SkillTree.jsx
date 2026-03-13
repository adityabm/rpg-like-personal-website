import React from 'react';
import { Wand2 } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { SKILL_TREE_BASE } from '../lib/data';

export const SkillTree = ({ t, cardClasses }) => (
  <section id="skills">
    <SectionHeading icon={Wand2} title={t.sections?.skills?.title} subtitle={t.sections?.skills?.subtitle} />
    <div className="grid md:grid-cols-3 gap-6">
      {SKILL_TREE_BASE.map((category, idx) => (
        <div key={idx} className={`p-8 rounded-3xl border flex flex-col gap-6 ${cardClasses}`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-500/10 rounded-xl border border-white/5">{category.icon}</div>
            <h3 className="font-black uppercase tracking-tight italic">{(t.skillsData || [])[idx]}</h3>
          </div>
          <div className="space-y-6 flex-grow">
            {(category.skills || []).map((skill, si) => (
              <div key={si} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{skill.name}</span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                    skill.rarity === 'Legendary' ? 'bg-orange-500/20 text-orange-500' : 
                    skill.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-500' :
                    skill.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-slate-400/20 text-slate-400'
                  }`}>{skill.rarity}</span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${
                    skill.rarity === 'Legendary' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 
                    skill.rarity === 'Epic' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]' :
                    skill.rarity === 'Rare' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' :
                    'bg-slate-400'
                  }`} style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);
