import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  build_status: string;
  build_progress: number;
  preview_url?: string;
  last_built_at?: string;
  created_at: string;
  updated_at: string;
  ai_metadata?: any;
}

export function useProjectSync(userId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchProjects();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Project change detected:', payload);
          fetchProjects(); // Refresh projects list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchProjects, supabase]);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
        return;
      }

      setProjects(data || []);
    } catch (err: any) {
      console.error('Error in fetchProjects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  return { 
    projects, 
    loading, 
    error, 
    refetch: fetchProjects 
  };
}

export function useBuildProgress(projectId: string) {
  const [buildLogs, setBuildLogs] = useState<any[]>([]);
  const [buildSession, setBuildSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBuildSession = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('build_sessions')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'in-progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setBuildSession(data);
        fetchBuildLogs();
      }
    } catch (err) {
      console.error('Error fetching build session:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, supabase, fetchBuildLogs]);

  const fetchBuildLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('build_logs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setBuildLogs(data);
      }
    } catch (err) {
      console.error('Error fetching build logs:', err);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    if (!projectId) return;

    // Fetch current build session
    fetchBuildSession();

    // Subscribe to build logs changes
    const channel = supabase
      .channel(`build-logs-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'build_logs',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Build log change detected:', payload);
          fetchBuildLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, fetchBuildSession, fetchBuildLogs, supabase]);


  return {
    buildLogs,
    buildSession,
    loading,
    refetch: fetchBuildLogs
  };
}
