import axios from 'axios';

const API_URL = 'http://localhost:5000/api/applications';

export const applicationService = {
  getMyApplications: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/my/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteApplication: async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  submitApplication: async (projectId: string, coverLetter: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}`, 
      { projectId, coverLetter },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};
