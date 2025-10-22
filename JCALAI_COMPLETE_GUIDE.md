# JCAL.ai - Complete Setup & Deployment Guide

## 🚀 Welcome to JCAL.ai

JCAL.ai is the ultimate AI-powered no-code application builder that transforms your ideas into production-ready applications in minutes. This guide will walk you through everything you need to know to get started and deploy your first application.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running Locally](#running-locally)
6. [Building Your First App](#building-your-first-app)
7. [Deployment](#deployment)
8. [Advanced Features](#advanced-features)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and npm
- **Git** for version control
- **Supabase account** (free tier works perfectly)
- **Vercel account** (optional, for deployment)
- **AI API Keys** (optional, but recommended):
  - Claude API key from Anthropic
  - OpenAI API key
  - Google Gemini API key

---

## Initial Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/jcalai.git
cd jcalai
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

This will install all necessary packages including:
- Next.js 14
- React 18
- Supabase client
- Craft.js for visual editing
- Tailwind CSS
- And many more...

---

## Environment Configuration

### 1. Create Environment File

Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 2. Configure Environment Variables

Edit \`.env.local\` with your credentials:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Model API Keys
ANTHROPIC_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_API_KEY=your-gemini-api-key

# Vercel Deployment (optional)
VERCEL_TOKEN=your-vercel-token

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
\`\`\`

---

## Database Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

### 2. Run Migrations

Navigate to your Supabase project dashboard:

1. Go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of each migration file in order:
   - \`supabase/migrations/001_initial_schema.sql\`
   - \`supabase/migrations/002_rls_policies.sql\`
   - \`supabase/migrations/003_jcalai_platform_schema.sql\`
   - \`supabase/migrations/004_jcalai_rls_policies.sql\`
4. Run each migration

Alternatively, use the Supabase CLI:

\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
\`\`\`

### 3. Set Up Authentication

In your Supabase dashboard:

1. Go to **Authentication** > **Providers**
2. Enable **Email** authentication
3. (Optional) Enable **Google** OAuth:
   - Add your Google Client ID and Secret
   - Add redirect URL: \`https://your-project.supabase.co/auth/v1/callback\`
4. (Optional) Enable **GitHub** OAuth:
   - Add your GitHub Client ID and Secret
   - Add redirect URL: \`https://your-project.supabase.co/auth/v1/callback\`

---

## Running Locally

### 1. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

### 2. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the JCAL.ai landing page!

### 3. Create Your Account

1. Click **Get Started** or **Sign Up**
2. Enter your email and password
3. Check your email for verification
4. Log in to access the dashboard

---

## Building Your First App

### Method 1: AI-Powered Generation (Recommended)

1. **Navigate to Projects Dashboard**
   - Click on your profile or go to \`/dashboard/projects\`

2. **Click "Create with AI"**
   - The AI creation modal will open

3. **Describe Your App**
   
   Example prompt:
   \`\`\`
   Build a modern task management app with:
   - User authentication
   - Project and task organization
   - Kanban board view
   - Team collaboration features
   - Due dates and priority levels
   - Dark mode support
   Use a clean, professional design with blue accents
   \`\`\`

4. **Generate**
   - Click "Generate Project"
   - AI will create your complete app structure
   - Pages, components, database, and APIs will be generated

5. **Customize in the Builder**
   - The builder will open automatically
   - Use drag-and-drop to modify components
   - Add or remove features as needed

### Method 2: Start from a Template

1. **Browse Templates**
   - Go to Dashboard > Templates

2. **Choose a Template**
   - SaaS Dashboard
   - E-commerce Store
   - Task Management
   - Landing Page
   - Blog
   - Portfolio

3. **Customize**
   - Template will be cloned to your projects
   - Open in builder to customize

### Method 3: Build from Scratch

1. **Create Blank Project**
   - Click "New Project"

2. **Add Pages**
   - Use the AI prompt panel
   - Type: "Create a landing page with hero section"
   - AI will generate the page

3. **Build Components**
   - Drag components from the sidebar
   - Configure properties in the right panel

---

## The Builder Interface

### Layout Overview

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  Toolbar (Save, Deploy, Export, Model Selector)         │
├──────────┬──────────────────────────────┬───────────────┤
│          │                              │               │
│ Component│   Canvas / Preview           │  Properties   │
│ Sidebar  │   or Backend Panel           │  Panel        │
│          │                              │               │
│          │   AI Prompt Panel            │               │
│          │   (Expandable)               │               │
└──────────┴──────────────────────────────┴───────────────┘
\`\`\`

### Key Features

**1. AI Prompt Panel**
- Always available at the top
- Generate pages, components, database schemas, or APIs
- Choose generation type: Page | Component | Database | API
- Model selection (Auto, Claude, GPT-4, Gemini)

**2. Component Sidebar**
- Pre-built components organized by category
- Drag and drop onto canvas
- Search for specific components

**3. Canvas/Preview**
- Visual preview of your app
- Switch between Desktop, Tablet, Mobile views
- Real-time updates

**4. Backend Panel**
- Database: View and edit tables and schemas
- API: Manage endpoints
- Integrations: Configure third-party services

**5. Properties Panel**
- Customize selected component
- Edit styles, content, and behavior
- Live updates

---

## Deployment

### Option 1: One-Click Vercel Deployment

1. **In the Builder**
   - Click the **Deploy** button in the toolbar

2. **Configure Deployment**
   - Environment: Production, Staging, or Preview
   - Custom domain (optional)
   - Environment variables

3. **Deploy**
   - Click "Deploy Now"
   - Wait for build to complete (~2-3 minutes)
   - Your app is live! 🎉

### Option 2: Export and Deploy Anywhere

1. **Export Code**
   - Click **Export** in the toolbar
   - Download ZIP file with complete source code

2. **Deploy to Your Platform**

   **Vercel:**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

   **Netlify:**
   \`\`\`bash
   npm run build
   netlify deploy --prod
   \`\`\`

   **Your Own Server:**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

---

## Advanced Features

### 1. Database Designer

**Access:**
- Builder > Backend Panel > Database

**Features:**
- Visual table creation
- Define columns and types
- Set relationships (1-to-1, 1-to-many, many-to-many)
- Auto-generate SQL migrations
- Apply migrations to Supabase

**Usage:**
\`\`\`
1. Click "New Table"
2. Add columns with types
3. Define relationships
4. Click "Generate Migration"
5. Review SQL
6. Click "Apply Migration"
\`\`\`

### 2. API Builder

**Access:**
- Builder > Backend Panel > API Endpoints

**Features:**
- Create RESTful endpoints
- Define request/response schemas
- Add authentication
- Rate limiting
- Visual workflow builder

**Usage:**
\`\`\`
1. Click "New Endpoint"
2. Set path and method (GET, POST, etc.)
3. Add logic or use visual builder
4. Test endpoint
5. Deploy
\`\`\`

### 3. Integration Hub

**Access:**
- Builder > Backend Panel > Integrations

**Available Integrations:**
- **Stripe**: Payments and subscriptions
- **SendGrid**: Email delivery
- **Twilio**: SMS and phone
- **AWS S3**: File storage
- **Google Analytics**: Analytics
- **OpenAI**: AI capabilities

**Setup Example (Stripe):**
\`\`\`
1. Click "Add Integration"
2. Select "Stripe"
3. Enter API keys
4. Test connection
5. Save configuration
\`\`\`

### 4. AI Model Router

The AI Model Router automatically selects the best AI model for your task:

- **Claude**: Best for complex code generation and architecture
- **GPT-4**: Best for creative tasks and general-purpose
- **Gemini**: Best for large context and cost efficiency

**Manual Override:**
- Click model selector in toolbar
- Choose specific model
- Or keep on "Auto" (recommended)

### 5. Collaboration (Coming Soon)

**Features:**
- Real-time multi-user editing
- Role-based permissions
- Activity tracking
- Comments and annotations

---

## Troubleshooting

### Common Issues

**1. "Project not found" error**

**Solution:**
- Ensure you're logged in
- Check project permissions
- Verify project ID in URL

**2. AI generation fails**

**Solution:**
- Check API keys in \`.env.local\`
- Verify API key has credits
- Try a different model
- Simplify your prompt

**3. Database errors**

**Solution:**
- Verify Supabase credentials
- Check RLS policies
- Run all migrations
- Check Supabase dashboard for errors

**4. Deployment fails**

**Solution:**
- Check build logs
- Verify environment variables
- Ensure all dependencies are listed in package.json
- Check Vercel token validity

**5. Components not rendering**

**Solution:**
- Check browser console for errors
- Verify component structure
- Clear browser cache
- Restart development server

---

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Supabase project URL | \`https://xxx.supabase.co\` |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anon key | \`eyJxxx...\` |

### Optional (but Recommended)

| Variable | Description | Example |
|----------|-------------|---------|
| \`ANTHROPIC_API_KEY\` | Claude API key | \`sk-ant-xxx\` |
| \`OPENAI_API_KEY\` | OpenAI API key | \`sk-xxx\` |
| \`GOOGLE_API_KEY\` | Google Gemini key | \`AIzxxx\` |
| \`VERCEL_TOKEN\` | Vercel deployment token | \`xxx\` |

---

## Getting Help

### Resources

- **Documentation**: [https://jcalai.com/docs](https://jcalai.com/docs)
- **Community**: [Discord](https://discord.gg/jcalai)
- **Email Support**: support@jcalai.com
- **GitHub Issues**: [github.com/innovix-jay/jcalai/issues](https://github.com/innovix-jay/jcalai/issues)

### Reporting Bugs

When reporting bugs, please include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots (if applicable)
5. Browser and OS version
6. Console errors (if any)

---

## Next Steps

🎉 **Congratulations!** You're now ready to build amazing applications with JCAL.ai.

**What to do next:**
1. ✅ Build your first app
2. ✅ Explore templates
3. ✅ Try different AI models
4. ✅ Deploy to production
5. ✅ Share your creation

**Join the Community:**
- Share your apps
- Get feedback
- Help others
- Request features

---

## About JCAL.ai

**Built by:** Innovix Dynamix  
**Website:** [https://jcalai.com](https://jcalai.com)  
**License:** Proprietary © 2025 Innovix Dynamix

**Mission:** Empower everyone to build software, regardless of technical background.

---

*Happy Building! 🚀*


