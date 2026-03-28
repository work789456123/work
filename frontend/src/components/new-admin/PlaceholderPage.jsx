import React from 'react';

const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{title}</h1>
          <p className="text-slate-500 mt-1">{description || "Manage settings and data."}</p>
        </div>
      </div>
      
      <div className="bg-teal-50 dark:bg-slate-800 rounded-xl shadow-sm border border-brand-primary/5 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-brand-primary/10 text-brand-primary p-4 rounded-full mb-4">
          <span className="material-symbols-outlined text-4xl">construction</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Page Under Construction</h3>
        <p className="text-slate-500 mt-2 text-center max-w-sm">This module is currently being built and will be available in the next release.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
