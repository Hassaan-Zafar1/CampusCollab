import { useState, useEffect, useCallback } from 'react';
import { applicationService } from './applicationService';

export const useMyApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await applicationService.getMyApplications();
      if (data.success) {
        setApplications(data.applications);
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteApplication = async (id: string) => {
    try {
      const data = await applicationService.deleteApplication(id);
      if (data.success) {
        setApplications(prev => prev.filter(app => app._id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete application';
      setError(msg);
      throw new Error(msg);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { 
    applications, 
    loading, 
    error, 
    refetch: fetchApplications,
    deleteApplication 
  };
};

export const useSubmitApplication = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (projectId: string, coverLetter: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.submitApplication(projectId, coverLetter);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit application';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
