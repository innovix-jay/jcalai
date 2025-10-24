import { NextRequest, NextResponse } from 'next/server';
import { SmartDatabaseDesigner } from '@/services/smart-database-designer';

const designer = new SmartDatabaseDesigner();

export async function POST(req: NextRequest) {
  try {
    const { projectId, description } = await req.json();

    if (!projectId || !description) {
      return NextResponse.json(
        { error: 'Project ID and description required' },
        { status: 400 }
      );
    }

    const schema = await designer.designSchema(description);

    return NextResponse.json({ schema });
  } catch (error) {
    console.error('Database design error:', error);
    return NextResponse.json(
      { error: 'Failed to design database schema' },
      { status: 500 }
    );
  }
}
