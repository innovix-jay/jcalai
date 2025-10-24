import { NextRequest, NextResponse } from 'next/server';
import { AutoOptimizer } from '@/services/auto-optimizer';

const optimizer = new AutoOptimizer();

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
