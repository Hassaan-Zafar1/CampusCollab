import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, FileText, Upload, Lock, Save, User, Plus, 
  Globe, ShieldCheck, Sparkles, Cpu, Link2, X, ChevronDown 
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface EditProfileFormProps {
  profileImg?: string | null;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profileImg }) => {
  const { styles, theme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  const [storedUser, setStoredUser] = useState<any>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : {};
  });

  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    department: storedUser.department || "",
    github: storedUser.github || "",
    linkedin: storedUser.linkedin || "",
    portfolio: storedUser.portfolio || "",
    skills: storedUser.skills || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Listen for custom userUpdated event (same-tab login)
  useEffect(() => {
    const handleUserUpdate = (e: CustomEvent) => {
      setStoredUser(e.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    return () => window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
  }, []);

  // Update formData when storedUser changes
  useEffect(() => {
    setFormData({
      name: storedUser.name || "",
      department: storedUser.department || "",
      github: storedUser.github || "",
      linkedin: storedUser.linkedin || "",
      portfolio: storedUser.portfolio || "",
      skills: storedUser.skills || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  }, [storedUser]);

  const [existingCv, setExistingCv] = useState<string | null>(storedUser.cvUrl || null);
  const [newCvFile, setNewCvFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    storedUser.skills ? (Array.isArray(storedUser.skills) ? storedUser.skills : storedUser.skills.split(',').map((s: string) => s.trim())) : []
  );
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);

  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);

  const handleConfirmPasswordChange = (value: string) => {
    setFormData({ ...formData, confirmPassword: value });
    setDoPasswordsMatch(value === formData.newPassword);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCvFile(e.target.files[0]);
      setExistingCv(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert("New passwords do not match!");
        return;
      }
      if (!formData.currentPassword) {
        alert("Please enter your current password to make security changes.");
        return;
      }
    }

    setLoading(true);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('token') || currentUser.token || '') 
        },
        body: JSON.stringify({
          ...formData,
          profilePicture: profileImg
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile Synced to Node Matrix!");
        window.location.reload(); 
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Connection to backend lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <span className={`text-[11px] font-black uppercase tracking-[0.4em] block ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
            Identity Configuration
          </span>
          <div className={`h-px flex-grow ${theme === 'light' ? 'bg-brand-maroon/10' : 'bg-brand-maroonBright/20'}`}></div>
        </div>
        <h2 className={`text-4xl lg:text-5xl font-black tracking-tighter uppercase font-lexend transition-colors ${styles.colors.text}`}>
          Edit <span className={theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}>Profile.</span>
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        
 {/* COMPACT PERSONAL INFORMATION CARD */}
<motion.div 
  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
  className={`rounded-[32px] border-2 transition-all duration-500 overflow-hidden shadow-xl relative ${theme === 'light' ? 'bg-[#FCFAFA] border-brand-maroon/20' : 'bg-brand-darkElevated border-white/5'}`}
>
  {/* Compact Header */}
  <div className="bg-brand-maroon px-8 py-4 flex items-center justify-between shadow-md">
    <div className="flex items-center space-x-3 text-white">
      <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
        <User size={18} />
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Personal Information</h3>
    </div>
    <Sparkles size={16} className="text-brand-mint/60" />
  </div>

  <div className="p-8 space-y-6">
    
    {/* IDENTITY GRID: Tightened Gaps */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { id: 'name', label: 'Full Display Name', icon: User, value: formData.name },
        { id: 'department', label: 'Department Name', icon: Cpu, value: formData.department }
      ].map((field) => (
        <div key={field.id} className="group">
          <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
            {field.label}
          </label>
          <div className="relative">
            <field.icon className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${theme === 'light' ? 'text-brand-maroon/40' : 'text-white/30'} group-focus-within:text-brand-maroon`} size={16} />
            <input 
              type="text" 
              value={field.value}
              onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
              className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none border-2 font-bold text-sm transition-all shadow-sm
                ${theme === 'light' 
                  ? 'bg-white border-brand-maroon focus:bg-[#FFFBF5] focus:shadow-inner' 
                  : 'bg-brand-darkBase border-brand-maroon focus:bg-brand-maroon/5'}`}
              placeholder={`Enter ${field.label}...`}
            />
          </div>
        </div>
      ))}

      {/* COMPACT SKILLS BOX: Indeed-style Tags */}
      <div className="md:col-span-2 group">
        <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
          Skills & Expertise Node
        </label>
        <div className={`w-full min-h-[100px] p-5 rounded-2xl border-2 transition-all shadow-sm
          ${theme === 'light' 
            ? 'bg-white border-brand-maroon focus-within:bg-[#FFFBF5]' 
            : 'bg-brand-darkBase border-brand-maroon focus-within:bg-brand-maroon/5'}`}>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.map((skill, index) => (
              <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-brand-maroon text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md hover:bg-brand-maroonBright transition-colors">
                {skill}
                <button type="button" onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))} className="hover:text-brand-mint">
                  <X size={12} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
          <div className="relative flex items-center">
            <Plus className="text-brand-maroon opacity-40 mr-2" size={14} />
            <input 
              placeholder="Add skill (Enter)..." 
              className="w-full bg-transparent outline-none font-bold text-xs py-1 border-b border-brand-maroon/20 focus:border-brand-maroon transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  e.preventDefault();
                  if (!selectedSkills.includes(e.currentTarget.value)) {
                    setSelectedSkills([...selectedSkills, e.currentTarget.value]);
                  }
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* COMPACT LINKS: Logos & Names Bolded */}
    <div className="pt-6 border-t border-brand-maroon/10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { id: 'github', label: 'GITHUB', icon: Github, color: '#181717', value: formData.github },
        { id: 'linkedin', label: 'LINKEDIN', icon: Linkedin, color: '#0077B5', value: formData.linkedin },
        { id: 'portfolio', label: 'PORTFOLIO', icon: Globe, color: '#800000', value: formData.portfolio }
      ].map((link) => (
        <div key={link.id} className="group">
          <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter mb-2`} style={{ color: link.color }}>
            <link.icon size={14} /> <span>{link.label}</span>
          </label>
          <input 
            type="url" 
            value={link.value}
            onChange={(e) => setFormData({...formData, [link.id]: e.target.value})}
            placeholder={`${link.id}.com/in/...`}
            className={`w-full px-4 py-2.5 rounded-xl outline-none border-2 font-black text-[10px] shadow-sm transition-all
              ${theme === 'light' ? 'bg-white border-brand-maroon focus:bg-[#FFFBF5]' : 'bg-brand-darkBase border-brand-maroon'}`}
            style={{ color: link.color } as any}
          />
        </div>
      ))}
    </div>
  </div>
</motion.div>

        {/* CARD 3: UPLOAD RESUME */}
<motion.div 
  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
  className={`rounded-[32px] border-2 transition-all duration-500 overflow-hidden shadow-xl relative ${theme === 'light' ? 'bg-[#FCFAFA] border-brand-maroon/20' : 'bg-brand-darkElevated border-white/5'}`}
>
  {/* Themed Red Header bar */}
  <div className="bg-brand-maroon px-8 py-4 flex items-center justify-between shadow-md">
    <div className="flex items-center space-x-3 text-white">
      <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
        <FileText size={18} />
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Upload Resume</h3>
    </div>
    <Sparkles size={16} className="text-brand-mint/60" />
  </div>

  <div className="p-8">
    {existingCv || newCvFile ? (
      <div className={`flex items-center justify-between p-5 rounded-2xl border-2 shadow-sm ${theme === 'light' ? 'bg-white border-brand-maroon' : 'bg-brand-darkBase border-brand-maroon'}`}>
        <div className="flex items-center space-x-5">
          <div className="w-12 h-12 bg-brand-maroon rounded-xl flex items-center justify-center text-white shadow-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className={`text-sm font-black uppercase tracking-tight ${styles.colors.text}`}>
              {newCvFile ? newCvFile.name : (storedUser.cvName || "Stored_Resume.pdf")}
            </p>
            <p className={`text-[9px] font-bold uppercase tracking-widest opacity-40`}>
              Synced to University Servers
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => {
              const fileUrl = newCvFile ? URL.createObjectURL(newCvFile) : (storedUser.cvUrl || null);
              if (fileUrl) {
                setActivePdfUrl(fileUrl);
                setShowPdfViewer(true);
              } else {
                alert("Resume file path not found in system matrix.");
              }
            }}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-brand-maroon text-white hover:bg-brand-maroonBright' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            View
          </button>
          
          <label className="cursor-pointer px-5 py-2 rounded-xl border-2 border-brand-maroon text-brand-maroon text-[10px] font-black uppercase tracking-widest hover:bg-brand-maroon hover:text-white transition-all">
            Replace
            <input type="file" className="hidden" onChange={handleCvChange} accept=".pdf" />
          </label>
        </div>
      </div>
    ) : (
      <label className={`group flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-500 hover:bg-[#FFFBF5] ${theme === 'light' ? 'bg-white border-brand-maroon' : 'bg-brand-darkBase border-brand-maroon'}`}>
        <input type="file" className="hidden" onChange={handleCvChange} accept=".pdf" />
        <div className="w-14 h-14 rounded-xl bg-brand-maroon text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
          <Upload size={22} />
        </div>
        <span className={`text-xs font-black uppercase tracking-widest ${theme === 'light' ? 'text-brand-maroon' : 'text-white'}`}>
          Upload your updated Resume
        </span>
      </label>
    )}
  </div>
</motion.div>

        {/* CARD 4: CHANGE PASSWORD */}
<motion.div 
  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
  className={`rounded-[32px] border-2 transition-all duration-500 overflow-hidden shadow-xl relative ${theme === 'light' ? 'bg-[#FCFAFA] border-brand-maroon/20' : 'bg-brand-darkElevated border-white/5'}`}
>
  {/* Themed Red Header bar */}
  <div className="bg-brand-maroon px-8 py-4 flex items-center justify-between shadow-md">
    <div className="flex items-center space-x-3 text-white">
      <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
        <Lock size={18} />
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Change Password</h3>
    </div>
    <div className="flex items-center gap-4">
      <button type="button" className="text-[9px] font-black uppercase text-white/70 hover:text-white hover:underline tracking-widest transition-all">
        Forget Access Key?
      </button>
      <ShieldCheck size={18} className="text-brand-mint" />
    </div>
  </div>
  
  <div className="p-8 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Current Password - Validated against Backend */}
      <div className="group">
        <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
          Current Password
        </label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={formData.currentPassword} 
          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} 
          className={`w-full px-6 py-4 rounded-2xl border-2 text-xs font-bold outline-none transition-all ${styles.input} 
            ${formData.currentPassword ? (isPasswordValid ? 'border-green-500 bg-green-50/10' : 'border-red-500 bg-red-50/10') : 'border-brand-maroon'}`} 
        />
      </div>

      {/* New Password */}
      <div className="group">
        <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
          New Password
        </label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={formData.newPassword} 
          onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
          className={`w-full px-6 py-4 rounded-2xl border-2 text-xs font-bold outline-none transition-all ${styles.input} border-brand-maroon focus:bg-[#FFFBF5]`} 
        />
      </div>

      {/* Confirm New Password - Real-time Match Check */}
      <div className="group">
        <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
          Confirm New Password
        </label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={formData.confirmPassword} 
          onChange={(e) => handleConfirmPasswordChange(e.target.value)} 
          className={`w-full px-6 py-4 rounded-2xl border-2 text-xs font-bold outline-none transition-all ${styles.input} 
            ${formData.confirmPassword ? (doPasswordsMatch ? 'border-green-500 bg-green-50/10' : 'border-red-500 bg-red-50/10') : 'border-brand-maroon'}`} 
        />
        {!doPasswordsMatch && formData.confirmPassword && (
          <p className="text-[9px] font-black text-red-500 uppercase mt-2 ml-2 tracking-tighter">Passwords do not match</p>
        )}
      </div>
    </div>
  </div>
</motion.div>

        {/* Final Sync Button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 px-4">
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${styles.colors.textMuted} text-center md:text-left`}>
            Syncing identity will update across all active <br /> university research nodes instantly.
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
                <span>Apply Changes</span>
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-brand-maroon transition-all">
                  <Save size={18} />
                </div>
              </>
            )}
          </button>
        </div>
      </form>
      <AnimatePresence>
        {showPdfViewer && activePdfUrl && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 lg:p-12"
          >
            <div className="w-full max-w-6xl flex justify-between items-center mb-4 text-white">
              <div className="flex items-center gap-3">
                <FileText className="text-brand-maroonBright" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {newCvFile ? newCvFile.name : (storedUser.cvName || "Resume_Preview.pdf")}
                </span>
              </div>
              <button 
                onClick={() => setShowPdfViewer(false)}
                className="p-3 bg-white/10 hover:bg-brand-maroon rounded-full transition-all active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-6xl h-full bg-white rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10"
            >
              <iframe 
                src={`${activePdfUrl}#toolbar=0`} 
                className="w-full h-full border-none"
                title="Resume Preview"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfileForm;