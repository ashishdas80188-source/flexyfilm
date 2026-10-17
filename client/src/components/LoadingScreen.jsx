import React from 'react';
import { Play } from 'lucide-react';

export const LoadingScreen = ({ message = 'Loading Cinema Experience...' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#080808] flex flex-col items-center justify-center p-4">
      {/* Animated Glowing Logo */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#8B0000] flex items-center justify-center shadow-2xl shadow-[#E50914]/50 animate-pulse">
          <Play className="w-10 h-10 text-white fill-current ml-1" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-[#E50914] animate-ping opacity-25" />
      </div>

      {/* Brand Name */}
      <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
        FLEXY<span className="text-[#E50914]">FILM</span>
      </h1>
      <p className="text-xs tracking-widest uppercase text-neutral-400 font-semibold mb-6">
        Your Cinema. Your Language. Your Flex.
      </p>

      {/* Modern Loader Indicator */}
      <div className="w-48 h-1 bg-neutral-900 rounded-full overflow-hidden">
        <div className="w-full h-full bg-[#E50914] rounded-full animate-pulse" />
      </div>

      <p className="text-xs text-neutral-500 mt-4 animate-pulse">{message}</p>
    </div>
  );
};
