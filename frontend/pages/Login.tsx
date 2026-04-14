import React, { useState } from 'react';
import api from '../src/api/axios';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Mail, Lock, CheckCircle2, Cpu } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface LoginProps {
  onSuccess: (email: string) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, styles } = useTheme();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const token = response.data.token;

      const user = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        department: response.data.department,
        role: response.data.role,
        github: response.data.github || '',
        linkedin: response.data.linkedin || '',
        portfolio: response.data.portfolio || '',
        profilePicture: response.data.profilePicture || '',
        skills: Array.isArray(response.data.skills) ? response.data.skills : [],
        isVerified: !!response.data.isVerified,
        token: token,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch custom event for same-tab listeners
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));

      onSuccess(response.data.email);
      console.log("LOGIN RESPONSE:", response.data);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "AI-Powered Matching",
    "Real-time Collaboration",
    "Project Management Tools"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-700 ${styles.colors.bg} overflow-hidden`}
    >
      {/* LEFT PANEL: Brand & Features */}
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="lg:w-[45%] p-12 lg:p-24 flex flex-col justify-center relative overflow-hidden bg-brand-maroon z-20 shadow-2xl"
      >
        {/* Subtle Background Identity Layer */}
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=2070" 
            alt="Research Matrix" 
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity grayscale contrast-125"
          />
        </div>

        <div className="relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4 mb-12"
          >
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
              <Cpu className="text-white" size={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase font-lexend">
                NED<span className="text-brand-mint ml-1">Collab</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Terminal 2.0</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl lg:text-5xl font-black font-lexend tracking-tighter leading-[1.1] uppercase mb-6"
          >
            NED Campus <br />
            <span className="text-brand-mint">Collab.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base text-white/80 max-w-md font-medium mb-16 leading-relaxed"
          >
            Connecting students and professors through innovative research and collaboration.
          </motion.p>

          <div className="space-y-5">
            {features.map((feature, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (idx * 0.1) }}
                key={idx} 
                className="flex items-center space-x-4 group cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-brand-mint/20 transition-all">
                  <CheckCircle2 size={18} className="text-brand-mint" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-white/90 group-hover:translate-x-2 transition-transform">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL: Authentication Terminal */}
      <div className={`flex-grow flex flex-col justify-center items-center p-8 lg:p-24 relative ${styles.colors.bg}`}>
        <button 
          onClick={() => onNavigate('home')}
          className="absolute top-10 right-10 lg:right-24 flex items-center space-x-2 text-brand-charcoal/40 dark:text-white/40 hover:text-brand-maroon dark:hover:text-brand-maroonBright transition-all font-bold text-[10px] uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          <span>Back to Home</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className={`text-4xl lg:text-5xl font-black ${styles.colors.text} tracking-tighter font-lexend uppercase mb-3`}>
              Welcome <span className={theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}>Back.</span>
            </h2>
            <p className={`text-sm font-bold uppercase tracking-widest ${styles.colors.textMuted}`}>
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-charcoal/20 group-focus-within:text-brand-maroon' : 'text-white/10 group-focus-within:text-brand-maroonBright'}`} size={20} />
                  <input 
                    type="email" required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full pl-16 pr-6 py-5 rounded-2xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                    Password
                  </label>
                  <button type="button" className={`text-[9px] font-black uppercase tracking-widest hover:text-brand-maroonBright transition-colors ${styles.colors.textMuted}`}>
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-charcoal/20 group-focus-within:text-brand-maroon' : 'text-white/10 group-focus-within:text-brand-maroonBright'}`} size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-16 pr-6 py-5 rounded-2xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center space-x-3 shadow-2xl active:scale-95 disabled:opacity-70 ${styles.buttonPrimary} shadow-brand-maroon/30`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ShieldCheck size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${styles.colors.textMuted}`}>
              Don't have an account?{' '}
              <button 
                onClick={() => onNavigate('signup')} 
                className={`ml-1 font-black transition-colors ${theme === 'light' ? 'text-brand-maroon hover:text-brand-maroonSoft' : 'text-brand-maroonBright hover:text-white'}`}
              >
                Register Here
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;