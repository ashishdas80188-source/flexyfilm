import { Storage } from '../services/storageService.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await Storage.getAdminStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    const {
      title,
      originalTitle,
      overview,
      tagline,
      posterPath,
      backdropPath,
      trailerUrl,
      videoUrl,
      releaseYear,
      runtime,
      rating,
      genres,
      language,
      industry,
      type,
      maturityRating,
      director,
      cast,
      isFeatured,
      isTrending,
      isTopRated,
    } = req.body;

    if (!title || !overview || !posterPath || !releaseYear) {
      return res.status(400).json({
        success: false,
        message: 'Title, overview, poster path, and release year are required',
      });
    }

    const movie = await Storage.createMovie({
      title,
      originalTitle: originalTitle || title,
      overview,
      tagline: tagline || '',
      posterPath,
      backdropPath: backdropPath || posterPath,
      trailerUrl: trailerUrl || '',
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      releaseYear: Number(releaseYear),
      runtime: Number(runtime) || 120,
      rating: Number(rating) || 7.5,
      genres: Array.isArray(genres) ? genres : (genres ? genres.split(',').map((g) => g.trim()) : ['Drama']),
      language: language || 'Hindi',
      industry: industry || 'Bollywood',
      type: type || 'movie',
      maturityRating: maturityRating || 'U/A 16+',
      director: director || '',
      cast: cast || [],
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      isTopRated: !!isTopRated,
      viewsCount: 100,
    });

    res.status(201).json({
      success: true,
      data: movie,
      message: 'Movie created successfully in catalog',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Storage.updateMovie(id, req.body);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({
      success: true,
      data: movie,
      message: 'Movie updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Storage.deleteMovie(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({
      success: true,
      message: 'Movie removed from catalog',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Storage.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    const updated = await Storage.updateMovie(id, { isFeatured: !movie.isFeatured });
    res.json({
      success: true,
      data: updated,
      message: `Movie ${updated.isFeatured ? 'featured on hero banner' : 'unfeatured'}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Storage.getAllUsers();
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user._id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }
    await Storage.deleteUser(id);
    res.json({
      success: true,
      message: 'User account removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
