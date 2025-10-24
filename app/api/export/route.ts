import { NextResponse } from 'next/server';
import { CodeExporter } from '@/services/code-exporter';

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const exporter = new CodeExporter();
    const zipBlob = await exporter.exportProject(projectId);

    // Return the ZIP file
    return new NextResponse(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="project-${projectId}.zip"`
      }
    });
  } catch (error: any) {
    console.error('[Export API] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
