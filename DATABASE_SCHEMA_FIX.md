# Database Schema Fix - "framework" Column Error

## 🐛 Issue

**Error Message**: `Could not find the 'framework' column of 'projects' in the schema cache`

**User Impact**: Users could not create new apps via AI builder or templates - the app would fail immediately with a database error.

## 🔍 Root Cause

The code was attempting to insert data using column names that didn't match the actual database schema:

### Projects Table Issues

**Incorrect Code**:
```typescript
{
  framework: 'nextjs',  // ❌ This column doesn't exist
  template_id: template.id,  // ❌ This column doesn't exist
}
```

**Database Schema**:
- The `projects` table stores framework configuration in a `config` JSONB column
- Template information goes in `ai_metadata` JSONB column
- Not as direct columns

### Pages Table Issues

**Incorrect Code**:
```typescript
{
  title: 'Home',  // ✅ Exists but not required
  content: JSON.stringify({ components: [] })  // ❌ This column doesn't exist
}
```

**Database Schema**:
- Pages use `name` (required) and `title` (optional)
- Page content is stored as `structure` JSONB, not `content`
- Missing required fields: `path`

## ✅ Solution

### Fixed Projects Table Insert

**Before**:
```typescript
.insert([{
  name: template.name,
  description: template.description,
  user_id: user.id,
  status: 'draft',
  framework: 'nextjs',  // ❌ Wrong
  template_id: template.id,  // ❌ Wrong
}])
```

**After**:
```typescript
.insert([{
  name: template.name,
  description: template.description,
  user_id: user.id,
  status: 'draft',
  app_type: 'web',  // ✅ Correct column
  ai_metadata: { template_id: template.id },  // ✅ Stored in JSONB
  config: {  // ✅ Framework stored in config JSONB
    framework: 'nextjs',
    styling: 'tailwindcss',
    database: 'supabase',
    auth: true,
    api: true
  }
}])
```

### Fixed Pages Table Insert

**Before**:
```typescript
.insert([{
  project_id: project.id,
  title: 'Home',
  slug: 'home',
  order_index: 0,
  content: JSON.stringify({ components: [] })  // ❌ Wrong column
}])
```

**After**:
```typescript
.insert([{
  project_id: project.id,
  name: 'Home',  // ✅ Required field
  title: 'Home',
  slug: 'home',
  path: '/',  // ✅ Required field
  is_home: true,
  order_index: 0,
  structure: {  // ✅ Correct column for page content
    ROOT: {
      type: 'Container',
      nodes: [],
      props: {}
    }
  }
}])
```

## 📋 Actual Database Schema

### Projects Table
```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  app_type app_type DEFAULT 'web',  -- ✅ Use this, not 'framework'
  status project_status DEFAULT 'draft',
  
  config JSONB DEFAULT '{
    "framework": "nextjs",      -- ✅ Framework stored here
    "styling": "tailwindcss",
    "database": "supabase",
    "auth": true,
    "api": true
  }',
  
  ai_prompt TEXT,
  ai_metadata JSONB DEFAULT '{}',  -- ✅ Template info stored here
  
  -- ... other fields
);
```

### Pages Table
```sql
CREATE TABLE public.pages (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,        -- ✅ Required (page name)
  slug TEXT NOT NULL,        -- ✅ Required (URL slug)
  path TEXT NOT NULL,        -- ✅ Required (full path like '/')
  
  structure JSONB DEFAULT '{ -- ✅ Page content stored here
    "ROOT": {
      "type": "Container",
      "nodes": [],
      "props": {}
    }
  }',
  
  title TEXT,                -- ✅ Optional (meta title)
  description TEXT,
  
  is_home BOOLEAN DEFAULT false,
  is_protected BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  
  -- ... other fields
);
```

## 🔧 Files Modified

1. **`app/builder/new/page.tsx`** - AI app builder
   - Fixed project creation to use correct schema
   - Fixed page creation to use correct schema

2. **`app/templates/page.tsx`** - Template selection
   - Fixed project creation from templates
   - Fixed default page creation

## ✅ Verification

After this fix:
- ✅ Users can create apps via AI builder
- ✅ Users can create apps from templates
- ✅ No database schema errors
- ✅ Projects save correctly with all metadata
- ✅ Pages create with proper structure
- ✅ Framework configuration properly stored

## 🚀 Deployment

**Git Commit**: `d302bff`  
**Status**: ✅ Pushed to main and deployed  

## 📚 Key Takeaways

1. **Always verify actual database schema** before writing insert queries
2. **JSONB columns** are flexible but require correct structure
3. **Required vs Optional** fields must be respected
4. **Read migration files** to understand exact schema structure
5. **Test with actual database** to catch schema mismatches early

## 🎯 Impact

This fix resolves the immediate blocker preventing users from:
- Creating new apps
- Using templates
- Getting started with the platform

**Result**: Core user workflow is now fully functional! ✅

