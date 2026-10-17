import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api.js';
import { useAuth } from './AuthContext.jsx';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [isAuthenticated, user?._id]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/watchlist');
      if (res.success && Array.isArray(res.data)) {
        setWatchlist(res.data);
      }
    } catch (err) {
      console.warn('Failed to load watchlist:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const inWatchlist = (movieId) => {
    if (!movieId) return false;
    return watchlist.some((item) => item.movieId === movieId || item._id === movieId);
  };

  const addToWatchlist = async (movie) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return false;
    }

    try {
      const movieId = movie._id || movie.id;
      const movieData = {
        title: movie.title,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        rating: movie.rating,
        releaseYear: movie.releaseYear,
        genres: movie.genres || [],
        language: movie.language || 'Hindi',
        type: movie.type || 'movie',
      };

      // Optimistic update
      const optimisticItem = {
        _id: 'temp_' + Date.now(),
        userId: user._id,
        movieId,
        movieData,
      };
      setWatchlist((prev) => [optimisticItem, ...prev]);

      const res = await api.post('/watchlist', { movieId, movieData });
      if (res.success && res.data) {
        setWatchlist((prev) =>
          prev.map((item) => (item._id === optimisticItem._id ? res.data : item))
        );
        return true;
      }
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      fetchWatchlist(); // Revert
      return false;
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (!isAuthenticated) return false;

    try {
      // Optimistic update
      setWatchlist((prev) =>
        prev.filter((item) => item.movieId !== movieId && item._id !== movieId)
      );
      await api.delete(`/watchlist/${movieId}`);
      return true;
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      fetchWatchlist();
      return false;
    }
  };

  const toggleWatchlist = async (movie) => {
    const movieId = movie._id || movie.id;
    if (inWatchlist(movieId)) {
      return await removeFromWatchlist(movieId);
    } else {
      return await addToWatchlist(movie);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        loading,
        inWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        refreshWatchlist: fetchWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
