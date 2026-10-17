import React, { useState } from 'react';
import { Bookmark, Film, Trash2, Play, Sparkles } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { MovieCard } from '../components/MovieCard.jsx';

export const MyListPage = ({ onSelectMovie, onNavigate }) => {
  const { watchlist, removeFromWatchlist, loading } = useWatchlist();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [filterType, setFilterType] = useState('All'); // 'All', 'movie', 'series'

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080808] pt-32 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto text-[#E50914]">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-heading">
          Sign In to Access Your Watchlist
        </h2>
        <p className="text-xs text-neutral-400">
          Save favorite titles, create custom watch queues, and sync seamlessly across your devices.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-xl bg-[#E50914] text-white font-bold text-sm hover:bg-[#ff1e28] shadow-lg shadow-[#E50914]/40 transition-all cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const filteredItems = watchlist.filter((item) => {
    if (filterType === 'All') return true;
    return item.movieData?.type === filterType;
  });

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-6 h-6 text-[#E50914]" />
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
              My Watchlist
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            You have saved <span className="text-white font-bold">{watchlist.length}</span> titles to watch later.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-white/10">
          {['All', 'movie', 'series'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                filterType === type
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {type === 'movie' ? 'Movies' : type === 'series' ? 'Web Series' : 'All Titles'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const movie = item.movieData || {};
            const movieId = item.movieId || item._id;

            return (
              <div key={item._id} className="relative group">
                <MovieCard
                  movie={{ ...movie, _id: movieId }}
                  onSelect={onSelectMovie}
                />
                {/* Instant Remove icon button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(movieId);
                  }}
                  title="Remove from My List"
                  className="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white/80 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl max-w-md mx-auto my-12 space-y-4">
          <Film className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-neutral-400">
            Explore trending blockbusters and regional gems to add them to your queue.
          </p>
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-[#E50914] text-white text-xs font-semibold hover:bg-[#ff1e28] transition-colors cursor-pointer"
          >
            Explore Cinema Catalog
          </button>
        </div>
      )}
    </div>
  );
};
