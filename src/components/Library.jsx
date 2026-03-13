import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

export const Library = ({ t, isDarkMode, lang, setSelectedBook }) => {
  const finalLibrary = useMemo(() => {
    const titles = t.libraryTitles || [];
    const recordedLabel = t.ui?.recorded || 'Recorded';
    return Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      title: titles[i] || `Volume ${i + 1}`,
      date: `${recordedLabel}: 202${Math.floor(i/5)}`,
      spineColor: ["bg-emerald-900", "bg-red-950", "bg-indigo-950", "bg-amber-950", "bg-slate-800", "bg-cyan-950"][i % 6],
      content: lang === 'en' 
        ? `In the ancient scrolls of digital development, Volume ${i+1} menceritakan perjalanan unik ke dalam kedalaman seni kuno...`
        : `Dalam gulungan kuno pengembangan digital, Volume ${i+1} menceritakan perjalanan unik ke dalam kedalaman seni kuno...`
    }));
  }, [lang, t.libraryTitles, t.ui, t.ui?.recorded]);

  return (
    <section id="library" className="space-y-12">
      <SectionHeading icon={BookOpen} title={t.sections?.library?.title} subtitle={t.sections?.library?.subtitle} />
      <div className="relative">
        <div className={`p-8 md:p-12 rounded-3xl border-x-8 border-t-8 shadow-2xl space-y-12 ${isDarkMode ? 'bg-[#1a0f0a] border-[#2d1a12]' : 'bg-[#f4e6d6] border-[#d4b9a3]'}`}>
          {[0].map((row) => (
            <div key={row} className="relative">
              <div className="flex flex-wrap justify-center items-end gap-1 md:gap-2 relative z-10 pb-2">
                {finalLibrary.slice(row * 7, (row + 1) * 7).map((book) => (
                  <button key={book.id} onClick={() => setSelectedBook(book)} className="relative group/book transition-all hover:-translate-y-6">
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/book:opacity-100 transition-all pointer-events-none z-50 bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/20 whitespace-nowrap">{book.title}</div>
                     <div className={`${book.spineColor} w-8 md:w-12 lg:w-16 rounded-t-lg border-x border-t border-black/30 flex items-center justify-center py-6 shadow-xl`} style={{ height: `${150 + (book.id % 5) * 15}px` }}>
                       <span className="[writing-mode:vertical-rl] rotate-180 text-[8px] md:text-[10px] font-serif font-black text-white/90 uppercase truncate max-h-full">{book.title}</span>
                     </div>
                  </button>
                ))}
              </div>
              <div className={`h-4 w-full rounded-full ${isDarkMode ? 'bg-[#2d1a12]' : 'bg-[#8b5e3c]'} shadow-lg`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
