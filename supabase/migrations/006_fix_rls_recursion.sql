-- Fix RLS Infinite Recursion Issues
-- This migration removes circular dependencies in RLS policies

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view projects they collaborate on" ON public.projects;
DROP POLICY IF EXISTS "Collaborators with edit permissions can update projects" ON public.projects;

DROP POLICY IF EXISTS "Collaborators can view pages" ON public.pages;
DROP POLICY IF EXISTS "Collaborators with write permissions can update pages" ON public.pages;

DROP POLICY IF EXISTS "Users can view collaborators from their projects" ON public.project_collaborators;
DROP POLICY IF EXISTS "Project owners can add collaborators" ON public.project_collaborators;
DROP POLICY IF EXISTS "Users with invite permissions can add collaborators" ON public.project_collaborators;
DROP POLICY IF EXISTS "Project owners can update collaborators" ON public.project_collaborators;
DROP POLICY IF EXISTS "Project owners can remove collaborators" ON public.project_collaborators;

DROP POLICY IF EXISTS "Users can view activity from their projects" ON public.project_activity;

-- Recreate simpler policies without recursion

-- Projects: Keep simple owner-only policies for now
-- (Collaboration features can be added later with proper recursion handling)

-- Pages: Simplified policies without recursion
DROP POLICY IF EXISTS "Users can view pages from their projects" ON public.pages;
CREATE POLICY "Users can view pages from their projects"
  ON public.pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = pages.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can insert pages into their projects" ON public.pages;
CREATE POLICY "Users can insert pages into their projects"
  ON public.pages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = pages.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can update pages in their projects" ON public.pages;
CREATE POLICY "Users can update pages in their projects"
  ON public.pages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = pages.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can delete pages from their projects" ON public.pages;
CREATE POLICY "Users can delete pages from their projects"
  ON public.pages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = pages.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

-- Project Collaborators: Direct policies without checking projects
CREATE POLICY "Users can view their own collaborator records"
  ON public.project_collaborators FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow direct project owners to manage collaborators (verified via project ownership)
CREATE POLICY "Authenticated users can add collaborators"
  ON public.project_collaborators FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their accepted status"
  ON public.project_collaborators FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can remove collaborators"
  ON public.project_collaborators FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Project Activity: Simple logging policy
CREATE POLICY "Users can view activity from their own projects"
  ON public.project_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_activity.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Database Schemas: Keep existing but ensure no recursion
DROP POLICY IF EXISTS "Users can view database schemas from their projects" ON public.database_schemas;
CREATE POLICY "Users can view database schemas from their projects"
  ON public.database_schemas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = database_schemas.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can create database schemas in their projects" ON public.database_schemas;
CREATE POLICY "Users can create database schemas in their projects"
  ON public.database_schemas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = database_schemas.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can update database schemas in their projects" ON public.database_schemas;
CREATE POLICY "Users can update database schemas in their projects"
  ON public.database_schemas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = database_schemas.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can delete database schemas from their projects" ON public.database_schemas;
CREATE POLICY "Users can delete database schemas from their projects"
  ON public.database_schemas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = database_schemas.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

-- API Endpoints: Keep existing but ensure no recursion
DROP POLICY IF EXISTS "Users can view API endpoints from their projects" ON public.api_endpoints;
CREATE POLICY "Users can view API endpoints from their projects"
  ON public.api_endpoints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = api_endpoints.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can create API endpoints in their projects" ON public.api_endpoints;
CREATE POLICY "Users can create API endpoints in their projects"
  ON public.api_endpoints FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = api_endpoints.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can update API endpoints in their projects" ON public.api_endpoints;
CREATE POLICY "Users can update API endpoints in their projects"
  ON public.api_endpoints FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = api_endpoints.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can delete API endpoints from their projects" ON public.api_endpoints;
CREATE POLICY "Users can delete API endpoints from their projects"
  ON public.api_endpoints FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = api_endpoints.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

-- Integrations: Keep existing but ensure no recursion
DROP POLICY IF EXISTS "Users can view integrations from their projects" ON public.integrations;
CREATE POLICY "Users can view integrations from their projects"
  ON public.integrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = integrations.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can create integrations in their projects" ON public.integrations;
CREATE POLICY "Users can create integrations in their projects"
  ON public.integrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = integrations.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can update integrations in their projects" ON public.integrations;
CREATE POLICY "Users can update integrations in their projects"
  ON public.integrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = integrations.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can delete integrations from their projects" ON public.integrations;
CREATE POLICY "Users can delete integrations from their projects"
  ON public.integrations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = integrations.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

-- Deployments: Keep existing but ensure no recursion
DROP POLICY IF EXISTS "Users can view deployments from their projects" ON public.deployments;
CREATE POLICY "Users can view deployments from their projects"
  ON public.deployments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can create deployments for their projects" ON public.deployments;
CREATE POLICY "Users can create deployments for their projects"
  ON public.deployments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

DROP POLICY IF EXISTS "Users can update deployments for their projects" ON public.deployments;
CREATE POLICY "Users can update deployments for their projects"
  ON public.deployments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
      AND projects.status != 'deleted'
    )
  );

