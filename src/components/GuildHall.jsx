import React from 'react';
import { Castle, ExternalLink } from 'lucide-react';

export const GuildHall = ({ t }) => {
  return (
    <footer id="guild" className="pt-60 pb-20 text-center space-y-12">
      <div className="h-px w-32 bg-amber-500/30 mx-auto" />
      
      <div className="space-y-6">
        <div 
          className="group inline-flex flex-col items-center gap-4 transition-all"
        >
          <div className="p-6 rounded-full bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Castle className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter group-hover:text-amber-500 transition-colors">
            {t.ui?.guildHall}
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
          <a href="https://github.com/adityabm" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 hover:opacity-100 transition-all flex items-center gap-1">
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://www.linkedin.com/in/aditya-dewantara/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 hover:opacity-100 transition-all flex items-center gap-1">
            LinkedIn <ExternalLink className="w-3 h-3" />
          </a>
          <a href="mailto:me@adit.dev" className="hover:text-amber-500 hover:opacity-100 transition-all flex items-center gap-1">
            Email <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="pt-20 pb-10">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] opacity-30">
          {t.ui?.copyright}
        </p>
      </div>
    </footer>
  );
};
