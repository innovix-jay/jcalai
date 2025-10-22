# 🗄️ JCAL.ai Database Setup Guide

## 📋 Quick Setup Instructions

Run these migrations in your Supabase SQL Editor in order.

**SQL Editor:** https://supabase.com/dashboard/project/lhqwlnwvnzremhgfynmu/sql/new

---

## 🚀 **Option 1: Run All Migrations (Recommended)**

Copy and paste each file's contents into the SQL Editor and run them in this exact order:

### **1. Initial Schema** ✅
File: `001_initial_schema.sql`

This creates the base tables for the original platform.

### **2. RLS Policies** ✅
File: `002_rls_policies.sql`

This sets up Row Level Security for data protection.

### **3. JCAL Platform Schema** ✅
File: `003_jcalai_platform_schema.sql`

This creates all JCAL.ai-specific tables:
- projects
- pages
- components
- database_schemas
- api_endpoints
- integrations
- templates
- deployments
- ai_generations
- project_collaborators
- project_activity

### **4. JCAL RLS Policies** ✅
File: `004_jcalai_rls_policies.sql`

This sets up security policies for JCAL.ai tables.

### **5. Project Backends** ✅
File: `005_project_backends.sql`

This creates tables for backend management:
- project_backends
- backend_credentials

---

## 🔧 **Option 2: Quick Setup Script**

Copy this entire block and run it in the SQL Editor:

```sql
-- ==================================================
-- JCAL.ai Complete Database Setup
-- ==================================================
-- This will set up all required tables and policies
-- Run this in Supabase SQL Editor
-- ==================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: Run each migration file separately in order:
-- 1. supabase/migrations/001_initial_schema.sql
-- 2. supabase/migrations/002_rls_policies.sql
-- 3. supabase/migrations/003_jcalai_platform_schema.sql
-- 4. supabase/migrations/004_jcalai_rls_policies.sql
-- 5. supabase/migrations/005_project_backends.sql

-- After running migrations, verify tables exist:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## ✅ **Verification**

After running all migrations, verify tables exist:

```sql
-- Check all JCAL.ai tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%project%' OR table_name LIKE '%ai_%'
ORDER BY table_name;
```

You should see:
- ✅ projects
- ✅ pages
- ✅ components
- ✅ database_schemas
- ✅ api_endpoints
- ✅ integrations
- ✅ templates
- ✅ deployments
- ✅ ai_generations
- ✅ project_collaborators
- ✅ project_activity
- ✅ project_backends
- ✅ backend_credentials

---

## 🔐 **Enable Authentication**

### **1. Email Authentication**
Already enabled by default in Supabase.

### **2. OAuth Providers**

#### **Google OAuth:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `https://lhqwlnwvnzremhgfynmu.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. In Supabase: Auth → Providers → Google
6. Paste credentials and enable

#### **GitHub OAuth:**
1. Go to: https://github.com/settings/developers
2. New OAuth App
3. Authorization callback: `https://lhqwlnwvnzremhgfynmu.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. In Supabase: Auth → Providers → GitHub
6. Paste credentials and enable

---

## 🧪 **Test Your Setup**

### **Test 1: Create a User**
```sql
-- This should work after migrations
INSERT INTO auth.users (email, encrypted_password)
VALUES ('test@jcalai.com', crypt('password123', gen_salt('bf')));
```

### **Test 2: Create a Project**
```sql
-- This should work with RLS
INSERT INTO public.projects (user_id, name, description)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Test Project',
  'My first JCAL.ai project'
);
```

### **Test 3: Verify RLS**
```sql
-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND rowsecurity = true;
```

---

## 🎯 **Next Steps**

After database setup:
1. ✅ Database migrations complete
2. ✅ RLS policies enabled
3. ✅ OAuth providers configured
4. 🚀 Deploy application to Vercel
5. 🧪 Test authentication flow
6. 🎨 Test AI features
7. 🌐 Add custom domain (jcalai.com)

---

## 📞 **Support**

If you encounter issues:
- Check Supabase logs: https://supabase.com/dashboard/project/lhqwlnwvnzremhgfynmu/logs/postgres-logs
- Review migration files for syntax errors
- Verify all extensions are enabled
- Check RLS policies match user permissions

---

**Your JCAL.ai database is ready! 🎉**

