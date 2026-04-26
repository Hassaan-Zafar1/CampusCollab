import React, { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, Loader, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProjectsAdmin, deleteProjectAdmin } from '../../services/adminService';
import { StatusBadge } from './AdminOverview';

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllProjectsAdmin({ search: search || undefined, status: statusFilter !== 'all' ? statusFilter : undefined, page, limit: 12 });
      setProjects(data.projects);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async (project: any) => {
    setDeleteLoading(project._id);
    try {
      await deleteProjectAdmin(project._id);
      setConfirmDelete(null);
      fetchProjects();
    } catch (e: any) { alert(e); }
    finally { setDeleteLoading(''); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-1">Project Management</h2>
        <p className="text-white/30 text-xs uppercase tracking-widest">{total} projects in the system</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search title, department, category..."
            className="w-full pl-10 pr-4 py-3 bg-[#1a0a0a] border border-white/5 rounded-xl text-white text-xs font-medium outline-none focus:border-[#800000]/50 placeholder-white/20 transition-colors" />
        </div>
        {['all', 'open', 'in-progress', 'closed'].map(s => (
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
                {['Title', 'Supervisor', 'Department', 'Category', 'Status', 'Interns', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white text-xs font-bold max-w-[200px] truncate">{p.title}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white/70 text-xs">{p.supervisor?.name || '—'}</p>
                    <p className="text-white/30 text-[10px]">{p.supervisor?.email}</p>
                  </td>
                  <td className="px-5 py-4 text-white/50 text-xs">{p.department}</td>
                  <td className="px-5 py-4 text-white/50 text-xs">{p.category}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4 text-white/50 text-xs text-center">{p.currentInterns?.length ?? 0} / {p.maxInterns}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setConfirmDelete(p)}
                      className="p-2 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-white/20 text-xs uppercase tracking-widest">No projects found</td></tr>
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

      {/* Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a0a0a] border border-white/10 rounded-2xl p-8 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-5">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Delete Project?</h3>
              <p className="text-white/50 text-sm mb-1"><span className="text-white font-bold">{confirmDelete.title}</span></p>
              <p className="text-white/30 text-xs mb-6">This will permanently delete the project and all linked applications.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button onClick={() => handleDelete(confirmDelete)} disabled={deleteLoading === confirmDelete._id}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  {deleteLoading === confirmDelete._id ? <Loader size={14} className="animate-spin" /> : null}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjects;
