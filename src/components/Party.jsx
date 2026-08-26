import React from 'react';
import { Users } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { PARTY_MEMBERS_BASE } from '../lib/data';

export const Party = ({ t, cardClasses }) => (
  <section id="party">
    <SectionHeading icon={Users} title={t.sections?.party?.title} subtitle={t.sections?.party?.subtitle} />
    <div className="grid md:grid-cols-2 gap-8">
      {PARTY_MEMBERS_BASE.map((m, i) => (
        <div key={i} className={`p-8 rounded-2xl border transition-all hover:scale-[1.02] ${cardClasses}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-black text-xl shadow-lg">{(m.name || " ")[0]}</div>
            <div>
              <h4 className="text-xl font-bold">{m.name}</h4>
              <p className="text-xs text-amber-500 font-bold uppercase tracking-widest">{t.partyData?.[m.roleKey]}</p>
            </div>
          </div>
          <p className="text-sm italic opacity-70 leading-relaxed border-l-2 border-amber-500/30 pl-6">&quot;{t.partyData?.[m.quoteKey]}&quot;</p>
          <button onClick={() => window.open(m.link, '_blank')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer mt-6 text-sm">
            Add to Party
          </button>
        </div>
      ))}
    </div>
  </section>
);
