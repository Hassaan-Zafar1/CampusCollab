import React, { useState } from 'react';
import api from '../src/api/axios';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, ArrowLeft, Mail, User, Lock, CheckCircle2, Cpu, Key, AlertCircle, ChevronDown } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface SignupProps {
  onNavigate: (page: string) => void;
  onSuccess?: (email: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState<string[]>(['']);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { theme, styles } = useTheme();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const skillsArray = skills.filter(skill => skill.trim() !== '');
      
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        department,
        skills: skillsArray
      });

      setSuccessMessage('Account created! Check your email for OTP.');
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verifyOTP', {
        email,
        otp
      });

      setSuccessMessage('Account verified successfully! Redirecting to login...');
      
      // Dispatch custom event with user data
      const userData = {
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
        token: response.data.token,
      };

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: userData }));

      if (onSuccess) {
        onSuccess(email);
      }

      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  const addSkillField = () => {
    setSkills([...skills, '']);
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
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
      {/* LEFT PANEL: Registration Terminal */}
      <div className={`lg:w-[55%] flex flex-col justify-center items-center p-8 lg:p-24 relative ${styles.colors.bg}`}>
        <button 
          onClick={() => onNavigate('home')}
          className="absolute top-10 left-10 lg:left-24 flex items-center space-x-2 text-brand-charcoal/40 dark:text-white/40 hover:text-brand-maroon dark:hover:text-brand-maroonBright transition-all font-bold text-[10px] uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          <span>Back to Home</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="mb-10">
            <h2 className={`text-4xl lg:text-5xl font-black ${styles.colors.text} tracking-tighter font-lexend uppercase mb-3`}>
              {step === 'form' ? 'Create' : 'Verify'}{' '}
              <span className={theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}>
                {step === 'form' ? 'Account.' : 'OTP.'}
              </span>
            </h2>
            <p className={`text-sm font-bold uppercase tracking-widest ${styles.colors.textMuted}`}>
              {step === 'form' 
                ? 'Deploy your research identity to the matrix'
                : 'Enter the OTP code sent to your email'
              }
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50/50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/30 flex items-center space-x-3 text-red-600 dark:text-red-400"
            >
              <AlertCircle size={20} />
              <span className="text-sm font-bold">{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-green-50/50 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/30 flex items-center space-x-3 text-green-600 dark:text-green-400"
            >
              <CheckCircle2 size={20} />
              <span className="text-sm font-bold">{successMessage}</span>
            </motion.div>
          )}

          {/* ==================== REGISTRATION FORM ==================== */}
          {step === 'form' ? (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="group">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-charcoal/20 group-focus-within:text-brand-maroon' : 'text-white/10 group-focus-within:text-brand-maroonBright'}`} size={18} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full pl-14 pr-6 py-4 rounded-xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                    University Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-charcoal/20 group-focus-within:text-brand-maroon' : 'text-white/10 group-focus-within:text-brand-maroonBright'}`} size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="id@cloud.neduet.edu.pk"
                      className={`w-full pl-14 pr-6 py-4 rounded-xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                    Role
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold text-sm shadow-sm appearance-none ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                    >
                      <option value="" disabled>Select your role</option>
                      <option value="student">Student</option>
                      <option value="professor">Professor</option>
                    </select>
                    <ChevronDown className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'light' ? 'text-brand-charcoal/40' : 'text-white/40'}`} size={18} />
                  </div>
                </div>

                <div className="group">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                    Department
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Systems Engineering"
                      className={`w-full px-6 py-4 rounded-xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                    Skills
                  </label>
                  <div className="space-y-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={skill}
                          onChange={e => updateSkill(index, e.target.value)}
                          placeholder="e.g. React, Python, ML..."
                          className={`flex-grow px-6 py-4 rounded-xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                        />
                        {skills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="px-4 py-4 text-red-500 hover:text-red-600 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSkillField}
                      className={`w-full py-3 rounded-xl border-2 border-dashed text-sm font-bold uppercase tracking-wider transition-all ${theme === 'light' ? 'border-brand-maroon/30 hover:border-brand-maroon text-brand-maroon' : 'border-white/30 hover:border-brand-maroonBright text-brand-maroonBright'}`}
                    >
                      + Add Another Skill
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-charcoal/20 group-focus-within:text-brand-maroon' : 'text-white/10 group-focus-within:text-brand-maroonBright'}`} size={18} />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-14 pr-6 py-4 rounded-xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-charcoal/20 group-focus-within:text-brand-maroon' : 'text-white/10 group-focus-within:text-brand-maroonBright'}`} size={18} />
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-14 pr-6 py-4 rounded-xl outline-none border transition-all font-bold text-sm shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5 dark:focus:ring-brand-maroonBright/5`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center space-x-3 shadow-2xl active:scale-95 disabled:opacity-70 ${styles.buttonPrimary}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Register Account</span>
                    <Rocket size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ==================== OTP VERIFICATION FORM ==================== */
            <form onSubmit={handleOtpVerify} className="space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 block transition-colors ${theme === 'light' ? 'text-brand-charcoal/30 group-focus-within:text-brand-maroon' : 'text-white/20 group-focus-within:text-brand-maroonBright'}`}>
                    Enter OTP Code
                  </label>
                  <div className="relative">
                    <Key className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-brand-charcoal/20 group-focus-within:text-brand-maroon' : 'text-white/10 group-focus-within:text-brand-maroonBright'}`} size={20} />
                    <input 
                      type="text" 
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className={`w-full pl-16 pr-6 py-5 rounded-2xl outline-none border transition-all font-bold text-lg tracking-[0.2em] text-center shadow-sm ${styles.input} focus:ring-4 focus:ring-brand-maroon/5`}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center space-x-3 shadow-2xl active:scale-95 disabled:opacity-70 ${styles.buttonPrimary}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ShieldCheck size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-12 text-center">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${styles.colors.textMuted}`}>
              Already have an account?{' '}
              <button 
                onClick={() => onNavigate('login')} 
                className={`ml-1 font-black transition-colors ${theme === 'light' ? 'text-brand-maroon hover:text-brand-maroonSoft' : 'text-brand-maroonBright hover:text-white'}`}
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL: Features */}
      <div className="lg:w-[45%] hidden lg:flex flex-col justify-center p-24 bg-brand-maroon text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        <div className="relative z-10">
          <h3 className="text-4xl font-black font-lexend tracking-tighter mb-12 uppercase">
            Join the <br />
            <span className="text-brand-mint">Research Matrix</span>
          </h3>
          <div className="space-y-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                  <CheckCircle2 size={20} className="text-brand-mint" />
                </div>
                <span className="text-lg font-bold uppercase tracking-wide">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;