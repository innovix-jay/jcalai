import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';

    // Mock templates data - in production, this would come from database
    const templates = [
      {
        id: '1',
        name: 'E-commerce Store',
        description: 'Complete online store with cart, checkout, and payment',
        thumbnail: '/templates/ecommerce.jpg',
        price: 49,
        reviews: 128,
        category: 'ecommerce'
      },
      {
        id: '2',
        name: 'SaaS Dashboard',
        description: 'Modern dashboard with analytics and user management',
        thumbnail: '/templates/saas.jpg',
        price: 79,
        reviews: 95,
        category: 'saas'
      },
      {
        id: '3',
        name: 'Landing Page',
        description: 'High-converting landing page with contact forms',
        thumbnail: '/templates/landing.jpg',
        price: 29,
        reviews: 203,
        category: 'landing'
      }
    ];

    const filteredTemplates = category === 'all' 
      ? templates 
      : templates.filter(t => t.category === category);

    return NextResponse.json({ templates: filteredTemplates });
  } catch (error) {
    console.error('Marketplace error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
