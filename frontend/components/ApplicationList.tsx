import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface ApplicationListProps {
  applications: any[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications, loading, onDelete }) => {
  const { styles, theme } = useTheme();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          label: 'Accepted'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          label: 'Rejected'
        };
      default:
        return {
          icon: Clock,
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          label: 'Pending'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin"></div>
        <p className={`mt-4 text-xs font-black uppercase tracking-widest ${styles.colors.textMuted}`}>Syncing Applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className={`text-center py-20 px-8 rounded-[40px] border-2 border-dashed ${styles.colors.border}`}>
        <FileText size={48} className={`mx-auto mb-4 opacity-20 ${styles.colors.text}`} />
        <p className={`text-base font-bold ${styles.colors.text}`}>No active applications found.</p>
        <p className={`text-xs font-black uppercase tracking-widest mt-2 ${styles.colors.textMuted}`}>Your research journey starts with a single application.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((app, index) => {
        const status = getStatusConfig(app.status);
        const StatusIcon = status.icon;

        return (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-[32px] border-2 transition-all hover:shadow-xl ${
              theme === 'light' ? 'bg-white border-brand-maroon/5' : 'bg-brand-darkElevated border-white/5'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${status.bg} ${status.color} border ${status.border}`}>
                  <StatusIcon size={24} />
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${styles.colors.textMuted} flex items-center gap-1`}>
                      <Calendar size={10} />
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className={`text-xl font-black tracking-tight uppercase transition-colors ${styles.colors.text}`}>
                    {app.project?.title || 'Unknown Project'}
                  </h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${styles.colors.textMuted}`}>
                    {app.project?.department} • {app.project?.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:self-center">
                {app.status === 'pending' && (
                  <button
                    onClick={() => onDelete(app._id)}
                    className="p-3 rounded-xl border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                    title="Withdraw Application"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    theme === 'light' 
                    ? 'bg-brand-maroon text-white hover:bg-brand-maroonSoft' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ExternalLink size={14} />
                  View Node
                </button>
              </div>
            </div>

            {app.status === 'rejected' && app.reviewComment && (
              <div className="mt-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60 mb-1">Feedback from Supervisor:</p>
                <p className={`text-sm font-medium ${styles.colors.textMuted}`}>{app.reviewComment}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ApplicationList;
