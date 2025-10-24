import JSZip from 'jszip';
import { createClient } from '@/lib/supabase/client';

export class CodeExporter {
  async exportProject(projectId: string): Promise<Blob> {
    const supabase = createClient();
    
    // Fetch project data
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    const { data: pages } = await supabase
      .from('pages')
      .select('*')
      .eq('project_id', projectId);

    const { data: components } = await supabase
      .from('components')
      .select('*')
      .eq('project_id', projectId);

    // Create ZIP file
    const zip = new JSZip();

    // Add package.json
    zip.file('package.json', JSON.stringify({
      name: project?.name.toLowerCase().replace(/\s+/g, '-') || 'jcal-project',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        'next': '^14.2.0',
        'react': '^18.3.0',
        'react-dom': '^18.3.0',
        '@supabase/supabase-js': '^2.39.0',
        'tailwindcss': '^3.4.0',
        'autoprefixer': '^10.4.0',
        'postcss': '^8.4.0'
      },
      devDependencies: {
        '@types/node': '^20',
        '@types/react': '^18',
        '@types/react-dom': '^18',
        'typescript': '^5',
        'eslint': '^8',
        'eslint-config-next': '14.2.0'
      }
    }, null, 2));

    // Add next.config.js
    zip.file('next.config.js', `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig`);

    // Add tailwind.config.js
    zip.file('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`);

    // Add tsconfig.json
    zip.file('tsconfig.json', JSON.stringify({
      compilerOptions: {
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./*']
        }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    }, null, 2));

    // Add .env.example
    zip.file('.env.example', `# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Add your environment variables here`);

    // Add README.md
    zip.file('README.md', this.generateReadme(project?.name || 'JCAL.ai Project'));

    // Add app/layout.tsx
    zip.file('app/layout.tsx', `import './globals.css'

export const metadata = {
  title: '${project?.name || 'JCAL.ai App'}',
  description: '${project?.description || 'Built with JCAL.ai'}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`);

    // Add app/globals.css
    zip.file('app/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`);

    // Add pages
    if (pages && pages.length > 0) {
      for (const page of pages) {
        const pagePath = page.is_home ? 'app/page.tsx' : `app/${page.slug}/page.tsx`;
        zip.file(pagePath, this.generatePageCode(page));
      }
    } else {
      // Add default page
      zip.file('app/page.tsx', `export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to ${project?.name || 'Your App'}</h1>
      <p className="text-gray-600">Built with JCAL.ai - No-code AI app builder</p>
    </main>
  )
}`);
    }

    // Add components
    if (components && components.length > 0) {
      for (const component of components) {
        zip.file(`components/${component.name}.tsx`, component.code || '');
      }
    }

    // Generate ZIP file
    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
  }

  private generateReadme(projectName: string): string {
    return `# ${projectName}

Built with [JCAL.ai](https://jcalai.com) - AI-powered no-code app builder

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create \`.env.local\` file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. Add your environment variables to \`.env.local\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- \`/app\` - Next.js app directory
- \`/components\` - React components
- \`/lib\` - Utility functions
- \`/public\` - Static assets

## Deployment

Deploy to Vercel:

\`\`\`bash
vercel
\`\`\`

Or use the [Vercel Dashboard](https://vercel.com/new)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [JCAL.ai Documentation](https://jcalai.com/docs)

## Built With

- Next.js 14
- React 18
- Tailwind CSS
- TypeScript

---

Made with ❤️ using JCAL.ai
`;
  }

  private generatePageCode(page: any): string {
    return `'use client';

export default function ${page.name.replace(/\s+/g, '')}Page() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">${page.name}</h1>
      <p className="text-gray-600">${page.description || 'Page description'}</p>
      
      {/* Page content will be generated here */}
    </div>
  );
}`;
  }
}
