-- Project Backends Table
-- Stores backend configuration for each project (managed or external)

CREATE TYPE backend_type AS ENUM ('jcal-managed', 'external');
CREATE TYPE backend_status AS ENUM ('provisioning', 'active', 'error', 'deleted');

CREATE TABLE public.project_backends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Backend type and configuration
  backend_type backend_type NOT NULL,
  status backend_status DEFAULT 'provisioning',
  
  -- For JCAL-managed backends
  schema_name TEXT, -- Isolated schema name (e.g., project_xxxxx)
  api_key TEXT, -- Project-specific API key (encrypted)
  
  -- For external backends
  external_provider TEXT, -- 'postgresql', 'mysql', 'mongodb', etc.
  connection_string TEXT, -- Encrypted connection string
  credentials JSONB DEFAULT '{}', -- Encrypted credentials
  
  -- Connection info
  connection_info JSONB DEFAULT '{}',
  
  -- Provisioning metadata
  provisioned_at TIMESTAMP WITH TIME ZONE,
  last_validated_at TIMESTAMP WITH TIME ZONE,
  
  -- Resource usage (for monitoring)
  resource_usage JSONB DEFAULT '{
    "storage_mb": 0,
    "requests_count": 0,
    "bandwidth_mb": 0
  }',
  
  -- Error tracking
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_project_backends_project_id ON public.project_backends(project_id);
CREATE INDEX idx_project_backends_status ON public.project_backends(status);
CREATE INDEX idx_project_backends_type ON public.project_backends(backend_type);

-- Add updated_at trigger
CREATE TRIGGER update_project_backends_updated_at
  BEFORE UPDATE ON public.project_backends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.project_backends ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view backends for their projects"
  ON public.project_backends FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_backends.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create backends for their projects"
  ON public.project_backends FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_backends.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update backends for their projects"
  ON public.project_backends FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_backends.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete backends for their projects"
  ON public.project_backends FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_backends.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Function to cleanup backend when project is deleted
CREATE OR REPLACE FUNCTION cleanup_project_backend()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the deletion
  INSERT INTO public.project_activity (
    project_id,
    user_id,
    activity_type,
    description
  ) VALUES (
    OLD.id,
    OLD.user_id,
    'backend_deleted',
    'Backend resources cleaned up'
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER before_project_delete_cleanup_backend
  BEFORE DELETE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_project_backend();

-- Add backend_enabled flag to projects table
ALTER TABLE public.projects ADD COLUMN backend_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN backend_type backend_type DEFAULT NULL;

-- Create function to validate backend connection
CREATE OR REPLACE FUNCTION validate_backend_connection(p_project_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  backend_record RECORD;
BEGIN
  SELECT * INTO backend_record
  FROM public.project_backends
  WHERE project_id = p_project_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Update last_validated_at
  UPDATE public.project_backends
  SET last_validated_at = NOW()
  WHERE project_id = p_project_id;
  
  RETURN backend_record.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


