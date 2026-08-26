import React from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { PARTY_MEMBERS_BASE } from '../lib/data';

export const Party = ({ t, cardClasses }) => (
  <section id="party">
    <SectionHeading icon={Users} title={t.sections?.party?.title} subtitle={t.sections?.party?.subtitle} />
    <div className="grid md:grid-cols-2 gap-x-8 gap-y-16 pt-14">
      {PARTY_MEMBERS_BASE.map((m, i) => (
        <div key={i} className={`relative overflow-visible p-8 pt-16 rounded-2xl border text-center transition-all hover:scale-[1.02] ${cardClasses}`}>
          <div className="absolute -top-14 left-1/2 z-10 h-28 w-28 -translate-x-1/2 rounded-full border-4 border-amber-500 bg-slate-950 p-1 shadow-xl shadow-amber-500/20">
            <Image
              src={m.token}
              alt={`${m.name} character token`}
              width={112}
              height={112}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <h4 className="text-xl font-bold">{m.name}</h4>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-amber-500">{t.partyData?.[m.roleKey]}</p>
          <p className="mx-auto mt-6 max-w-md border-t border-amber-500/20 pt-5 text-sm italic leading-relaxed opacity-70">&quot;{t.partyData?.[m.quoteKey]}&quot;</p>
          <button onClick={() => window.open(m.link, '_blank')} className="mx-auto mt-6 flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-black uppercase tracking-widest text-black shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-95">
            Add to Party
          </button>
        </div>
      ))}
    </div>
  </section>
);
