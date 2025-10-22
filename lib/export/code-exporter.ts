/**
 * Code Export System
 * Generates and exports complete project source code as downloadable ZIP
 */

import JSZip from 'jszip';
import { createClient } from '@/lib/supabase/client';

export interface ExportOptions {
  projectId: string;
  includeNodeModules?: boolean;
  includeEnv?: boolean;
  format?: 'zip' | 'tar';
}

export class CodeExporter {
  /**
   * Export complete project as ZIP file
   */
  async exportProject(options: ExportOptions): Promise<Blob> {
    const supabase = createClient();

    // Load complete project data
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        pages(*),
        components(*),
        database_schemas(*),
        api_endpoints(*),
        integrations(*)
      `)
      .eq('id', options.projectId)
      .single();

    if (error || !project) {
      throw new Error('Failed to load project data');
    }

    // Create ZIP file
    const zip = new JSZip();

    // Add all project files
    this.addCoreFiles(zip, project);
    this.addPages(zip, project.pages || []);
    this.addComponents(zip, project.components || []);
    this.addAPIRoutes(zip, project.api_endpoints || []);
    this.addDatabaseMigrations(zip, project.database_schemas || []);
    this.addConfiguration(zip, project, options.includeEnv);
    this.addDocumentation(zip, project);

    // Generate ZIP blob
    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
  }

  /**
   * Add core project files
   */
  private addCoreFiles(zip: JSZip, project: any): void {
    // package.json
    zip.file(
      'package.json',
      JSON.stringify(
        {
          name: project.name.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          description: project.description,
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
            lint: 'next lint',
            'type-check': 'tsc --noEmit',
          },
          dependencies: {
            '@supabase/supabase-js': '^2.75.0',
            '@supabase/ssr': '^0.7.0',
            next: '^14.2.33',
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            'react-hot-toast': '^2.4.1',
            tailwindcss: '^3.3.6',
            autoprefixer: '^10.4.16',
            postcss: '^8.4.32',
            clsx: '^2.0.0',
            'tailwind-merge': '^2.2.0',
          },
          devDependencies: {
            '@types/node': '^20.10.5',
            '@types/react': '^18.2.45',
            '@types/react-dom': '^18.2.18',
            typescript: '^5.3.3',
            eslint: '^8.56.0',
            'eslint-config-next': '14.0.4',
          },
        },
        null,
        2
      )
    );

    // next.config.js
    zip.file(
      'next.config.js',
      `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['${project.config?.imageHost || 'localhost'}'],
  },
}

module.exports = nextConfig
`
    );

    // tsconfig.json
    zip.file(
      'tsconfig.json',
      JSON.stringify(
        {
          compilerOptions: {
            target: 'es5',
            lib: ['dom', 'dom.iterable', 'esnext'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
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
              '@/*': ['./*'],
            },
          },
          include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
          exclude: ['node_modules'],
        },
        null,
        2
      )
    );

    // tailwind.config.js
    zip.file(
      'tailwind.config.js',
      `/** @type {import('tailwindcss').Config} */
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
}
`
    );

    // postcss.config.js
    zip.file(
      'postcss.config.js',
      `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
    );

    // .gitignore
    zip.file(
      '.gitignore',
      `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`
    );

    // globals.css
    zip.file(
      'app/globals.css',
      `@tailwind base;
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
}
`
    );

    // Root layout
    zip.file(
      'app/layout.tsx',
      `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${project.name}',
  description: '${project.description}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
`
    );

    // Supabase client
    zip.file(
      'lib/supabase/client.ts',
      `import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
`
    );

    // Utilities
    zip.file(
      'lib/utils.ts',
      `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
    );
  }

  /**
   * Add page files
   */
  private addPages(zip: JSZip, pages: any[]): void {
    for (const page of pages) {
      const pagePath = page.path === '/' ? 'app/page.tsx' : `app${page.path}/page.tsx`;
      
      zip.file(
        pagePath,
        `export default function ${page.name.replace(/\s+/g, '')}Page() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">${page.name}</h1>
      <p className="text-gray-600">${page.description || 'Page content goes here'}</p>
      {/* Add your content here */}
    </div>
  );
}
`
      );
    }
  }

  /**
   * Add component files
   */
  private addComponents(zip: JSZip, components: any[]): void {
    for (const component of components) {
      const componentName = component.name.replace(/\s+/g, '');
      
      zip.file(
        `components/${componentName.toLowerCase()}.tsx`,
        `interface ${componentName}Props {
  // Add your props here
}

export function ${componentName}(props: ${componentName}Props) {
  return (
    <div>
      {/* ${component.description || component.name} */}
    </div>
  );
}
`
      );
    }
  }

  /**
   * Add API route files
   */
  private addAPIRoutes(zip: JSZip, endpoints: any[]): void {
    for (const endpoint of endpoints) {
      zip.file(
        `app/api${endpoint.path}/route.ts`,
        `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

/**
 * ${endpoint.description || endpoint.name}
 */
export async function ${endpoint.method}(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Add your logic here
    
    return NextResponse.json({ 
      success: true,
      message: 'Success'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
      );
    }
  }

  /**
   * Add database migration files
   */
  private addDatabaseMigrations(zip: JSZip, schemas: any[]): void {
    if (schemas.length === 0) return;

    for (const schema of schemas) {
      if (!schema.tables || schema.tables.length === 0) continue;

      let migrationSQL = `-- Database migration for ${schema.name}\n\n`;

      for (const table of schema.tables) {
        migrationSQL += `CREATE TABLE IF NOT EXISTS ${table.name} (\n`;
        
        const columns = table.columns || [];
        migrationSQL += columns
          .map((col: any) => {
            const parts = [
              `  ${col.name}`,
              col.type.toUpperCase(),
              col.nullable === false ? 'NOT NULL' : '',
              col.unique ? 'UNIQUE' : '',
            ].filter(Boolean);
            return parts.join(' ');
          })
          .join(',\n');

        migrationSQL += `\n);\n\n`;

        // Add indexes
        if (columns.some((col: any) => col.unique)) {
          columns
            .filter((col: any) => col.unique)
            .forEach((col: any) => {
              migrationSQL += `CREATE INDEX IF NOT EXISTS idx_${table.name}_${col.name} ON ${table.name}(${col.name});\n`;
            });
          migrationSQL += '\n';
        }
      }

      zip.file(`supabase/migrations/${schema.id}_${schema.name}.sql`, migrationSQL);
    }
  }

  /**
   * Add configuration files
   */
  private addConfiguration(zip: JSZip, project: any, includeEnv?: boolean): void {
    // .env.example
    zip.file(
      '.env.example',
      `# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Add your environment variables here
`
    );

    // If includeEnv is true, add actual .env.local (sanitized)
    if (includeEnv) {
      zip.file(
        '.env.local',
        `# Generated by JCAL.ai
# Remember to update these values with your actual credentials

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
`
      );
    }
  }

  /**
   * Add documentation files
   */
  private addDocumentation(zip: JSZip, project: any): void {
    // README.md
    zip.file(
      'README.md',
      `# ${project.name}

${project.description}

## 🚀 Generated by JCAL.ai

This project was automatically generated using **JCAL.ai** - the ultimate AI-powered no-code platform.

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)

## 🛠️ Installation

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Set up environment variables:**
Copy \`.env.example\` to \`.env.local\` and fill in your Supabase credentials:
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. **Run database migrations:**
Use the Supabase CLI or run the migrations in \`supabase/migrations/\` in your Supabase dashboard.

4. **Start the development server:**
\`\`\`bash
npm run dev
\`\`\`

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
${project.name}/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── (pages)/         # Application pages
│   ├── globals.css      # Global styles
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
├── lib/                 # Utility functions
│   ├── supabase/       # Supabase client
│   └── utils.ts        # Helper functions
├── supabase/           # Database migrations
├── public/             # Static assets
└── package.json        # Dependencies

\`\`\`

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

Or use the Vercel CLI:
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Deploy to Netlify

\`\`\`bash
npm run build
netlify deploy --prod
\`\`\`

## 🔧 Configuration

Edit \`next.config.js\` to customize your Next.js configuration.

Edit \`tailwind.config.js\` to customize your Tailwind theme.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JCAL.ai Documentation](https://jcalai.com/docs)

## 🤝 Support

Need help? Visit [JCAL.ai Support](https://jcalai.com/support) or join our community.

---

**Built with ❤️ using [JCAL.ai](https://jcalai.com)**

*Empowering the next generation of builders*
`
    );

    // CONTRIBUTING.md
    zip.file(
      'CONTRIBUTING.md',
      `# Contributing to ${project.name}

Thank you for your interest in contributing!

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: \`npm install\`
4. Create a branch: \`git checkout -b feature/your-feature\`
5. Make your changes
6. Test your changes: \`npm run dev\`
7. Commit: \`git commit -m "Add your feature"\`
8. Push: \`git push origin feature/your-feature\`
9. Open a Pull Request

## Code Style

This project uses:
- TypeScript for type safety
- ESLint for linting
- Prettier for formatting

Run \`npm run lint\` before committing.

## Questions?

Open an issue or reach out to the maintainers.
`
    );
  }

  /**
   * Download the exported ZIP file
   */
  async downloadProject(projectId: string, projectName: string): Promise<void> {
    const blob = await this.exportProject({ projectId });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
export const codeExporter = new CodeExporter();


