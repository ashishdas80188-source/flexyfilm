import { Storage } from '../services/storageService.js';
import { TMDBService } from '../services/tmdbService.js';

export const getMovies = async (req, res) => {
  try {
    const {
      genre,
      language,
      industry,
      type,
      year,
      minRating,
      sort,
      isFeatured,
      isTrending,
      isTopRated,
      limit,
    } = req.query;

    const filter = {};
    if (genre) filter.genre = genre;
    if (language) filter.language = language;
    if (industry) filter.industry = industry;
    if (type) filter.type = type;
    if (year) filter.year = year;
    if (minRating) filter.minRating = minRating;
    if (sort) filter.sort = sort;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (isTrending !== undefined) filter.isTrending = isTrending === 'true';
    if (isTopRated !== undefined) filter.isTopRated = isTopRated === 'true';

    let movies = await Storage.getMovies(filter);

    if (limit) {
      movies = movies.slice(0, Number(limit));
    }

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedMovies = async (req, res) => {
  try {
    let movies = await Storage.getMovies({ isFeatured: true });
    if (movies.length === 0) {
      movies = await Storage.getMovies({ isTrending: true });
    }
    res.json({
      success: true,
      data: movies.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a TMDB reference
    if (id.startsWith('tmdb_')) {
      const tmdbId = id.replace('tmdb_', '');
      const tmdbMovie = await TMDBService.getMovieDetails(tmdbId);
      if (tmdbMovie) {
        // Fetch similar from local catalog
        const similar = await Storage.getMovies({ limit: 6 });
        return res.json({
          success: true,
          data: {
            ...tmdbMovie,
            similarMovies: similar.slice(0, 6),
          },
        });
      }
    }

    const movie = await Storage.getMovieById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie or series not found',
      });
    }

    // Increment view count slightly
    Storage.updateMovie(id, { viewsCount: (movie.viewsCount || 1000) + 1 }).catch(() => {});

    // Compute similar movies based on shared genre or language
    const allMovies = await Storage.getMovies();
    const similarMovies = allMovies
      .filter((m) => m._id.toString() !== id.toString())
      .filter(
        (m) =>
          m.industry === movie.industry ||
          m.language === movie.language ||
          m.genres.some((g) => movie.genres.includes(g))
      )
      .slice(0, 8);

    res.json({
      success: true,
      data: {
        ...movie,
        similarMovies: similarMovies.length > 0 ? similarMovies : allMovies.slice(0, 6),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const { q, language, genre, industry, year } = req.query;

    const filters = {};
    if (language) filters.language = language;
    if (genre) filters.genre = genre;
    if (industry) filters.industry = industry;
    if (year) filters.year = year;

    let results = await Storage.searchMovies(q, filters);

    // If local results are sparse and TMDB is configured, query TMDB multi search
    if (results.length < 3 && q) {
      const tmdbResults = await TMDBService.searchMovies(q);
      if (tmdbResults && tmdbResults.length > 0) {
        results = [...results, ...tmdbResults];
      }
    }

    res.json({
      success: true,
      count: results.length,
      data: results,
      query: q || '',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getIndustriesSummary = async (req, res) => {
  try {
    const all = await Storage.getMovies();
    const industries = [
      { name: 'Bollywood', language: 'Hindi', count: 0, image: 'https://image.tmdb.org/t/p/w780/jIW0Wn61Lz6fUqYq23yXJ2G1s6E.jpg', tagline: 'Epic drama, music, and blockbuster emotions' },
      { name: 'Hollywood', language: 'English', count: 0, image: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', tagline: 'Global cinematic masterworks & franchises' },
      { name: 'Tollywood', language: 'Telugu', count: 0, image: 'https://image.tmdb.org/t/p/w780/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg', tagline: 'Grand spectacles, iconic heroes, and folklore' },
      { name: 'Ollywood', language: 'Odia', count: 0, image: 'https://image.tmdb.org/t/p/w780/3T4w1iEecUq1vQYv2k0k2tL3y8Z.jpg', tagline: 'Heartwarming narratives from the land of Jagannath' },
      { name: 'Sandalwood', language: 'Kannada', count: 0, image: 'https://image.tmdb.org/t/p/w780/5s1y8e4k0b9m5F7Z10E2dF3fK9X.jpg', tagline: 'Raw intensity, mythical grandeur, and passion' },
      { name: 'Kollywood', language: 'Tamil', count: 0, image: 'https://image.tmdb.org/t/p/w780/mO4R7m7f6L4k9jE4U4f2V6s9r7q.jpg', tagline: 'Gripping thrillers and visionary storytelling' },
      { name: 'Mollywood', language: 'Malayalam', count: 0, image: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', tagline: 'Subtle realism, profound scripts, and brilliance' },
    ];

    all.forEach((m) => {
      const found = industries.find((ind) => ind.name.toLowerCase() === m.industry?.toLowerCase());
      if (found) found.count++;
    });

    res.json({ success: true, data: industries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
