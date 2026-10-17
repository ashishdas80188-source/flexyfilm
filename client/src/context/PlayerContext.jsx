import React, { createContext, useContext, useState } from 'react';
import { api } from '../api/api.js';
import { useAuth } from './AuthContext.jsx';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMovie, setActiveMovie] = useState(null);
  const [isTrailerOnly, setIsTrailerOnly] = useState(false);

  const playMovie = (movie, trailerOnly = false) => {
    setActiveMovie(movie);
    setIsTrailerOnly(trailerOnly);
    setIsOpen(true);

    // If authenticated, record or update watch history
    if (isAuthenticated && movie && !trailerOnly) {
      api.post('/history/progress', {
        movieId: movie._id || movie.id,
        progressSeconds: 120, // started watching
        totalSeconds: (movie.runtime || 120) * 60,
        movieData: {
          title: movie.title,
          posterPath: movie.posterPath,
          backdropPath: movie.backdropPath,
          rating: movie.rating,
          releaseYear: movie.releaseYear,
          runtime: movie.runtime,
          genres: movie.genres,
          language: movie.language,
          type: movie.type,
        },
      }).catch((e) => console.warn('Could not record history:', e));
    }
  };

  const closePlayer = () => {
    setIsOpen(false);
    setActiveMovie(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        isOpen,
        activeMovie,
        isTrailerOnly,
        playMovie,
        closePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
