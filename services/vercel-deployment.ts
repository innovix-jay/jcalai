export class VercelDeploymentService {
  private vercelToken: string;
  private teamId?: string;

  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN || '';
    this.teamId = process.env.VERCEL_TEAM_ID;
  }

  async deployProject(
    projectId: string,
    projectName: string,
    files: Record<string, string>
  ): Promise<{
    success: boolean;
    url?: string;
    deploymentId?: string;
    error?: string;
  }> {
    try {
      console.log(`[Vercel] Starting deployment for project: ${projectId}`);

      // Prepare files for deployment
      const deploymentFiles = Object.entries(files).map(([path, content]) => ({
        file: path,
        data: content,
      }));

      // Create deployment via Vercel API
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json',
          ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
        },
        body: JSON.stringify({
          name: `jcal-${projectId.substring(0, 8)}`,
          files: deploymentFiles,
          projectSettings: {
            framework: 'nextjs',
            buildCommand: 'npm run build',
            outputDirectory: '.next',
            installCommand: 'npm install',
            devCommand: 'npm run dev'
          },
          target: 'production',
          gitSource: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Vercel API error: ${errorData.error?.message || response.statusText}`);
      }

      const deployment = await response.json();

      console.log(`[Vercel] Deployment created: ${deployment.id}`);

      // Wait for deployment to complete
      const finalStatus = await this.waitForDeployment(deployment.id);

      if (finalStatus.readyState === 'READY') {
        const url = `https://${deployment.url}`;
        console.log(`[Vercel] Deployment successful: ${url}`);

        return {
          success: true,
          url,
          deploymentId: deployment.id
        };
      } else {
        throw new Error(`Deployment failed with status: ${finalStatus.readyState}`);
      }
    } catch (error: any) {
      console.error('[Vercel] Deployment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async waitForDeployment(deploymentId: string, maxAttempts = 60): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

      const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
        }
      });

      const deployment = await response.json();

      console.log(`[Vercel] Deployment status: ${deployment.readyState} (attempt ${i + 1})`);

      if (deployment.readyState === 'READY' || deployment.readyState === 'ERROR') {
        return deployment;
      }

      // Broadcast progress
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('deployment-progress', {
          detail: {
            deploymentId,
            status: deployment.readyState,
            progress: Math.min((i / maxAttempts) * 100, 95)
          }
        }));
      }
    }

    throw new Error('Deployment timeout');
  }

  async addCustomDomain(deploymentId: string, domain: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch('https://api.vercel.com/v9/projects/{projectId}/domains', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json',
          ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
        },
        body: JSON.stringify({ name: domain })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to add domain');
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProjectFiles(projectId: string): Promise<Record<string, string>> {
    // TODO: Fetch from database/storage
    // For now, return a basic Next.js structure
    return {
      'package.json': JSON.stringify({
        name: `jcal-project-${projectId}`,
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start'
        },
        dependencies: {
          'next': '14.2.33',
          'react': '18.3.1',
          'react-dom': '18.3.1'
        }
      }, null, 2),
      'next.config.js': `module.exports = { reactStrictMode: true };`,
      'app/page.tsx': `export default function Home() { return <div>Hello from JCAL.ai!</div>; }`,
      'app/layout.tsx': `export default function RootLayout({ children }: { children: React.ReactNode }) { return <html><body>{children}</body></html>; }`
    };
  }
}
