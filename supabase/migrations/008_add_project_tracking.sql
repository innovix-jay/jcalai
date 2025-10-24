-- Add real-time project tracking capabilities
-- Migration: 008_add_project_tracking.sql

-- Add build tracking columns to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS build_status TEXT DEFAULT 'idle';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS build_progress INTEGER DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS preview_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS last_built_at TIMESTAMPTZ;

-- Create build_logs table for detailed build tracking
CREATE TABLE IF NOT EXISTS public.build_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  step_id TEXT NOT NULL,
  step_label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'complete', 'error')),
  logs TEXT[] DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_build_logs_project_id ON public.build_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_build_logs_status ON public.build_logs(status);
CREATE INDEX IF NOT EXISTS idx_build_logs_created_at ON public.build_logs(created_at);

-- Create build_sessions table for tracking build sessions
CREATE TABLE IF NOT EXISTS public.build_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('ai-generation', 'manual-build', 'template-import')),
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'in-progress', 'completed', 'failed')),
  total_steps INTEGER DEFAULT 0,
  completed_steps INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Create index for build sessions
CREATE INDEX IF NOT EXISTS idx_build_sessions_project_id ON public.build_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_build_sessions_status ON public.build_sessions(status);

-- Add RLS policies for build_logs
ALTER TABLE public.build_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view build logs for their projects"
  ON public.build_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = build_logs.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert build logs for their projects"
  ON public.build_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = build_logs.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update build logs for their projects"
  ON public.build_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = build_logs.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Add RLS policies for build_sessions
ALTER TABLE public.build_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view build sessions for their projects"
  ON public.build_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = build_sessions.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert build sessions for their projects"
  ON public.build_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = build_sessions.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update build sessions for their projects"
  ON public.build_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = build_sessions.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Function to update project build status
CREATE OR REPLACE FUNCTION public.update_project_build_status(
  p_project_id UUID,
  p_status TEXT,
  p_progress INTEGER DEFAULT 0,
  p_preview_url TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.projects
  SET 
    build_status = p_status,
    build_progress = p_progress,
    preview_url = COALESCE(p_preview_url, preview_url),
    last_built_at = CASE 
      WHEN p_status = 'completed' THEN NOW()
      ELSE last_built_at
    END,
    updated_at = NOW()
  WHERE id = p_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old build logs (keep last 50 per project)
CREATE OR REPLACE FUNCTION public.cleanup_old_build_logs()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.build_logs
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (
        PARTITION BY project_id 
        ORDER BY created_at DESC
      ) as rn
      FROM public.build_logs
    ) ranked
    WHERE rn > 50
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
