import { useEffect, useState, useMemo } from 'react';
import {
  getAllProjects,
  getProjectById,
  getProjectsByCategory,
  getProjectsByDepartment,
  getProjectStats,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
  applyToProject
} from './projectService';

export interface GetProjectsParams {
  department?: string;
  category?: string;
  skills?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Memoized params to avoid unnecessary re-fetches
export const useProjects = (params?: GetProjectsParams) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0 });

  // Memoize params to avoid unnecessary re-fetches
  const memoizedParams = useMemo(() => {
    return {
      department: params?.department || undefined,
      category: params?.category || undefined,
      skills: params?.skills || undefined,
      status: params?.status || undefined,
      search: params?.search || undefined,
      page: params?.page || 1,
      limit: params?.limit || 10
    };
  }, [
    params?.department,
    params?.category,
    params?.skills,
    params?.status,
    params?.search,
    params?.page,
    params?.limit
  ]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllProjects(memoizedParams);
        setProjects(data.projects || []);
        setPagination({ 
          total: data.total || 0, 
          page: data.page || 1, 
          pages: data.pages || 1 
        });
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(typeof err === 'string' ? err : 'Failed to fetch projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [memoizedParams]);

  return { projects, loading, error, pagination };
};

export const useSingleProject = (id: string) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProject(null);
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectById(id);
        setProject(data.project || null);
      } catch (err: any) {
        setError(typeof err === 'string' ? err : 'Failed to fetch project');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
};

export const useMyProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProjects();
      setProjects(data.projects || []);
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  return { projects, loading, error, refetch: fetchMyProjects };
};

export const useProjectStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectStats();
        setStats(data.stats || null);
      } catch (err: any) {
        setError(typeof err === 'string' ? err : 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
};

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const create = async (payload: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await createProject(payload);
      setSuccess(true);
      return data.project;
    } catch (err: any) {
      const errorMsg = typeof err === 'string' ? err : 'Failed to create project';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error, success };
};

export const useApplyProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await applyToProject(projectId);
      return data;
    } catch (err: any) {
      const errorMsg = typeof err === 'string' ? err : 'Failed to apply to project';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { apply, loading, error };
};