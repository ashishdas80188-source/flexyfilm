import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Sparkles, Film, ArrowRight } from 'lucide-react';
import { api } from '../api/api.js';
import { MovieCard } from '../components/MovieCard.jsx';

export const SearchPage = ({ onSelectMovie, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [trendingRecommendations, setTrendingRecommendations] = useState([]);

  const suggestions = [
    'Jawan',
    'Shah Rukh Khan',
    'Kalki 2898 AD',
    'Dune',
    '12th Fail',
    'Mirzapur',
    'Denis Villeneuve',
    'Kantara',
    'Babushaan Mohanty',
    'Allu Arjun',
    'Sci-Fi',
    'Action',
  ];

  const languages = ['Hindi', 'English', 'Telugu', 'Odia', 'Kannada', 'Tamil', 'Malayalam'];
  const genres = ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Crime', 'Thriller', 'Horror'];

  useEffect(() => {
    // Load fallback recommendations
    api.get('/movies?isTrending=true').then((res) => {
      if (res.data) setTrendingRecommendations(res.data.slice(0, 5));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      executeSearch();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedLanguage, selectedGenre]);

  const executeSearch = async () => {
    if (!query.trim() && !selectedLanguage && !selectedGenre) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query.trim());
      if (selectedLanguage) params.append('language', selectedLanguage);
      if (selectedGenre) params.append('genre', selectedGenre);

      const res = await api.get(`/movies/search?${params.toString()}`);
      if (res.data) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setQuery(item);
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedLanguage('');
    setSelectedGenre('');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight mb-2">
          Search Cinema & Talent
        </h1>
        <p className="text-neutral-400 text-sm">
          Discover movies, web series, directors, and star casts across 10+ languages.
        </p>
      </div>

      {/* Main Big Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#E50914]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, director, actor (e.g. Shah Rukh Khan, Dune, Malkangiri)..."
          autoFocus
          className="w-full pl-13 pr-12 py-4 bg-neutral-900 border border-white/10 rounded-2xl text-base sm:text-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] shadow-2xl transition-colors"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-6">
        <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider whitespace-nowrap mr-1">
          Try:
        </span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => handleSuggestionClick(s)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-900 hover:bg-[#E50914]/20 hover:text-white text-neutral-300 border border-white/5 whitespace-nowrap transition-all cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Filter Badges: Language & Genre */}
      <div className="flex flex-wrap items-center gap-3 p-3 glass-panel rounded-xl mb-8">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mr-2">
          <Filter className="w-3.5 h-3.5 text-[#E50914]" />
          <span>Filters:</span>
        </div>

        {/* Language Filter */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-[#E50914]"
        >
          <option value="">All Languages</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Genre Filter */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-[#E50914]"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {(selectedLanguage || selectedGenre) && (
          <button
            onClick={() => {
              setSelectedLanguage('');
              setSelectedGenre('');
            }}
            className="text-xs text-red-400 hover:underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results View */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-poster rounded-xl skeleton-shimmer" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-xs text-neutral-400 mb-4 font-medium">
            Found <span className="text-white font-bold">{results.length}</span> matching titles:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {results.map((movie) => (
              <div key={movie._id} className="flex justify-center">
                <MovieCard movie={movie} onSelect={onSelectMovie} />
              </div>
            ))}
          </div>
        </div>
      ) : query.trim() || selectedLanguage || selectedGenre ? (
        /* Empty State */
        <div className="space-y-8 my-10">
          <div className="glass-panel p-10 text-center rounded-2xl max-w-lg mx-auto space-y-3">
            <Film className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              No matching cinema found for "{query}"
            </h3>
            <p className="text-xs text-neutral-400">
              Try searching with a broader keyword, actor name, or exploring trending recommendations below.
            </p>
          </div>

          {/* Trending fallback recommendations */}
          {trendingRecommendations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-base font-bold text-white">
                  Trending Recommendations You Might Enjoy
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {trendingRecommendations.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} onSelect={onSelectMovie} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Initial Landing Search State */
        <div className="space-y-8 my-8">
          <div className="glass-panel p-8 text-center rounded-2xl max-w-lg mx-auto space-y-3">
            <Sparkles className="w-10 h-10 text-[#E50914] mx-auto" />
            <h3 className="text-lg font-bold text-white">Start Searching FlexyFilm</h3>
            <p className="text-xs text-neutral-400">
              Type movie titles, star names, directors, or select a genre above to begin.
            </p>
          </div>

          {trendingRecommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">
                Trending on FlexyFilm Today
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {trendingRecommendations.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} onSelect={onSelectMovie} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
