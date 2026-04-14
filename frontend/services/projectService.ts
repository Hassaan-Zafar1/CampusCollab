import api from '../src/api/axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  department: string;
  category: string;
  technologies: string[];
  requiredSkills: string[];
  maxInterns: number;
  status: 'open' | 'in-progress' | 'closed';
  supervisor: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
  currentInterns: any[];
  applicants: any[];
  createdAt: string;
}

interface CreateProjectPayload {
  title: string;
  description: string;
  department: string;
  category: string;
  technologies: string[];
  requiredSkills: string[];
  maxInterns: number;
}

interface UpdateProjectPayload {
  title?: string;
  description?: string;
  department?: string;
  category?: string;
  technologies?: string[];
  requiredSkills?: string[];
  maxInterns?: number;
  status?: 'open' | 'in-progress' | 'closed';
}

interface GetProjectsParams {
  department?: string;
  category?: string;
  skills?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Get all projects with filters
export const getAllProjects = async (params?: GetProjectsParams) => {
  try {
    const response = await api.get('/projects', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch projects';
  }
};

// Get single project by ID
export const getProjectById = async (id: string) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch project';
  }
};

// Get projects by category
export const getProjectsByCategory = async (category: string) => {
  try {
    const response = await api.get(`/projects/category/${category}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch projects by category';
  }
};

// Get projects by department
export const getProjectsByDepartment = async (department: string) => {
  try {
    const response = await api.get(`/projects/department/${department}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch projects by department';
  }
};

// Get project statistics
export const getProjectStats = async () => {
  try {
    const response = await api.get('/projects/stats/overview');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch project statistics';
  }
};

// Create new project (Professor only)
export const createProject = async (payload: CreateProjectPayload) => {
  try {
    const response = await api.post('/projects', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to create project';
  }
};

// Update project (Professor only - owner)
export const updateProject = async (id: string, payload: UpdateProjectPayload) => {
  try {
    const response = await api.put(`/projects/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to update project';
  }
};

// Delete project (Professor only - owner)
export const deleteProject = async (id: string) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to delete project';
  }
};

// Get professor's own projects (Protected)
export const getMyProjects = async () => {
  try {
    const response = await api.get('/projects/my/projects');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch your projects';
  }
};

// Apply to project (Student only)
export const applyToProject = async (projectId: string) => {
  try {
    const response = await api.post(`/projects/${projectId}/apply`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to apply to project';
  }
};