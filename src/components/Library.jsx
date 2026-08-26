import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const SPINE_PALETTE = [
  'bg-emerald-900', 'bg-red-950', 'bg-indigo-950',
  'bg-amber-950', 'bg-slate-800', 'bg-cyan-950'
];

export const Library = ({ t, isDarkMode, library }) => {
  const titles = library || [];
  const hasBooks = Array.isArray(library) && library.length > 0;

  const renderEmptyState = () => (
    <div className={`p-10 md:p-16 text-center rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-[#1a0f0a] border-[#2d1a12]' : 'bg-[#f4e6d6] border-[#d4b9a3]'}`}>
      <div className="mx-auto mb-6 inline-flex rounded-full bg-amber-500/20 border border-amber-500/50 p-4">
        <BookOpen className="h-8 w-8 text-amber-500" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-2xl font-bold">
        {t.ui?.emptyLibraryTitle || 'The ink has not yet dried.'}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed opacity-70">
        {t.ui?.emptyLibraryBody || 'No scrolls have been inscribed in this archive yet. Return when the first tale has been told.'}
      </p>
    </div>
  );

  return (
    <section id="library" className="space-y-12">
      <SectionHeading
        icon={BookOpen}
        title={t.sections?.library?.title}
        subtitle={t.sections?.library?.subtitle}
      />
      {!hasBooks ? (
        renderEmptyState()
      ) : (
      <div className="relative">
        <div className={`p-8 md:p-12 rounded-3xl border-x-8 border-t-8 shadow-2xl space-y-12 ${isDarkMode ? 'bg-[#1a0f0a] border-[#2d1a12]' : 'bg-[#f4e6d6] border-[#d4b9a3]'}`}>
          <div className="relative">
            <div className="flex flex-wrap justify-center items-end gap-1 md:gap-2 relative z-10 pb-2">
              {titles.map((book, i) => {
                const title = book.title;
                const spineColor = SPINE_PALETTE[i % SPINE_PALETTE.length];
                return (
                  <Link
                    key={book.slug}
                    href={`/library/${book.slug}`}
                    className="relative group/book transition-all hover:-translate-y-6"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/book:opacity-100 transition-all pointer-events-none z-50 bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/20 whitespace-nowrap">
                      {title}
                    </div>
                    <div
                      className={`${spineColor} w-8 md:w-12 lg:w-16 rounded-t-lg border-x border-t border-black/30 flex items-center justify-center py-6 shadow-xl overflow-hidden`}
                      style={{ height: `${150 + (i % 5) * 15}px` }}
                    >
                      <span className="[writing-mode:vertical-rl] rotate-180 text-[8px] md:text-[10px] font-serif font-black text-white/90 uppercase max-h-full whitespace-nowrap overflow-hidden text-ellipsis">
                        {title}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className={`h-4 w-full rounded-full ${isDarkMode ? 'bg-[#2d1a12]' : 'bg-[#8b5e3c]'} shadow-lg`} />
          </div>
        </div>
      </div>
      )}
    </section>
  );
};