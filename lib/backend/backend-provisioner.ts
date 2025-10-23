/**
 * Backend Provisioning System
 * Automatically provisions and manages backend resources for user projects
 */

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

export interface BackendProvisionRequest {
  projectId: string;
  userId: string;
  projectName: string;
  backendType: 'jcal-managed' | 'external';
  config?: {
    externalProvider?: string;
    connectionString?: string;
    credentials?: Record<string, string>;
  };
}

export interface BackendProvisionResult {
  success: boolean;
  backendId: string;
  connectionInfo?: {
    databaseUrl?: string;
    apiUrl?: string;
    apiKey?: string;
  };
  error?: string;
}

export class BackendProvisioner {
  private adminClient: any;
  private managementApiKey: string;

  constructor() {
    // Initialize lazily to avoid build-time environment variable issues
    this.adminClient = null;
    this.managementApiKey = '';
  }

  private getAdminClient() {
    if (!this.adminClient) {
      this.adminClient = createSupabaseAdmin(
        process.env.JCAL_MASTER_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.JCAL_MASTER_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      this.managementApiKey = process.env.SUPABASE_MANAGEMENT_API_KEY || '';
    }
    return this.adminClient;
  }

  /**
   * Provision a new backend for a project
   */
  async provisionBackend(request: BackendProvisionRequest): Promise<BackendProvisionResult> {
    try {
      if (request.backendType === 'jcal-managed') {
        return await this.provisionManagedBackend(request);
      } else {
        return await this.setupExternalBackend(request);
      }
    } catch (error) {
      console.error('Backend provisioning error:', error);
      return {
        success: false,
        backendId: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Provision a JCAL-managed Supabase backend
   */
  private async provisionManagedBackend(request: BackendProvisionRequest): Promise<BackendProvisionResult> {
    // Generate unique schema/namespace for this project
    const schemaName = this.generateSchemaName(request.projectId);
    
    // Create isolated schema for this project
    await this.createProjectSchema(schemaName, request.projectId, request.userId);

    // Set up default tables
    await this.createDefaultTables(schemaName, request.projectId);

    // Configure Row Level Security
    await this.setupRLS(schemaName, request.userId);

    // Generate API credentials
    const apiKey = await this.generateAPIKey(request.projectId, request.userId);

    // Store backend configuration
    await this.saveBackendConfig(request.projectId, {
      type: 'jcal-managed',
      schema: schemaName,
      provisionedAt: new Date().toISOString(),
    });

    return {
      success: true,
      backendId: schemaName,
      connectionInfo: {
        databaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        apiUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`,
        apiKey: apiKey,
      },
    };
  }

  /**
   * Set up external backend connection
   */
  private async setupExternalBackend(request: BackendProvisionRequest): Promise<BackendProvisionResult> {
    if (!request.config?.externalProvider) {
      throw new Error('External provider not specified');
    }

    // Validate connection
    const isValid = await this.validateExternalConnection(
      request.config.externalProvider,
      request.config.credentials || {}
    );

    if (!isValid) {
      throw new Error('Failed to validate external backend connection');
    }

    // Store encrypted credentials
    await this.saveBackendConfig(request.projectId, {
      type: 'external',
      provider: request.config.externalProvider,
      credentials: await this.encryptCredentials(request.config.credentials || {}),
      connectedAt: new Date().toISOString(),
    });

    return {
      success: true,
      backendId: `external-${request.projectId}`,
      connectionInfo: {
        databaseUrl: request.config.connectionString,
      },
    };
  }

  /**
   * Create isolated schema for project
   */
  private async createProjectSchema(schemaName: string, projectId: string, userId: string): Promise<void> {
    // Create schema
    await this.adminClient.rpc('create_project_schema', {
      schema_name: schemaName,
      project_id: projectId,
      user_id: userId,
    });

    // Or use raw SQL if RPC not available
    const { error } = await this.adminClient.from('_sql').rpc('exec', {
      sql: `
        -- Create schema
        CREATE SCHEMA IF NOT EXISTS ${schemaName};
        
        -- Grant usage to authenticated users
        GRANT USAGE ON SCHEMA ${schemaName} TO authenticated;
        
        -- Set search path
        ALTER SCHEMA ${schemaName} OWNER TO postgres;
      `
    });

    if (error && !error.message.includes('already exists')) {
      throw error;
    }
  }

  /**
   * Create default tables for a new project
   */
  private async createDefaultTables(schemaName: string, projectId: string): Promise<void> {
    const tables = [
      {
        name: 'app_users',
        columns: `
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        `,
      },
      {
        name: 'app_data',
        columns: `
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES ${schemaName}.app_users(id) ON DELETE CASCADE,
          data_type TEXT NOT NULL,
          data JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        `,
      },
    ];

    for (const table of tables) {
      const { error } = await this.adminClient.from('_sql').rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS ${schemaName}.${table.name} (
            ${table.columns}
          );
          
          -- Create updated_at trigger
          CREATE TRIGGER update_${table.name}_updated_at
            BEFORE UPDATE ON ${schemaName}.${table.name}
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `
      });

      if (error && !error.message.includes('already exists')) {
        console.error(`Error creating table ${table.name}:`, error);
      }
    }
  }

  /**
   * Set up Row Level Security policies
   */
  private async setupRLS(schemaName: string, userId: string): Promise<void> {
    const tables = ['app_users', 'app_data'];

    for (const table of tables) {
      await this.adminClient.from('_sql').rpc('exec', {
        sql: `
          -- Enable RLS
          ALTER TABLE ${schemaName}.${table} ENABLE ROW LEVEL SECURITY;
          
          -- Policy: Users can only access their own data
          DROP POLICY IF EXISTS "${table}_isolation_policy" ON ${schemaName}.${table};
          CREATE POLICY "${table}_isolation_policy" ON ${schemaName}.${table}
            FOR ALL
            USING (
              -- Allow if user owns this project
              EXISTS (
                SELECT 1 FROM public.projects
                WHERE id = '${schemaName.replace('project_', '')}'
                AND user_id = auth.uid()
              )
              OR
              -- Allow if user is a collaborator
              EXISTS (
                SELECT 1 FROM public.project_collaborators
                WHERE project_id = '${schemaName.replace('project_', '')}'
                AND user_id = auth.uid()
              )
            );
        `
      });
    }
  }

  /**
   * Generate API key for project
   */
  private async generateAPIKey(projectId: string, userId: string): Promise<string> {
    // In production, this would generate a project-specific API key
    // For now, return the main anon key with project context
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  }

  /**
   * Generate unique schema name
   */
  private generateSchemaName(projectId: string): string {
    return `project_${projectId.replace(/-/g, '_')}`;
  }

  /**
   * Validate external backend connection
   */
  private async validateExternalConnection(
    provider: string,
    credentials: Record<string, string>
  ): Promise<boolean> {
    try {
      switch (provider) {
        case 'postgresql':
          return await this.validatePostgreSQL(credentials);
        case 'mysql':
          return await this.validateMySQL(credentials);
        case 'mongodb':
          return await this.validateMongoDB(credentials);
        case 'firebase':
          return await this.validateFirebase(credentials);
        default:
          return false;
      }
    } catch (error) {
      console.error('Connection validation error:', error);
      return false;
    }
  }

  private async validatePostgreSQL(credentials: Record<string, string>): Promise<boolean> {
    // Test connection with provided credentials
    // This would use pg library in production
    return credentials.host && credentials.database && credentials.user ? true : false;
  }

  private async validateMySQL(credentials: Record<string, string>): Promise<boolean> {
    // Test MySQL connection
    return credentials.host && credentials.database && credentials.user ? true : false;
  }

  private async validateMongoDB(credentials: Record<string, string>): Promise<boolean> {
    // Test MongoDB connection
    return credentials.connectionString ? true : false;
  }

  private async validateFirebase(credentials: Record<string, string>): Promise<boolean> {
    // Test Firebase connection
    return credentials.projectId && credentials.apiKey ? true : false;
  }

  /**
   * Encrypt credentials for storage
   */
  private async encryptCredentials(credentials: Record<string, string>): Promise<string> {
    // In production, use proper encryption (AES-256)
    // For now, base64 encode (NOT SECURE - replace in production)
    return Buffer.from(JSON.stringify(credentials)).toString('base64');
  }

  /**
   * Save backend configuration
   */
  private async saveBackendConfig(projectId: string, config: any): Promise<void> {
    const { error } = await this.adminClient
      .from('project_backends')
      .upsert({
        project_id: projectId,
        config: config,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving backend config:', error);
    }
  }

  /**
   * Delete/deprovision backend when project is deleted
   */
  async deprovisionBackend(projectId: string): Promise<void> {
    const schemaName = this.generateSchemaName(projectId);

    try {
      // Drop schema and all tables
      await this.adminClient.from('_sql').rpc('exec', {
        sql: `DROP SCHEMA IF EXISTS ${schemaName} CASCADE;`
      });

      // Remove backend config
      await this.adminClient
        .from('project_backends')
        .delete()
        .eq('project_id', projectId);
    } catch (error) {
      console.error('Error deprovisioning backend:', error);
      throw error;
    }
  }

  /**
   * Get backend info for a project
   */
  async getBackendInfo(projectId: string): Promise<any> {
    const { data, error } = await this.adminClient
      .from('project_backends')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }
}

// Singleton instance
export const backendProvisioner = new BackendProvisioner();


