import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PAGE_TEMPLATES: Record<string, any> = {
  blank: {
    structure: { type: 'div', props: { className: 'p-8' }, children: [] }
  },
  home: {
    structure: {
      type: 'div',
      props: { className: 'min-h-screen' },
      children: [
        {
          type: 'section',
          props: { className: 'py-20 text-center' },
          children: [
            { type: 'h1', props: { className: 'text-4xl font-bold mb-4' }, children: 'Welcome' },
            { type: 'p', props: { className: 'text-xl' }, children: 'This is your home page' }
          ]
        }
      ]
    }
  },
  about: {
    structure: {
      type: 'div',
      props: { className: 'container mx-auto px-4 py-16' },
      children: [
        { type: 'h1', props: { className: 'text-3xl font-bold mb-8' }, children: 'About Us' },
        { type: 'p', props: { className: 'text-lg' }, children: 'Tell your story here...' }
      ]
    }
  },
  contact: {
    structure: {
      type: 'div',
      props: { className: 'container mx-auto px-4 py-16' },
      children: [
        { type: 'h1', props: { className: 'text-3xl font-bold mb-8' }, children: 'Contact Us' },
        { type: 'form', props: { className: 'max-w-md' }, children: [] }
      ]
    }
  },
  products: {
    structure: {
      type: 'div',
      props: { className: 'container mx-auto px-4 py-16' },
      children: [
        { type: 'h1', props: { className: 'text-3xl font-bold mb-8' }, children: 'Products' },
        { type: 'div', props: { className: 'grid grid-cols-3 gap-6' }, children: [] }
      ]
    }
  },
  dashboard: {
    structure: {
      type: 'div',
      props: { className: 'min-h-screen bg-gray-100' },
      children: [
        { type: 'header', props: { className: 'bg-white shadow p-4' }, children: [] },
        { type: 'main', props: { className: 'p-8' }, children: [] }
      ]
    }
  },
  settings: {
    structure: {
      type: 'div',
      props: { className: 'container mx-auto px-4 py-16' },
      children: [
        { type: 'h1', props: { className: 'text-3xl font-bold mb-8' }, children: 'Settings' },
        { type: 'div', props: { className: 'space-y-6' }, children: [] }
      ]
    }
  }
};

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

    // Get template structure
    const templateData = PAGE_TEMPLATES[template] || PAGE_TEMPLATES.blank;

    // Create the page
    const { data: newPage, error: createError } = await supabase
      .from('pages')
      .insert({
        project_id: projectId,
        name,
        path,
        structure: templateData.structure,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating page:', createError);
      return NextResponse.json(
        { error: 'Failed to create page' },
        { status: 500 }
      );
    }

    return NextResponse.json(newPage);
  } catch (error) {
    console.error('Error in create page API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

