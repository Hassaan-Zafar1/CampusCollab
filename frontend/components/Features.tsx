
import React, { useState } from 'react';
import { Search, Filter, Cpu, Brain, Layers, ArrowUpRight, CheckCircle2, Clock, Ban, Sparkles } from 'lucide-react';

const categories = ["All Fields", "MERN Stack", "IoT & Robotics", "Machine Learning", "Cloud Systems", "Civil Eng."];

const projects = [
  {
    title: "Hybrid Solar Grid Controller",
    professor: "Dr. Farooq",
    tags: ["Embedded", "IoT"],
    status: "Recruiting",
    statusColor: "emerald",
    // Store the component directly instead of a JSX element for better prop handling in TS
    icon: Cpu,
    match: 94
  },
  {
    title: "NLP for Urdu Dialects",
    professor: "Ms. Zainab",
    tags: ["AI", "Python"],
    status: "Ongoing",
    statusColor: "indigo",
    icon: Brain,
    match: 88
  },
  {
    title: "Decentralized Voting WebApp",
    professor: "Dr. Kashif",
    tags: ["Blockchain", "MERN"],
    status: "Closed",
    statusColor: "slate",
    icon: Layers,
    match: 72
  },
  {
    title: "Structural Health AI Monitor",
    professor: "Dr. Sameer",
    tags: ["Civil", "Sensors"],
    status: "Recruiting",
    statusColor: "emerald",
    icon: Cpu,
    match: 91
  }
];

const Features: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All Fields");

  return (
    <section id="project-hub" className="bg-white py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-crimson mb-4 font-black uppercase tracking-[0.2em] text-xs">
              <Layers size={14} />
              <span>Project Hub</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Discover Open <span className="text-crimson">Innovations.</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  activeCategory === cat 
                  ? 'bg-crimson text-white border-crimson shadow-lg shadow-crimson/20' 
                  : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, idx) => {
            // Assign the icon component to a capitalized variable for JSX rendering
            const ProjectIcon = project.icon;
            return (
              <div key={idx} className="group relative bg-slate-50/50 p-8 rounded-3xl border border-slate-100 hover:border-crimson/20 hover:bg-white hover:shadow-2xl hover:shadow-crimson/5 transition-all duration-500 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-white border border-slate-100 shadow-sm text-slate-600 group-hover:bg-crimson group-hover:text-white group-hover:shadow-lg group-hover:shadow-crimson/30`}>
                    {/* Fixed: Replaced React.cloneElement with direct component usage to resolve prop type error */}
                    <ProjectIcon size={28} />
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    project.status === 'Recruiting' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    project.status === 'Ongoing' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                    'bg-slate-200/50 text-slate-500'
                  }`}>
                    {project.status === 'Recruiting' ? <CheckCircle2 size={10} /> : 
                     project.status === 'Ongoing' ? <Clock size={10} /> : <Ban size={10} />}
                    <span>{project.status}</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-crimson transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 font-bold text-xs mb-6 uppercase tracking-widest">{project.professor}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-200/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-12 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-crimson" style={{width: `${project.match}%`}}></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400">{project.match}% AI Match</span>
                  </div>
                  <button className="text-slate-400 hover:text-crimson transition-colors">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Special CTA Bento Card */}
          <div className="relative overflow-hidden bg-slate-900 p-8 rounded-3xl flex flex-col justify-center items-center text-center group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
              {/* Fixed: Added Sparkles import to fix the "Cannot find name 'Sparkles'" error */}
              <Sparkles size={32} />
            </div>
            <h4 className="text-xl font-black text-white mb-4">Launch Your Idea</h4>
            <p className="text-slate-400 text-sm font-medium mb-6">Can't find a project? Propose your own innovation to faculty members.</p>
            <button className="px-6 py-2.5 bg-crimson text-white font-bold rounded-xl text-sm group-hover:shadow-lg group-hover:shadow-crimson/50 transition-all">
              Propose Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
