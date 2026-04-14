import React from 'react';
import { LogOut, Cpu, Sun, Moon, LayoutGrid, Lightbulb, User, Home } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentView?: 'projects' | 'innovations' | 'home';
  onViewChange?: (view: 'projects' | 'innovations' | 'home') => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onLoginClick, 
  onSignupClick, 
  isAuthenticated, 
  onLogout,
  theme,
  onToggleTheme,
  currentView = 'home',
  onViewChange,
  onHomeClick
}) => {
  const { styles } = useTheme();

  // The Navbar is "Red" only when viewing the Research Feed or Innovation Submission areas
  const isRedMode = isAuthenticated && (currentView === 'projects' || currentView === 'innovations');

  const navBgClass = isRedMode 
    ? 'bg-brand-maroon border-brand-maroonBright/20 shadow-xl' 
    : `${styles.navbar} border-b`;
  
  const textColorClass = isRedMode ? 'text-white' : styles.colors.text;
  const mutedTextColorClass = isRedMode ? 'text-white/70' : styles.colors.textMuted;
  const logoBgClass = isRedMode ? 'bg-white' : (theme === 'light' ? 'bg-brand-maroon' : 'bg-brand-maroonBright');
  const logoIconClass = isRedMode ? 'text-brand-maroon' : 'text-white';

  return (
    <nav className={`sticky top-0 z-[100] ${navBgClass} backdrop-blur-xl transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={onHomeClick}>
              <div className={`w-10 h-10 ${logoBgClass} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300`}>
                <Cpu className={`h-5 w-5 ${logoIconClass}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold ${textColorClass} tracking-tight leading-none font-lexend transition-colors`}>
                  CAMPUS<span className={isRedMode ? 'text-white/80' : (theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright')}>COLLAB</span>
                </span>
                <span className={`text-[9px] font-bold ${mutedTextColorClass} uppercase tracking-[0.2em] mt-1 transition-colors`}>
                  Research Terminal
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-10">
              {/* Home Option is always visible */}
              <button 
                onClick={onHomeClick} 
                className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  currentView === 'home' || !isAuthenticated
                    ? (isRedMode ? 'text-white' : 'text-brand-maroon dark:text-brand-maroonBright')
                    : (isRedMode ? 'text-white/50 hover:text-white' : `${styles.colors.textMuted} hover:text-brand-maroon`)
                }`}
              >
                <Home size={16} />
                <span>Home</span>
              </button>

              {!isAuthenticated ? (
                <>
                  <a href="#" className={`text-xs font-bold uppercase tracking-widest ${styles.colors.textMuted} hover:text-brand-maroon transition-colors`}>Research</a>
                  <a href="#" className={`text-xs font-bold uppercase tracking-widest ${styles.colors.textMuted} hover:text-brand-maroon transition-colors`}>Collaborate</a>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => onViewChange?.('projects')}
                    className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest transition-all ${
                      currentView === 'projects' 
                        ? (isRedMode ? 'text-white' : 'text-brand-maroon') 
                        : (isRedMode ? 'text-white/50 hover:text-white' : `${styles.colors.textMuted} hover:text-brand-maroon`)
                    }`}
                  >
                    <LayoutGrid size={16} />
                    <span>Project Feed</span>
                  </button>
                  <button 
                    onClick={() => onViewChange?.('innovations')}
                    className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest transition-all ${
                      currentView === 'innovations' 
                        ? (isRedMode ? 'text-white' : 'text-brand-maroon') 
                        : (isRedMode ? 'text-white/50 hover:text-white' : `${styles.colors.textMuted} hover:text-brand-maroon`)
                    }`}
                  >
                    <Lightbulb size={16} />
                    <span>Post Innovation</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl transition-all ${
                isRedMode 
                  ? 'text-white bg-white/10 hover:bg-white/20' 
                  : (theme === 'light' ? 'text-brand-charcoal/40 bg-brand-maroon/5' : 'text-gray-500 bg-white/5')
              }`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button onClick={onLoginClick} className={`text-xs font-bold uppercase tracking-widest ${styles.colors.text} hover:text-brand-maroon transition-colors px-4 py-2`}>Sign In</button>
                <button onClick={onSignupClick} className={`${styles.buttonPrimary} px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95`}>Register</button>
              </div>
            ) : (
              <div className={`flex items-center space-x-5 pl-5 border-l ${isRedMode ? 'border-white/20' : styles.colors.border}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${
                  isRedMode ? 'bg-white/10 border border-white/20 text-white' : 'bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon dark:text-brand-maroonBright'
                }`}>
                  <User size={20} />
                </div>
                <button 
                  onClick={onLogout} 
                  className={`p-2 transition-colors ${isRedMode ? 'text-white/70 hover:text-white' : 'text-brand-charcoal/40 hover:text-brand-maroon dark:text-white/40'}`}
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;