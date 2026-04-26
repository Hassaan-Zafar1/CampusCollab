import React, { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, ChevronDown, Loader, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, deleteUser, updateUserRole } from '../../services/adminService';
import { RoleBadge } from './AdminOverview';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ search: search || undefined, role: roleFilter !== 'all' ? roleFilter : undefined, page, limit: 12 });
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, roleFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (user: any) => {
    setActionLoading(user._id);
    try {
      await deleteUser(user._id);
      setConfirmDelete(null);
      fetchUsers();
    } catch (e: any) { alert(e); }
    finally { setActionLoading(''); }
  };

  const handleRoleChange = async (id: string, role: 'student' | 'professor') => {
    setActionLoading(id);
    try {
      await updateUserRole(id, role);
      fetchUsers();
    } catch (e: any) { alert(e); }
    finally { setActionLoading(''); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-1">User Management</h2>
        <p className="text-white/30 text-xs uppercase tracking-widest">{total} users registered</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, email, department..."
            className="w-full pl-10 pr-4 py-3 bg-[#1a0a0a] border border-white/5 rounded-xl text-white text-xs font-medium outline-none focus:border-[#800000]/50 placeholder-white/20 transition-colors"
          />
        </div>
        {['all', 'student', 'professor'].map(r => (
          <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-[#800000] text-white' : 'bg-[#1a0a0a] border border-white/5 text-white/40 hover:text-white'}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader size={28} className="text-[#800000] animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">User</th>
                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">Department</th>
                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">Role</th>
                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">Status</th>
                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#800000]/20 flex items-center justify-center shrink-0">
                        {u.profilePicture
                          ? <img src={u.profilePicture} className="w-full h-full rounded-xl object-cover" alt="" />
                          : <span className="text-[#800000] text-sm font-black">{u.name?.[0]}</span>
                        }
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold">{u.name}</p>
                        <p className="text-white/30 text-[10px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/50 text-xs">{u.department || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <RoleBadge role={u.role} />
                      <div className="relative group">
                        <button className="p-1 rounded-lg hover:bg-white/5 text-white/20 hover:text-white/60 transition-all">
                          <ChevronDown size={12} />
                        </button>
                        <div className="absolute left-0 top-full mt-1 bg-[#0d0505] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 hidden group-hover:block min-w-[120px]">
                          {['student', 'professor'].map(r => (
                            <button key={r} onClick={() => handleRoleChange(u._id, r as any)}
                              disabled={actionLoading === u._id}
                              className="w-full px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-[#800000]/20 hover:text-white transition-all flex items-center gap-2">
                              {actionLoading === u._id ? <Loader size={10} className="animate-spin" /> : null}
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.isVerified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {u.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setConfirmDelete(u)}
                      className="p-2 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-white/20 text-xs uppercase tracking-widest">No users found</td></tr>
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

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a0a0a] border border-white/10 rounded-2xl p-8 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-5">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Delete User?</h3>
              <p className="text-white/50 text-sm mb-1"><span className="text-white font-bold">{confirmDelete.name}</span></p>
              <p className="text-white/30 text-xs mb-6">This will permanently delete the user and all their associated data.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button onClick={() => handleDelete(confirmDelete)} disabled={actionLoading === confirmDelete._id}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  {actionLoading === confirmDelete._id ? <Loader size={14} className="animate-spin" /> : null}
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

export default AdminUsers;
