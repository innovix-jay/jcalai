/**
 * Vercel Deployment System
 * Handles one-click deployments to Vercel with automatic configuration
 */

import { createClient } from '@/lib/supabase/client';

export interface DeploymentConfig {
  projectId: string;
  projectName: string;
  environment: 'production' | 'staging' | 'preview';
  envVars?: Record<string, string>;
  customDomain?: string;
}

export interface DeploymentResult {
  success: boolean;
  deploymentId?: string;
  url?: string;
  error?: string;
  buildLog?: string;
}

export class VercelDeployer {
  private vercelToken: string;
  private vercelTeamId?: string;

  constructor(token?: string, teamId?: string) {
    this.vercelToken = token || process.env.VERCEL_TOKEN || '';
    this.vercelTeamId = teamId;
  }

  /**
   * Deploy a project to Vercel
   */
  async deploy(config: DeploymentConfig): Promise<DeploymentResult> {
    if (!this.vercelToken) {
      return {
        success: false,
        error: 'Vercel token not configured',
      };
    }

    try {
      // 1. Generate project files
      const projectFiles = await this.generateProjectFiles(config.projectId);

      // 2. Create Vercel deployment
      const deployment = await this.createVercelDeployment(
        config.projectName,
        projectFiles,
        config.envVars || {}
      );

      // 3. Wait for deployment to complete
      const result = await this.waitForDeployment(deployment.id);

      // 4. Save deployment record to database
      await this.saveDeploymentRecord(config.projectId, {
        platform: 'vercel',
        environment: config.environment,
        status: result.ready ? 'deployed' : 'failed',
        deploy_url: result.url,
        build_id: deployment.id,
        custom_domain: config.customDomain,
      });

      // 5. Configure custom domain if provided
      if (config.customDomain && result.ready) {
        await this.configureCustomDomain(deployment.id, config.customDomain);
      }

      return {
        success: result.ready,
        deploymentId: deployment.id,
        url: result.url,
        buildLog: result.buildLog,
      };
    } catch (error) {
      console.error('Deployment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate all project files for deployment
   */
  private async generateProjectFiles(projectId: string): Promise<Record<string, string>> {
    const supabase = createClient();

    // Load project data
    const { data: project } = await supabase
      .from('projects')
      .select('*, pages(*), components(*), database_schemas(*), api_endpoints(*)')
      .eq('id', projectId)
      .single();

    if (!project) {
      throw new Error('Project not found');
    }

    const files: Record<string, string> = {};

    // Generate package.json
    files['package.json'] = this.generatePackageJson(project);

    // Generate Next.js config
    files['next.config.js'] = this.generateNextConfig(project);

    // Generate environment file
    files['.env.example'] = this.generateEnvFile(project);

    // Generate pages
    for (const page of project.pages || []) {
      const pagePath = `app${page.path === '/' ? '/page.tsx' : `${page.path}/page.tsx`}`;
      files[pagePath] = this.generatePageComponent(page);
    }

    // Generate components
    for (const component of project.components || []) {
      files[`components/${component.name.toLowerCase()}.tsx`] = this.generateComponent(component);
    }

    // Generate API routes
    for (const endpoint of project.api_endpoints || []) {
      files[`app/api${endpoint.path}/route.ts`] = this.generateAPIRoute(endpoint);
    }

    // Generate layout
    files['app/layout.tsx'] = this.generateLayout(project);

    // Generate globals.css
    files['app/globals.css'] = this.generateGlobalCSS();

    // Generate tailwind.config.js
    files['tailwind.config.js'] = this.generateTailwindConfig();

    // Generate tsconfig.json
    files['tsconfig.json'] = this.generateTSConfig();

    // Generate README
    files['README.md'] = this.generateReadme(project);

    return files;
  }

  /**
   * Create deployment on Vercel
   */
  private async createVercelDeployment(
    projectName: string,
    files: Record<string, string>,
    envVars: Record<string, string>
  ): Promise<any> {
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        files: Object.entries(files).map(([file, data]) => ({
          file,
          data,
        })),
        projectSettings: {
          framework: 'nextjs',
          buildCommand: 'npm run build',
          outputDirectory: '.next',
        },
        env: Object.entries(envVars).map(([key, value]) => ({
          key,
          value,
          type: 'encrypted',
          target: ['production', 'preview'],
        })),
        target: 'production',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Vercel deployment failed: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Wait for deployment to complete
   */
  private async waitForDeployment(deploymentId: string): Promise<any> {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          Authorization: `Bearer ${this.vercelToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check deployment status');
      }

      const deployment = await response.json();

      if (deployment.readyState === 'READY') {
        return {
          ready: true,
          url: deployment.url,
          buildLog: deployment.buildLog,
        };
      }

      if (deployment.readyState === 'ERROR') {
        return {
          ready: false,
          error: deployment.error,
          buildLog: deployment.buildLog,
        };
      }

      // Wait 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error('Deployment timeout');
  }

  /**
   * Configure custom domain
   */
  private async configureCustomDomain(deploymentId: string, domain: string): Promise<void> {
    const response = await fetch('https://api.vercel.com/v9/projects/domains', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain,
      }),
    });

    if (!response.ok) {
      console.error('Failed to configure custom domain:', await response.json());
    }
  }

  /**
   * Save deployment record to database
   */
  private async saveDeploymentRecord(projectId: string, deploymentData: any): Promise<void> {
    const supabase = createClient();

    await supabase.from('deployments').insert({
      project_id: projectId,
      ...deploymentData,
    });
  }

  // File generation methods
  private generatePackageJson(project: any): string {
    return JSON.stringify(
      {
        name: project.name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
        },
        dependencies: {
          '@supabase/supabase-js': '^2.75.0',
          next: '^14.2.33',
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          tailwindcss: '^3.3.6',
          autoprefixer: '^10.4.16',
          postcss: '^8.4.32',
        },
        devDependencies: {
          '@types/node': '^20.10.5',
          '@types/react': '^18.2.45',
          '@types/react-dom': '^18.2.18',
          typescript: '^5.3.3',
          eslint: '^8.56.0',
          'eslint-config-next': '14.0.4',
        },
      },
      null,
      2
    );
  }

  private generateNextConfig(project: any): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['${project.config?.imageHost || 'localhost'}'],
  },
}

module.exports = nextConfig
`;
  }

  private generateEnvFile(project: any): string {
    return `# Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Add your custom environment variables here
`;
  }

  private generatePageComponent(page: any): string {
    return `export default function ${page.name.replace(/\s+/g, '')}Page() {
  return (
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold">${page.name}</h1>
      {/* Generated by JCAL.ai */}
    </div>
  );
}
`;
  }

  private generateComponent(component: any): string {
    return `export function ${component.name}() {
  return (
    <div>
      {/* ${component.name} component */}
    </div>
  );
}
`;
  }

  private generateAPIRoute(endpoint: any): string {
    return `import { NextResponse } from 'next/server';

export async function ${endpoint.method}(request: Request) {
  // ${endpoint.description || 'API endpoint'}
  
  return NextResponse.json({ message: 'Success' });
}
`;
  }

  private generateLayout(project: any): string {
    return `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${project.name}',
  description: '${project.description}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`;
  }

  private generateGlobalCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
  }

  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
  }

  private generateTSConfig(): string {
    return JSON.stringify(
      {
        compilerOptions: {
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          paths: {
            '@/*': ['./*'],
          },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
        exclude: ['node_modules'],
      },
      null,
      2
    );
  }

  private generateReadme(project: any): string {
    return `# ${project.name}

${project.description}

## Generated by JCAL.ai

This project was generated using JCAL.ai - the ultimate AI-powered no-code platform.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
Copy \`.env.example\` to \`.env.local\` and fill in your values.

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploy

Deploy to Vercel with one click or export and deploy anywhere.

---

Built with ❤️ using JCAL.ai
`;
  }
}

// Singleton instance
export const vercelDeployer = new VercelDeployer();


