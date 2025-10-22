/**
 * Template Management System
 * Pre-built templates for common app types
 */

import { createClient } from '@/lib/supabase/client';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'ecommerce' | 'saas' | 'landing' | 'blog' | 'portfolio' | 'admin' | 'crm' | 'marketplace' | 'learning';
  thumbnail_url?: string;
  preview_url?: string;
  tags: string[];
  features: string[];
  structure: any;
  is_free: boolean;
  price?: number;
}

export const BUILT_IN_TEMPLATES: Omit<Template, 'id'>[] = [
  {
    name: 'SaaS Dashboard',
    description: 'Complete SaaS application with user authentication, subscription management, and analytics dashboard.',
    category: 'saas',
    tags: ['authentication', 'subscriptions', 'analytics', 'dashboard'],
    features: [
      'User authentication with OAuth',
      'Stripe subscription integration',
      'Analytics dashboard with charts',
      'User settings and profile management',
      'Team collaboration features',
      'API key management',
    ],
    is_free: true,
    structure: {
      pages: [
        { name: 'Landing Page', path: '/', isProtected: false },
        { name: 'Dashboard', path: '/dashboard', isProtected: true },
        { name: 'Analytics', path: '/analytics', isProtected: true },
        { name: 'Settings', path: '/settings', isProtected: true },
        { name: 'Billing', path: '/billing', isProtected: true },
      ],
      database: {
        tables: [
          {
            name: 'users',
            columns: [
              { name: 'id', type: 'uuid', nullable: false, unique: true },
              { name: 'email', type: 'text', nullable: false, unique: true },
              { name: 'full_name', type: 'text', nullable: true },
              { name: 'avatar_url', type: 'text', nullable: true },
              { name: 'subscription_status', type: 'text', nullable: true },
              { name: 'created_at', type: 'timestamp', nullable: false },
            ],
          },
          {
            name: 'subscriptions',
            columns: [
              { name: 'id', type: 'uuid', nullable: false, unique: true },
              { name: 'user_id', type: 'uuid', nullable: false },
              { name: 'plan', type: 'text', nullable: false },
              { name: 'status', type: 'text', nullable: false },
              { name: 'stripe_subscription_id', type: 'text', nullable: true },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'E-commerce Store',
    description: 'Full-featured e-commerce platform with product catalog, shopping cart, and payment processing.',
    category: 'ecommerce',
    tags: ['ecommerce', 'products', 'cart', 'payments', 'stripe'],
    features: [
      'Product catalog with search and filters',
      'Shopping cart functionality',
      'Stripe payment integration',
      'Order management',
      'Admin dashboard',
      'Inventory tracking',
    ],
    is_free: true,
    structure: {
      pages: [
        { name: 'Home', path: '/', isProtected: false },
        { name: 'Products', path: '/products', isProtected: false },
        { name: 'Product Detail', path: '/products/[id]', isProtected: false },
        { name: 'Cart', path: '/cart', isProtected: false },
        { name: 'Checkout', path: '/checkout', isProtected: true },
        { name: 'Orders', path: '/orders', isProtected: true },
        { name: 'Admin', path: '/admin', isProtected: true },
      ],
      database: {
        tables: [
          {
            name: 'products',
            columns: [
              { name: 'id', type: 'uuid', nullable: false, unique: true },
              { name: 'name', type: 'text', nullable: false },
              { name: 'description', type: 'text', nullable: true },
              { name: 'price', type: 'decimal', nullable: false },
              { name: 'image_url', type: 'text', nullable: true },
              { name: 'stock', type: 'integer', nullable: false },
              { name: 'category', type: 'text', nullable: true },
            ],
          },
          {
            name: 'orders',
            columns: [
              { name: 'id', type: 'uuid', nullable: false, unique: true },
              { name: 'user_id', type: 'uuid', nullable: false },
              { name: 'total', type: 'decimal', nullable: false },
              { name: 'status', type: 'text', nullable: false },
              { name: 'created_at', type: 'timestamp', nullable: false },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'Task Management',
    description: 'Project and task management tool with team collaboration features.',
    category: 'dashboard',
    tags: ['tasks', 'projects', 'collaboration', 'kanban'],
    features: [
      'Kanban board view',
      'Task assignment and tracking',
      'Team collaboration',
      'Project timelines',
      'File attachments',
      'Activity tracking',
    ],
    is_free: true,
    structure: {
      pages: [
        { name: 'Projects', path: '/projects', isProtected: true },
        { name: 'Tasks', path: '/tasks', isProtected: true },
        { name: 'Calendar', path: '/calendar', isProtected: true },
        { name: 'Team', path: '/team', isProtected: true },
      ],
      database: {
        tables: [
          {
            name: 'projects',
            columns: [
              { name: 'id', type: 'uuid', nullable: false, unique: true },
              { name: 'name', type: 'text', nullable: false },
              { name: 'description', type: 'text', nullable: true },
              { name: 'owner_id', type: 'uuid', nullable: false },
              { name: 'created_at', type: 'timestamp', nullable: false },
            ],
          },
          {
            name: 'tasks',
            columns: [
              { name: 'id', type: 'uuid', nullable: false, unique: true },
              { name: 'project_id', type: 'uuid', nullable: false },
              { name: 'title', type: 'text', nullable: false },
              { name: 'description', type: 'text', nullable: true },
              { name: 'assigned_to', type: 'uuid', nullable: true },
              { name: 'status', type: 'text', nullable: false },
              { name: 'priority', type: 'text', nullable: true },
              { name: 'due_date', type: 'timestamp', nullable: true },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'Landing Page',
    description: 'Beautiful, conversion-optimized landing page template.',
    category: 'landing',
    tags: ['marketing', 'landing', 'conversion', 'responsive'],
    features: [
      'Hero section with CTA',
      'Feature showcase',
      'Testimonials',
      'Pricing tables',
      'Contact form',
      'Newsletter signup',
    ],
    is_free: true,
    structure: {
      pages: [
        { name: 'Home', path: '/', isProtected: false },
        { name: 'Features', path: '/features', isProtected: false },
        { name: 'Pricing', path: '/pricing', isProtected: false },
        { name: 'Contact', path: '/contact', isProtected: false },
      ],
      database: {
        tables: [
          {
            name: 'leads',
            columns: [
              { name: 'id', type: 'uuid', nullable: false, unique: true },
              { name: 'email', type: 'text', nullable: false },
              { name: 'name', type: 'text', nullable: true },
              { name: 'message', type: 'text', nullable: true },
              { name: 'created_at', type: 'timestamp', nullable: false },
            ],
          },
        ],
      },
    },
  },
];

export class TemplateManager {
  /**
   * Get all available templates
   */
  async getTemplates(category?: string): Promise<Template[]> {
    const supabase = createClient();

    let query = supabase.from('templates').select('*').eq('is_public', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('usage_count', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get featured templates
   */
  async getFeaturedTemplates(): Promise<Template[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .eq('is_featured', true)
      .order('usage_count', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching featured templates:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a project from a template
   */
  async createFromTemplate(templateId: string, userId: string, projectName?: string): Promise<string> {
    const supabase = createClient();

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      throw new Error('Template not found');
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: projectName || template.name,
        description: template.description,
        app_type: template.app_type || 'web',
        status: 'draft',
        config: template.project_structure?.config || {},
      })
      .select()
      .single();

    if (projectError || !project) {
      throw new Error('Failed to create project');
    }

    // Create pages
    if (template.pages && template.pages.length > 0) {
      const pages = template.pages.map((page: any, index: number) => ({
        project_id: project.id,
        name: page.name,
        slug: page.name.toLowerCase().replace(/\s+/g, '-'),
        path: page.path,
        is_protected: page.isProtected || false,
        structure: page.structure || {},
        order_index: index,
        is_home: index === 0,
      }));

      await supabase.from('pages').insert(pages);
    }

    // Create database schema
    if (template.project_structure?.database) {
      await supabase.from('database_schemas').insert({
        project_id: project.id,
        name: 'Initial Schema',
        tables: template.project_structure.database.tables || [],
      });
    }

    // Update template usage count
    await supabase
      .from('templates')
      .update({
        usage_count: (template.usage_count || 0) + 1,
      })
      .eq('id', templateId);

    return project.id;
  }

  /**
   * Initialize built-in templates in the database
   */
  async initializeBuiltInTemplates(): Promise<void> {
    const supabase = createClient();

    for (const template of BUILT_IN_TEMPLATES) {
      // Check if template already exists
      const { data: existing } = await supabase
        .from('templates')
        .select('id')
        .eq('name', template.name)
        .eq('is_official', true)
        .single();

      if (!existing) {
        await supabase.from('templates').insert({
          ...template,
          is_public: true,
          is_official: true,
          is_featured: true,
          project_structure: template.structure,
          pages: template.structure.pages,
        });
      }
    }
  }
}

// Singleton instance
export const templateManager = new TemplateManager();


