import React from 'react';
import { Film, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-neutral-900 border border-white/10 flex items-center justify-center text-[#E50914] shadow-2xl">
          <Film className="w-12 h-12" />
        </div>
        <span className="absolute -top-3 -right-3 px-3 py-1 bg-[#E50914] text-white font-black text-sm rounded-full shadow-lg">
          404
        </span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight mb-2">
        Scene Not Found
      </h1>
      <p className="text-sm text-neutral-400 max-w-md mb-8 leading-relaxed">
        The cinematic cut you are looking for has been moved, removed, or never existed in the FlexyFilm universe.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#ff1e28] text-white font-bold text-sm shadow-xl shadow-[#E50914]/40 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};
