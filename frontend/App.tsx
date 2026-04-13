import React, { useState, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatAssistant from './components/AIChatAssistant';
import { useTheme } from './theme/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

// Modular Page Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import Innovation from './pages/Innovation';
import Profile from './pages/Profile';

interface PendingNavigation {
  page: string;
  projectId?: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'professor' | null>(null);
  const [pendingNav, setPendingNav] = useState<PendingNavigation | null>(null);
  const [focusedProjectId, setFocusedProjectId] = useState<number | undefined>(undefined);
  
  const { theme, toggleTheme, styles } = useTheme();

  const handleAuthSuccess = (email: string) => {
    const role = (email.includes('prof') || email.includes('fac')) ? 'professor' : 'student';
    setUserRole(role);
    setIsAuthenticated(true);
    
    // Check if there was a destination the user was trying to reach
    if (pendingNav) {
      if (pendingNav.projectId) {
        setFocusedProjectId(pendingNav.projectId);
      }
      setCurrentPage(pendingNav.page);
      setPendingNav(null);
    } else {
      setCurrentPage('projects');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentPage('home');
    setFocusedProjectId(undefined);
  };

  const navigateTo = (page: string, params?: { projectId?: number }) => {
    // If trying to access protected content without auth
    if ((page === 'projects' || page === 'innovation' || page === 'profile') && !isAuthenticated) {
      setPendingNav({ page, projectId: params?.projectId });
      setCurrentPage('login');
      return;
    }

    if (params?.projectId) {
      setFocusedProjectId(params.projectId);
    } else {
      setFocusedProjectId(undefined);
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': 
        return <Home key="home" onNavigate={navigateTo} />;
      case 'login': 
        return <Login key="login" onSuccess={handleAuthSuccess} onNavigate={navigateTo} />;
      case 'signup': 
        return <Signup key="signup" onSuccess={handleAuthSuccess} onNavigate={navigateTo} />;
      case 'projects': 
        return <Projects key="projects" role={userRole || 'student'} focusedProjectId={focusedProjectId} onNavigate={navigateTo} />;
      case 'innovation': 
        return <Innovation key="innovation" />;
      case 'profile':
        return <Profile key="profile" onNavigate={navigateTo} />;
      default: 
        return <Home key="home-default" onNavigate={navigateTo} />;
    }
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'signup';

  // Determine current view for Navbar styling
  const getCurrentView = () => {
    if (currentPage === 'home') return 'home';
    if (currentPage === 'innovation') return 'innovations';
    if (currentPage === 'projects' || currentPage === 'profile') return 'projects';
    return 'home';
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ease-in-out ${styles.colors.bg}`}>
      {!isAuthPage && (
        <Navbar 
          onLoginClick={() => navigateTo('login')} 
          onSignupClick={() => navigateTo('signup')} 
          isAuthenticated={isAuthenticated} 
          onLogout={logout}
          theme={theme}
          onToggleTheme={toggleTheme}
          currentView={getCurrentView()}
          onViewChange={(v) => navigateTo(v === 'innovations' ? 'innovation' : v === 'projects' ? 'projects' : 'home')}
          onHomeClick={() => navigateTo('home')}
        />
      )}
      
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-grow flex flex-col"
          >
            <Suspense fallback={
              <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
                <div className={`w-20 h-20 border-4 border-brand-maroon/10 border-t-brand-maroon rounded-full animate-spin`}></div>
                <div className="text-center">
                  <p className={`font-lexend font-black tracking-widest uppercase text-sm ${styles.colors.text} mb-2`}>Initializing Neural Node</p>
                  <div className="w-48 h-1.5 bg-brand-maroon/10 rounded-full overflow-hidden mx-auto">
                    <div className="w-1/2 h-full bg-brand-maroon animate-[ticker_2s_linear_infinite]"></div>
                  </div>
                </div>
              </div>
            }>
              {renderPage()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAuthPage && <Footer />}
      <AIChatAssistant />
    </div>
  );
};

export default App;