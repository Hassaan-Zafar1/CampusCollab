import React, { useEffect, useState } from 'react';
import { Users, FolderOpen, ClipboardList, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardStats, getRecentActivity } from '../../services/adminService';

const StatCard: React.FC<{ label: string; value: number; sub?: string; color: string; icon: React.ElementType }> = 
  ({ label, value, sub, color, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="bg-[#1a0a0a] border border-white/5 rounded-2xl p-6 flex items-start gap-4"
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mb-1">{label}</p>
      <p className="text-white text-3xl font-black">{value.toLocaleString()}</p>
      {sub && <p className="text-white/30 text-[10px] mt-1">{sub}</p>}
    </div>
  </motion.div>
);

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const map: Record<string, string> = {
    student: 'bg-blue-500/20 text-blue-300',
    professor: 'bg-purple-500/20 text-purple-300',
    admin: 'bg-[#800000]/40 text-red-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${map[role] || 'bg-white/10 text-white/60'}`}>
      {role}
    </span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    open: 'bg-emerald-500/20 text-emerald-300',
    'in-progress': 'bg-blue-500/20 text-blue-300',
    closed: 'bg-white/10 text-white/40',
    pending: 'bg-amber-500/20 text-amber-300',
    approved: 'bg-emerald-500/20 text-emerald-300',
    rejected: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${map[status] || 'bg-white/10 text-white/40'}`}>
      {status}
    </span>
  );
};

export { RoleBadge, StatusBadge };

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentActivity()])
      .then(([s, a]) => { setStats(s.stats); setActivity(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader size={32} className="text-[#800000] animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-1">Platform Overview</h2>
        <p className="text-white/30 text-xs uppercase tracking-widest">Live statistics across all collections</p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats?.users?.total ?? 0} sub={`${stats?.users?.students ?? 0} students · ${stats?.users?.professors ?? 0} professors`} color="bg-[#800000]" icon={Users} />
        <StatCard label="Total Projects" value={stats?.projects?.total ?? 0} sub={`${stats?.projects?.open ?? 0} open`} color="bg-indigo-600" icon={FolderOpen} />
        <StatCard label="Applications" value={stats?.applications?.total ?? 0} sub={`${stats?.applications?.pending ?? 0} pending`} color="bg-amber-600" icon={ClipboardList} />
        <StatCard label="Approved" value={stats?.applications?.approved ?? 0} sub={`${stats?.applications?.rejected ?? 0} rejected`} color="bg-emerald-700" icon={CheckCircle} />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-[#1a0a0a] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={14} className="text-[#800000]" />
            <h3 className="text-white text-xs font-black uppercase tracking-widest">Recent Users</h3>
          </div>
          <div className="space-y-3">
            {activity?.recentUsers?.map((u: any) => (
              <div key={u._id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#800000]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#800000] text-xs font-black">{u.name?.[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold truncate">{u.name}</p>
                    <p className="text-white/30 text-[10px] truncate">{u.email}</p>
                  </div>
                </div>
                <RoleBadge role={u.role} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-[#1a0a0a] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={14} className="text-[#800000]" />
            <h3 className="text-white text-xs font-black uppercase tracking-widest">Recent Projects</h3>
          </div>
          <div className="space-y-3">
            {activity?.recentProjects?.map((p: any) => (
              <div key={p._id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-xs font-bold truncate">{p.title}</p>
                  <p className="text-white/30 text-[10px] truncate">{p.department}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
