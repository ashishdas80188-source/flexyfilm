import bcrypt from 'bcryptjs';
import { getIsMongoConnected } from '../config/db.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Watchlist from '../models/Watchlist.js';
import WatchHistory from '../models/WatchHistory.js';
import { initialMovies, defaultUsers } from './seedData.js';

// In-memory fallback stores
let memoryMovies = JSON.parse(JSON.stringify(initialMovies));
let memoryUsers = [];
let memoryWatchlist = [];
let memoryHistory = [];

export const initStorage = async () => {
  const isMongo = getIsMongoConnected();

  // Initialize demo users with real hashed passwords
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const userPasswordHash = await bcrypt.hash('user123', salt);

  const seededUsers = [
    {
      _id: 'u_admin_1',
      name: 'Flexy Admin',
      email: 'admin@flexyfilm.com',
      password: adminPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      preferredLanguages: ['Hindi', 'English', 'Telugu', 'Odia', 'Kannada'],
      createdAt: new Date(),
    },
    {
      _id: 'u_demo_1',
      name: 'Movie Buff',
      email: 'user@flexyfilm.com',
      password: userPasswordHash,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      preferredLanguages: ['Hindi', 'English'],
      createdAt: new Date(),
    },
  ];

  memoryUsers = JSON.parse(JSON.stringify(seededUsers));

  // Initialize sample continue-watching items in memory
  memoryHistory = [
    {
      _id: 'h_1',
      userId: 'u_demo_1',
      movieId: 'm_bolly_1',
      progressSeconds: 3840,
      totalSeconds: 10140,
      completed: false,
      movieData: {
        title: 'Jawan',
        posterPath: 'https://image.tmdb.org/t/p/w780/jIW0Wn61Lz6fUqYq23yXJ2G1s6E.jpg',
        backdropPath: 'https://image.tmdb.org/t/p/original/m9m5F7Z10E2dF3fK9XG4GZ9U3qY.jpg',
        rating: 8.2,
        releaseYear: 2023,
        runtime: 169,
        genres: ['Action', 'Thriller'],
        language: 'Hindi',
        type: 'movie',
      },
      lastWatchedAt: new Date(),
    },
    {
      _id: 'h_2',
      userId: 'u_demo_1',
      movieId: 's_series_1',
      progressSeconds: 1920,
      totalSeconds: 3300,
      completed: false,
      movieData: {
        title: 'Mirzapur',
        posterPath: 'https://image.tmdb.org/t/p/w780/hH2WkK5m5U0x9f5qK3s1y8e4k0b.jpg',
        backdropPath: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
        rating: 8.8,
        releaseYear: 2024,
        runtime: 55,
        genres: ['Crime', 'Action'],
        language: 'Hindi',
        type: 'series',
      },
      lastWatchedAt: new Date(),
    },
  ];

  // Initialize sample watchlist items in memory
  memoryWatchlist = [
    {
      _id: 'w_1',
      userId: 'u_demo_1',
      movieId: 'm_holly_1',
      movieData: {
        title: 'Dune: Part Two',
        posterPath: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdropPath: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg',
        rating: 8.7,
        releaseYear: 2024,
        genres: ['Sci-Fi', 'Adventure'],
        language: 'English',
        type: 'movie',
      },
      addedAt: new Date(),
    },
    {
      _id: 'w_2',
      userId: 'u_demo_1',
      movieId: 'm_tolly_1',
      movieData: {
        title: 'Kalki 2898 AD',
        posterPath: 'https://image.tmdb.org/t/p/w780/6EaX7E3P0FvX1B3jXG4s1y8e4k0.jpg',
        backdropPath: 'https://image.tmdb.org/t/p/original/2wP7t5vH5F1vK4s7G4s1y8e4k0.jpg',
        rating: 8.5,
        releaseYear: 2024,
        genres: ['Sci-Fi', 'Action'],
        language: 'Telugu',
        type: 'movie',
      },
      addedAt: new Date(),
    },
  ];

  if (isMongo) {
    try {
      const count = await Movie.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding MongoDB with FlexyFilm initial cinema catalog...');
        await Movie.insertMany(initialMovies);
      }
      for (const u of seededUsers) {
        const exists = await User.findOne({ email: u.email });
        if (!exists) {
          await User.create(u);
        }
      }
      console.log('✅ MongoDB Catalog and Default Users verified.');
    } catch (e) {
      console.warn('⚠️  MongoDB seeding error, continuing with fallback:', e.message);
    }
  } else {
    console.log('🍿 FlexyFilm Seed Catalog loaded in High-Speed Memory Store: ' + memoryMovies.length + ' titles ready.');
  }
};

export const Storage = {
  // --- USERS ---
  async findUserByEmail(email) {
    if (getIsMongoConnected()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (getIsMongoConnected()) {
      return await User.findById(id).select('-password');
    }
    const user = memoryUsers.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser(userData) {
    if (getIsMongoConnected()) {
      return await User.create(userData);
    }
    const newUser = {
      _id: 'u_' + Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    memoryUsers.push(newUser);
    return newUser;
  },

  async updateUser(id, updateData) {
    if (getIsMongoConnected()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }
    const index = memoryUsers.findIndex((u) => u._id.toString() === id.toString());
    if (index === -1) return null;
    memoryUsers[index] = { ...memoryUsers[index], ...updateData };
    const { password, ...safeUser } = memoryUsers[index];
    return safeUser;
  },

  async getAllUsers() {
    if (getIsMongoConnected()) {
      return await User.find().select('-password');
    }
    return memoryUsers.map(({ password, ...u }) => u);
  },

  async deleteUser(id) {
    if (getIsMongoConnected()) {
      return await User.findByIdAndDelete(id);
    }
    const prevLen = memoryUsers.length;
    memoryUsers = memoryUsers.filter((u) => u._id.toString() !== id.toString());
    return memoryUsers.length < prevLen;
  },

  // --- MOVIES ---
  async getMovies(filter = {}) {
    if (getIsMongoConnected()) {
      const query = {};
      if (filter.genre) query.genres = { $in: [filter.genre] };
      if (filter.language) query.language = new RegExp(filter.language, 'i');
      if (filter.industry) query.industry = new RegExp(filter.industry, 'i');
      if (filter.type) query.type = filter.type;
      if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
      if (filter.isTrending !== undefined) query.isTrending = filter.isTrending;
      if (filter.isTopRated !== undefined) query.isTopRated = filter.isTopRated;
      if (filter.year) query.releaseYear = Number(filter.year);
      if (filter.minRating) query.rating = { $gte: Number(filter.minRating) };

      let sort = { createdAt: -1 };
      if (filter.sort === 'rating') sort = { rating: -1 };
      if (filter.sort === 'year') sort = { releaseYear: -1 };
      if (filter.sort === 'views') sort = { viewsCount: -1 };

      return await Movie.find(query).sort(sort);
    }

    let results = [...memoryMovies];

    if (filter.genre) {
      results = results.filter((m) =>
        m.genres.some((g) => g.toLowerCase() === filter.genre.toLowerCase())
      );
    }
    if (filter.language) {
      results = results.filter(
        (m) => m.language.toLowerCase() === filter.language.toLowerCase()
      );
    }
    if (filter.industry) {
      results = results.filter(
        (m) => m.industry.toLowerCase() === filter.industry.toLowerCase()
      );
    }
    if (filter.type) {
      results = results.filter((m) => m.type === filter.type);
    }
    if (filter.isFeatured !== undefined) {
      results = results.filter((m) => m.isFeatured === filter.isFeatured);
    }
    if (filter.isTrending !== undefined) {
      results = results.filter((m) => m.isTrending === filter.isTrending);
    }
    if (filter.isTopRated !== undefined) {
      results = results.filter((m) => m.isTopRated === filter.isTopRated);
    }
    if (filter.year) {
      results = results.filter((m) => m.releaseYear === Number(filter.year));
    }
    if (filter.minRating) {
      results = results.filter((m) => m.rating >= Number(filter.minRating));
    }

    if (filter.sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (filter.sort === 'year') {
      results.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (filter.sort === 'views') {
      results.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else {
      results.reverse();
    }

    return results;
  },

  async getMovieById(id) {
    if (getIsMongoConnected()) {
      try {
        const doc = await Movie.findById(id);
        if (doc) return doc;
      } catch (err) {
        // Fallback for non-ObjectID queries
      }
      return await Movie.findOne({ _id: id });
    }
    return memoryMovies.find((m) => m._id.toString() === id.toString()) || null;
  },

  async createMovie(movieData) {
    if (getIsMongoConnected()) {
      return await Movie.create(movieData);
    }
    const newMovie = {
      _id: 'm_' + Date.now(),
      ...movieData,
      createdAt: new Date().toISOString(),
    };
    memoryMovies.unshift(newMovie);
    return newMovie;
  },

  async updateMovie(id, updateData) {
    if (getIsMongoConnected()) {
      return await Movie.findByIdAndUpdate(id, updateData, { new: true });
    }
    const index = memoryMovies.findIndex((m) => m._id.toString() === id.toString());
    if (index === -1) return null;
    memoryMovies[index] = { ...memoryMovies[index], ...updateData };
    return memoryMovies[index];
  },

  async deleteMovie(id) {
    if (getIsMongoConnected()) {
      return await Movie.findByIdAndDelete(id);
    }
    const prevLen = memoryMovies.length;
    memoryMovies = memoryMovies.filter((m) => m._id.toString() !== id.toString());
    return memoryMovies.length < prevLen;
  },

  async searchMovies(query, filters = {}) {
    const q = (query || '').toLowerCase().trim();

    if (getIsMongoConnected()) {
      const matchCriteria = {};
      if (q) {
        matchCriteria.$or = [
          { title: { $regex: q, $options: 'i' } },
          { originalTitle: { $regex: q, $options: 'i' } },
          { director: { $regex: q, $options: 'i' } },
          { 'cast.name': { $regex: q, $options: 'i' } },
          { genres: { $elemMatch: { $regex: q, $options: 'i' } } },
        ];
      }
      if (filters.language) matchCriteria.language = new RegExp(filters.language, 'i');
      if (filters.genre) matchCriteria.genres = { $in: [filters.genre] };
      if (filters.industry) matchCriteria.industry = new RegExp(filters.industry, 'i');
      if (filters.year) matchCriteria.releaseYear = Number(filters.year);

      return await Movie.find(matchCriteria);
    }

    return memoryMovies.filter((m) => {
      let matchesQuery = true;
      if (q) {
        const titleMatch = m.title?.toLowerCase().includes(q);
        const origMatch = m.originalTitle?.toLowerCase().includes(q);
        const dirMatch = m.director?.toLowerCase().includes(q);
        const castMatch = m.cast?.some((c) => c.name?.toLowerCase().includes(q));
        const genreMatch = m.genres?.some((g) => g.toLowerCase().includes(q));
        matchesQuery = titleMatch || origMatch || dirMatch || castMatch || genreMatch;
      }

      if (!matchesQuery) return false;
      if (filters.language && m.language.toLowerCase() !== filters.language.toLowerCase()) return false;
      if (filters.genre && !m.genres.some((g) => g.toLowerCase() === filters.genre.toLowerCase())) return false;
      if (filters.industry && m.industry.toLowerCase() !== filters.industry.toLowerCase()) return false;
      if (filters.year && m.releaseYear !== Number(filters.year)) return false;

      return true;
    });
  },

  // --- WATCHLIST ---
  async getWatchlist(userId) {
    if (getIsMongoConnected()) {
      return await Watchlist.find({ userId }).sort({ createdAt: -1 });
    }
    return memoryWatchlist.filter((w) => w.userId.toString() === userId.toString());
  },

  async addToWatchlist(userId, movieId, movieData) {
    if (getIsMongoConnected()) {
      const existing = await Watchlist.findOne({ userId, movieId });
      if (existing) return existing;
      return await Watchlist.create({ userId, movieId, movieData });
    }
    const existing = memoryWatchlist.find(
      (w) => w.userId.toString() === userId.toString() && w.movieId === movieId
    );
    if (existing) return existing;
    const item = {
      _id: 'w_' + Date.now(),
      userId,
      movieId,
      movieData,
      addedAt: new Date().toISOString(),
    };
    memoryWatchlist.unshift(item);
    return item;
  },

  async removeFromWatchlist(userId, movieId) {
    if (getIsMongoConnected()) {
      return await Watchlist.findOneAndDelete({ userId, movieId });
    }
    const prev = memoryWatchlist.length;
    memoryWatchlist = memoryWatchlist.filter(
      (w) => !(w.userId.toString() === userId.toString() && w.movieId === movieId)
    );
    return memoryWatchlist.length < prev;
  },

  async isMovieInWatchlist(userId, movieId) {
    if (getIsMongoConnected()) {
      const found = await Watchlist.findOne({ userId, movieId });
      return !!found;
    }
    return memoryWatchlist.some(
      (w) => w.userId.toString() === userId.toString() && w.movieId === movieId
    );
  },

  // --- WATCH HISTORY / CONTINUE WATCHING ---
  async getWatchHistory(userId) {
    if (getIsMongoConnected()) {
      return await WatchHistory.find({ userId }).sort({ lastWatchedAt: -1 }).limit(20);
    }
    return memoryHistory
      .filter((h) => h.userId.toString() === userId.toString())
      .sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt));
  },

  async updateWatchProgress(userId, movieId, progressSeconds, totalSeconds, movieData) {
    const completed = progressSeconds >= totalSeconds * 0.95;

    if (getIsMongoConnected()) {
      return await WatchHistory.findOneAndUpdate(
        { userId, movieId },
        {
          progressSeconds,
          totalSeconds,
          completed,
          movieData,
          lastWatchedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    const index = memoryHistory.findIndex(
      (h) => h.userId.toString() === userId.toString() && h.movieId === movieId
    );

    const record = {
      _id: index !== -1 ? memoryHistory[index]._id : 'h_' + Date.now(),
      userId,
      movieId,
      progressSeconds,
      totalSeconds,
      completed,
      movieData,
      lastWatchedAt: new Date().toISOString(),
    };

    if (index !== -1) {
      memoryHistory[index] = record;
    } else {
      memoryHistory.unshift(record);
    }
    return record;
  },

  async clearWatchHistory(userId) {
    if (getIsMongoConnected()) {
      return await WatchHistory.deleteMany({ userId });
    }
    memoryHistory = memoryHistory.filter((h) => h.userId.toString() !== userId.toString());
    return true;
  },

  // --- STATS FOR ADMIN ---
  async getAdminStats() {
    let moviesCount, seriesCount, usersCount, historyCount;

    if (getIsMongoConnected()) {
      moviesCount = await Movie.countDocuments({ type: 'movie' });
      seriesCount = await Movie.countDocuments({ type: 'series' });
      usersCount = await User.countDocuments();
      historyCount = await WatchHistory.countDocuments();
    } else {
      moviesCount = memoryMovies.filter((m) => m.type === 'movie').length;
      seriesCount = memoryMovies.filter((m) => m.type === 'series').length;
      usersCount = memoryUsers.length;
      historyCount = memoryHistory.length;
    }

    return {
      totalMovies: moviesCount,
      totalSeries: seriesCount,
      totalTitles: moviesCount + seriesCount,
      totalUsers: usersCount,
      totalStreams: historyCount + 1284,
      totalHoursWatched: Math.round(historyCount * 1.8 + 4320),
    };
  },
};
