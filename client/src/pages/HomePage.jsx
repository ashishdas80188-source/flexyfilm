import React, { useState, useEffect } from 'react';
import {
  Flame,
  Star,
  Film,
  Sparkles,
  Clapperboard,
  Tv,
  Globe,
  Clock,
  Compass,
} from 'lucide-react';
import { api } from '../api/api.js';
import { HeroBanner } from '../components/HeroBanner.jsx';
import { MovieRow } from '../components/MovieRow.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const HomePage = ({ onSelectMovie, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  // Regional industries
  const [bollywoodMovies, setBollywoodMovies] = useState([]);
  const [tollywoodMovies, setTollywoodMovies] = useState([]);
  const [ollywoodMovies, setOllywoodMovies] = useState([]);
  const [sandalwoodMovies, setSandalwoodMovies] = useState([]);
  const [kollywoodMovies, setKollywoodMovies] = useState([]);
  const [mollywoodMovies, setMollywoodMovies] = useState([]);
  const [hollywoodMovies, setHollywoodMovies] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, [isAuthenticated]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [
        featuredRes,
        allMoviesRes,
        trendingRes,
        topRatedRes,
        seriesRes,
      ] = await Promise.all([
        api.get('/movies/featured'),
        api.get('/movies'),
        api.get('/movies?isTrending=true'),
        api.get('/movies?isTopRated=true'),
        api.get('/movies?type=series'),
      ]);

      if (featuredRes.data) setFeaturedMovies(featuredRes.data);
      if (trendingRes.data) setTrendingMovies(trendingRes.data);
      if (topRatedRes.data) setTopRatedMovies(topRatedRes.data);
      if (seriesRes.data) setSeriesList(seriesRes.data);

      if (allMoviesRes.data) {
        const all = allMoviesRes.data;
        setLatestMovies(all.slice(0, 10));
        setBollywoodMovies(all.filter((m) => m.industry === 'Bollywood'));
        setTollywoodMovies(all.filter((m) => m.industry === 'Tollywood'));
        setOllywoodMovies(all.filter((m) => m.industry === 'Ollywood'));
        setSandalwoodMovies(all.filter((m) => m.industry === 'Sandalwood'));
        setKollywoodMovies(all.filter((m) => m.industry === 'Kollywood'));
        setMollywoodMovies(all.filter((m) => m.industry === 'Mollywood'));
        setHollywoodMovies(all.filter((m) => m.industry === 'Hollywood'));
      }

      // If user is logged in, fetch continue watching
      if (isAuthenticated) {
        try {
          const histRes = await api.get('/history');
          if (histRes.data && histRes.data.length > 0) {
            setContinueWatching(histRes.data);
          }
        } catch (e) {
          console.warn('Could not load history:', e);
        }
      }
    } catch (err) {
      console.error('Failed to load homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pb-16">
      {/* Cinematic Hero Showcase */}
      <HeroBanner
        featuredMovies={featuredMovies.length > 0 ? featuredMovies : trendingMovies}
        onSelectMovie={onSelectMovie}
      />

      {/* Rows Container */}
      <div className="relative -mt-16 sm:-mt-24 z-20 space-y-6">
        {/* Continue Watching (Only for logged-in users with history) */}
        {continueWatching.length > 0 && (
          <MovieRow
            title="Continue Watching"
            subtitle="Pick up right where you left off"
            movies={continueWatching}
            isHistory={true}
            icon={Clock}
            onSelectMovie={onSelectMovie}
          />
        )}

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          subtitle="Top streamed titles across all languages today"
          movies={trendingMovies}
          icon={Flame}
          onSelectMovie={onSelectMovie}
        />

        {/* Top Rated Masterpieces */}
        <MovieRow
          title="Top Rated Masterpieces"
          subtitle="Critically acclaimed cinema rated 8.5+ on IMDb"
          movies={topRatedMovies}
          icon={Star}
          onSelectMovie={onSelectMovie}
        />

        {/* Latest Releases */}
        <MovieRow
          title="Latest Releases"
          subtitle="Fresh blockbusters and new digital arrivals"
          movies={latestMovies}
          icon={Sparkles}
          onSelectMovie={onSelectMovie}
        />

        {/* Popular Web Series */}
        {seriesList.length > 0 && (
          <MovieRow
            title="Binge-Worthy Web Series"
            subtitle="Compelling episodic stories and award-winning originals"
            movies={seriesList}
            icon={Tv}
            onSelectMovie={onSelectMovie}
          />
        )}

        {/* Regional Cinema Showcase: Bollywood */}
        {bollywoodMovies.length > 0 && (
          <MovieRow
            title="Bollywood Superhits"
            subtitle="Mass entertainment, romance, and gripping action from Hindi cinema"
            movies={bollywoodMovies}
            icon={Film}
            onSelectMovie={onSelectMovie}
          />
        )}

        {/* Regional Cinema Showcase: Tollywood */}
        {tollywoodMovies.length > 0 && (
          <MovieRow
            title="Tollywood Spectacles"
            subtitle="High-octane blockbusters and mythological epics in Telugu"
            movies={tollywoodMovies}
            icon={Clapperboard}
            onSelectMovie={onSelectMovie}
          />
        )}

        {/* Regional Cinema Showcase: Ollywood */}
        {ollywoodMovies.length > 0 && (
          <MovieRow
            title="Ollywood Gems (Odia Cinema)"
            subtitle="Authentic cultural tales, inspiring journeys, and rooted narratives"
            movies={ollywoodMovies}
            icon={Compass}
            onSelectMovie={onSelectMovie}
          />
        )}

        {/* Regional Cinema Showcase: Sandalwood */}
        {sandalwoodMovies.length > 0 && (
          <MovieRow
            title="Sandalwood Power (Kannada Cinema)"
            subtitle="Fierce mythologies, action epics, and emotional dramas"
            movies={sandalwoodMovies}
            icon={Sparkles}
            onSelectMovie={onSelectMovie}
          />
        )}

        {/* Regional Cinema Showcase: Kollywood & Mollywood */}
        {(kollywoodMovies.length > 0 || mollywoodMovies.length > 0) && (
          <MovieRow
            title="Tamil & Malayalam Highlights"
            subtitle="Cutting-edge thrillers and groundbreaking realistic storytelling"
            movies={[...kollywoodMovies, ...mollywoodMovies]}
            icon={Globe}
            onSelectMovie={onSelectMovie}
          />
        )}

        {/* Hollywood */}
        {hollywoodMovies.length > 0 && (
          <MovieRow
            title="Hollywood Blockbusters"
            subtitle="Global sci-fi, mind-bending thrillers, and multi-billion dollar franchises"
            movies={hollywoodMovies}
            icon={Film}
            onSelectMovie={onSelectMovie}
          />
        )}
      </div>
    </div>
  );
};
