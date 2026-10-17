import React, { useState, useEffect } from 'react';
import {
  Play,
  Info,
  Plus,
  Check,
  Star,
  Film,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export const HeroBanner = ({ featuredMovies = [], onSelectMovie }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { inWatchlist, toggleWatchlist } = useWatchlist();
  const { playMovie } = usePlayer();

  const currentMovie = featuredMovies[currentIndex] || null;

  // Auto-advance banner every 9 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!currentMovie) {
    return (
      <div className="relative w-full h-[70vh] min-h-[500px] bg-neutral-950 skeleton-shimmer flex items-center justify-center">
        <div className="text-neutral-500 font-medium">Loading Cinema Showcase...</div>
      </div>
    );
  }

  const isSaved = inWatchlist(currentMovie._id || currentMovie.id);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[560px] max-h-[880px] overflow-hidden select-none">
      {/* High-Resolution Backdrop Image */}
      <div className="absolute inset-0">
        <img
          key={currentMovie._id}
          src={currentMovie.backdropPath || currentMovie.posterPath}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-top filter brightness-[0.88] transition-opacity duration-1000 animate-in fade-in"
        />
        {/* Gradients to blend seamlessly into background */}
        <div className="absolute inset-0 hero-side-gradient" />
        <div className="absolute inset-0 hero-vignette" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 z-20">
        <div className="max-w-2xl space-y-4">
          {/* Industry & Language Tag */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E50914] text-white tracking-wide shadow-md shadow-[#E50914]/40">
              <Sparkles className="w-3 h-3" />
              {currentMovie.industry || 'Featured Spotlight'}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20">
              {currentMovie.language || 'Hindi'}
            </span>
            <span className="px-1.5 py-0.5 text-xs font-bold border border-white/40 text-neutral-300 rounded">
              {currentMovie.maturityRating || 'U/A 16+'}
            </span>
            <span className="px-1.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {currentMovie.rating?.toFixed(1) || '8.5'}
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              {currentMovie.releaseYear || 2024}
            </span>
            {currentMovie.runtime && (
              <span className="text-xs text-neutral-400 font-medium">
                {currentMovie.runtime}m
              </span>
            )}
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
              {currentMovie.title}
            </h1>
            {currentMovie.tagline && (
              <p className="text-sm sm:text-base text-[#FF334B] font-semibold italic drop-shadow-md">
                "{currentMovie.tagline}"
              </p>
            )}
          </div>

          {/* Overview / Synopsis */}
          <p className="text-sm sm:text-base text-neutral-200 line-clamp-3 leading-relaxed drop-shadow-md max-w-xl font-normal">
            {currentMovie.overview}
          </p>

          {/* Genres Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-300">
            {currentMovie.genres?.map((g) => (
              <span key={g} className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                {g}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {/* Play Now */}
            <button
              onClick={() => playMovie(currentMovie, false)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] text-white font-bold text-sm sm:text-base hover:bg-[#ff1e28] shadow-xl shadow-[#E50914]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play Now</span>
            </button>

            {/* Play Trailer */}
            {currentMovie.trailerUrl && (
              <button
                onClick={() => playMovie(currentMovie, true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4 text-[#FF334B]" />
                <span>Trailer</span>
              </button>
            )}

            {/* Add to My List */}
            <button
              onClick={() => toggleWatchlist(currentMovie)}
              aria-label={isSaved ? 'Remove from My List' : 'Add to My List'}
              className={`p-3 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#E50914]/20 border-[#E50914] text-white'
                  : 'bg-white/10 border-white/20 text-neutral-200 hover:text-white hover:bg-white/20'
              }`}
              title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {isSaved ? <Check className="w-5 h-5 text-[#FF334B]" /> : <Plus className="w-5 h-5" />}
            </button>

            {/* More Info */}
            <button
              onClick={() => onSelectMovie(currentMovie._id || currentMovie.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-all cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous featured movie"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-md border border-white/10 transition-all hidden md:flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next featured movie"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-md border border-white/10 transition-all hidden md:flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-6 right-8 z-30 flex items-center gap-2">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-[#E50914]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
