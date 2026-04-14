import React, { useState, useMemo } from 'react';
import { Search, Rocket, ChevronRight, Globe, CheckCircle2, Microscope, Database, Sparkles, Layout, BrainCircuit, Cpu, Cloud, ArrowRight, Code2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  onGetStarted: () => void;
}

// MOCK DATA
const CATEGORIES = [
  { id: 'ai', name: 'AI & Machine Learning', icon: BrainCircuit },
  { id: 'mern', name: 'MERN Stack', icon: Layers },
  { id: 'iot', name: 'IoT & Robotics', icon: Cpu },
  { id: 'cloud', name: 'Cloud Computing', icon: Cloud },
];

const PROJECTS_DATA: Record<string, any[]> = {
  ai: [
    { id: 1, title: "Neural Network Optimizer", subtitle: "Efficiency in small models", institution: "AI Lab 1", type: "Research", icon: BrainCircuit },
    { id: 2, title: "Urdu Voice Synthesis", subtitle: "NLP for local dialects", institution: "Linguistics Hub", type: "Internship", icon: Sparkles },
    { id: 3, title: "Vision-based Sorting", subtitle: "Industrial automation", institution: "RoboSystems", type: "Project", icon: Microscope },
    { id: 4, title: "Chatbot for Campus", subtitle: "Administrative automation", institution: "Student Dev", type: "Internship", icon: BrainCircuit },
  ],
  mern: [
    { id: 5, title: "E-Commerce Matrix", subtitle: "High-scale inventory", institution: "Web Solutions", type: "Project", icon: Code2 },
    { id: 6, title: "Student Portal v4", subtitle: "Microservices architecture", institution: "NED IT Dept", type: "Internship", icon: Layout },
    { id: 7, title: "Research Inventory", subtitle: "Websocket optimizations", institution: "Data Stream", type: "Internship", icon: Database },
    { id: 8, title: "Research Repository", subtitle: "Next.js & MongoDB", institution: "CampusCollab", type: "Project", icon: Layers },
  ],
  iot: [
    { id: 9, title: "Smart Grid Monitor", subtitle: "Energy efficiency node", institution: "Electrical Dept", type: "Research", icon: Cpu },
    { id: 10, title: "Auto-Irrigation Hub", subtitle: "Soil moisture precision", institution: "AgriTech", type: "Project", icon: Cloud },
    { id: 11, title: "UAV Recon Drone", subtitle: "Autonomous flight path", institution: "AeroLab", type: "Research", icon: Rocket },
    { id: 12, title: "Home Automation API", subtitle: "ESP32 Integrations", institution: "SmartHome", type: "Internship", icon: Cpu },
  ],
  cloud: [
    { id: 13, title: "Edge Computing Node", subtitle: "Low latency processing", institution: "Cloud Unit", type: "Research", icon: Cloud },
    { id: 14, title: "SaaS Multi-tenant", subtitle: "Secure database isolation", institution: "SaaS Builder", type: "Project", icon: Database },
    { id: 15, title: "Serverless Auth", subtitle: "AWS Lambda functions", institution: "DevOps Team", type: "Internship", icon: Globe },
    { id: 16, title: "Cloud Storage Drive", subtitle: "Distributed file system", institution: "Data Labs", type: "Research", icon: Cloud },
  ],
};

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [localSearch, setLocalSearch] = useState('');

  const currentProjects = useMemo(() => {
    const list = PROJECTS_DATA[activeCategory] || [];
    if (!localSearch) return list;
    return list.filter(p => p.title.toLowerCase().includes(localSearch.toLowerCase()));
  }, [activeCategory, localSearch]);

  return (
    <section className="relative flex flex-col lg:flex-row bg-brand-cream dark:bg-brand-darkBase transition-colors duration-700">
      {/* Left Column (Sticky Sidebar) */}
      <div className="lg:w-[40%] lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] hero-split-left flex flex-col justify-center p-12 lg:p-16 relative z-10 bg-brand-maroon dark:bg-[#5A1716] transition-colors duration-500 rounded-br-[40px] lg:rounded-br-none">
        <div className="hero-overlay absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="relative z-10 text-white">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[0.9] uppercase mb-12 font-lexend"
          >
            DESIGN.<br />
            BUILD.<br />
            INNOVATE.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg opacity-80 max-w-md mb-12 font-medium"
          >
            Bridging university-level academic excellence and global industry through collaborative research.
          </motion.p>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6 font-lexend">CampusCollab</h2>
            <p className="text-sm opacity-70 max-w-sm mb-8">
              A collaborative research platform where university students compare, share innovative ideas, and build projects in the academic ecosystem.
            </p>
            
            <div className="space-y-3">
              {[
                "SECURE UNIVERSITY ACCESS",
                "PROJECT COLLABORATION",
                "INNOVATION HUB"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-[10px] font-bold tracking-[0.2em]">
                  <CheckCircle2 size={14} className="text-white opacity-80" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[60%] flex flex-col pt-16 lg:pt-24 px-8 lg:px-20 bg-brand-cream dark:bg-brand-darkBase">
        <div className="max-w-4xl w-full">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-extrabold text-brand-charcoal dark:text-white tracking-tighter leading-[1] uppercase mb-16 font-lexend"
          >
            RESEARCH<br />
            <span className="text-brand-maroon dark:text-brand-maroonBright drop-shadow-[0_0_10px_rgba(123,32,31,0.2)]">OPTIMIZED.</span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-16 group"
          >
            <div className="pill-search bg-white/80 dark:bg-brand-darkSurface/90 backdrop-blur-xl rounded-full flex items-center p-2 shadow-pill border border-brand-maroon/5 dark:border-white/10 group-focus-within:border-brand-maroon dark:group-focus-within:border-brand-maroonBright transition-all">
              <Search className="ml-6 text-brand-maroon dark:text-brand-maroonBright opacity-40 group-focus-within:opacity-100 transition-opacity" size={24} />
              <input 
                type="text" 
                placeholder="Query Research Matrix (e.g. LLM, Robotics, IoT)..."
                className="flex-grow bg-transparent px-6 py-4 text-sm font-medium outline-none text-brand-charcoal dark:text-gray-100 placeholder:text-brand-charcoal/30 dark:placeholder:text-white/20"
              />
              <button className="bg-brand-maroon dark:bg-brand-maroonSoft text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-maroonSoft dark:hover:bg-brand-maroonBright hover:scale-[1.05] transition-all flex items-center space-x-2 shadow-lg">
                <span>Initialize Search</span>
                <Globe size={14} />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Microscope, label: "Active Nodes", value: "158" },
              { icon: Rocket, label: "Live Missions", value: "42" },
              { icon: Database, label: "Grant Pools", value: "12" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                whileHover={{ y: -10, rotate: 1 }}
                className="bg-brand-maroon/5 dark:bg-brand-maroonSoft/10 backdrop-blur-2xl p-10 rounded-[40px] shadow-soft flex flex-col items-center text-center border border-brand-maroon/10 dark:border-brand-maroonBright/20 transition-all group cursor-default relative overflow-hidden"
              >
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-brand-maroon/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <div className="w-16 h-16 bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-maroon dark:text-brand-maroonBright mb-6 group-hover:bg-brand-maroon dark:group-hover:bg-brand-maroonBright group-hover:text-white transition-all shadow-sm border border-brand-maroon/5 dark:border-white/5">
                  <stat.icon size={32} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-extrabold text-brand-charcoal dark:text-white mb-2 font-lexend tracking-tighter drop-shadow-sm transition-colors">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-maroon/50 dark:text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Rest of the component follows... */}
        </div>
      </div>
    </section>
  );
};

export default Hero;