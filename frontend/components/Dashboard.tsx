
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Cpu, 
  BrainCircuit, 
  GraduationCap, 
  Zap, 
  User,
  ArrowUpRight,
  Award,
  Github,
  Linkedin,
  ShieldCheck,
  Layout,
  BookOpen,
  PieChart,
  Bell,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  role: 'student' | 'professor';
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [filter, setFilter] = useState<'All' | 'Open' | 'Ongoing'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    { 
      id: 1, 
      title: "Optimizing Smart Grid Load via Federated Learning", 
      dept: "Electrical Engineering", 
      professor: "Dr. Ali Raza", 
      status: "Open", 
      type: "AI", 
      tags: ['ML', 'Smart Grid'],
      description: "Developing a decentralized training protocol for residential power balancing units at the district level.",
      credits: 3
    },
    { 
      id: 2, 
      title: "Real-time Urdu NLP for Autonomous Systems", 
      dept: "Computer Systems", 
      professor: "Ms. Zainab Khan", 
      status: "Ongoing", 
      type: "AI", 
      tags: ['NLP', 'Robotics'],
      description: "Implementing voice-to-action protocols for localized Urdu commands in factory environments.",
      credits: 4
    },
    { 
      id: 3, 
      title: "Seismic Stability of Retrofitted Structures", 
      dept: "Civil Engineering", 
      professor: "Dr. Sameer", 
      status: "Open", 
      type: "Civil", 
      tags: ['Structural', 'AI'],
      description: "Analyzing the longevity of composite reinforcements in historic campus buildings.",
      credits: 2
    }
  ];

  const processedProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = filter === 'All' || p.status === filter;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="bg-academic-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Sidebar: Navigation & Identity */}
          <aside className="w-full lg:w-72 lg:sticky lg:top-32 space-y-6">
            <div className="bg-white rounded-xl p-8 border border-academic-border shadow-soft text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full rounded-full bg-academic-background border-2 border-academic-border flex items-center justify-center text-academic-grayMuted">
                  <User size={40} />
                </div>
                <div className="absolute bottom-0 right-0 bg-brand-red text-white p-2 rounded-full border-4 border-white">
                  <ShieldCheck size={14} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-academic-blueGray mb-1">Hammad Siddiqui</h3>
              <p className="text-xs font-semibold text-academic-grayMuted uppercase tracking-widest mb-8">CIS Researcher</p>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-academic-background rounded-lg text-brand-red font-semibold text-sm">
                  <Layout size={18} />
                  <span>Overview</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-academic-grayText hover:bg-academic-background rounded-lg font-medium text-sm transition-all">
                  <BookOpen size={18} />
                  <span>Research Nodes</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-academic-grayText hover:bg-academic-background rounded-lg font-medium text-sm transition-all">
                  <PieChart size={18} />
                  <span>Analytics</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-academic-grayText hover:bg-academic-background rounded-lg font-medium text-sm transition-all">
                  <Bell size={18} />
                  <span>Notices</span>
                </button>
              </div>
            </div>

            <div className="bg-academic-blueGray text-white rounded-xl p-8 shadow-soft">
              <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Verification Score</h4>
              <div className="text-4xl font-bold mb-4">98.2</div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-red w-[98%]"></div>
              </div>
              <p className="text-[10px] mt-4 opacity-50 font-medium leading-relaxed italic">
                Authorized Node Level 4: Access to proprietary campus lab datasets granted.
              </p>
            </div>
          </aside>

          {/* Main: Content Area */}
          <main className="flex-grow">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-academic-blueGray tracking-tight mb-2">Research Repository</h2>
                <p className="text-academic-grayMuted text-sm font-medium">Explore and collaborate on active academic initiatives.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-academic-grayMuted" size={16} />
                  <input 
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-11 pr-6 py-2.5 w-full md:w-64 bg-white border border-academic-border rounded-lg outline-none focus:border-brand-red transition-all text-sm font-medium text-academic-blueGray"
                  />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 border-b border-academic-border mb-8">
              {['All', 'Open', 'Ongoing'].map((f) => (
                <button
                  key={f} onClick={() => setFilter(f as any)}
                  className={`px-6 py-4 text-sm font-semibold transition-all relative ${
                    filter === f ? 'text-brand-red' : 'text-academic-grayMuted hover:text-academic-blueGray'
                  }`}
                >
                  {f}
                  {filter === f && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
                  )}
                </button>
              ))}
            </div>

            {/* Project Cards */}
            <div className="space-y-4">
              {processedProjects.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  className="bg-white p-8 rounded-xl border border-academic-border hover:border-brand-red/30 hover:shadow-card transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-16 h-16 shrink-0 rounded-lg bg-academic-background flex items-center justify-center text-brand-red border border-academic-border">
                      {project.type === 'AI' ? <BrainCircuit size={32} /> : <Cpu size={32} />}
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                              project.status === 'Open' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {project.status}
                            </span>
                            <span className="text-[11px] font-medium text-academic-grayMuted">Node: #{project.id}X</span>
                          </div>
                          <h3 className="text-xl font-bold text-academic-blueGray group-hover:text-brand-red transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <button className="flex items-center space-x-2 px-6 py-2.5 bg-brand-red text-white text-xs font-bold uppercase rounded-lg hover:bg-brand-redSoft transition-all">
                          <span>Apply</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      <p className="text-academic-grayText text-sm leading-relaxed mb-8 max-w-3xl">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-8 border-t border-academic-border pt-6 mt-2">
                        <div className="flex items-center space-x-2.5 text-academic-grayMuted">
                          <GraduationCap size={16} />
                          <span className="text-xs font-semibold">{project.professor}</span>
                        </div>
                        <div className="flex items-center space-x-2.5 text-academic-grayMuted">
                          <Award size={16} />
                          <span className="text-xs font-semibold">{project.dept}</span>
                        </div>
                        <div className="flex items-center space-x-2.5 text-brand-red">
                          <Zap size={16} />
                          <span className="text-xs font-bold">{project.credits} Academic Credits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
