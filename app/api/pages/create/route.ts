import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, name, path, template = 'blank' } = await req.json();

    if (!projectId || !name || !path) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Generate page content based on template
    const content = generatePageContent(template, name);

    // Create the page with correct schema
    const { data: newPage, error: createError } = await supabase
      .from('pages')
      .insert({
        project_id: projectId,
        name: name,
        slug: slug,
        path: path,
        template: template,
        content: content,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating page:', createError);
      return NextResponse.json(
        { 
          error: 'Failed to create page', 
          details: createError.message,
          code: createError.code 
        },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('project_activity').insert({
      project_id: projectId,
      action_type: 'page_created',
      description: `Created page: ${name}`,
      metadata: { page_id: newPage.id, template }
    });

    return NextResponse.json({ success: true, page: newPage });
  } catch (error: any) {
    console.error('Error in create page API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

function generatePageContent(template: string, pageName: string): string {
  const cleanName = pageName.replace(/[^a-zA-Z0-9]/g, '');
  
  const templates = {
    blank: `export default function ${cleanName}() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">${pageName}</h1>
      <p>Start building your page here.</p>
    </div>
  );
}`,
    form: `export default function ${cleanName}() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">${pageName}</h1>
      <form className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
          Submit
        </button>
      </form>
    </div>
  );
}`,
    list: `export default function ${cleanName}() {
  const items = [
    { id: 1, title: 'Item 1', description: 'Description 1' },
    { id: 2, title: 'Item 2', description: 'Description 2' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">${pageName}</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    detail: `export default function ${cleanName}() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">${pageName}</h1>
        <div className="prose prose-lg">
          <p>This is a detail page template with rich content layout.</p>
          <h2>Section 1</h2>
          <p>Add your content here.</p>
          <h2>Section 2</h2>
          <p>More content goes here.</p>
        </div>
      </div>
    </div>
  );
}`
  };

  return templates[template as keyof typeof templates] || templates.blank;
}

