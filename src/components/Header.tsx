import React from 'react';

export const Header: React.FC = () => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-150 pt-safe select-none"
    >
      <div className="relative w-full max-w-3xl mx-auto h-14 flex items-center justify-center">
        <h1
          id="header-title"
          className="font-bold text-zinc-900 dark:text-zinc-100 text-base tracking-tight text-center truncate max-w-full px-[var(--header-side-clearance,4.5rem)]"
        >
          OFFpolice
        </h1>
      </div>
    </header>
  );
};

