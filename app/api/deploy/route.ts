import { NextResponse } from 'next/server';
import { VercelDeploymentService } from '@/services/vercel-deployment';

export async function POST(req: Request) {
  try {
    const { projectId, projectName } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const deploymentService = new VercelDeploymentService();
    
    // Get project files
    const files = await deploymentService.getProjectFiles(projectId);
    
    // Deploy to Vercel
    const result = await deploymentService.deployProject(
      projectId,
      projectName || `jcal-project-${projectId}`,
      files
    );

    if (result.success) {
      // TODO: Save deployment info to database
      return NextResponse.json({
        success: true,
        url: result.url,
        deploymentId: result.deploymentId
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Deploy API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
