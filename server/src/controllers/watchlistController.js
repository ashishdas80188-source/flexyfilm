import { Storage } from '../services/storageService.js';

export const getWatchlist = async (req, res) => {
  try {
    const list = await Storage.getWatchlist(req.user._id);
    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const { movieId, movieData } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    let payload = movieData;
    if (!payload) {
      const fullMovie = await Storage.getMovieById(movieId);
      if (fullMovie) {
        payload = {
          title: fullMovie.title,
          posterPath: fullMovie.posterPath,
          backdropPath: fullMovie.backdropPath,
          rating: fullMovie.rating,
          releaseYear: fullMovie.releaseYear,
          genres: fullMovie.genres,
          language: fullMovie.language,
          type: fullMovie.type,
        };
      }
    }

    const item = await Storage.addToWatchlist(req.user._id, movieId, payload);
    res.status(201).json({
      success: true,
      data: item,
      message: 'Added to My List',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    await Storage.removeFromWatchlist(req.user._id, movieId);
    res.json({
      success: true,
      message: 'Removed from My List',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkWatchlistStatus = async (req, res) => {
  try {
    const { movieId } = req.params;
    const inList = await Storage.isMovieInWatchlist(req.user._id, movieId);
    res.json({
      success: true,
      inWatchlist: inList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
