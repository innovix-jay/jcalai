-- Version History System for JCAL.ai
-- Migration: 009_version_history.sql

-- Create versions table
CREATE TABLE IF NOT EXISTS public.project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  version_tag TEXT, -- e.g., "v1.0.0", "Initial Build", "Added Auth"
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  
  -- Snapshot of project state
  snapshot JSONB NOT NULL, -- Complete project state including pages, components, config
  
  -- Changes from previous version
  changes_summary TEXT,
  files_changed TEXT[], -- Array of file paths that changed
  diff JSONB, -- Detailed diff information
  
  -- Metadata
  commit_message TEXT,
  is_auto_save BOOLEAN DEFAULT false,
  parent_version_id UUID REFERENCES public.project_versions(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_version_number ON public.project_versions(version_number);
CREATE INDEX IF NOT EXISTS idx_project_versions_created_at ON public.project_versions(created_at);

-- Add RLS policies
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions for their projects"
  ON public.project_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_versions.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert versions for their projects"
  ON public.project_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_versions.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Function to create a new version
CREATE OR REPLACE FUNCTION public.create_project_version(
  p_project_id UUID,
  p_commit_message TEXT DEFAULT 'Auto-save',
  p_is_auto_save BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
  v_version_id UUID;
  v_version_number INTEGER;
  v_snapshot JSONB;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_version_number
  FROM public.project_versions
  WHERE project_id = p_project_id;

  -- Create snapshot
  SELECT jsonb_build_object(
    'project', row_to_json(p.*),
    'pages', (
      SELECT jsonb_agg(row_to_json(pg.*))
      FROM public.pages pg
      WHERE pg.project_id = p_project_id
    ),
    'components', (
      SELECT jsonb_agg(row_to_json(c.*))
      FROM public.components c
      WHERE c.project_id = p_project_id
    )
  )
  INTO v_snapshot
  FROM public.projects p
  WHERE p.id = p_project_id;

  -- Insert new version
  INSERT INTO public.project_versions (
    project_id,
    version_number,
    version_tag,
    created_by,
    snapshot,
    commit_message,
    is_auto_save
  ) VALUES (
    p_project_id,
    v_version_number,
    'v' || v_version_number,
    auth.uid(),
    v_snapshot,
    p_commit_message,
    p_is_auto_save
  )
  RETURNING id INTO v_version_id;

  RETURN v_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore a version
CREATE OR REPLACE FUNCTION public.restore_project_version(
  p_version_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_snapshot JSONB;
  v_project_id UUID;
BEGIN
  -- Get version snapshot
  SELECT snapshot, project_id
  INTO v_snapshot, v_project_id
  FROM public.project_versions
  WHERE id = p_version_id;

  IF v_snapshot IS NULL THEN
    RETURN false;
  END IF;

  -- TODO: Implement restoration logic
  -- This would restore pages, components, and project config from snapshot
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-save trigger (create version on significant changes)
CREATE OR REPLACE FUNCTION public.auto_version_on_page_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Create auto-save version when pages are modified
  PERFORM public.create_project_version(
    NEW.project_id,
    'Auto-save: Page ' || NEW.name || ' updated',
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-versioning
DROP TRIGGER IF EXISTS trigger_auto_version_on_page_update ON public.pages;
CREATE TRIGGER trigger_auto_version_on_page_update
  AFTER UPDATE ON public.pages
  FOR EACH ROW
  WHEN (OLD.structure IS DISTINCT FROM NEW.structure)
  EXECUTE FUNCTION public.auto_version_on_page_change();
