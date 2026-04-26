import React, { useState, Suspense, useEffect, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatAssistant from './components/AIChatAssistant';
import { useTheme } from './theme/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

// Modular Page Imports (Dynamic Loading)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Projects = lazy(() => import('./pages/Projects'));
const Innovation = lazy(() => import('./pages/Innovation'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

interface PendingNavigation {
  page: string;
  projectId?: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'professor' | 'admin' | null>(null);
  const [pendingNav, setPendingNav] = useState<PendingNavigation | null>(null);
  const [focusedProjectId, setFocusedProjectId] = useState<number | undefined>(undefined);
  
  const { theme, toggleTheme, styles } = useTheme();

  // Restore session from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    } else {
      // If no token/user but page is protected, revert to home or login
      const protectedPages = ['projects', 'profile', 'innovation'];
      const savedPage = localStorage.getItem('currentPage');
      if (savedPage && protectedPages.includes(savedPage)) {
         setCurrentPage('home');
         localStorage.setItem('currentPage', 'home');
      }
    }
  }, []);

  const handleAuthSuccess = (email: string) => {
    // Read the actual role from localStorage (set by login response)
    let role: 'student' | 'professor' | 'admin' = 'student';
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        role = parsed.role || 'student';
      }
    } catch {}

    setUserRole(role);
    setIsAuthenticated(true);

    // Admin goes straight to admin dashboard
    if (role === 'admin') {
      setCurrentPage('admin');
      localStorage.setItem('currentPage', 'admin');
      return;
    }

    // Check if there was a destination the user was trying to reach
    if (pendingNav) {
      if (pendingNav.projectId) {
        setFocusedProjectId(pendingNav.projectId);
      }
      setCurrentPage(pendingNav.page);
      localStorage.setItem('currentPage', pendingNav.page);
      setPendingNav(null);
    } else {
      setCurrentPage('projects');
      localStorage.setItem('currentPage', 'projects');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentPage('home');
    localStorage.setItem('currentPage', 'home');
    setFocusedProjectId(undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const navigateTo = (page: string, params?: { projectId?: number }) => {
    // If trying to access protected content without auth
    if ((page === 'projects' || page === 'innovation' || page === 'profile') && !isAuthenticated) {
      setPendingNav({ page, projectId: params?.projectId });
      setCurrentPage('login');
      localStorage.setItem('currentPage', 'login');
      return;
    }

    if (params?.projectId) {
      setFocusedProjectId(params.projectId);
    } else {
      setFocusedProjectId(undefined);
    }

    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
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
      case 'admin':
        return <AdminDashboard key="admin" onLogout={logout} />;
      default: 
        return <Home key="home-default" onNavigate={navigateTo} />;
    }
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'signup' || currentPage === 'admin';

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