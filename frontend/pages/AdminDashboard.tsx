import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar, { AdminTab } from '../components/admin/AdminSidebar';
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminProjects from '../components/admin/AdminProjects';
import AdminApplications from '../components/admin/AdminApplications';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':     return <AdminOverview />;
      case 'users':        return <AdminUsers />;
      case 'projects':     return <AdminProjects />;
      case 'applications': return <AdminApplications />;
      default:             return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d0505]">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        adminName={user.name || 'Admin'}
        onLogout={onLogout}
      />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0d0505]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-black">CampusCollab</p>
            <p className="text-white text-sm font-black uppercase tracking-tight capitalize">{activeTab}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/30 text-[10px] uppercase tracking-widest font-black">Live</span>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
