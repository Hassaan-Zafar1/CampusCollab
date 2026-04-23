import React, { useState, useRef } from 'react';
import { 
  User, 
  ShieldCheck, 
  Layout, 
  Bell, 
  Settings, 
  Trash2, 
  Upload,
  CheckCircle2,
  BrainCircuit,
  Cpu,
  Layers,
  Globe,
  Microscope,
  Edit3,
  Sparkles,
  Github,
  Linkedin,
  Link2,
  ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';

interface ProfileMenuProps {
  user: {
    name: string;
    email: string;
    role: string;
    department: string;
  };
  selectedInterests?: string[];
  onInterestsChange?: (interests: string[]) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showInterests?: boolean;
  userLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  externalProfileImg?: string | null;
  onImageChange?: (img: string | null) => void;
}

const INTERESTS_OPTIONS = [
  { id: 'AI', label: 'AI & ML', icon: BrainCircuit },
  { id: 'MERN', label: 'MERN Stack', icon: Layers },
  { id: 'IoT', label: 'IoT & Robotics', icon: Cpu },
  { id: 'Civil', label: 'Civil Eng.', icon: Microscope },
  { id: 'Cloud', label: 'Cloud Computing', icon: Globe },
];

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user, 
  selectedInterests = [], 
  onInterestsChange,
  activeTab,
  onTabChange,
  showInterests = true,
  userLinks,
  externalProfileImg,
  onImageChange,
}) => {
  const { theme, styles } = useTheme();
  
  // Consolidate links from both props and user object
  const links = {
    github: userLinks?.github || (user as any).github || "",
    linkedin: userLinks?.linkedin || (user as any).linkedin || "",
    website: userLinks?.website || (user as any).portfolio || ""
  };

  const formatUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith('http') ? url : `https://${url}`;
  };
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [isHoveredAvatar, setIsHoveredAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImg(base64);
        if (onImageChange) onImageChange(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImg(null);
    if (onImageChange) onImageChange(null);
  };

  const displayImg = externalProfileImg || profileImg;

  const toggleInterest = (id: string) => {
    if (onInterestsChange) {
      if (selectedInterests.includes(id)) {
        onInterestsChange(selectedInterests.filter(i => i !== id));
      } else {
        onInterestsChange([...selectedInterests, id]);
      }
    }
  };

  return (
    <aside className="w-full lg:w-80 lg:sticky lg:top-28 space-y-6 shrink-0 z-30">
      {/* IDENTITY NODE CARD */}
      <div className={`rounded-[40px] p-8 border-2 transition-all duration-500 overflow-hidden relative shadow-card ${theme === 'light' ? 'bg-white border-brand-maroon/10' : 'bg-brand-darkElevated border-white/10'}`}>
        <div className="absolute top-0 left-0 w-full h-24 bg-brand-maroon transition-colors duration-500 shadow-inner"></div>
        
        <div className="relative w-32 h-32 mx-auto mb-6 mt-4 group">
          <div 
            className={`w-full h-full rounded-[42px] border-4 flex items-center justify-center overflow-hidden transition-all duration-500 ${theme === 'light' ? 'bg-brand-cream border-white' : 'bg-brand-darkBase border-brand-darkElevated'} shadow-xl relative`}
            onMouseEnter={() => setIsHoveredAvatar(true)}
            onMouseLeave={() => setIsHoveredAvatar(false)}
          >
            {displayImg ? (
              <img src={displayImg} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={56} className={theme === 'light' ? 'text-brand-maroon/40' : 'text-white/20'} />
            )}

            <AnimatePresence>
              {isHoveredAvatar && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-brand-maroon/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2"
                >
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-white/20 hover:bg-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105"
                  >
                    <Upload size={14} />
                    <span>{profileImg ? 'Change' : 'Upload'}</span>
                  </button>
                  {displayImg && (
                    <button 
                      onClick={handleRemoveImage}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-brand-maroonBright hover:bg-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          
          <div className="absolute -bottom-1 -right-1 bg-brand-mint text-brand-charcoal p-2 rounded-2xl border-4 border-white dark:border-brand-darkElevated shadow-glow">
            <ShieldCheck size={16} />
          </div>
        </div>
        
        <div className="text-center relative z-10 mb-8">
          <h3 className={`text-2xl font-black tracking-tighter uppercase font-lexend transition-colors ${styles.colors.text}`}>
            {user?.name}
          </h3>
          <p className={`text-[12px] font-black uppercase tracking-[0.2em] mb-4 ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
            {user?.department || "Computer Science"}
          </p>
          
          {/* FLOWCHART ELLIPSE STYLE ROLE BADGE */}
          <div className="inline-flex items-center px-6 py-2 bg-brand-maroon/5 dark:bg-brand-maroonBright/10 border border-brand-maroon/10 dark:border-brand-maroonBright/20 rounded-full mb-6">
             <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-brand-maroon' : 'text-brand-maroonBright'}`}>
                {user?.role}
             </span>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-4">
            <a 
              href={formatUrl(links.github) || "https://github.com"} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                theme === 'light' 
                  ? 'bg-brand-maroon/5 border-brand-maroon/10 text-brand-maroon hover:bg-brand-maroon hover:text-white' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-brand-maroonBright hover:text-white'
              }`}
              title="GitHub Matrix"
            >
              <Github size={18} />
            </a>
            <a 
              href={formatUrl(links.linkedin) || "https://linkedin.com"} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                theme === 'light' 
                  ? 'bg-brand-maroon/5 border-brand-maroon/10 text-brand-maroon hover:bg-brand-maroon hover:text-white' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-brand-maroonBright hover:text-white'
              }`}
              title="LinkedIn Connection"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href={formatUrl(links.website) || "https://portfolio.me"} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                theme === 'light' 
                  ? 'bg-brand-maroon/5 border-brand-maroon/10 text-brand-maroon hover:bg-brand-maroon hover:text-white' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-brand-maroonBright hover:text-white'
              }`}
              title="Research Portfolio"
            >
              <Globe size={18} />
            </a>
          </div>
        </div>
        
        <div className="space-y-2 relative z-10">
          {[
            { id: 'feed', icon: Layout, label: "Research Feed" },
            user.role === 'student' && { id: 'applications', icon: ClipboardCheck, label: "My Applications" },
            { id: 'alerts', icon: Bell, label: "Alerts Terminal" },
            { id: 'edit', icon: Edit3, label: "Edit Profile" }
          ].filter(Boolean).map((item: any) => (
            <button 
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-brand-maroon text-white shadow-lg shadow-brand-maroon/30 scale-[1.02]' 
                : `${styles.colors.textMuted} hover:bg-brand-maroon/5 dark:hover:bg-white/5 hover:text-brand-maroon dark:hover:text-brand-maroonBright`
              }`}
            >
              <div className="flex items-center space-x-4">
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
              {activeTab === item.id && <CheckCircle2 size={14} className="text-brand-mint" />}
            </button>
          ))}
        </div>
      </div>

      {/* INTERESTS MATRIX CARD */}
      {showInterests && (
        <div className={`rounded-[40px] pb-10 border-2 transition-all duration-500 overflow-hidden shadow-card relative ${theme === 'light' ? 'bg-white border-brand-maroon/10' : 'bg-brand-darkElevated border-white/10'}`}>
          <div className="absolute top-0 left-0 w-full h-16 bg-brand-maroon transition-colors duration-500 shadow-inner flex items-center px-8">
            <Sparkles size={16} className="text-brand-mint mr-3" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
              Interest Priority
            </h4>
            <div className="ml-auto w-2 h-2 rounded-full bg-brand-mint animate-pulse"></div>
          </div>

          <div className="pt-20 px-8">
            <p className={`text-[10px] font-bold leading-relaxed mb-8 ${styles.colors.textMuted} uppercase tracking-tight`}>
              Select research nodes to prioritize in your matrix feed. High priority nodes sync faster.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {INTERESTS_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all duration-300 active:scale-95 ${
                      isSelected
                      ? 'bg-brand-maroon border-brand-maroon text-white shadow-lg shadow-brand-maroon/20 scale-105'
                      : `bg-transparent ${theme === 'light' ? 'border-brand-maroon/10 text-brand-maroon/40 hover:border-brand-maroon/30 hover:text-brand-maroon' : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white'}`
                    }`}
                  >
                    <interest.icon size={14} />
                    <span>{interest.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-brand-maroon/5 dark:border-white/5 flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30">Algorithm Active</span>
              <div className="flex space-x-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-brand-maroon/20"></div>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ProfileMenu;