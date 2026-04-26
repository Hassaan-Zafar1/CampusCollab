import React from 'react';
import { LayoutDashboard, Users, FolderOpen, ClipboardList, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export type AdminTab = 'overview' | 'users' | 'projects' | 'applications';

interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminName: string;
  onLogout: () => void;
}

const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'users',         label: 'Users',          icon: Users },
  { id: 'projects',      label: 'Projects',       icon: FolderOpen },
  { id: 'applications',  label: 'Applications',   icon: ClipboardList },
];

const AdminSidebar: React.FC<Props> = ({ activeTab, onTabChange, adminName, onLogout }) => (
  <aside className="w-64 min-h-screen bg-[#1a0a0a] flex flex-col shrink-0">
    {/* Logo */}
    <div className="px-6 py-8 border-b border-white/5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-[#800000] flex items-center justify-center">
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black text-sm tracking-tight uppercase font-lexend">CampusCollab</p>
          <p className="text-[#800000] text-[9px] font-black uppercase tracking-[0.3em]">Admin Panel</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-4 py-6 space-y-1">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all relative ${
            activeTab === id
              ? 'bg-[#800000] text-white shadow-lg shadow-[#800000]/30'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          {activeTab === id && (
            <motion.div layoutId="adminTab" className="absolute inset-0 bg-[#800000] rounded-xl -z-10" />
          )}
          <Icon size={16} />
          {label}
        </button>
      ))}
    </nav>

    {/* Admin info + logout */}
    <div className="px-4 py-6 border-t border-white/5">
      <div className="px-4 py-3 rounded-xl bg-white/5 mb-3">
        <p className="text-white/30 text-[8px] uppercase tracking-widest font-bold mb-0.5">Logged in as</p>
        <p className="text-white text-xs font-black truncate">{adminName}</p>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </aside>
);

export default AdminSidebar;
