import React, { useEffect, useRef } from 'react';
import { X, Film, Play, AlertCircle, Maximize, Volume2, Shield } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.jsx';

export const VideoPlayerModal = () => {
  const { isOpen, activeMovie, isTrailerOnly, closePlayer } = usePlayer();
  const videoRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closePlayer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePlayer]);

  if (!isOpen || !activeMovie) return null;

  // Determine source: If trailerOnly or no videoUrl, use trailerUrl
  const useYouTube = isTrailerOnly || !activeMovie.videoUrl || (activeMovie.trailerUrl && isTrailerOnly);
  const trailerEmbed = activeMovie.trailerUrl
    ? `${activeMovie.trailerUrl}?autoplay=1&rel=0&modestbranding=1`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={closePlayer} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden glass-modal border border-white/15 shadow-2xl z-10 flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E50914] flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                {activeMovie.title}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {isTrailerOnly ? 'Official Trailer' : 'Cinema Stream'} • {activeMovie.language || 'Original Audio'} • {activeMovie.releaseYear || 2024}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Shield className="w-3 h-3" />
              Verified Stream
            </span>
            <button
              onClick={closePlayer}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Screen Container (16:9) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {useYouTube && trailerEmbed ? (
            <iframe
              src={trailerEmbed}
              title={`${activeMovie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : activeMovie.videoUrl ? (
            <video
              ref={videoRef}
              src={activeMovie.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video streaming.
            </video>
          ) : trailerEmbed ? (
            <iframe
              src={trailerEmbed}
              title={`${activeMovie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-white text-base font-semibold">
                Official streaming source coming soon
              </p>
              <p className="text-xs text-neutral-400 max-w-sm">
                FlexyFilm streams verified licensed streams and official studio trailers.
              </p>
            </div>
          )}
        </div>

        {/* Player Bottom Info Bar */}
        <div className="px-4 sm:px-6 py-3 bg-neutral-950/80 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">{activeMovie.industry || 'FlexyFilm Cinema'}</span>
            <span>•</span>
            <span>{activeMovie.maturityRating || 'U/A 16+'}</span>
            <span>•</span>
            <span>{activeMovie.genres?.join(', ')}</span>
          </div>
          <span className="hidden sm:inline text-neutral-500">
            Press <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-neutral-300">ESC</kbd> to exit
          </span>
        </div>
      </div>
    </div>
  );
};
