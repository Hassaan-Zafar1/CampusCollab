import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Cpu, 
  Zap, 
  User as UserIcon, 
  Award, 
  ChevronDown, 
  Send, 
  Clock, 
  ClipboardCheck, 
  Target,
  ChevronUp,
  Info,
  Sparkles,
  Loader
} from 'lucide-react';
import { useApplyProject } from '../services/projectHooks';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    description: string;
    category: string;
    department: string;
    status: 'open' | 'in-progress' | 'closed';
    technologies: string[];
    requiredSkills: string[];
    maxInterns: number;
    supervisor: {
      _id: string;
      name: string;
      email: string;
      department: string;
    };
    currentInterns: any[];
    applicants: any[];
    createdAt: string;
  };
  isPriority?: boolean;
  role?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isPriority = false, role = 'student' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { apply, loading: applyLoading, error: applyError } = useApplyProject();

  const isRedState = isHovered || isExpanded;
  const spotsAvailable = project.maxInterns - project.currentInterns.length;

  const handleApply = async () => {
    try {
      await apply(project._id);
      setHasApplied(true);
      alert('Application submitted successfully!');
    } catch (err: any) {
      alert('Error: ' + applyError);
    }
  };

  const statusColors = {
    open: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20',
    'in-progress': 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20',
    closed: 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border border-gray-100 dark:border-gray-500/20'
  };

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ 
        layout: { duration: 0.5, type: "spring", stiffness: 200, damping: 28 },
        opacity: { duration: 0.2 }
      }}
      className={`group p-8 rounded-[40px] border-2 transition-colors duration-500 relative shadow-card cursor-default overflow-hidden ${
        isRedState 
          ? 'bg-brand-maroon border-brand-maroon shadow-glow' 
          : 'bg-white dark:bg-[#121212] border-brand-maroon/5 dark:border-white/10'
      }`}
    >
      {/* Background Glow Effect */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-700 pointer-events-none ${
        isRedState ? 'bg-white/10' : 'bg-brand-maroon/5 dark:bg-brand-maroonBright/5'
      }`}></div>
      
      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Icon Badge */}
          <div className={`w-20 h-20 shrink-0 rounded-[28px] flex items-center justify-center border transition-all duration-500 shadow-sm ${
            isRedState 
              ? 'bg-white/20 text-white border-white/20' 
              : 'bg-brand-cream dark:bg-white/5 text-brand-maroon dark:text-brand-maroonBright border-brand-maroon/5 dark:border-white/10'
          }`}>
            {project.category.toLowerCase().includes('ai') ? <BrainCircuit size={40} /> : <Cpu size={40} />}
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div className="max-w-xl">
                <div className="flex items-center space-x-3 mb-3 flex-wrap gap-2">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isRedState
                      ? 'bg-white/20 text-white border border-white/30'
                      : statusColors[project.status]
                  }`}>
                    {project.status}
                  </span>
                  
                  {isPriority && (
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border animate-pulse-soft ${
                      isRedState 
                        ? 'bg-brand-mint/20 text-brand-mint border-brand-mint/30' 
                        : 'bg-brand-mint/10 text-brand-mint border-brand-mint/20'
                    }`}>
                      <Sparkles size={10} />
                      <span>Matrix Match</span>
                    </span>
                  )}

                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isRedState ? 'text-white/40' : 'text-brand-charcoal/20 dark:text-white/30'}`}>
                    {spotsAvailable}/{project.maxInterns} Spots
                  </span>
                </div>
                <h3 className={`text-2xl font-black tracking-tighter uppercase font-lexend leading-tight mb-4 transition-colors ${isRedState ? 'text-white' : 'text-brand-charcoal dark:text-white'}`}>
                  {project.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {project.status === 'open' && !hasApplied ? (
                  <>
                    <button 
                      onClick={handleApply}
                      disabled={applyLoading || spotsAvailable === 0}
                      className={`flex items-center space-x-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95 border-2 ${
                        applyLoading
                          ? 'opacity-70 cursor-wait'
                          : isRedState 
                            ? 'bg-white text-brand-maroon border-white hover:bg-white/90' 
                            : 'bg-brand-maroon text-white border-brand-maroon hover:bg-brand-maroonSoft'
                      }`}
                    >
                      {applyLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                      <span>{applyLoading ? 'Submitting...' : 'Apply'}</span>
                    </button>
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className={`flex items-center space-x-3 px-8 py-4 bg-transparent border-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                        isRedState 
                          ? 'border-white/40 text-white hover:bg-white/10' 
                          : 'border-brand-maroon/20 dark:border-white/20 text-brand-maroon dark:text-white hover:bg-brand-maroon/5'
                      }`}
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </>
                ) : hasApplied ? (
                  <button 
                    disabled
                    className={`flex items-center space-x-3 px-10 py-4 bg-emerald-500 border-2 border-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl`}
                  >
                    <span>✓ Applied</span>
                  </button>
                ) : (
                  <button 
                    disabled
                    className="flex items-center space-x-3 px-10 py-4 bg-black border-2 border-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl"
                  >
                    <span>Node Locked</span>
                    <Zap size={16} className="text-brand-maroonBright" />
                  </button>
                )}
              </div>
            </div>

            <p className={`text-base font-medium leading-relaxed mb-8 max-w-4xl transition-colors ${isRedState ? 'text-white/80' : 'text-brand-charcoal/60 dark:text-white/70'}`}>
              {project.description}
            </p>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 border-t pt-8 mt-2 transition-colors duration-500 ${isRedState ? 'border-white/20' : 'border-brand-maroon/5 dark:border-white/10'}`}>
              <div className={`flex items-center space-x-3 transition-colors ${isRedState ? 'text-white/70' : 'text-brand-charcoal/50 dark:text-white/50'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isRedState ? 'bg-white/10 text-white' : 'bg-brand-cream dark:bg-white/5 text-brand-maroon dark:text-brand-maroonBright'}`}>
                  <UserIcon size={20} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest leading-none">{project.supervisor.name}</span>
              </div>
              <div className={`flex items-center space-x-3 transition-colors ${isRedState ? 'text-white/70' : 'text-brand-charcoal/50 dark:text-white/50'}`}>
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isRedState ? 'bg-white/10 text-white' : 'bg-brand-cream dark:bg-white/5 text-brand-maroon dark:text-brand-maroonBright'}`}>
                  <Award size={20} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest leading-none">{project.department}</span>
              </div>
              <div className={`flex items-center space-x-3 font-black transition-colors ${isRedState ? 'text-white' : 'text-brand-maroon dark:text-brand-maroonBright'}`}>
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isRedState ? 'bg-white/20 text-white' : 'bg-brand-maroonMuted dark:bg-brand-maroonBright/10 text-brand-maroon dark:text-brand-maroonBright'}`}>
                  <Zap size={20} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest leading-none">{project.technologies.slice(0, 2).join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXPANDED CONTENT */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pt-8 border-t-2 border-white/20 mt-2 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Required Skills */}
                  <div className="bg-white/10 p-8 rounded-[32px] border border-white/10 backdrop-blur-md">
                    <div className="flex items-center space-x-3 mb-6">
                      <ClipboardCheck className="text-brand-mint" size={20} />
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Required Skills</h4>
                    </div>
                    <div className="space-y-4">
                      {project.requiredSkills.length > 0 ? (
                        project.requiredSkills.map((skill, i) => (
                          <div key={i} className="flex items-center space-x-3 text-sm font-bold text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-mint"></div>
                            <span>{skill}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm font-bold text-white/50">No specific requirements</p>
                      )}
                    </div>
                  </div>

                  {/* Technologies & Duration */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center space-x-4">
                        <Cpu className="text-brand-mint" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Technologies</span>
                      </div>
                      <span className="text-xs font-black text-white uppercase tracking-widest">{project.technologies.join(', ')}</span>
                    </div>

                    <div className="p-8 bg-white/10 rounded-[32px] text-white border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Award size={20} className="text-brand-mint" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Interns</h4>
                      </div>
                      <p className="text-sm font-bold leading-relaxed opacity-80">
                        {project.currentInterns.length} active • {spotsAvailable} spots available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-brand-maroonSoft/30 p-10 rounded-[40px] border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <Info size={18} className="text-brand-mint" />
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-brand-mint">Project Details</h4>
                  </div>
                  <p className="text-white/80 text-base leading-relaxed font-medium">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProjectCard;