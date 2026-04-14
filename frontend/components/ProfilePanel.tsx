import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Layout, BookOpen, PieChart, Bell, Settings } from 'lucide-react';

const ProfilePanel: React.FC = () => {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  useEffect(() => {
    // Listen for custom userUpdated event (same-tab login)
    const handleUserUpdate = (e: CustomEvent) => {
      setUser(e.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    return () => window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
  }, []);

  return (
    <aside className="w-full lg:w-80 lg:sticky lg:top-32 space-y-6 shrink-0 transition-colors duration-500">
      <div className="bg-white dark:bg-[#121212] rounded-3xl p-8 border border-brand-maroon/5 dark:border-brand-maroon/30 shadow-soft text-center overflow-hidden relative transition-all">
        <div className="absolute top-0 left-0 w-full h-24 bg-brand-maroon/5 dark:bg-brand-maroon/20"></div>
        <div className="relative w-24 h-24 mx-auto mb-6 mt-4">
          <div className="w-full h-full rounded-[32px] bg-brand-cream dark:bg-[#080808] border-2 border-white dark:border-brand-maroon/20 flex items-center justify-center text-brand-maroon dark:text-white shadow-sm">
            <User size={40} />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-brand-mint text-brand-charcoal p-2 rounded-xl border-4 border-white dark:border-[#121212] shadow-lg">
            <ShieldCheck size={14} />
          </div>
        </div>
        
        {/* Display the Dynamic Name */}
        <h3 className="text-xl font-black text-brand-charcoal dark:text-white mb-1 font-lexend transition-colors">
          {user.name || "Guest Node"}
        </h3>
        {/* Display Dynamic Department/Role */}
        <p className="text-[10px] font-black text-brand-charcoal/40 dark:text-white/30 uppercase tracking-[0.2em] mb-8 transition-colors">
          {user.department || "General"} Node • {user.role || "Member"}
        </p>
        
        <div className="space-y-2">
          {[
            { icon: Layout, label: "Feed", active: true },
            { icon: BookOpen, label: "My Research" },
            { icon: PieChart, label: "Metrics" },
            { icon: Bell, label: "Alerts" },
            { icon: Settings, label: "Config" }
          ].map((item, idx) => (
            <button 
              key={idx}
              className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                item.active 
                ? 'bg-brand-maroon text-white shadow-lg shadow-brand-maroon/20' 
                : 'text-brand-charcoal/50 dark:text-white/50 hover:bg-brand-cream dark:hover:bg-brand-maroon/10 hover:text-brand-maroon'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-brand-charcoal dark:bg-black text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden group border border-transparent dark:border-brand-maroon/30 transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-maroon/10 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Node Health</h4>
        <div className="text-5xl font-black mb-6 font-lexend tracking-tighter">98.2<span className="text-brand-mint text-xl">%</span></div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-brand-mint w-[98%] shadow-[0_0_15px_rgba(167,215,197,0.5)]"></div>
        </div>
        <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed tracking-widest italic">
          High-tier researcher authentication verified. Access to specialized labs unlocked.
        </p>
      </div>
    </aside>
  );
};

export default ProfilePanel;