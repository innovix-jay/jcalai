import { NextRequest, NextResponse } from 'next/server';
import { AutoOptimizer } from '@/services/auto-optimizer';

const optimizer = new AutoOptimizer();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const suggestions = await optimizer.analyzeProject(projectId);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Optimization analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze project' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, optimizationIds } = await req.json();

    if (!projectId || !optimizationIds) {
      return NextResponse.json(
        { error: 'Project ID and optimization IDs required' },
        { status: 400 }
      );
    }

    const result = await optimizer.applyOptimizations(projectId, optimizationIds);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Optimization application error:', error);
    return NextResponse.json(
      { error: 'Failed to apply optimizations' },
      { status: 500 }
    );
  }
}
