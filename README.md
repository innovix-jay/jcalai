# 🚀 JCAL.ai - AI-Powered No-Code App Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black)](https://nextjs.org/)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-AI-purple)](https://jcalai.com)

**JCAL.ai by Innovix Dynamix** - The ultimate AI-powered no-code platform for building production applications in minutes.

---

## ✨ **What is JCAL.ai?**

JCAL.ai is a revolutionary no-code platform that enables anyone to build, deploy, and manage production-ready applications using natural language and AI assistance. With intelligent routing between Claude, GPT-4, and Gemini, JCAL.ai automatically selects the best AI model for your task.

### **Key Features:**

- 🤖 **AI-Powered Scaffolding** - Describe your app, watch AI build it
- 🎨 **Visual Drag & Drop Builder** - Intuitive Craft.js editor
- 💾 **Managed Backend System** - One-click Supabase provisioning
- 🔌 **Bring Your Own Backend** - Support for 8 database providers
- 🚀 **One-Click Deployment** - Deploy to Vercel instantly
- 📦 **Complete Code Export** - Download full source code
- 🎯 **Smart Model Router** - Auto-selects Claude, GPT-4, or Gemini
- 🔒 **Enterprise Security** - Row-Level Security & data isolation

---

## 🚀 **Quick Start**

### **Prerequisites:**
- Node.js 18+ and npm
- Supabase account (or use our managed backend)
- At least one AI API key (Claude, OpenAI, or Gemini)

### **Installation:**

```bash
# Clone the repository
git clone https://github.com/innovix-jay/jcalai.git
cd jcalai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Visit http://localhost:3000 to see JCAL.ai in action!

---

## 📋 **Environment Variables**

Create a `.env.local` file with:

```bash
# AI Model API Keys (choose at least one)
GOOGLE_API_KEY=your_google_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

See `QUICK_START_JCALAI.md` for detailed setup instructions.

---

## 📚 **Documentation**

- **[Quick Start Guide](QUICK_START_JCALAI.md)** - Get started in 5 minutes
- **[Complete Guide](JCALAI_COMPLETE_GUIDE.md)** - Comprehensive documentation
- **[Backend System Guide](BACKEND_SYSTEM_GUIDE.md)** - Database and backend management
- **[Deployment Guide](DEPLOYMENT_GUIDE_FINAL.md)** - Production deployment
- **[Integration Guide](INTEGRATION_COMPLETE.md)** - Service integration

---

## 🏗️ **Architecture**

JCAL.ai is built with modern technologies:

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Visual Editor:** Craft.js, @dnd-kit
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **AI:** Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google)
- **Deployment:** Vercel
- **Database Connectors:** PostgreSQL, MySQL, MongoDB, Firebase, AWS RDS, PlanetScale, CockroachDB

---

## 🎯 **Key Innovations**

### **1. Intelligent AI Model Router**
Automatically selects the optimal AI model based on:
- Prompt complexity
- Task type (UI, backend, database)
- Cost optimization
- User preferences

### **2. Managed Backend Provisioning**
One-click backend setup with:
- Automatic schema isolation
- Row-Level Security
- Multi-tenant architecture
- Zero configuration required

### **3. Flexible Backend Options**
- **JCAL Managed:** Instant Supabase provisioning
- **Bring Your Own:** Connect any database (8 providers supported)

---

## 🚀 **Deployment**

### **Deploy to Vercel:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/innovix-jay/jcalai)

Or manually:
```bash
npm run build
vercel deploy
```

---

## 🤝 **Contributing**

We welcome contributions! Please see our contribution guidelines.

---

## 📄 **License**

MIT License - see LICENSE file for details

---

## 🏢 **About Innovix Dynamix**

JCAL.ai is built by [Innovix Dynamix](https://innovixdynamix.com), a technology company dedicated to empowering the next generation of creators and builders.

---

## 🔗 **Links**

- **Website:** https://jcalai.com
- **Documentation:** https://jcalai.com/docs
- **GitHub:** https://github.com/innovix-jay/jcalai
- **Vercel:** https://vercel.com/jay-cadmus-projects-02376606/jcalai

---

## 📞 **Support**

- **Email:** support@jcalai.com
- **Documentation:** https://jcalai.com/docs
- **GitHub Issues:** https://github.com/innovix-jay/jcalai/issues

---

## 🎉 **Built With**

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [Craft.js](https://craft.js.org/)
- [Anthropic Claude](https://anthropic.com/)
- [OpenAI GPT-4](https://openai.com/)
- [Google Gemini](https://ai.google.dev/)

---

**Start building amazing applications today with JCAL.ai!** ✨

