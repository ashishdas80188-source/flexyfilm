import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Search,
  Bookmark,
  User,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Play,
  Globe,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWatchlist } from '../context/WatchlistContext.jsx';

export const Navbar = ({ currentPath, onNavigate, onSearchClick }) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { watchlist } = useWatchlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Series', path: '/series' },
    { label: 'Languages', path: '/languages' },
  ];

  const regionalIndustries = [
    { name: 'Bollywood (Hindi)', path: '/languages/bollywood' },
    { name: 'Hollywood (English)', path: '/languages/hollywood' },
    { name: 'Tollywood (Telugu)', path: '/languages/tollywood' },
    { name: 'Ollywood (Odia)', path: '/languages/ollywood' },
    { name: 'Sandalwood (Kannada)', path: '/languages/sandalwood' },
    { name: 'Kollywood (Tamil)', path: '/languages/kollywood' },
    { name: 'Mollywood (Malayalam)', path: '/languages/mollywood' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            {/* FlexyFilm Logo */}
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#E50914] to-[#8B0000] flex items-center justify-center shadow-lg shadow-[#E50914]/40 group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF334B] rounded-full animate-ping" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black tracking-tight text-white font-heading">
                  FLEXY<span className="text-[#E50914]">FILM</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 -mt-1 font-semibold hidden sm:block">
                  Your Cinema. Your Flex.
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    currentPath === link.path
                      ? 'text-white bg-white/10 font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              {/* Regional Languages Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Globe className="w-4 h-4 text-[#E50914]" />
                  <span>Regional</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-xl glass-modal p-2 shadow-2xl z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[11px] font-bold text-neutral-400 px-3 py-1.5 uppercase tracking-wider">
                      Regional Cinema
                    </div>
                    {regionalIndustries.map((ind) => (
                      <button
                        key={ind.path}
                        onClick={() => {
                          onNavigate(ind.path);
                          setLangDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-neutral-200 hover:text-white hover:bg-[#E50914]/20 hover:border-l-2 hover:border-[#E50914] rounded-lg transition-all"
                      >
                        {ind.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* My List */}
              <button
                onClick={() => onNavigate('/my-list')}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  currentPath === '/my-list'
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bookmark className="w-4 h-4 text-[#E50914]" />
                <span>My List</span>
                {watchlist.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-[#E50914] text-white rounded-full">
                    {watchlist.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={onSearchClick || (() => onNavigate('/search'))}
              aria-label="Search movies"
              className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 group"
            >
              <Search className="w-5 h-5 text-neutral-300 group-hover:text-white" />
              <span className="hidden lg:inline text-xs text-neutral-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                ⌘K
              </span>
            </button>

            {/* Admin Dashboard Pill if admin */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('/admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </button>
            )}

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full glass-panel hover:border-white/20 transition-colors"
                >
                  <span className="text-xs font-medium text-neutral-200 hidden sm:inline max-w-[100px] truncate">
                    {user?.name || 'User'}
                  </span>
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E50914]/50"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 pr-1" />
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl glass-modal p-2 shadow-2xl z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E50914]/20 text-[#FF334B]">
                        {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('/profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-neutral-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('/my-list');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-neutral-400" />
                      <span>My Watchlist ({watchlist.length})</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          onNavigate('/admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="border-t border-white/10 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-[#E50914] text-white hover:bg-[#ff1e28] shadow-lg shadow-[#E50914]/30 hover:shadow-[#E50914]/50 transition-all cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white md:hidden rounded-lg hover:bg-white/10"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-modal border-t border-white/10 px-4 pt-4 pb-6 mt-3 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
                  currentPath === link.path
                    ? 'bg-[#E50914] text-white font-semibold'
                    : 'text-neutral-200 hover:bg-white/10'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}

            <div className="pt-2 border-t border-white/10">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-4 mb-2">
                Regional Cinema
              </p>
              <div className="grid grid-cols-2 gap-1.5 px-2">
                {regionalIndustries.map((ind) => (
                  <button
                    key={ind.path}
                    onClick={() => {
                      onNavigate(ind.path);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 text-xs rounded-lg text-neutral-300 hover:text-white hover:bg-white/10"
                  >
                    {ind.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('/my-list');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-neutral-200 hover:bg-white/10 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#E50914]" />
                My List
              </span>
              <span className="px-2 py-0.5 text-xs bg-[#E50914] text-white rounded-full">
                {watchlist.length}
              </span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-amber-400 hover:bg-amber-500/10 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
