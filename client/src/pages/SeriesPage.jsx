import React, { useState, useEffect } from 'react';
import { Tv, Sparkles, Filter } from 'lucide-react';
import { api } from '../api/api.js';
import { MovieCard } from '../components/MovieCard.jsx';

export const SeriesPage = ({ onSelectMovie }) => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');

  const genres = ['All', 'Crime', 'Drama', 'Comedy', 'Sci-Fi', 'Thriller', 'Action'];

  useEffect(() => {
    fetchSeries();
  }, [selectedGenre]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      let url = '/movies?type=series';
      if (selectedGenre && selectedGenre !== 'All') {
        url += `&genre=${encodeURIComponent(selectedGenre)}`;
      }
      const res = await api.get(url);
      if (res.data) {
        setSeries(res.data);
      }
    } catch (err) {
      console.error('Error fetching series:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Tv className="w-6 h-6 text-[#E50914]" />
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
            Original Web Series
          </h1>
        </div>
        <p className="text-neutral-400 text-sm max-w-2xl">
          Immerse yourself in binge-worthy multi-episode drama, gritty crime sagas, and original productions.
        </p>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
        {genres.map((g) => {
          const active = (selectedGenre === '' && g === 'All') || selectedGenre === g;
          return (
            <button
              key={g}
              onClick={() => setSelectedGenre(g === 'All' ? '' : g)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/40'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-poster rounded-xl skeleton-shimmer" />
          ))}
        </div>
      ) : series.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {series.map((item) => (
            <div key={item._id} className="flex justify-center">
              <MovieCard movie={item} onSelect={onSelectMovie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl max-w-md mx-auto my-12 space-y-4">
          <Tv className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Series Found</h3>
          <p className="text-xs text-neutral-400">
            Try switching genre filters to view other television series.
          </p>
        </div>
      )}
    </div>
  );
};
