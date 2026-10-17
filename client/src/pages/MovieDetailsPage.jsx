import React, { useState, useEffect } from 'react';
import {
  Play,
  Film,
  Plus,
  Check,
  Star,
  Clock,
  Calendar,
  Globe,
  Share2,
  Volume2,
  Shield,
  ArrowLeft,
  User,
} from 'lucide-react';
import { api } from '../api/api.js';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { MovieRow } from '../components/MovieRow.jsx';

export const MovieDetailsPage = ({ movieId, onBack, onSelectMovie }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { inWatchlist, toggleWatchlist } = useWatchlist();
  const { playMovie } = usePlayer();

  useEffect(() => {
    if (movieId) {
      loadMovieDetails();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/movies/${movieId}`);
      if (res.data) {
        setMovie(res.data);
      } else {
        throw new Error('Movie data could not be retrieved');
      }
    } catch (err) {
      console.error('Failed to load movie details:', err);
      setError(err.message || 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 skeleton-shimmer mb-4" />
        <p className="text-neutral-400 text-sm">Loading cinematic features...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#080808] pt-32 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <Film className="w-16 h-16 text-neutral-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Movie Details Unavailable</h2>
        <p className="text-xs text-neutral-400">{error || 'This title could not be found.'}</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-[#E50914] text-white text-xs font-semibold hover:bg-[#ff1e28] transition-colors"
        >
          Return to Cinema
        </button>
      </div>
    );
  }

  const isSaved = inWatchlist(movie._id || movie.id);

  return (
    <div className="min-h-screen bg-[#080808] pb-24 text-neutral-200">
      {/* Hero Backdrop with Atmospheric Vignette */}
      <div className="relative w-full h-[60vh] min-h-[440px] max-h-[700px] overflow-hidden">
        <img
          src={movie.backdropPath || movie.posterPath}
          alt={movie.title}
          className="w-full h-full object-cover object-top filter brightness-[0.75]"
        />
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/70" />

        {/* Back navigation button */}
        <button
          onClick={onBack}
          className="absolute top-24 left-4 sm:left-8 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white text-xs font-medium backdrop-blur-md border border-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Details Body */}
      <div className="relative -mt-36 sm:-mt-48 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Poster Card */}
          <div className="w-48 sm:w-64 md:w-72 flex-shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl shadow-black ring-1 ring-white/15 bg-neutral-900">
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="w-full aspect-poster object-cover"
            />
          </div>

          {/* Right: Rich Information */}
          <div className="flex-1 space-y-5 text-left">
            {/* Title & Tagline */}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E50914] text-white">
                  {movie.industry || 'Cinema'}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-white border border-white/10">
                  {movie.language || 'Hindi'}
                </span>
                <span className="px-1.5 py-0.5 text-xs font-bold border border-white/30 text-neutral-300 rounded">
                  {movie.maturityRating || 'U/A 16+'}
                </span>
                <span className="text-xs text-neutral-400 font-medium">
                  {movie.type === 'series' ? 'Web Series' : 'Movie'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight leading-tight">
                {movie.title}
              </h1>

              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="text-sm text-neutral-400 mt-1 font-medium">
                  Original Title: {movie.originalTitle}
                </p>
              )}

              {movie.tagline && (
                <p className="text-sm sm:text-base text-[#FF334B] font-semibold italic mt-1.5">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Quick Metrics (Rating, Runtime, Year) */}
            <div className="flex items-center gap-5 text-xs text-neutral-300 py-1 border-y border-white/10">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">{movie.rating?.toFixed(1) || '8.2'}</span>
                <span className="text-neutral-500 font-normal">({movie.voteCount || '1.2k'} votes)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>{movie.runtime ? `${movie.runtime} mins` : '120 mins'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>{movie.releaseYear || 2024}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                onClick={() => playMovie(movie, false)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] text-white font-bold text-sm sm:text-base hover:bg-[#ff1e28] shadow-lg shadow-[#E50914]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch Stream</span>
              </button>

              {movie.trailerUrl && (
                <button
                  onClick={() => playMovie(movie, true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                >
                  <Film className="w-4 h-4 text-[#FF334B]" />
                  <span>Play Trailer</span>
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-md border text-sm font-semibold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#E50914]/20 border-[#E50914] text-white'
                    : 'bg-white/10 border-white/20 text-neutral-300 hover:text-white hover:bg-white/20'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4 text-[#FF334B]" /> : <Plus className="w-4 h-4" />}
                <span>{isSaved ? 'In Watchlist' : 'Add to List'}</span>
              </button>
            </div>

            {/* Overview / Storyline */}
            <div className="space-y-1.5 pt-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Synopsis
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                {movie.overview}
              </p>
            </div>

            {/* Genres */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-900 border border-white/10 text-neutral-200"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Director & Crew */}
            {movie.director && (
              <div className="pt-2 text-xs text-neutral-400">
                <span className="font-semibold text-neutral-200">Director:</span>{' '}
                <span className="text-white font-medium">{movie.director}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cast & Characters Section */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mt-14 space-y-4 text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Starring Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {movie.cast.map((actor, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-3 rounded-xl flex items-center gap-3 border border-white/5"
                >
                  <img
                    src={actor.profilePath || `https://api.dicebear.com/7.x/initials/svg?seed=${actor.name}`}
                    alt={actor.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{actor.character || 'Cast'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Embedded Trailer Player Preview */}
        {movie.trailerUrl && (
          <div className="mt-14 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                Official Studio Trailer
              </h2>
            </div>
            <div className="rounded-2xl overflow-hidden glass-modal border border-white/10 aspect-video max-w-4xl shadow-2xl">
              <iframe
                src={`${movie.trailerUrl}?rel=0&modestbranding=1`}
                title={`${movie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {/* Similar & Recommended Movies */}
        {movie.similarMovies && movie.similarMovies.length > 0 && (
          <div className="mt-14">
            <MovieRow
              title="More Like This"
              subtitle="Recommended titles based on genre, industry, and themes"
              movies={movie.similarMovies}
              onSelectMovie={onSelectMovie}
            />
          </div>
        )}
      </div>
    </div>
  );
};
