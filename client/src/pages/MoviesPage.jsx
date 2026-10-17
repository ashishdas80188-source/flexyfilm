import React, { useState, useEffect } from 'react';
import { Film, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { api } from '../api/api.js';
import { MovieCard } from '../components/MovieCard.jsx';

export const MoviesPage = ({ onSelectMovie, initialGenre = '', initialLang = '' }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLang);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const genres = [
    'All',
    'Action',
    'Comedy',
    'Drama',
    'Sci-Fi',
    'Thriller',
    'Crime',
    'Adventure',
    'Horror',
    'Romance',
    'Biography',
    'Animation',
  ];

  const languages = [
    'All',
    'Hindi',
    'English',
    'Telugu',
    'Odia',
    'Kannada',
    'Tamil',
    'Malayalam',
    'Punjabi',
    'Marathi',
  ];

  const industries = [
    'All',
    'Bollywood',
    'Hollywood',
    'Tollywood',
    'Ollywood',
    'Sandalwood',
    'Kollywood',
    'Mollywood',
  ];

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedLanguage, selectedIndustry, minRating, sortBy]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('type', 'movie');
      if (selectedGenre && selectedGenre !== 'All') params.append('genre', selectedGenre);
      if (selectedLanguage && selectedLanguage !== 'All') params.append('language', selectedLanguage);
      if (selectedIndustry && selectedIndustry !== 'All') params.append('industry', selectedIndustry);
      if (minRating) params.append('minRating', minRating);
      if (sortBy) params.append('sort', sortBy);

      const res = await api.get(`/movies?${params.toString()}`);
      if (res.data) {
        setMovies(res.data);
      }
    } catch (err) {
      console.error('Error fetching movies catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedGenre('');
    setSelectedLanguage('');
    setSelectedIndustry('');
    setMinRating('');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Film className="w-6 h-6 text-[#E50914]" />
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
            Movies Catalogue
          </h1>
        </div>
        <p className="text-neutral-400 text-sm max-w-2xl">
          Browse full-length feature films across regional industries and international cinema.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl mb-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <SlidersHorizontal className="w-4 h-4 text-[#E50914]" />
            <span>Filters & Sort</span>
          </div>

          {(selectedGenre || selectedLanguage || selectedIndustry || minRating) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Genre Pill Selector */}
        <div>
          <p className="text-xs text-neutral-400 mb-2 font-medium">Genre</p>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {genres.map((g) => {
              const active = (selectedGenre === '' && g === 'All') || selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g === 'All' ? '' : g)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdowns Row: Language, Industry, Min Rating, Sort */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Language */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
            >
              <option value="">All Languages</option>
              {languages.filter((l) => l !== 'All').map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Regional Industry */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Regional Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
            >
              <option value="">All Industries</option>
              {industries.filter((i) => i !== 'All').map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Min Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
            >
              <option value="">Any Rating</option>
              <option value="9">9+ ⭐ Masterpieces</option>
              <option value="8">8+ ⭐ Highly Rated</option>
              <option value="7">7+ ⭐ Good</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
            >
              <option value="rating">Top Rated</option>
              <option value="year">Newest First</option>
              <option value="views">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-poster rounded-xl skeleton-shimmer" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="flex justify-center">
              <MovieCard movie={movie} onSelect={onSelectMovie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl max-w-md mx-auto my-12 space-y-4">
          <Film className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Movies Match Your Criteria</h3>
          <p className="text-xs text-neutral-400">
            Try adjusting your genre or language filters to discover more titles.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-semibold hover:bg-[#ff1e28] transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
