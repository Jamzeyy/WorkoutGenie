import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Trash2, Shield, Dumbbell, Calendar, AlertCircle, RefreshCw, AlertTriangle, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminApi, feedbackApi, FeedbackReport } from '../api';
import { AdminUser } from '../types';
import Button from '../components/Button';

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [feedbackReports, setFeedbackReports] = useState<FeedbackReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    loadUsers();
    loadFeedbackReports();
  }, [user, navigate]);

  async function loadFeedbackReports() {
    try {
      const reports = await feedbackApi.getAll();
      setFeedbackReports(reports);
    } catch (err) {
      console.error('Failed to load feedback reports:', err);
    }
  }

  async function handleResolveReport(id: number) {
    try {
      await feedbackApi.updateStatus(id, 'resolved');
      setFeedbackReports(feedbackReports.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
    } catch (err) {
      console.error('Failed to resolve report:', err);
    }
  }

  async function handleDismissReport(id: number) {
    try {
      await feedbackApi.updateStatus(id, 'dismissed');
      setFeedbackReports(feedbackReports.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to dismiss report:', err);
    }
  }

  async function loadUsers(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load users';
      console.error('[Admin] Load users error:', message);
      
      // Only logout on actual token issues, not on permission issues
      if (message.toLowerCase().includes('invalid') && message.toLowerCase().includes('token')) {
        logout();
        navigate('/auth');
        return;
      }
      
      // For "Admin access required" (403) - show error but don't logout
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRefresh() {
    await loadUsers(true);
  }

  async function handleDelete(userId: number) {
    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (!user?.is_admin) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-white">Admin Dashboard</h1>
              <p className="text-dark-400">Manage users and view statistics</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 bg-dark-700 hover:bg-dark-600 rounded-xl transition-colors disabled:opacity-50"
            title="Refresh users"
          >
            <RefreshCw className={`w-5 h-5 text-dark-300 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-genie-400" />
              <span className="text-dark-400 text-sm">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{users.length}</p>
          </div>
          <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-dark-400 text-sm">Admins</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{users.filter(u => u.is_admin).length}</p>
          </div>
          <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <span className="text-dark-400 text-sm">Total Workouts</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{users.reduce((sum, u) => sum + u.workout_count, 0)}</p>
          </div>
          <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-dark-400 text-sm">Total Plans</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{users.reduce((sum, u) => sum + u.plan_count, 0)}</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Feedback Reports */}
        {feedbackReports.filter(r => r.status === 'pending').length > 0 && (
          <div className="bg-dark-800/50 backdrop-blur border border-yellow-500/30 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-dark-700 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Video Reports</h2>
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                {feedbackReports.filter(r => r.status === 'pending').length} pending
              </span>
            </div>
            <div className="divide-y divide-dark-700">
              {feedbackReports.filter(r => r.status === 'pending').map((report) => (
                <div key={report.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium">{report.exercise_name}</p>
                    <p className="text-dark-400 text-sm">
                      {report.issue_type === 'video_private' && '🔒 Video is Private'}
                      {report.issue_type === 'video_wrong' && '❌ Wrong Exercise'}
                      {report.issue_type === 'video_broken' && '⚠️ Video Not Loading'}
                      {report.issue_type === 'other' && '📝 Other Issue'}
                      {report.message && ` - ${report.message}`}
                    </p>
                    <p className="text-dark-500 text-xs mt-1">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolveReport(report.id)}
                      className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                      title="Mark as resolved"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDismissReport(report.id)}
                      className="p-2 bg-dark-600 hover:bg-dark-500 text-dark-300 rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-dark-700">
            <h2 className="text-lg font-semibold text-white">All Users</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-dark-400">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left p-4 text-dark-400 font-medium text-sm">User</th>
                    <th className="text-left p-4 text-dark-400 font-medium text-sm hidden md:table-cell">Email</th>
                    <th className="text-center p-4 text-dark-400 font-medium text-sm">Role</th>
                    <th className="text-center p-4 text-dark-400 font-medium text-sm hidden sm:table-cell">Workouts</th>
                    <th className="text-center p-4 text-dark-400 font-medium text-sm hidden sm:table-cell">Plans</th>
                    <th className="text-left p-4 text-dark-400 font-medium text-sm hidden lg:table-cell">Joined</th>
                    <th className="text-right p-4 text-dark-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-dark-700/50 hover:bg-dark-700/30">
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{u.name || 'Unnamed'}</p>
                          <p className="text-dark-400 text-sm md:hidden">{u.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-dark-300 hidden md:table-cell">{u.email}</td>
                      <td className="p-4 text-center">
                        {u.is_admin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-dark-600 text-dark-300 rounded-full text-xs font-medium">
                            User
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center text-dark-300 hidden sm:table-cell">{u.workout_count}</td>
                      <td className="p-4 text-center text-dark-300 hidden sm:table-cell">{u.plan_count}</td>
                      <td className="p-4 text-dark-400 text-sm hidden lg:table-cell">{formatDate(u.created_at)}</td>
                      <td className="p-4 text-right">
                        {u.id === user?.id ? (
                          <span className="text-dark-500 text-sm">You</span>
                        ) : deleteConfirm === u.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-dark-600 text-dark-300 text-sm rounded-lg hover:bg-dark-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(u.id)}
                            className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
