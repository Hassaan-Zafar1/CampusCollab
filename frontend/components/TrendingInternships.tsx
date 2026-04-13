import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Layers, Cpu, Cloud, Sparkles, Code2, Layout, ArrowRight, Search, Database, Zap, Microscope } from 'lucide-react';

const CATEGORIES = [
  { id: 'ai', name: 'AI & Machine Learning', icon: BrainCircuit },
  { id: 'mern', name: 'MERN Stack', icon: Layers },
  { id: 'iot', name: 'IoT & Robotics', icon: Cpu },
  { id: 'cloud', name: 'Cloud Computing', icon: Cloud },
];
// MOCK DATA:

const PROJECTS_DATA: Record<string, any[]> = {
  ai: [
    { id: 1, title: "Neural Network Optimizer", subtitle: "Efficiency in mobile models", institution: "AI Lab 1", type: "Research", icon: BrainCircuit },
    { id: 2, title: "Urdu Voice Synthesis", subtitle: "NLP for local dialects", institution: "Linguistics Hub", type: "Internship", icon: Sparkles },
    { id: 3, title: "Vision Sorting Matrix", subtitle: "Industrial vision protocols", institution: "Automation Lab", type: "Project", icon: Microscope },
    { id: 4, title: "Autonomous Campus Bot", subtitle: "Lidar-based mapping", institution: "RoboHub", type: "Research", icon: Zap },
  ],
  mern: [
    { id: 5, title: "University LMS Matrix", subtitle: "Scalable student data", institution: "NED IT Dept", type: "Project", icon: Code2 },
    { id: 6, title: "Resource Scheduler", subtitle: "Lab booking automation", institution: "Faculty Unit", type: "Internship", icon: Layout },
    { id: 7, title: "Research Inventory", subtitle: "Asset tracking system", institution: "Logistics Node", type: "Project", icon: Database },
    { id: 8, title: "Collaborative Git Hub", subtitle: "University dev portal", institution: "Dev Node", type: "Research", icon: Code2 },
  ],
  iot: [
    { id: 9, title: "Smart Grid Monitor", subtitle: "Real-time energy nodes", institution: "Electrical Dept", type: "Research", icon: Cpu },
    { id: 10, title: "Remote Lab Access", subtitle: "Digital twin for equipment", institution: "Control Systems", type: "Project", icon: Database },
    { id: 11, title: "Precision Agri-Node", subtitle: "IOT sensor fusion", institution: "Agri-Tech", type: "Internship", icon: Cloud },
    { id: 12, title: "Mesh Network Router", subtitle: "LoRaWAN campus grid", institution: "Telecom Unit", type: "Research", icon: Zap },
  ],
  cloud: [
    { id: 13, title: "Edge Computing Hub", subtitle: "Low latency processing", institution: "Data Unit", type: "Research", icon: Cloud },
    { id: 14, title: "SaaS Multi-tenant", subtitle: "Secure academic isolation", institution: "Cloud Group", type: "Project", icon: Database },
    { id: 15, title: "Cloud ERP Sync", subtitle: "Distributed data management", institution: "SysOps", type: "Internship", icon: Layers },
    { id: 16, title: "VPC Research Lab", subtitle: "Virtualized sandbox env", institution: "CyberNode", type: "Research", icon: Cloud },
  ],
};

interface TrendingInternshipsProps {
  onViewMore: () => void;
  onProjectClick: (projectId: number) => void;
}

const TrendingInternships: React.FC<TrendingInternshipsProps> = ({ onViewMore, onProjectClick }) => {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [search, setSearch] = useState('');

  const currentProjects = useMemo(() => {
    const list = PROJECTS_DATA[activeCategory] || [];
    if (!search) return list;
    return list.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.subtitle.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeCategory, search]);

  return (
    <motion.div 
      initial={{ opacity: 1, y: 0 }}
      className="mb-20 bg-white dark:bg-brand-darkSurface p-8 lg:p-14 rounded-[48px] border-2 border-brand-maroon/20 dark:border-white/20 shadow-card relative overflow-hidden transition-all duration-700"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#7B201F 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
        <h3 className="text-3xl font-black text-brand-charcoal dark:text-gray-100 tracking-tighter font-lexend uppercase transition-colors">Trending Projects</h3>
        
        <div className="relative group max-w-xs w-full">
          <div className="absolute inset-0 bg-brand-cream dark:bg-brand-darkElevated rounded-2xl pointer-events-none border-2 border-brand-maroon/15 dark:border-white/10 group-focus-within:border-brand-maroon dark:group-focus-within:border-brand-maroonBright transition-all"></div>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-maroon dark:text-brand-maroonBright z-10" size={16} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by keyword..."
            className="relative z-10 w-full bg-transparent py-3.5 pl-12 pr-4 text-xs font-black uppercase tracking-widest text-brand-maroon dark:text-gray-200 outline-none placeholder:text-brand-maroon/30 dark:placeholder:text-white/20 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar border-b-2 border-brand-maroon/10 dark:border-white/10 relative z-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center space-x-2 border-2 shadow-sm ${
              activeCategory === cat.id 
              ? 'bg-brand-maroon dark:bg-brand-maroonSoft text-white border-brand-maroon scale-105 shadow-lg shadow-brand-maroon/30 dark:shadow-brand-maroon/20' 
              : 'bg-white dark:bg-white/5 text-brand-maroon dark:text-gray-300 border-brand-maroon/20 dark:border-white/15 hover:bg-brand-maroon hover:text-white hover:border-brand-maroon dark:hover:bg-brand-maroonSoft'
            }`}
          >
            <cat.icon size={14} />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px] relative z-10">
        <AnimatePresence mode="popLayout" initial={false}>
          {currentProjects.slice(0, 4).map((project) => (
            <motion.div
              key={project.id}
              layout
              onClick={() => onProjectClick(project.id)}
              initial={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                y: -12, 
                scale: 1.025,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group bg-white dark:bg-brand-darkElevated p-10 rounded-[40px] border-2 border-brand-maroon/20 dark:border-white/20 flex flex-col items-start text-left relative cursor-pointer transition-all duration-300 shadow-card hover:bg-brand-maroon dark:hover:bg-brand-maroon hover:shadow-glow hover:border-brand-maroon dark:hover:border-brand-maroon"
            >
              {/* Icon Container: Turns Light on Hover */}
              <div className="w-14 h-14 bg-brand-cream dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-maroon dark:text-brand-maroonBright mb-6 shadow-sm group-hover:bg-white/20 group-hover:text-white transition-all border-2 border-brand-maroon/5 dark:border-white/5">
                <project.icon size={28} />
              </div>

              {/* Text Elements: Turn Pure White on Hover */}
              <h4 className="text-xl font-black mb-3 leading-tight tracking-tight uppercase font-lexend text-brand-charcoal dark:text-gray-100 transition-colors group-hover:text-white">
                {project.title}
              </h4>
              <p className="text-[12px] font-bold mb-8 line-clamp-2 uppercase tracking-tight transition-all text-brand-charcoal/60 dark:text-gray-300 group-hover:text-white/90">
                {project.subtitle}
              </p>
              
              {/* Footer Section: Borders and labels switch to white-themed versions */}
              <div className="mt-auto pt-6 border-t-2 border-brand-maroon/10 dark:border-white/10 w-full flex items-center justify-between group-hover:border-white/20 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 dark:text-gray-400 group-hover:text-white/60 transition-all">
                  {project.institution}
                </span>
                <span className="px-4 py-2 bg-brand-maroon dark:bg-brand-maroonSoft text-white group-hover:bg-white group-hover:text-brand-maroon text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-sm">
                  {project.type}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {currentProjects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-brand-maroonMuted/10 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-brand-maroon/20 dark:border-white/20">
             <Database size={48} className="text-brand-maroon/20 dark:text-white/10 mb-4" />
             <p className="text-sm font-black text-brand-maroon/40 dark:text-white/30 uppercase tracking-widest">No nodes found in matrix</p>
          </div>
        )}
      </div>

      <div className="mt-16 text-center relative z-10">
          <button 
            onClick={onViewMore}
            className="group relative px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] bg-white dark:bg-white/5 border-2 border-brand-maroon/20 dark:border-white/10 text-brand-maroon dark:text-gray-200 hover:bg-brand-maroon dark:hover:bg-brand-maroonBright hover:text-white hover:border-brand-maroon transition-all shadow-xl active:scale-95 flex items-center space-x-4 mx-auto"
          >
            <span>See More Innovation Nodes</span>
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
      </div>
    </motion.div>
  );
};

export default TrendingInternships;