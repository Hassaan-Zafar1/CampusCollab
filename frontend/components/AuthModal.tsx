
import React, { useState, useEffect } from 'react';
import { X, Fingerprint, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess: (email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  const validateEmail = (email: string) => {
    const nedRegex = /^[a-zA-Z0-9._%+-]+@neduet\.edu\.pk$/;
    return nedRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Unauthorized access: Use official @neduet.edu.pk credentials.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(email);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-academic-blueGray/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-academic-border"
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="w-10 h-10 bg-brand-red rounded flex items-center justify-center text-white">
              <Fingerprint size={24} />
            </div>
            <button onClick={onClose} className="text-academic-grayMuted hover:text-brand-red transition-colors">
              <X size={20} />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-academic-blueGray mb-2 tracking-tight">
            {mode === 'login' ? 'Researcher Portal' : 'Register Identity'}
          </h2>
          <p className="text-sm text-academic-grayMuted mb-8 font-medium">
            Authenticate using your official university node.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-academic-blueGray uppercase tracking-widest mb-2 block">University Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="id@neduet.edu.pk"
                className={`w-full px-4 py-3 bg-academic-background border rounded-lg outline-none transition-all text-sm font-medium ${
                  error ? 'border-red-500' : 'border-academic-border focus:border-brand-red'
                }`}
              />
              {error && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-widest">{error}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-academic-blueGray uppercase tracking-widest mb-2 block">Access Key</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-academic-background border border-academic-border rounded-lg outline-none focus:border-brand-red transition-all text-sm font-medium"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-brand-red text-white font-bold uppercase tracking-widest text-[11px] rounded-lg hover:bg-brand-redSoft transition-all active:scale-[0.98] flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Node'}</span>
                  <ShieldCheck size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-academic-border text-center">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs font-bold text-academic-grayMuted uppercase tracking-widest hover:text-brand-red transition-colors"
            >
              {mode === 'login' ? 'Request New Membership' : 'Authorized Access Login'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
