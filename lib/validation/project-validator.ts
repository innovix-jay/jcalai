/**
 * Project Validation System
 * Automatically validates all UI components, connections, and project structure
 */

import { createClient } from '@/lib/supabase/client';

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'structure' | 'component' | 'api' | 'database' | 'integration' | 'deployment';
  message: string;
  location?: string;
  suggestion?: string;
  autoFixable?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: ValidationIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
}

export class ProjectValidator {
  /**
   * Run complete validation on a project
   */
  async validateProject(projectId: string): Promise<ValidationResult> {
    const supabase = createClient();

    // Load complete project data
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        pages(*),
        components(*),
        database_schemas(*),
        api_endpoints(*),
        integrations(*)
      `)
      .eq('id', projectId)
      .single();

    if (error || !project) {
      return {
        isValid: false,
        score: 0,
        issues: [{
          id: 'project-not-found',
          severity: 'error',
          category: 'structure',
          message: 'Project not found',
        }],
        summary: { errors: 1, warnings: 0, info: 0 },
      };
    }

    const issues: ValidationIssue[] = [];

    // Run all validation checks
    issues.push(...this.validateProjectStructure(project));
    issues.push(...this.validatePages(project.pages || []));
    issues.push(...this.validateComponents(project.components || []));
    issues.push(...this.validateDatabaseSchemas(project.database_schemas || []));
    issues.push(...this.validateAPIEndpoints(project.api_endpoints || []));
    issues.push(...this.validateIntegrations(project.integrations || []));
    issues.push(...this.validateDeployability(project));

    // Calculate summary
    const summary = {
      errors: issues.filter(i => i.severity === 'error').length,
      warnings: issues.filter(i => i.severity === 'warning').length,
      info: issues.filter(i => i.severity === 'info').length,
    };

    // Calculate score (100 - deductions)
    let score = 100;
    score -= summary.errors * 10; // -10 points per error
    score -= summary.warnings * 3; // -3 points per warning
    score -= summary.info * 1; // -1 point per info
    score = Math.max(0, Math.min(100, score));

    return {
      isValid: summary.errors === 0,
      score,
      issues,
      summary,
    };
  }

  /**
   * Validate project structure
   */
  private validateProjectStructure(project: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!project.name || project.name.trim() === '') {
      issues.push({
        id: 'no-project-name',
        severity: 'error',
        category: 'structure',
        message: 'Project name is required',
        suggestion: 'Add a descriptive name for your project',
      });
    }

    if (!project.description || project.description.trim() === '') {
      issues.push({
        id: 'no-description',
        severity: 'warning',
        category: 'structure',
        message: 'Project description is missing',
        suggestion: 'Add a description to help others understand your project',
      });
    }

    if (!project.config || Object.keys(project.config).length === 0) {
      issues.push({
        id: 'no-config',
        severity: 'warning',
        category: 'structure',
        message: 'Project configuration is incomplete',
        suggestion: 'Configure your project settings (framework, styling, etc.)',
      });
    }

    return issues;
  }

  /**
   * Validate pages
   */
  private validatePages(pages: any[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (pages.length === 0) {
      issues.push({
        id: 'no-pages',
        severity: 'error',
        category: 'structure',
        message: 'Project has no pages',
        suggestion: 'Create at least one page for your application',
        autoFixable: true,
      });
      return issues;
    }

    // Check for home page
    const hasHomePage = pages.some(p => p.is_home || p.path === '/');
    if (!hasHomePage) {
      issues.push({
        id: 'no-home-page',
        severity: 'error',
        category: 'structure',
        message: 'No home page defined',
        location: 'Pages',
        suggestion: 'Set one page as the home page (path: "/")',
        autoFixable: true,
      });
    }

    // Check for duplicate paths
    const paths = pages.map(p => p.path);
    const duplicatePaths = paths.filter((path, index) => paths.indexOf(path) !== index);
    if (duplicatePaths.length > 0) {
      issues.push({
        id: 'duplicate-paths',
        severity: 'error',
        category: 'structure',
        message: `Duplicate page paths found: ${duplicatePaths.join(', ')}`,
        suggestion: 'Ensure each page has a unique path',
      });
    }

    // Validate each page
    pages.forEach((page, index) => {
      if (!page.name || page.name.trim() === '') {
        issues.push({
          id: `page-${index}-no-name`,
          severity: 'error',
          category: 'structure',
          message: `Page at index ${index} has no name`,
          location: `Page ${index + 1}`,
        });
      }

      if (!page.path || page.path.trim() === '') {
        issues.push({
          id: `page-${index}-no-path`,
          severity: 'error',
          category: 'structure',
          message: `Page "${page.name}" has no path`,
          location: page.name,
        });
      }

      if (!page.structure || Object.keys(page.structure).length === 0) {
        issues.push({
          id: `page-${index}-empty`,
          severity: 'warning',
          category: 'component',
          message: `Page "${page.name}" has no content`,
          location: page.name,
          suggestion: 'Add components to your page',
        });
      }
    });

    return issues;
  }

  /**
   * Validate components
   */
  private validateComponents(components: any[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (components.length === 0) {
      issues.push({
        id: 'no-components',
        severity: 'info',
        category: 'component',
        message: 'No custom components defined',
        suggestion: 'Consider creating reusable components for your application',
      });
    }

    components.forEach((component, index) => {
      if (!component.name || component.name.trim() === '') {
        issues.push({
          id: `component-${index}-no-name`,
          severity: 'error',
          category: 'component',
          message: `Component at index ${index} has no name`,
        });
      }

      if (!component.structure) {
        issues.push({
          id: `component-${index}-no-structure`,
          severity: 'error',
          category: 'component',
          message: `Component "${component.name}" has no structure defined`,
          location: component.name,
        });
      }
    });

    return issues;
  }

  /**
   * Validate database schemas
   */
  private validateDatabaseSchemas(schemas: any[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (schemas.length === 0) {
      issues.push({
        id: 'no-database',
        severity: 'info',
        category: 'database',
        message: 'No database schema defined',
        suggestion: 'Add database tables if your app needs data persistence',
      });
      return issues;
    }

    schemas.forEach((schema, schemaIndex) => {
      if (!schema.tables || schema.tables.length === 0) {
        issues.push({
          id: `schema-${schemaIndex}-no-tables`,
          severity: 'warning',
          category: 'database',
          message: `Database schema "${schema.name}" has no tables`,
          location: schema.name,
        });
        return;
      }

      schema.tables.forEach((table: any, tableIndex: number) => {
        // Validate table name
        if (!table.name || table.name.trim() === '') {
          issues.push({
            id: `table-${tableIndex}-no-name`,
            severity: 'error',
            category: 'database',
            message: `Table at index ${tableIndex} has no name`,
            location: schema.name,
          });
        }

        // Validate columns
        if (!table.columns || table.columns.length === 0) {
          issues.push({
            id: `table-${tableIndex}-no-columns`,
            severity: 'error',
            category: 'database',
            message: `Table "${table.name}" has no columns`,
            location: `${schema.name} > ${table.name}`,
          });
        }

        // Check for primary key
        const hasPrimaryKey = table.columns?.some((col: any) => 
          col.name === 'id' && col.type === 'uuid'
        );
        if (!hasPrimaryKey) {
          issues.push({
            id: `table-${tableIndex}-no-pk`,
            severity: 'warning',
            category: 'database',
            message: `Table "${table.name}" should have a primary key (id UUID)`,
            location: `${schema.name} > ${table.name}`,
            suggestion: 'Add an "id" column of type UUID as the primary key',
            autoFixable: true,
          });
        }

        // Check for timestamps
        const hasTimestamps = table.columns?.some((col: any) => 
          col.name === 'created_at' || col.name === 'updated_at'
        );
        if (!hasTimestamps) {
          issues.push({
            id: `table-${tableIndex}-no-timestamps`,
            severity: 'info',
            category: 'database',
            message: `Table "${table.name}" doesn't have timestamp columns`,
            location: `${schema.name} > ${table.name}`,
            suggestion: 'Consider adding created_at and updated_at columns',
          });
        }
      });
    });

    return issues;
  }

  /**
   * Validate API endpoints
   */
  private validateAPIEndpoints(endpoints: any[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (endpoints.length === 0) {
      issues.push({
        id: 'no-api-endpoints',
        severity: 'info',
        category: 'api',
        message: 'No API endpoints defined',
        suggestion: 'Create API endpoints if your app needs backend logic',
      });
      return issues;
    }

    // Check for duplicate endpoint paths
    const endpointKeys = endpoints.map(e => `${e.method}:${e.path}`);
    const duplicates = endpointKeys.filter((key, index) => endpointKeys.indexOf(key) !== index);
    if (duplicates.length > 0) {
      issues.push({
        id: 'duplicate-endpoints',
        severity: 'error',
        category: 'api',
        message: `Duplicate API endpoints found: ${duplicates.join(', ')}`,
        suggestion: 'Each endpoint must have a unique method + path combination',
      });
    }

    endpoints.forEach((endpoint, index) => {
      if (!endpoint.name) {
        issues.push({
          id: `endpoint-${index}-no-name`,
          severity: 'warning',
          category: 'api',
          message: `API endpoint "${endpoint.path}" has no name`,
          location: endpoint.path,
        });
      }

      if (!endpoint.path || !endpoint.path.startsWith('/')) {
        issues.push({
          id: `endpoint-${index}-invalid-path`,
          severity: 'error',
          category: 'api',
          message: `API endpoint path must start with "/"`,
          location: endpoint.name || `Endpoint ${index + 1}`,
        });
      }

      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(endpoint.method)) {
        issues.push({
          id: `endpoint-${index}-invalid-method`,
          severity: 'error',
          category: 'api',
          message: `Invalid HTTP method: ${endpoint.method}`,
          location: endpoint.path,
        });
      }

      if (!endpoint.description) {
        issues.push({
          id: `endpoint-${index}-no-description`,
          severity: 'info',
          category: 'api',
          message: `API endpoint "${endpoint.path}" has no description`,
          location: endpoint.path,
          suggestion: 'Add a description for API documentation',
        });
      }
    });

    return issues;
  }

  /**
   * Validate integrations
   */
  private validateIntegrations(integrations: any[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    integrations.forEach((integration, index) => {
      if (!integration.is_configured) {
        issues.push({
          id: `integration-${index}-not-configured`,
          severity: 'warning',
          category: 'integration',
          message: `Integration "${integration.service_name}" is not configured`,
          location: integration.service_name,
          suggestion: 'Complete the integration configuration',
        });
      }

      if (!integration.is_active) {
        issues.push({
          id: `integration-${index}-inactive`,
          severity: 'info',
          category: 'integration',
          message: `Integration "${integration.service_name}" is inactive`,
          location: integration.service_name,
          suggestion: 'Activate the integration to use it in your app',
        });
      }
    });

    return issues;
  }

  /**
   * Validate deployment readiness
   */
  private validateDeployability(project: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check if project has necessary environment variables
    if (!project.config?.env_vars || Object.keys(project.config.env_vars).length === 0) {
      issues.push({
        id: 'no-env-vars',
        severity: 'warning',
        category: 'deployment',
        message: 'No environment variables configured',
        suggestion: 'Add environment variables for deployment (e.g., database URLs, API keys)',
      });
    }

    // Check if project has a production-ready configuration
    if (project.config?.framework === 'nextjs' && !project.config?.build_command) {
      issues.push({
        id: 'no-build-command',
        severity: 'info',
        category: 'deployment',
        message: 'No custom build command specified',
        suggestion: 'Default Next.js build command will be used',
      });
    }

    return issues;
  }

  /**
   * Auto-fix issues where possible
   */
  async autoFixIssues(projectId: string, issueIds: string[]): Promise<number> {
    const result = await this.validateProject(projectId);
    const supabase = createClient();
    let fixedCount = 0;

    for (const issueId of issueIds) {
      const issue = result.issues.find(i => i.id === issueId);
      if (!issue || !issue.autoFixable) continue;

      try {
        switch (issue.id) {
          case 'no-pages':
            // Create a default home page
            await supabase.from('pages').insert({
              project_id: projectId,
              name: 'Home',
              slug: 'home',
              path: '/',
              is_home: true,
              structure: {
                ROOT: {
                  type: 'Container',
                  props: {},
                  nodes: [],
                },
              },
            });
            fixedCount++;
            break;

          case 'no-home-page':
            // Set the first page as home
            const { data: pages } = await supabase
              .from('pages')
              .select('id')
              .eq('project_id', projectId)
              .limit(1);
            
            if (pages && pages.length > 0) {
              await supabase
                .from('pages')
                .update({ is_home: true, path: '/' })
                .eq('id', pages[0].id);
              fixedCount++;
            }
            break;

          // Add more auto-fix cases as needed
        }
      } catch (error) {
        console.error(`Failed to auto-fix issue ${issueId}:`, error);
      }
    }

    return fixedCount;
  }
}

// Singleton instance
export const projectValidator = new ProjectValidator();


