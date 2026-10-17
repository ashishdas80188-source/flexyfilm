import React, { useState } from 'react';
import { Play, Plus, Check, Star, Info, Film } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export const MovieCard = ({
  movie,
  onSelect,
  progress = null, // for continue watching { progressSeconds, totalSeconds }
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { inWatchlist, toggleWatchlist } = useWatchlist();
  const { playMovie } = usePlayer();

  if (!movie) return null;

  const movieId = movie._id || movie.id || movie.movieId;
  const isSaved = inWatchlist(movieId);

  const calculateProgressPercent = () => {
    if (!progress || !progress.totalSeconds) return 0;
    return Math.min(100, Math.round((progress.progressSeconds / progress.totalSeconds) * 100));
  };

  return (
    <div
      className="relative flex-none w-[170px] sm:w-[200px] md:w-[220px] group transition-all duration-300 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-black/90 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(movieId)}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-poster w-full overflow-hidden bg-neutral-950">
        <img
          src={movie.posterPath || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400'}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quality Badge */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-black/70 backdrop-blur-md text-white rounded border border-white/10 uppercase">
            {movie.language || 'HD'}
          </span>
          {movie.type === 'series' && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E50914] text-white rounded uppercase shadow">
              Series
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-amber-400 text-[11px] font-bold border border-white/10">
          <Star className="w-3 h-3 fill-current" />
          <span>{movie.rating ? movie.rating.toFixed(1) : '7.8'}</span>
        </div>

        {/* Continue Watching Progress Bar */}
        {progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60 z-20">
            <div
              className="h-full bg-[#E50914] rounded-r"
              style={{ width: `${calculateProgressPercent()}%` }}
            />
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 flex flex-col justify-end transition-opacity duration-200 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playMovie(movie, false);
                }}
                className="w-9 h-9 rounded-full bg-[#E50914] text-white flex items-center justify-center hover:bg-[#ff1e28] shadow-lg shadow-[#E50914]/50 hover:scale-110 transition-all cursor-pointer"
                title="Play Stream"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>

              {/* Watchlist Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(movie);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#E50914]/30 border-[#E50914] text-white'
                    : 'bg-black/60 border-white/20 text-neutral-300 hover:text-white hover:bg-black/80'
                }`}
                title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
              >
                {isSaved ? <Check className="w-4 h-4 text-[#FF334B]" /> : <Plus className="w-4 h-4" />}
              </button>

              {/* Details button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(movieId);
                }}
                className="w-9 h-9 rounded-full bg-black/60 border border-white/20 text-neutral-300 hover:text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md transition-all ml-auto cursor-pointer"
                title="More Details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metadata */}
            <div className="text-left">
              <p className="text-xs font-semibold text-white truncate">{movie.title}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                <span>{movie.releaseYear || 2024}</span>
                <span>•</span>
                <span className="truncate">{movie.genres?.[0] || 'Drama'}</span>
                {progress && (
                  <>
                    <span>•</span>
                    <span className="text-[#FF334B]">
                      {Math.max(1, Math.round(((progress.totalSeconds - progress.progressSeconds) / 60)))}m left
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer (Visible when not hovered) */}
      <div className="p-2.5 text-left">
        <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-400">
          <span>{movie.industry || movie.language || 'Cinema'}</span>
          <span>{movie.releaseYear || 2024}</span>
        </div>
      </div>
    </div>
  );
};
