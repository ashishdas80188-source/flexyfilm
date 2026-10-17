import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Film, ArrowRight } from 'lucide-react';
import { api } from '../api/api.js';
import { MovieCard } from '../components/MovieCard.jsx';

export const LanguagesPage = ({ onSelectMovie, activeIndustryParam = null }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(
    activeIndustryParam
      ? activeIndustryParam.charAt(0).toUpperCase() + activeIndustryParam.slice(1)
      : 'All'
  );
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const industries = [
    {
      id: 'All',
      name: 'All Cinema',
      tagline: 'Explore India and World Cinema across all tongues',
      language: 'Multilingual',
      bg: 'https://image.tmdb.org/t/p/original/m9m5F7Z10E2dF3fK9XG4GZ9U3qY.jpg',
    },
    {
      id: 'Bollywood',
      name: 'Bollywood',
      tagline: 'Hindi Cinema: Grand spectacles, musical magic, and high-voltage drama',
      language: 'Hindi',
      bg: 'https://image.tmdb.org/t/p/w780/jIW0Wn61Lz6fUqYq23yXJ2G1s6E.jpg',
    },
    {
      id: 'Hollywood',
      name: 'Hollywood',
      tagline: 'English & Global: Visionary sci-fi, blockbusters, and award-winning masterworks',
      language: 'English',
      bg: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    },
    {
      id: 'Tollywood',
      name: 'Tollywood',
      tagline: 'Telugu Cinema: Mythological grandeur, ferocious action, and pan-India sagas',
      language: 'Telugu',
      bg: 'https://image.tmdb.org/t/p/w780/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg',
    },
    {
      id: 'Ollywood',
      name: 'Ollywood',
      tagline: 'Odia Cinema: Heartfelt, culturally rooted, inspiring stories of Odisha',
      language: 'Odia',
      bg: 'https://image.tmdb.org/t/p/w780/3T4w1iEecUq1vQYv2k0k2tL3y8Z.jpg',
    },
    {
      id: 'Sandalwood',
      name: 'Sandalwood',
      tagline: 'Kannada Cinema: Untamed power, folklore legends, and emotional intensity',
      language: 'Kannada',
      bg: 'https://image.tmdb.org/t/p/w780/5s1y8e4k0b9m5F7Z10E2dF3fK9X.jpg',
    },
    {
      id: 'Kollywood',
      name: 'Kollywood',
      tagline: 'Tamil Cinema: Cinematic finesse, dark thrillers, and visionary directors',
      language: 'Tamil',
      bg: 'https://image.tmdb.org/t/p/w780/mO4R7m7f6L4k9jE4U4f2V6s9r7q.jpg',
    },
    {
      id: 'Mollywood',
      name: 'Mollywood',
      tagline: 'Malayalam Cinema: Realistic character studies, subtle brilliance, and nuance',
      language: 'Malayalam',
      bg: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    },
  ];

  useEffect(() => {
    if (activeIndustryParam) {
      setSelectedIndustry(
        activeIndustryParam.charAt(0).toUpperCase() + activeIndustryParam.slice(1)
      );
    }
  }, [activeIndustryParam]);

  useEffect(() => {
    fetchMovies();
  }, [selectedIndustry]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      let url = '/movies';
      if (selectedIndustry !== 'All') {
        url += `?industry=${encodeURIComponent(selectedIndustry)}`;
      }
      const res = await api.get(url);
      if (res.data) {
        setMovies(res.data);
      }
    } catch (err) {
      console.error('Error fetching regional movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeHub = industries.find((i) => i.id === selectedIndustry) || industries[0];

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-6 h-6 text-[#E50914]" />
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
            Regional & Linguistic Cinema Hubs
          </h1>
        </div>
        <p className="text-neutral-400 text-sm max-w-2xl">
          Celebrate India's rich cultural cinema diversity alongside world cinema. Stream Bollywood, Tollywood, Ollywood, Sandalwood, and beyond in high definition.
        </p>
      </div>

      {/* Horizontal Industry Selector Badges */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {industries.map((ind) => {
          const active = selectedIndustry === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustry(ind.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                active
                  ? 'bg-[#E50914] text-white shadow-xl shadow-[#E50914]/40 scale-105'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-white/5'
              }`}
            >
              <span>{ind.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20' : 'bg-white/5'}`}>
                {ind.language}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Industry Spotlight Card */}
      <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-8 mb-10">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E50914]/20 text-[#FF334B] border border-[#E50914]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Industry Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {activeHub.name} ({activeHub.language})
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {activeHub.tagline}
          </p>
          <p className="text-xs text-neutral-400 pt-2 font-medium">
            Showing <span className="text-white font-bold">{movies.length}</span> verified titles in this category
          </p>
        </div>
      </div>

      {/* Cinema Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
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
          <h3 className="text-lg font-bold text-white">No Titles Found for this Language</h3>
          <p className="text-xs text-neutral-400">
            More regional releases are added continuously by our curation team.
          </p>
        </div>
      )}
    </div>
  );
};
