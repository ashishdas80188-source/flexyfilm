import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { WatchlistProvider } from './context/WatchlistContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { VideoPlayerModal } from './components/VideoPlayerModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { LoadingScreen } from './components/LoadingScreen.jsx';

// Pages
import { HomePage } from './pages/HomePage.jsx';
import { MoviesPage } from './pages/MoviesPage.jsx';
import { SeriesPage } from './pages/SeriesPage.jsx';
import { LanguagesPage } from './pages/LanguagesPage.jsx';
import { MovieDetailsPage } from './pages/MovieDetailsPage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { MyListPage } from './pages/MyListPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

function AppContent() {
  const { loading: authLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [appReady, setAppReady] = useState(false);

  // Sync state with browser location
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path.startsWith('/movie/')) {
        setSelectedMovieId(path.replace('/movie/', ''));
      } else {
        setSelectedMovieId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    // Small delay for cinematic first impression
    const timer = setTimeout(() => setAppReady(true), 600);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(timer);
    };
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K or "/" opens Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigateTo('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (!path.startsWith('/movie/')) {
      setSelectedMovieId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMovie = (id) => {
    setSelectedMovieId(id);
    navigateTo(`/movie/${id}`);
  };

  const handleBackFromDetails = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('/');
    }
  };

  if (authLoading || !appReady) {
    return <LoadingScreen message="Initializing Cinema Engine..." />;
  }

  // Render correct page view
  const renderCurrentPage = () => {
    if (currentPath.startsWith('/movie/') || selectedMovieId) {
      const id = selectedMovieId || currentPath.replace('/movie/', '');
      return (
        <MovieDetailsPage
          movieId={id}
          onBack={handleBackFromDetails}
          onSelectMovie={handleSelectMovie}
        />
      );
    }

    if (currentPath === '/') {
      return (
        <HomePage
          onSelectMovie={handleSelectMovie}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/movies' || currentPath.startsWith('/movies?')) {
      const searchParams = new URLSearchParams(window.location.search);
      const genre = searchParams.get('genre') || '';
      return (
        <MoviesPage
          onSelectMovie={handleSelectMovie}
          initialGenre={genre}
        />
      );
    }

    if (currentPath === '/series') {
      return (
        <SeriesPage
          onSelectMovie={handleSelectMovie}
        />
      );
    }

    if (currentPath.startsWith('/languages')) {
      const parts = currentPath.split('/');
      const industryParam = parts.length > 2 ? parts[2] : null;
      return (
        <LanguagesPage
          onSelectMovie={handleSelectMovie}
          activeIndustryParam={industryParam}
        />
      );
    }

    if (currentPath === '/search') {
      return (
        <SearchPage
          onSelectMovie={handleSelectMovie}
          initialQuery={initialSearchQuery}
        />
      );
    }

    if (currentPath === '/my-list') {
      return (
        <MyListPage
          onSelectMovie={handleSelectMovie}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/profile') {
      return (
        <ProfilePage
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/admin') {
      return (
        <AdminDashboardPage
          onNavigate={navigateTo}
          onSelectMovie={handleSelectMovie}
        />
      );
    }

    return <NotFoundPage onNavigate={navigateTo} />;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#E5E5E5] flex flex-col selection:bg-[#E50914] selection:text-white">
      {/* Sticky Glass Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onSearchClick={() => navigateTo('/search')}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Interactive Modals */}
      <VideoPlayerModal />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </WatchlistProvider>
    </AuthProvider>
  );
}
