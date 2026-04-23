import React, { useState, useMemo, useEffect } from 'react';
import ProfileMenu from '../components/ProfileMenu';
import ProjectCard from '../components/ProjectCard';
import { Search, Database, Loader } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../services/projectHooks';
import { useMyApplications } from '../services/applicationHooks';
import ApplicationList from '../components/ApplicationList';

interface ProjectsProps {
  role: string;
  focusedProjectId?: number;
  onNavigate: (page: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({ role, focusedProjectId, onNavigate }) => {
  const { styles } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('open');
  const [category, setCategory] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('feed');
  const [user, setUser] = useState<any>({});
  const [page, setPage] = useState(1);

  // Fetch projects from backend
  const { projects, loading, error, pagination } = useProjects({
    category: category || undefined,
    status: filter !== 'all' ? filter : undefined,
    search: search || undefined,
    page,
    limit: 10
  });

  // Fetch applications for tracking status
  const { 
    applications: myApps, 
    loading: appsLoading, 
    refetch: refetchApps,
    deleteApplication 
  } = useMyApplications();

  // Map project ID to application status
  const applicationStatusMap = useMemo(() => {
    const map: Record<string, string> = {};
    myApps.forEach(app => {
      if (app.project && app.project._id) {
        map[app.project._id] = app.status;
      }
    });
    return map;
  }, [myApps]);

  // Dynamic User State handling
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    };

    loadUser();

    const handleUserUpdate = (e: CustomEvent) => {
      setUser(e.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    return () => window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
  }, []);

  const filteredAndPrioritized = useMemo(() => {
    if (!projects) return [];

    return [...projects].sort((a, b) => {
      // Prioritize selected interests
      const aMatch = selectedInterests.includes(a.category);
      const bMatch = selectedInterests.includes(b.category);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;

      return 0;
    });
  }, [projects, selectedInterests]);

  return (
    <div className={`min-h-screen pt-12 pb-32 transition-colors duration-700 ${styles.colors.bg}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* MODULAR PROFILE MENU */}
          {Object.keys(user).length > 0 && (
            <ProfileMenu
              user={user}
              selectedInterests={selectedInterests}
              onInterestsChange={setSelectedInterests}
              activeTab={activeTab}
              onTabChange={(tab) => {
                if (tab === 'edit') onNavigate('profile');
                else setActiveTab(tab);
              }}
            />
          )}

          <div className="flex-grow">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 block ${styles.colors.primary === 'brand-maroon' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
                  Research Node Feed
                </span>
                <h2 className={`text-4xl font-black tracking-tighter uppercase font-lexend transition-colors ${styles.colors.text}`}>
                  Repository <span className={styles.colors.primary === 'brand-maroon' ? 'text-brand-maroon' : 'text-brand-maroonBright'}>Matrix.</span>
                </h2>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative group">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-opacity group-focus-within:opacity-100 ${styles.colors.textMuted} opacity-30`} size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Query matrix..."
                    className={`pl-11 pr-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest outline-none border-2 transition-all w-full md:w-72 shadow-soft ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                  />
                </div>
                <div className={`flex p-1 rounded-2xl border-2 shadow-soft ${styles.colors.bg} ${styles.colors.border}`}>
                  {['all', 'open'].map(f => (
                    <button
                      key={f}
                      onClick={() => {
                        setFilter(f);
                        setPage(1);
                      }}
                      className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f
                          ? 'bg-brand-maroon dark:bg-brand-maroonSoft text-white shadow-lg shadow-brand-maroon/20'
                          : `${styles.colors.textMuted} hover:text-brand-maroon dark:hover:text-white`
                        }`}
                    >
                      {f === 'all' ? 'All' : 'Open'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-32 rounded-[40px] border-2 border-dashed ${styles.colors.border} transition-colors`}
              >
                <Loader size={48} className={`mx-auto mb-6 opacity-20 animate-spin ${styles.colors.text}`} />
                <p className={`text-xs font-black uppercase tracking-[0.3em] opacity-40 ${styles.colors.text}`}>
                  Fetching research nodes...
                </p>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-8 rounded-[40px] border-2 bg-red-50/50 dark:bg-red-500/10 border-red-200/50 dark:border-red-500/30`}
              >
                <p className={`text-sm font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400`}>
                  Error: {error}
                </p>
              </motion.div>
            )}

            {/* Applications List View */}
            {activeTab === 'applications' && (
              <ApplicationList 
                applications={myApps} 
                loading={appsLoading} 
                onDelete={deleteApplication} 
              />
            )}

            {/* Projects Grid View */}
            {activeTab === 'feed' && !loading && !error && (
              <>
                <motion.div layout className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {filteredAndPrioritized.length > 0 ? (
                      filteredAndPrioritized.map(project => (
                        <ProjectCard
                          key={project._id}
                          project={project}
                          isPriority={selectedInterests.includes(project.category)}
                          role={role}
                          applicationStatus={applicationStatusMap[project._id] as any}
                          onApplySuccess={refetchApps}
                        />
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-center py-32 rounded-[40px] border-2 border-dashed ${styles.colors.border} transition-colors`}
                      >
                        <Database size={48} className={`mx-auto mb-6 opacity-20 ${styles.colors.text}`} />
                        <p className={`text-xs font-black uppercase tracking-[0.3em] opacity-40 ${styles.colors.text}`}>
                          No research nodes found
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${page === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : 'bg-brand-maroon text-white hover:bg-brand-maroonSoft'
                        }`}
                    >
                      Previous
                    </button>
                    <span className={`text-sm font-black uppercase tracking-widest ${styles.colors.text}`}>
                      Page {page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${page === pagination.pages
                          ? 'opacity-50 cursor-not-allowed'
                          : 'bg-brand-maroon text-white hover:bg-brand-maroonSoft'
                        }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;