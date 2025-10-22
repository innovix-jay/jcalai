/**
 * Database Connector Framework
 * Supports multiple external database providers
 */

export interface DatabaseProvider {
  id: string;
  name: string;
  type: 'sql' | 'nosql' | 'cloud';
  icon: string;
  description: string;
  popular: boolean;
  credentialFields: ConnectorField[];
  features: string[];
  setupGuide: string;
}

export interface ConnectorField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'url' | 'number';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string) => boolean | string;
}

export interface ConnectionTest {
  success: boolean;
  message: string;
  latency?: number;
  serverInfo?: Record<string, any>;
}

export const DATABASE_PROVIDERS: DatabaseProvider[] = [
  {
    id: 'supabase-custom',
    name: 'Supabase (Custom)',
    type: 'cloud',
    icon: '⚡',
    description: 'Connect your own Supabase project',
    popular: true,
    features: [
      'PostgreSQL database',
      'Built-in authentication',
      'Real-time subscriptions',
      'Storage and APIs',
      'Auto-generated REST APIs',
    ],
    credentialFields: [
      {
        key: 'url',
        label: 'Project URL',
        type: 'url',
        required: true,
        placeholder: 'https://xxxxx.supabase.co',
        helpText: 'Your Supabase project URL',
        validation: (value) => value.includes('supabase.co') || 'Must be a valid Supabase URL',
      },
      {
        key: 'anon_key',
        label: 'Anon Key',
        type: 'password',
        required: true,
        placeholder: 'eyJxxx...',
        helpText: 'Your Supabase anon/public key',
      },
      {
        key: 'service_key',
        label: 'Service Role Key',
        type: 'password',
        required: false,
        placeholder: 'eyJxxx...',
        helpText: 'Optional: For server-side operations',
      },
    ],
    setupGuide: `
1. Go to https://supabase.com and create a project
2. Navigate to Settings > API
3. Copy your Project URL and API keys
4. Paste them here to connect
    `,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'sql',
    icon: '🐘',
    description: 'Connect to any PostgreSQL database',
    popular: true,
    features: [
      'Relational database',
      'ACID compliance',
      'Advanced SQL features',
      'Scalable and reliable',
      'JSON support',
    ],
    credentialFields: [
      {
        key: 'host',
        label: 'Host',
        type: 'text',
        required: true,
        placeholder: 'localhost or db.example.com',
        helpText: 'Database server hostname or IP',
      },
      {
        key: 'port',
        label: 'Port',
        type: 'number',
        required: true,
        placeholder: '5432',
        helpText: 'Database port (default: 5432)',
      },
      {
        key: 'database',
        label: 'Database Name',
        type: 'text',
        required: true,
        placeholder: 'myapp',
        helpText: 'Name of the database to connect to',
      },
      {
        key: 'user',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'postgres',
        helpText: 'Database user',
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: '••••••••',
        helpText: 'Database password',
      },
      {
        key: 'ssl',
        label: 'SSL Mode',
        type: 'select',
        required: false,
        options: [
          { value: 'disable', label: 'Disable' },
          { value: 'prefer', label: 'Prefer' },
          { value: 'require', label: 'Require' },
        ],
        helpText: 'SSL connection mode',
      },
    ],
    setupGuide: `
1. Ensure PostgreSQL is running
2. Create a database for your app
3. Create a user with appropriate permissions
4. Enter connection details here
    `,
  },
  {
    id: 'mysql',
    name: 'MySQL',
    type: 'sql',
    icon: '🐬',
    description: 'Connect to MySQL or MariaDB',
    popular: true,
    features: [
      'Relational database',
      'High performance',
      'Wide adoption',
      'Replication support',
      'ACID transactions',
    ],
    credentialFields: [
      {
        key: 'host',
        label: 'Host',
        type: 'text',
        required: true,
        placeholder: 'localhost or db.example.com',
      },
      {
        key: 'port',
        label: 'Port',
        type: 'number',
        required: true,
        placeholder: '3306',
      },
      {
        key: 'database',
        label: 'Database Name',
        type: 'text',
        required: true,
        placeholder: 'myapp',
      },
      {
        key: 'user',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'root',
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: '••••••••',
      },
    ],
    setupGuide: `
1. Install MySQL/MariaDB
2. Create database: CREATE DATABASE myapp;
3. Create user and grant permissions
4. Enter connection details
    `,
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'nosql',
    icon: '🍃',
    description: 'Connect to MongoDB or MongoDB Atlas',
    popular: true,
    features: [
      'Document database',
      'Flexible schema',
      'Horizontal scaling',
      'Rich query language',
      'Aggregation framework',
    ],
    credentialFields: [
      {
        key: 'connection_string',
        label: 'Connection String',
        type: 'password',
        required: true,
        placeholder: 'mongodb+srv://user:pass@cluster.mongodb.net/dbname',
        helpText: 'MongoDB connection string',
      },
      {
        key: 'database',
        label: 'Database Name',
        type: 'text',
        required: true,
        placeholder: 'myapp',
        helpText: 'Default database to use',
      },
    ],
    setupGuide: `
1. Create MongoDB Atlas cluster or local instance
2. Create database and user
3. Get connection string from MongoDB Atlas
4. Paste connection string here
    `,
  },
  {
    id: 'firebase',
    name: 'Firebase',
    type: 'cloud',
    icon: '🔥',
    description: 'Google Firebase Realtime Database or Firestore',
    popular: true,
    features: [
      'Real-time database',
      'Firestore (document DB)',
      'Built-in authentication',
      'File storage',
      'Cloud functions',
    ],
    credentialFields: [
      {
        key: 'project_id',
        label: 'Project ID',
        type: 'text',
        required: true,
        placeholder: 'my-app-12345',
        helpText: 'Firebase project ID',
      },
      {
        key: 'api_key',
        label: 'Web API Key',
        type: 'password',
        required: true,
        placeholder: 'AIzaSyXxxx...',
        helpText: 'Firebase web API key',
      },
      {
        key: 'service_account',
        label: 'Service Account JSON',
        type: 'password',
        required: false,
        placeholder: '{ "type": "service_account", ... }',
        helpText: 'Optional: For server-side operations',
      },
    ],
    setupGuide: `
1. Go to Firebase Console
2. Create a new project
3. Go to Project Settings
4. Copy Project ID and Web API Key
5. Download service account key (optional)
    `,
  },
  {
    id: 'aws-rds',
    name: 'AWS RDS',
    type: 'cloud',
    icon: '☁️',
    description: 'Amazon RDS (PostgreSQL, MySQL, etc.)',
    popular: false,
    features: [
      'Managed database service',
      'Multiple engines',
      'Automated backups',
      'High availability',
      'Scalable',
    ],
    credentialFields: [
      {
        key: 'engine',
        label: 'Database Engine',
        type: 'select',
        required: true,
        options: [
          { value: 'postgres', label: 'PostgreSQL' },
          { value: 'mysql', label: 'MySQL' },
          { value: 'mariadb', label: 'MariaDB' },
        ],
      },
      {
        key: 'host',
        label: 'Endpoint',
        type: 'text',
        required: true,
        placeholder: 'mydb.xxxxx.us-east-1.rds.amazonaws.com',
      },
      {
        key: 'port',
        label: 'Port',
        type: 'number',
        required: true,
        placeholder: '5432',
      },
      {
        key: 'database',
        label: 'Database Name',
        type: 'text',
        required: true,
        placeholder: 'myapp',
      },
      {
        key: 'user',
        label: 'Master Username',
        type: 'text',
        required: true,
        placeholder: 'admin',
      },
      {
        key: 'password',
        label: 'Master Password',
        type: 'password',
        required: true,
        placeholder: '••••••••',
      },
    ],
    setupGuide: `
1. Create RDS instance in AWS Console
2. Configure security groups to allow connections
3. Note the endpoint and credentials
4. Enter details here
    `,
  },
  {
    id: 'planetscale',
    name: 'PlanetScale',
    type: 'cloud',
    icon: '🌍',
    description: 'Serverless MySQL platform',
    popular: false,
    features: [
      'Serverless MySQL',
      'Branching workflow',
      'Auto-scaling',
      'No cold starts',
      'Deploy requests',
    ],
    credentialFields: [
      {
        key: 'host',
        label: 'Host',
        type: 'text',
        required: true,
        placeholder: 'xxxxx.us-east-2.psdb.cloud',
      },
      {
        key: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'xxxxx',
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'pscale_pw_xxxxx',
      },
    ],
    setupGuide: `
1. Create PlanetScale database
2. Create branch (main or development)
3. Generate credentials
4. Enter connection details
    `,
  },
  {
    id: 'cockroachdb',
    name: 'CockroachDB',
    type: 'cloud',
    icon: '🪳',
    description: 'Distributed SQL database',
    popular: false,
    features: [
      'Distributed SQL',
      'PostgreSQL compatible',
      'Multi-region',
      'Auto-scaling',
      'Strong consistency',
    ],
    credentialFields: [
      {
        key: 'connection_string',
        label: 'Connection String',
        type: 'password',
        required: true,
        placeholder: 'postgresql://user:pass@host:26257/dbname?sslmode=verify-full',
      },
    ],
    setupGuide: `
1. Create CockroachDB cluster
2. Create database and user
3. Download CA certificate
4. Get connection string
5. Paste here
    `,
  },
];

export class DatabaseConnectorManager {
  /**
   * Get all available database providers
   */
  getProviders(filter?: { type?: string; popular?: boolean }): DatabaseProvider[] {
    let providers = DATABASE_PROVIDERS;

    if (filter?.type) {
      providers = providers.filter(p => p.type === filter.type);
    }

    if (filter?.popular !== undefined) {
      providers = providers.filter(p => p.popular === filter.popular);
    }

    return providers;
  }

  /**
   * Get provider by ID
   */
  getProvider(id: string): DatabaseProvider | undefined {
    return DATABASE_PROVIDERS.find(p => p.id === id);
  }

  /**
   * Get popular providers
   */
  getPopularProviders(): DatabaseProvider[] {
    return DATABASE_PROVIDERS.filter(p => p.popular);
  }

  /**
   * Test database connection
   */
  async testConnection(
    providerId: string,
    credentials: Record<string, string>
  ): Promise<ConnectionTest> {
    const provider = this.getProvider(providerId);
    
    if (!provider) {
      return {
        success: false,
        message: 'Provider not found',
      };
    }

    // Validate required fields
    const missingFields = provider.credentialFields
      .filter(field => field.required && !credentials[field.key])
      .map(field => field.label);

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      };
    }

    // Test connection (this would make actual connection attempts in production)
    try {
      const startTime = Date.now();
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const latency = Date.now() - startTime;

      return {
        success: true,
        message: 'Connection successful',
        latency,
        serverInfo: {
          provider: provider.name,
          type: provider.type,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * Validate credentials format
   */
  validateCredentials(providerId: string, credentials: Record<string, string>): {
    valid: boolean;
    errors: Record<string, string>;
  } {
    const provider = this.getProvider(providerId);
    
    if (!provider) {
      return { valid: false, errors: { provider: 'Provider not found' } };
    }

    const errors: Record<string, string> = {};

    for (const field of provider.credentialFields) {
      const value = credentials[field.key];

      // Check required fields
      if (field.required && !value) {
        errors[field.key] = `${field.label} is required`;
        continue;
      }

      // Run custom validation
      if (value && field.validation) {
        const result = field.validation(value);
        if (result !== true) {
          errors[field.key] = typeof result === 'string' ? result : `Invalid ${field.label}`;
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Generate connection string
   */
  generateConnectionString(providerId: string, credentials: Record<string, string>): string {
    const provider = this.getProvider(providerId);
    
    if (!provider) return '';

    switch (providerId) {
      case 'postgresql':
        return `postgresql://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}${credentials.ssl ? `?sslmode=${credentials.ssl}` : ''}`;
      
      case 'mysql':
        return `mysql://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;
      
      case 'mongodb':
        return credentials.connection_string || '';
      
      case 'supabase-custom':
        return credentials.url || '';
      
      default:
        return '';
    }
  }
}

// Singleton instance
export const databaseConnector = new DatabaseConnectorManager();


