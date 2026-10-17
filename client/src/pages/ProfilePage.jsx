import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bookmark,
  Clock,
  Sparkles,
  Lock,
  Globe,
  Trash2,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import { api } from '../api/api.js';

export const ProfilePage = ({ onNavigate }) => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { watchlist } = useWatchlist();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [preferredLanguages, setPreferredLanguages] = useState(
    user?.preferredLanguages || ['Hindi', 'English']
  );

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Profile update status
  const [saveMsg, setSaveMsg] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Watch history count
  const [historyCount, setHistoryCount] = useState(0);

  const availableAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  ];

  const allLanguages = [
    'Hindi',
    'English',
    'Telugu',
    'Odia',
    'Kannada',
    'Tamil',
    'Malayalam',
    'Punjabi',
    'Bengali',
    'Marathi',
  ];

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || availableAvatars[0]);
      setPreferredLanguages(user.preferredLanguages || ['Hindi', 'English']);
    }

    api.get('/history')
      .then((res) => {
        if (res.data) setHistoryCount(res.data.length);
      })
      .catch(() => {});
  }, [user]);

  const toggleLanguage = (lang) => {
    if (preferredLanguages.includes(lang)) {
      if (preferredLanguages.length > 1) {
        setPreferredLanguages(preferredLanguages.filter((l) => l !== lang));
      }
    } else {
      setPreferredLanguages([...preferredLanguages, lang]);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveMsg('');
    try {
      await updateProfile({
        name,
        avatar,
        preferredLanguages,
      });
      setSaveMsg('Profile preferences updated successfully!');
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordMsg(''), 4000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear your watch history?')) {
      try {
        await api.delete('/history');
        setHistoryCount(0);
        alert('Watch history cleared');
      } catch (e) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-white/10">
        <div className="relative">
          <img
            src={avatar || availableAvatars[0]}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-2xl object-cover ring-2 ring-[#E50914] shadow-xl shadow-[#E50914]/30"
          />
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E50914] text-white">
            {user?.role === 'admin' ? 'ADMIN' : 'PRO'}
          </span>
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {user?.name}
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Active Member
            </span>
          </div>
          <p className="text-xs text-neutral-400">{user?.email}</p>
          <p className="text-xs text-neutral-500 pt-1">
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024'}
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Member Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-[#E50914]/20 flex items-center justify-center text-[#FF334B]">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-heading">{watchlist.length}</p>
            <p className="text-xs text-neutral-400">Titles in Watchlist</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-heading">{historyCount}</p>
            <p className="text-xs text-neutral-400">Watched Titles</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-heading">
              {preferredLanguages.length}
            </p>
            <p className="text-xs text-neutral-400">Language Feeds</p>
          </div>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: General Info & Avatar */}
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-2xl space-y-5 border border-white/10">
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <User className="w-5 h-5 text-[#E50914]" />
            <span>Profile Information</span>
          </h2>

          {saveMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveMsg}</span>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Choose Avatar
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {availableAvatars.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`relative rounded-xl overflow-hidden ring-2 transition-all flex-shrink-0 cursor-pointer ${
                    avatar === url ? 'ring-[#E50914] scale-105' : 'ring-transparent hover:ring-white/40'
                  }`}
                >
                  <img src={url} alt="avatar option" className="w-12 h-12 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Cinema Languages */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Preferred Cinema Languages
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allLanguages.map((lang) => {
                const active = preferredLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#E50914] text-white font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={saveLoading}
            className="w-full py-2.5 rounded-xl bg-[#E50914] text-white text-xs font-bold hover:bg-[#ff1e28] transition-colors cursor-pointer"
          >
            {saveLoading ? 'Saving...' : 'Save Profile Preferences'}
          </button>
        </form>

        {/* Right: Security & History Maintenance */}
        <div className="space-y-8">
          {/* Change Password */}
          <form onSubmit={handleChangePassword} className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4 border border-white/10">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#E50914]" />
              <span>Change Password</span>
            </h2>

            {passwordMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                {passwordMsg}
              </div>
            )}
            {passwordError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {passwordError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                New Password (minimum 6 characters)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </form>

          {/* Privacy & Watch History */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Watch History & Activity</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Clear your watch history and reset continue watching recommendation algorithms.
            </p>
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold border border-red-500/20 transition-colors cursor-pointer"
            >
              Clear All Watch History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
