import React, { useState } from 'react';
import {
  X,
  Play,
  Mail,
  Lock,
  User,
  ShieldAlert,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const AuthModal = () => {
  const {
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    register,
    loginAsDemo,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [languages, setLanguages] = useState(['Hindi', 'English']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const availableLanguages = [
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

  const toggleLanguage = (lang) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter((l) => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register(name, email, password, languages);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await loginAsDemo(role);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl glass-modal border border-white/15 p-6 sm:p-8 shadow-2xl z-10">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#E50914] to-[#8B0000] shadow-lg shadow-[#E50914]/40 mb-3">
            <Play className="w-6 h-6 text-white fill-current ml-0.5" />
          </div>
          <h2 className="text-2xl font-black text-white font-heading tracking-tight">
            FLEXY<span className="text-[#E50914]">FILM</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isLogin
              ? 'Welcome back! Sign in to continue streaming.'
              : 'Create your account to unlock unlimited cinema.'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-xl bg-neutral-900/90 p-1 mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isLogin
                ? 'bg-[#E50914] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isLogin
                ? 'bg-[#E50914] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
            <span className="font-bold">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-900/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Preferred Cinema Languages
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {availableLanguages.map((lang) => {
                  const selected = languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                        selected
                          ? 'bg-[#E50914]/20 border-[#E50914] text-white font-medium'
                          : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#E50914] text-white font-bold text-sm hover:bg-[#ff1e28] shadow-lg shadow-[#E50914]/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In to FlexyFilm' : 'Create Free Account'}
          </button>
        </form>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Test Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
              className="py-2 px-3 rounded-xl bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
              <span>User Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
