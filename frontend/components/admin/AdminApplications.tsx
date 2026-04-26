import React, { useEffect, useState, useCallback } from 'react';
import { Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllApplicationsAdmin } from '../../services/adminService';
import { StatusBadge } from './AdminOverview';

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllApplicationsAdmin({ status: statusFilter !== 'all' ? statusFilter : undefined, page, limit: 12 });
      setApplications(data.applications);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-1">Application Management</h2>
        <p className="text-white/30 text-xs uppercase tracking-widest">{total} total applications</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-3">
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-[#800000] text-white' : 'bg-[#1a0a0a] border border-white/5 text-white/40 hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader size={28} className="text-[#800000] animate-spin" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Student', 'Project', 'Department', 'Status', 'Reviewed By', 'Applied On'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white text-xs font-bold">{app.student?.name || '—'}</p>
                    <p className="text-white/30 text-[10px]">{app.student?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white/70 text-xs max-w-[180px] truncate">{app.project?.title || '—'}</p>
                    <p className="text-white/30 text-[10px]">{app.project?.category}</p>
                  </td>
                  <td className="px-5 py-4 text-white/50 text-xs">{app.project?.department || '—'}</td>
                  <td className="px-5 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-5 py-4 text-white/40 text-xs">{app.reviewedBy?.name || '—'}</td>
                  <td className="px-5 py-4 text-white/40 text-[10px]">
                    {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </motion.tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-white/20 text-xs uppercase tracking-widest">No applications found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
            className="p-2 rounded-xl bg-[#1a0a0a] border border-white/5 text-white/40 hover:text-white disabled:opacity-30 transition-all">
            <ChevronLeft size={16} />
          </button>
          <span className="text-white/40 text-xs font-black uppercase tracking-widest">Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page===pages}
            className="p-2 rounded-xl bg-[#1a0a0a] border border-white/5 text-white/40 hover:text-white disabled:opacity-30 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
