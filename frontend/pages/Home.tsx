import React from 'react';
import StickySidebar from '../components/StickySidebar';
import TrendingInternships from '../components/TrendingInternships';
import { motion } from 'framer-motion';
import { Search, Globe, Microscope, Rocket, Database, ChevronRight, Sparkles } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface HomeProps {
  onNavigate: (page: string, params?: { projectId?: number }) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { theme, styles } = useTheme();

  return (
    <section className={`flex flex-col lg:flex-row ${styles.colors.bg} transition-colors duration-700 items-start w-full relative`}>
      {/* Sidebar is sticky and will remain fixed within this section's bounds */}
      <StickySidebar />

      {/* Right Content Area */}
      <div className="w-full lg:w-[60%] flex flex-col pt-16 lg:pt-24 px-8 lg:px-20 relative z-10">
        <div className="max-w-4xl w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <div className="flex items-center space-x-3 mb-4">
               <span className={`text-[11px] font-black uppercase tracking-[0.4em] block ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>Unified Terminal</span>
               <div className={`h-px flex-grow ${theme === 'light' ? 'bg-brand-maroon/10' : 'bg-brand-maroonBright/20'}`}></div>
            </div>
            <h2 className={`text-5xl lg:text-7xl font-black ${styles.colors.text} tracking-tighter leading-[1] uppercase font-lexend transition-colors`}>
              RESEARCH<br />
              <span className={`${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright drop-shadow-[0_0_10px_rgba(123,32,31,0.2)]'}`}>OPTIMIZED.</span>
            </h2>
          </motion.div>

          {/* Search Bar */}
          <div className={`${styles.pillSearch} rounded-full flex items-center p-2 mb-20 group focus-within:ring-4 focus-within:ring-brand-maroon/5 transition-all bg-white dark:bg-brand-darkSurface border-2 border-brand-maroon/10`}>
            <Search className={`ml-6 ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'} opacity-40 group-focus-within:opacity-100 transition-opacity`} size={24} />
            <input 
              type="text" 
              placeholder="Query Research Matrix (e.g. LLM, Robotics, IoT)..."
              className={`flex-grow bg-transparent px-6 py-4 text-sm font-bold outline-none ${styles.colors.text} placeholder:${theme === 'light' ? 'text-brand-charcoal/20' : 'text-white/20'}`}
            />
            <button className={`${styles.buttonPrimary} px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-3`}>
              <span>Initialize Node</span>
              <Globe size={16} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: Microscope, label: "Active Nodes", value: "158" },
              { icon: Rocket, label: "Live Missions", value: "42" },
              { icon: Database, label: "Grant Pools", value: "12" },
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, rotate: 1 }}
                className={`${styles.statsCard} p-10 rounded-[40px] flex flex-col items-center text-center border-2 transition-all group cursor-default relative overflow-hidden bg-white dark:bg-brand-darkElevated shadow-card`}
              >
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-brand-maroon/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <div className={`w-16 h-16 bg-brand-cream dark:bg-white/5 rounded-2xl flex items-center justify-center ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'} mb-6 group-hover:bg-brand-maroon dark:group-hover:bg-brand-maroonBright group-hover:text-white transition-all shadow-sm border border-brand-maroon/5 dark:border-white/5`}>
                  <stat.icon size={32} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className={`text-4xl font-black ${theme === 'light' ? 'text-brand-maroon' : 'text-white'} mb-2 font-lexend tracking-tighter drop-shadow-sm transition-colors`}>{stat.value}</div>
                <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.colors.textMuted}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <TrendingInternships 
            onViewMore={() => onNavigate('projects')} 
            onProjectClick={(id) => onNavigate('projects', { projectId: id })}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`bg-brand-charcoal dark:bg-brand-darkSurface rounded-t-[50px] p-12 lg:p-16 text-white relative overflow-hidden w-full mt-24 group transition-all duration-700 border-t border-white/5 shadow-2xl`}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-maroon/10 dark:bg-brand-maroonBright/10 rounded-full blur-[100px] transition-all group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="text-brand-mint" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Exclusive Faculty Funding</span>
            </div>
            <h3 className={`text-4xl lg:text-6xl font-black tracking-tighter mb-6 font-lexend uppercase ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>FYP Innovation Grant</h3>
            <p className="text-xl text-white/60 dark:text-gray-400 mb-10 max-w-2xl font-sans leading-relaxed">
              Unlock your potential with up to <span className="text-brand-mint font-black">200,000 PKR</span> funding. Build engineering solutions that matter for the national matrix. 
            </p>
            <button 
              onClick={() => onNavigate('innovation')}
              className={`flex items-center space-x-4 bg-white/5 dark:bg-white/10 border border-white/10 px-10 py-5 rounded-[24px] text-sm font-bold uppercase tracking-widest transition-all hover:bg-brand-maroon dark:hover:bg-brand-maroonSoft`}
            >
              <span>View Grant Requirements</span>
              <ChevronRight size={20} className="text-brand-mint" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;