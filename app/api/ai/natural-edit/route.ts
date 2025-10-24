import { NextResponse } from 'next/server';
import { NaturalLanguageEditor } from '@/services/natural-language-editor';

export async function POST(req: Request) {
  try {
    const { projectId, command } = await req.json();

    if (!projectId || !command) {
      return NextResponse.json(
        { error: 'Project ID and command are required' },
        { status: 400 }
      );
    }

    const editor = new NaturalLanguageEditor();

    // Parse the command
    const intent = await editor.parseEditCommand(command, {
      currentPage: 'index',
      components: [],
      fileStructure: {}
    });

    console.log('[Natural Edit] Intent:', intent);

    // Apply the edit (in production, fetch actual files)
    const files = {
      'app/page.tsx': '// Placeholder content'
    };

    const result = await editor.applyEdit(intent, projectId, files);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Natural Edit] Error:', error);
    return NextResponse.json(
      { error: error.message, details: error.stack },
      { status: 500 }
    );
  }
}
