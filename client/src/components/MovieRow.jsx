import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard.jsx';

export const MovieRow = ({
  title,
  movies = [],
  onSelectMovie,
  subtitle = null,
  isHistory = false, // for continue watching items which contain { movieData, progressSeconds, totalSeconds }
  icon: Icon = null,
}) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative py-4 space-y-2.5 group/row select-none">
      {/* Row Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-[#E50914]" />}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight font-heading">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-400 mt-0.5 font-normal">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            aria-label={`Scroll ${title} left`}
            className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex items-center justify-center text-white/70 hover:text-white transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
          >
            <div className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:scale-110 transition-transform">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-2 scroll-smooth"
        >
          {movies.map((item) => {
            const movie = isHistory ? item.movieData : item;
            const progress = isHistory
              ? { progressSeconds: item.progressSeconds, totalSeconds: item.totalSeconds }
              : null;
            const key = item._id || item.id || movie?.title;

            return (
              <MovieCard
                key={key}
                movie={{ ...movie, _id: isHistory ? item.movieId : (item._id || item.id) }}
                progress={progress}
                onSelect={onSelectMovie}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            aria-label={`Scroll ${title} right`}
            className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-gradient-to-l from-black/90 via-black/50 to-transparent flex items-center justify-center text-white/70 hover:text-white transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
          >
            <div className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:scale-110 transition-transform">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
