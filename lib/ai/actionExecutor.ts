import { createClient } from '@/lib/supabase/client';

export async function executeActions(projectId: string, actions: any[]) {       
  const supabase = createClient();
  const results = [];

  for (const action of actions) {
    try {
      let result;

      switch (action.type) {
        case 'create_page':
          result = await createPage(supabase, projectId, action.data);
          break;

        case 'add_component':
          result = await addComponent(supabase, projectId, action.data);        
          break;

        case 'create_table':
          result = await createDatabaseTable(supabase, projectId, action.data); 
          break;

        default:
          console.warn('Unknown action type:', action.type);
          result = { error: `Unknown action type: ${action.type}` };
      }

      results.push({ success: true, action: action.type, data: result });       
    } catch (error: any) {
      console.error(`Failed to execute ${action.type}:`, error);
      results.push({ success: false, action: action.type, error: error.message });                                                                              
    }
  }

  return results;
}

async function createPage(supabase: any, projectId: string, pageData: any) {    
  const { name, path, template = 'blank' } = pageData;

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Generate page content based on template
  const content = generatePageContent(template, name);

  const { data, error } = await supabase
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

  if (error) throw error;

  // Log activity
  await supabase.from('project_activity').insert({
    project_id: projectId,
    action_type: 'page_created',
    description: `Created page: ${name}`,
    metadata: { page_id: data.id, template }
  });

  return data;
}

async function addComponent(supabase: any, projectId: string, componentData: any) {                                                                             
  const { name, type, code, props = {} } = componentData;

  const { data, error } = await supabase
    .from('components')
    .insert({
      project_id: projectId,
      name: name,
      type: type,
      code: code,
      props: props,
    })
    .select()
    .single();

  if (error) throw error;

  // Log activity
  await supabase.from('project_activity').insert({
    project_id: projectId,
    action_type: 'component_added',
    description: `Added component: ${name}`,
    metadata: { component_id: data.id, type }
  });

  return data;
}

async function createDatabaseTable(supabase: any, projectId: string, tableData: any) {                                                                          
  const { name, fields } = tableData;

  const { data, error } = await supabase
    .from('database_schemas')
    .insert({
      project_id: projectId,
      table_name: name,
      schema: {
        fields: fields,
        created_at: new Date().toISOString()
      }
    })
    .select()
    .single();

  if (error) throw error;

  // Log activity
  await supabase.from('project_activity').insert({
    project_id: projectId,
    action_type: 'table_created',
    description: `Created table: ${name}`,
    metadata: { schema_id: data.id, field_count: fields.length }
  });

  return data;
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
