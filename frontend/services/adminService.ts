import api from '../src/api/axios';

// ── Stats & Activity ───────────────────────────────────────────
export const getDashboardStats = async () => {
  try {
    const res = await api.get('/admin/stats');
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch stats';
  }
};

export const getRecentActivity = async () => {
  try {
    const res = await api.get('/admin/activity');
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch activity';
  }
};

// ── Users ──────────────────────────────────────────────────────
export const getAllUsers = async (params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const res = await api.get('/admin/users', { params });
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch users';
  }
};

export const getUserById = async (id: string) => {
  try {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch user';
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to delete user';
  }
};

export const updateUserRole = async (id: string, role: 'student' | 'professor') => {
  try {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to update role';
  }
};

// ── Projects ───────────────────────────────────────────────────
export const getAllProjectsAdmin = async (params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const res = await api.get('/admin/projects', { params });
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch projects';
  }
};

export const deleteProjectAdmin = async (id: string) => {
  try {
    const res = await api.delete(`/admin/projects/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to delete project';
  }
};

// ── Applications ───────────────────────────────────────────────
export const getAllApplicationsAdmin = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const res = await api.get('/admin/applications', { params });
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch applications';
  }
};
