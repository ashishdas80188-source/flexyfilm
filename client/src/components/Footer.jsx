import { Film, Play, Heart, Shield, Globe, Mail } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-12 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E50914] to-[#8B0000] flex items-center justify-center shadow-lg shadow-[#E50914]/40">
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-heading">
                FLEXY<span className="text-[#E50914]">FILM</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your Cinema. Your Language. Your Flex. Stream the biggest blockbusters, regional masterpieces, and award-winning web series in pristine 4K HDR.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Shield className="w-4 h-4 text-[#E50914]" />
              <span>100% Authorized & Licensed Trailers</span>
            </div>
          </div>

          {/* Regional Cinema Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Regional Cinema
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/languages/bollywood')} className="hover:text-white transition-colors">
                  Bollywood (Hindi)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/languages/hollywood')} className="hover:text-white transition-colors">
                  Hollywood (English)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/languages/tollywood')} className="hover:text-white transition-colors">
                  Tollywood (Telugu)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/languages/ollywood')} className="hover:text-white transition-colors">
                  Ollywood (Odia)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/languages/sandalwood')} className="hover:text-white transition-colors">
                  Sandalwood (Kannada)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/languages/kollywood')} className="hover:text-white transition-colors">
                  Kollywood (Tamil) & Mollywood
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explore Genres
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/movies?genre=Action')} className="hover:text-white transition-colors">
                  Action Blockbusters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/movies?genre=Comedy')} className="hover:text-white transition-colors">
                  Comedy & Satire
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/movies?genre=Sci-Fi')} className="hover:text-white transition-colors">
                  Sci-Fi & Fantasy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/movies?genre=Thriller')} className="hover:text-white transition-colors">
                  Crime & Thrillers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/series')} className="hover:text-white transition-colors">
                  Original Web Series
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); alert("FlexyFilm is an ultra-premium MERN movie streaming architecture created for modern cinema enthusiasts."); }} className="hover:text-white transition-colors">
                  About FlexyFilm
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: User privacy, password encryption (bcrypt), and secured JWT tokens are strictly maintained."); }} className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: FlexyFilm complies with legitimate TMDB metadata terms and streams authorized video assets."); }} className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#help" onClick={(e) => { e.preventDefault(); alert("Support Contact: support@flexyfilm.com — 24/7 streaming assistance."); }} className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} FlexyFilm Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-[#E50914] fill-current" /> for cinematic lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
