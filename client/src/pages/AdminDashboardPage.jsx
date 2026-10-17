import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Film,
  Tv,
  Users,
  Eye,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Search,
  Check,
  X,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/api.js';

export const AdminDashboardPage = ({ onNavigate, onSelectMovie }) => {
  const { user, isAdmin, openAuthModal } = useAuth();

  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' | 'users'
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Movie Modal (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    originalTitle: '',
    overview: '',
    tagline: '',
    posterPath: '',
    backdropPath: '',
    trailerUrl: '',
    videoUrl: '',
    releaseYear: 2024,
    runtime: 120,
    rating: 8.0,
    genres: 'Action, Drama',
    language: 'Hindi',
    industry: 'Bollywood',
    type: 'movie',
    maturityRating: 'U/A 16+',
    director: '',
    isFeatured: false,
    isTrending: false,
  });

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies'),
        api.get('/admin/users'),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (moviesRes.data) setMovies(moviesRes.data);
      if (usersRes.data) setUsersList(usersRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // If not admin, show warning
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080808] pt-32 pb-20 px-4 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white font-heading">
          Administrator Access Required
        </h2>
        <p className="text-xs text-neutral-400">
          This portal contains sensitive movie catalog management, analytics, and user governance tools.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Sign in as Admin
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    setEditingMovieId(null);
    setFormData({
      title: '',
      originalTitle: '',
      overview: '',
      tagline: '',
      posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
      backdropPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      releaseYear: 2024,
      runtime: 135,
      rating: 8.5,
      genres: 'Action, Thriller',
      language: 'Hindi',
      industry: 'Bollywood',
      type: 'movie',
      maturityRating: 'U/A 16+',
      director: '',
      isFeatured: false,
      isTrending: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (movie) => {
    setEditingMovieId(movie._id);
    setFormData({
      title: movie.title || '',
      originalTitle: movie.originalTitle || '',
      overview: movie.overview || '',
      tagline: movie.tagline || '',
      posterPath: movie.posterPath || '',
      backdropPath: movie.backdropPath || '',
      trailerUrl: movie.trailerUrl || '',
      videoUrl: movie.videoUrl || '',
      releaseYear: movie.releaseYear || 2024,
      runtime: movie.runtime || 120,
      rating: movie.rating || 8.0,
      genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || '',
      language: movie.language || 'Hindi',
      industry: movie.industry || 'Bollywood',
      type: movie.type || 'movie',
      maturityRating: movie.maturityRating || 'U/A 16+',
      director: movie.director || '',
      isFeatured: !!movie.isFeatured,
      isTrending: !!movie.isTrending,
    });
    setIsModalOpen(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        genres: formData.genres.split(',').map((g) => g.trim()),
        releaseYear: Number(formData.releaseYear),
        runtime: Number(formData.runtime),
        rating: Number(formData.rating),
      };

      if (editingMovieId) {
        await api.put(`/admin/movies/${editingMovieId}`, payload);
      } else {
        await api.post('/admin/movies', payload);
      }

      setIsModalOpen(false);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Error saving movie');
    }
  };

  const handleDeleteMovie = async (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}" from the catalog?`)) {
      try {
        await api.delete(`/admin/movies/${id}`);
        loadAdminData();
      } catch (err) {
        alert(err.message || 'Error deleting movie');
      }
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      await api.patch(`/admin/movies/${id}/feature`);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Error toggling featured status');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (confirm(`Delete account for user: ${name}?`)) {
      try {
        await api.delete(`/admin/users/${id}`);
        loadAdminData();
      } catch (err) {
        alert(err.message || 'Error deleting user');
      }
    }
  };

  const filteredMovies = movies.filter((m) => {
    if (!searchQuery) return true;
    return (
      m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.language?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
              FlexyFilm Admin Console
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            Catalog governance, streaming metrics, and user management.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e28] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#E50914]/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Movie / Series</span>
        </button>
      </div>

      {/* KPI Statistics Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase">Feature Films</span>
              <Film className="w-4 h-4 text-[#E50914]" />
            </div>
            <p className="text-2xl font-black text-white font-heading">{stats.totalMovies}</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase">Web Series</span>
              <Tv className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white font-heading">{stats.totalSeries}</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase">Registered Users</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white font-heading">{stats.totalUsers}</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase">Streams Logged</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white font-heading">{stats.totalStreams}</p>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('movies')}
          className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'movies'
              ? 'border-[#E50914] text-white'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Manage Movies & Series ({movies.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'border-[#E50914] text-white'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Users ({usersList.length})</span>
        </button>
      </div>

      {/* Tab: Movies */}
      {activeTab === 'movies' && (
        <div className="space-y-4">
          {/* Quick Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by title, language or industry..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Table Container */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-3">Industry</th>
                    <th className="py-3 px-3">Language</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3">Year</th>
                    <th className="py-3 px-3 text-center">Hero Banner</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMovies.map((movie) => (
                    <tr key={movie._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={movie.posterPath}
                          alt={movie.title}
                          className="w-8 h-11 object-cover rounded shadow"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-[200px]">
                            {movie.title}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate max-w-[200px]">
                            {movie.genres?.join(', ')}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                          {movie.industry}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-400">{movie.language}</td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-current" />
                          {movie.rating}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-400">{movie.releaseYear}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleFeature(movie._id)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            movie.isFeatured
                              ? 'bg-[#E50914] text-white shadow'
                              : 'bg-neutral-800 text-neutral-500 hover:text-white'
                          }`}
                        >
                          {movie.isFeatured ? '★ Featured' : 'Normal'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => onSelectMovie(movie._id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
                          title="View Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(movie)}
                          className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          title="Edit Metadata"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie._id, movie.title)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          title="Delete Title"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Preferred Languages</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-white">{u.name}</span>
                  </td>
                  <td className="py-3 px-3 text-neutral-400">{u.email}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-400">
                    {u.preferredLanguages?.join(', ') || 'Hindi, English'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-modal border border-white/15 p-6 shadow-2xl z-10 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h2 className="text-xl font-bold text-white font-heading">
                {editingMovieId ? 'Edit Title Metadata' : 'Add New Movie / Series'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Original Title</label>
                  <input
                    type="text"
                    value={formData.originalTitle}
                    onChange={(e) => setFormData({ ...formData, originalTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Ready or Not, Here He Comes!"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Overview / Synopsis *</label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Poster Image URL *</label>
                  <input
                    type="text"
                    value={formData.posterPath}
                    onChange={(e) => setFormData({ ...formData, posterPath: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Backdrop Image URL</label>
                  <input
                    type="text"
                    value={formData.backdropPath}
                    onChange={(e) => setFormData({ ...formData, backdropPath: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">YouTube Trailer Embed URL</label>
                  <input
                    type="text"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Video Stream URL</label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://.../video.mp4"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-2.5 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="Bollywood">Bollywood</option>
                    <option value="Hollywood">Hollywood</option>
                    <option value="Tollywood">Tollywood</option>
                    <option value="Ollywood">Ollywood</option>
                    <option value="Sandalwood">Sandalwood</option>
                    <option value="Kollywood">Kollywood</option>
                    <option value="Mollywood">Mollywood</option>
                    <option value="Web Series">Web Series</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Language</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-2.5 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-2.5 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                    className="w-full px-2.5 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Genres (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.genres}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    placeholder="Action, Sci-Fi, Drama"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Director</label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    placeholder="e.g. S.S. Rajamouli"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#E50914] rounded"
                  />
                  <span>Showcase on Hero Banner</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4 accent-[#E50914] rounded"
                  />
                  <span>Mark as Trending Now</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e28] text-white font-bold transition-colors cursor-pointer"
                >
                  {editingMovieId ? 'Update Metadata' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
