import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = process.env.TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export const isTMDBConfigured = () => !!TMDB_API_KEY && TMDB_API_KEY.trim().length > 5;

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 5000,
});

export const TMDBService = {
  async getTrending(mediaType = 'movie', timeWindow = 'week') {
    if (!isTMDBConfigured()) return null;
    try {
      const res = await tmdbClient.get(`/trending/${mediaType}/${timeWindow}`, {
        params: { api_key: TMDB_API_KEY },
      });
      return res.data.results.map(formatTMDBMovie);
    } catch (err) {
      console.warn('TMDB getTrending fallback:', err.message);
      return null;
    }
  },

  async getMovieDetails(tmdbId) {
    if (!isTMDBConfigured()) return null;
    try {
      const [detailsRes, creditsRes, videosRes] = await Promise.all([
        tmdbClient.get(`/movie/${tmdbId}`, { params: { api_key: TMDB_API_KEY } }),
        tmdbClient.get(`/movie/${tmdbId}/credits`, { params: { api_key: TMDB_API_KEY } }),
        tmdbClient.get(`/movie/${tmdbId}/videos`, { params: { api_key: TMDB_API_KEY } }),
      ]);

      const movie = detailsRes.data;
      const credits = creditsRes.data;
      const videos = videosRes.data.results || [];

      const trailer = videos.find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
      );

      const director = credits.crew?.find((c) => c.job === 'Director')?.name || '';
      const cast = (credits.cast || []).slice(0, 8).map((c) => ({
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null,
      }));

      return {
        _id: `tmdb_${movie.id}`,
        tmdbId: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        overview: movie.overview,
        tagline: movie.tagline,
        posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE}/w780${movie.poster_path}` : null,
        backdropPath: movie.backdrop_path ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}` : null,
        trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
        releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
        releaseDate: movie.release_date,
        runtime: movie.runtime || 120,
        rating: Math.round(movie.vote_average * 10) / 10,
        voteCount: movie.vote_count,
        genres: (movie.genres || []).map((g) => g.name),
        language: movie.original_language?.toUpperCase() || 'EN',
        director,
        cast,
      };
    } catch (err) {
      console.warn('TMDB getMovieDetails fallback:', err.message);
      return null;
    }
  },

  async searchMovies(query) {
    if (!isTMDBConfigured() || !query) return null;
    try {
      const res = await tmdbClient.get('/search/multi', {
        params: {
          api_key: TMDB_API_KEY,
          query,
          include_adult: false,
        },
      });
      return res.data.results
        .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
        .map(formatTMDBMovie);
    } catch (err) {
      console.warn('TMDB searchMovies fallback:', err.message);
      return null;
    }
  },
};

function formatTMDBMovie(item) {
  const isMovie = item.media_type !== 'tv';
  return {
    _id: `tmdb_${item.id}`,
    tmdbId: item.id,
    title: item.title || item.name,
    originalTitle: item.original_title || item.original_name,
    overview: item.overview,
    posterPath: item.poster_path ? `${TMDB_IMAGE_BASE}/w780${item.poster_path}` : null,
    backdropPath: item.backdrop_path ? `${TMDB_IMAGE_BASE}/original${item.backdrop_path}` : null,
    releaseYear: (item.release_date || item.first_air_date)
      ? new Date(item.release_date || item.first_air_date).getFullYear()
      : 2024,
    rating: Math.round((item.vote_average || 7) * 10) / 10,
    voteCount: item.vote_count || 100,
    genres: [],
    language: item.original_language?.toUpperCase() || 'EN',
    type: isMovie ? 'movie' : 'series',
  };
}
