import React from 'react';

export const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-1">
      <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/50">
        <Icon className="w-6 h-6 text-amber-500" />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-tighter italic">{title || 'Section'}</h2>
    </div>
    {subtitle && <p className="text-sm opacity-60 ml-12">{subtitle}</p>}
  </div>
);
