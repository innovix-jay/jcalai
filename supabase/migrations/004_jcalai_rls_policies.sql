-- RLS Policies for JcalAI Platform
-- This migration adds comprehensive Row Level Security policies

-- Projects Policies
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view projects they collaborate on"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators
      WHERE project_collaborators.project_id = projects.id
      AND project_collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Collaborators with edit permissions can update projects"
  ON public.projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators
      WHERE project_collaborators.project_id = projects.id
      AND project_collaborators.user_id = auth.uid()
      AND (project_collaborators.permissions->>'write')::boolean = true
    )
  );

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Pages Policies
CREATE POLICY "Users can view pages from their projects"
  ON public.pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = pages.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators can view pages"
  ON public.pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators
      WHERE project_collaborators.project_id = pages.project_id
      AND project_collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert pages into their projects"
  ON public.pages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = pages.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update pages in their projects"
  ON public.pages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = pages.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators with write permissions can update pages"
  ON public.pages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators
      WHERE project_collaborators.project_id = pages.project_id
      AND project_collaborators.user_id = auth.uid()
      AND (project_collaborators.permissions->>'write')::boolean = true
    )
  );

CREATE POLICY "Users can delete pages from their projects"
  ON public.pages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = pages.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Components Policies
CREATE POLICY "Users can view their own components"
  ON public.components FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public components"
  ON public.components FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view components from their projects"
  ON public.components FOR SELECT
  USING (
    project_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = components.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create components"
  ON public.components FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own components"
  ON public.components FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own components"
  ON public.components FOR DELETE
  USING (auth.uid() = user_id);

-- Database Schemas Policies
CREATE POLICY "Users can view database schemas from their projects"
  ON public.database_schemas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = database_schemas.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create database schemas in their projects"
  ON public.database_schemas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = database_schemas.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update database schemas in their projects"
  ON public.database_schemas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = database_schemas.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete database schemas from their projects"
  ON public.database_schemas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = database_schemas.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- API Endpoints Policies
CREATE POLICY "Users can view API endpoints from their projects"
  ON public.api_endpoints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = api_endpoints.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create API endpoints in their projects"
  ON public.api_endpoints FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = api_endpoints.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update API endpoints in their projects"
  ON public.api_endpoints FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = api_endpoints.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete API endpoints from their projects"
  ON public.api_endpoints FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = api_endpoints.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Integrations Policies
CREATE POLICY "Users can view integrations from their projects"
  ON public.integrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = integrations.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create integrations in their projects"
  ON public.integrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = integrations.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update integrations in their projects"
  ON public.integrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = integrations.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete integrations from their projects"
  ON public.integrations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = integrations.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Templates Policies
CREATE POLICY "Anyone can view public templates"
  ON public.templates FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own templates"
  ON public.templates FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can create templates"
  ON public.templates FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own templates"
  ON public.templates FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own templates"
  ON public.templates FOR DELETE
  USING (auth.uid() = creator_id);

-- Deployments Policies
CREATE POLICY "Users can view deployments from their projects"
  ON public.deployments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create deployments for their projects"
  ON public.deployments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update deployments for their projects"
  ON public.deployments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- AI Generations Policies
CREATE POLICY "Users can view their own AI generations"
  ON public.ai_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI generations"
  ON public.ai_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI generations"
  ON public.ai_generations FOR UPDATE
  USING (auth.uid() = user_id);

-- Project Collaborators Policies
CREATE POLICY "Users can view collaborators from their projects"
  ON public.project_collaborators FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can add collaborators"
  ON public.project_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users with invite permissions can add collaborators"
  ON public.project_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = project_collaborators.project_id
      AND pc.user_id = auth.uid()
      AND (pc.permissions->>'invite')::boolean = true
    )
  );

CREATE POLICY "Project owners can update collaborators"
  ON public.project_collaborators FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can remove collaborators"
  ON public.project_collaborators FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Project Activity Policies
CREATE POLICY "Users can view activity from their projects"
  ON public.project_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_activity.project_id
      AND projects.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.project_collaborators
      WHERE project_collaborators.project_id = project_activity.project_id
      AND project_collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert activity logs"
  ON public.project_activity FOR INSERT
  WITH CHECK (true);


