import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Send, 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  Code2, 
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

const DEPARTMENTS = [
  'Computer Science & Information Technology',
  'Artificial Intelligence',
  'Gaming and Animation',
  'Cybersecurity',
  'Data Science'
];

const NewInnovation: React.FC = () => {
  const { theme, styles } = useTheme();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: DEPARTMENTS[0],
    summary: '',
    techStack: '',
    teamCount: '1',
    supervisor: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-16 rounded-[48px] border-2 shadow-2xl transition-all duration-500 ${theme === 'light' ? 'bg-white border-brand-maroon/10' : 'bg-brand-darkElevated border-white/10'}`}
        >
          <div className="w-24 h-24 bg-brand-mint rounded-[32px] flex items-center justify-center text-brand-charcoal mx-auto mb-10 shadow-lg">
            <CheckCircle2 size={48} />
          </div>
          <h2 className={`text-5xl font-black ${styles.colors.text} tracking-tighter mb-6 uppercase font-lexend`}>Matrix Synced</h2>
          <p className={`${styles.colors.textMuted} font-bold text-lg mb-10 max-w-md mx-auto`}>
            Your innovation proposal has been transmitted to the Faculty Review Board. Expect a node response within 48 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className={`px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 ${styles.buttonPrimary}`}
          >
            Submit Another Innovation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="mb-16">
        <div className={`flex items-center space-x-4 mb-6 ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
          <Rocket size={24} className="animate-bounce" />
          <span className="text-[12px] font-black uppercase tracking-[0.4em]">Submission Terminal 2.0</span>
        </div>
        <h2 className={`text-5xl md:text-7xl font-black ${styles.colors.text} tracking-tighter leading-none mb-4 uppercase font-lexend transition-colors`}>
          PROPOSE <span className={theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}>INNOVATION.</span>
        </h2>
        <p className={`font-bold uppercase tracking-widest text-xs transition-colors ${styles.colors.textMuted}`}>
          Translate your technical vision into an official campus research node.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Section 1: Core Intel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[48px] border-2 transition-all duration-500 overflow-hidden shadow-card relative ${theme === 'light' ? 'bg-white border-brand-maroon/10' : 'bg-brand-darkElevated border-white/10'}`}
        >
          {/* Header Box (Matching Edit Profile style) */}
          <div className="bg-brand-maroon px-10 py-6 flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white border border-white/20">
                <BookOpen size={20} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Project Intel Matrix</h3>
            </div>
            <Sparkles size={16} className="text-brand-mint/60" />
          </div>

          <div className="p-10 md:p-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2 group">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.colors.textMuted} mb-3 block group-focus-within:text-brand-maroon transition-colors`}>Project Title</label>
                <div className="relative">
                  <Rocket className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-maroon/20' : 'text-white/10'}`} size={18} />
                  <input 
                    required type="text" 
                    placeholder="e.g., Autonomous Campus Navigation Drone"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className={`w-full pl-16 pr-6 py-5 rounded-2xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5`}
                  />
                </div>
              </div>

              <div className="group">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.colors.textMuted} mb-3 block group-focus-within:text-brand-maroon transition-colors`}>Primary Department</label>
                <select 
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className={`w-full px-8 py-5 rounded-2xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 appearance-none`}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="group">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.colors.textMuted} mb-3 block group-focus-within:text-brand-maroon transition-colors`}>Team Size Node</label>
                <select 
                  value={formData.teamCount}
                  onChange={e => setFormData({...formData, teamCount: e.target.value})}
                  className={`w-full px-8 py-5 rounded-2xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 appearance-none`}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Researchers</option>)}
                </select>
              </div>

              <div className="md:col-span-2 group">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.colors.textMuted} mb-3 block group-focus-within:text-brand-maroon transition-colors`}>Executive Summary</label>
                <textarea 
                  required rows={4}
                  placeholder="Explain the technical problem and your proposed solution architecture..."
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                  className={`w-full px-8 py-5 rounded-2xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 resize-none`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Technical Matrix */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-[48px] border-2 transition-all duration-500 overflow-hidden shadow-card relative ${theme === 'light' ? 'bg-white border-brand-maroon/10' : 'bg-brand-darkElevated border-white/10'}`}
        >
          {/* Header Box */}
          <div className="bg-brand-maroon px-10 py-6 flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white border border-white/20">
                <Code2 size={20} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Technical Architecture</h3>
            </div>
            <div className="w-2 h-2 rounded-full bg-brand-mint animate-pulse"></div>
          </div>

          <div className="p-10 md:p-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="group md:col-span-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.colors.textMuted} mb-3 block group-focus-within:text-brand-maroon transition-colors`}>Tech Stack Protocols</label>
                <div className="relative">
                  <Zap className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-maroon/20' : 'text-white/10'}`} size={18} />
                  <input 
                    required type="text" 
                    placeholder="e.g., React, Node.js, TensorFlow, OpenCV..."
                    value={formData.techStack}
                    onChange={e => setFormData({...formData, techStack: e.target.value})}
                    className={`w-full pl-16 pr-6 py-5 rounded-2xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5`}
                  />
                </div>
              </div>

              <div className="group md:col-span-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.colors.textMuted} mb-3 block group-focus-within:text-brand-maroon transition-colors`}>Preferred Faculty Supervisor Node</label>
                <div className="relative">
                  <GraduationCap className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-maroon/20' : 'text-white/10'}`} size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter Supervisor Name (Dr. / Ms. / Mr.)..."
                    value={formData.supervisor}
                    onChange={e => setFormData({...formData, supervisor: e.target.value})}
                    className={`w-full pl-16 pr-6 py-5 rounded-2xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5`}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Button Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 px-4">
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${styles.colors.textMuted} text-center md:text-left`}>
            Submitting this innovation will sync it with the <br /> university innovation directory for faculty review.
          </p>
          <button 
            type="submit"
            disabled={loading}
            className={`group relative flex items-center space-x-5 px-14 py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-2xl active:scale-95 disabled:opacity-70 ${styles.buttonPrimary}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Transmit Innovation</span>
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-brand-maroon transition-all">
                  <Send size={18} />
                </div>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInnovation;