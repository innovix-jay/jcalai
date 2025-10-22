# JCAL.ai Backend System - Complete Guide

## 🎯 Overview

JCAL.ai offers a revolutionary backend system that gives users complete flexibility:
- **JCAL Managed Backend**: Instant, zero-configuration Supabase backend
- **Bring Your Own Backend**: Connect to any existing database or cloud service

---

## 🚀 JCAL Managed Backend

### What Is It?

When you choose **JCAL Managed Backend**, we automatically provision a complete, isolated, production-ready backend for your app with ZERO configuration required.

### Features

✅ **One-Click Setup** - No Supabase account needed  
✅ **Isolated Data** - Your data is completely separate from other projects  
✅ **Auto-Scaling** - Scales automatically with your app  
✅ **Built-In Security** - Row-Level Security (RLS) configured automatically  
✅ **Real-Time Capabilities** - Live data updates when you need them  
✅ **Automatic Backups** - Your data is safe and recoverable  
✅ **Zero Maintenance** - We handle everything  

### How It Works

1. **User Creates Project**
   - You describe your app to JCAL
   - AI generates the complete structure

2. **Enable Backend (One Click)**
   - Click "Enable Backend"
   - Select "JCAL Managed"
   - Done! ✨

3. **Behind the Scenes**
   - We create an isolated PostgreSQL schema for your project
   - Set up default tables (`app_users`, `app_data`)
   - Configure Row-Level Security (RLS)
   - Generate project-specific API keys
   - Connect everything to your app

4. **You Build**
   - Drag-and-drop tables in visual designer
   - Connect UI components to data
   - Everything just works

### Technical Details

#### Architecture

```
User's App (Frontend)
    ↓
JCAL API Layer (Validation, Auth)
    ↓
Isolated Project Schema (project_xxxxx)
    ↓
    ├── app_users (table)
    ├── app_data (table)
    └── ... (your custom tables)
```

#### Data Isolation

- Each project gets its own PostgreSQL **schema**
- Schema name: `project_{project_id}`
- RLS policies ensure strict data separation
- Users can only access their own project data

#### Security

- **Row-Level Security (RLS)**: Enforced at database level
- **API Key Isolation**: Each project gets unique credentials
- **Encrypted at Rest**: All data encrypted
- **Audit Logging**: All access is logged

#### Default Tables

When backend is provisioned, we create:

**app_users**
```sql
id UUID PRIMARY KEY
email TEXT UNIQUE NOT NULL
full_name TEXT
avatar_url TEXT
metadata JSONB
created_at TIMESTAMP
updated_at TIMESTAMP
```

**app_data**
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES app_users(id)
data_type TEXT NOT NULL
data JSONB
created_at TIMESTAMP
updated_at TIMESTAMP
```

You can add more tables using the visual database designer!

---

## 🔌 Bring Your Own Backend

### Supported Providers

#### **Popular** (One-Click Connectors)

1. **Supabase (Custom)**
   - Your own Supabase project
   - Full control over configuration
   - Connect with URL + API keys

2. **PostgreSQL**
   - Any PostgreSQL database
   - On-premise or cloud
   - Full SQL support

3. **MySQL**
   - MySQL or MariaDB
   - Cloud or self-hosted
   - Wide compatibility

4. **MongoDB**
   - MongoDB Atlas or self-hosted
   - Document database
   - Flexible schema

5. **Firebase**
   - Realtime Database or Firestore
   - Google Cloud integration
   - Built-in authentication

#### **Advanced** (Custom Connectors)

6. **AWS RDS** - Amazon managed databases
7. **PlanetScale** - Serverless MySQL
8. **CockroachDB** - Distributed SQL
9. **Azure SQL** - Microsoft cloud database
10. **Custom REST API** - Any HTTP API

### Connection Process

1. **Choose Provider**
   - Select from list of supported providers
   - See requirements and setup guide

2. **Enter Credentials**
   - Secure, encrypted form
   - Field validation
   - Help text for each field

3. **Test Connection**
   - Click "Test Connection"
   - Real-time validation
   - Connection latency shown

4. **Connect**
   - Click "Connect Database"
   - Credentials encrypted and stored
   - Backend connected to project

### Example: PostgreSQL Connection

**Required Fields:**
- Host: `db.example.com`
- Port: `5432`
- Database: `myapp`
- Username: `dbuser`
- Password: `••••••••`

**Optional:**
- SSL Mode: `require` (recommended)

**Test Connection:**
- Validates credentials
- Checks database accessibility
- Tests permissions

**Connection String Generated:**
```
postgresql://dbuser:password@db.example.com:5432/myapp?sslmode=require
```

### Security & Privacy

- **Encrypted Storage**: All credentials encrypted with AES-256
- **No Logging**: Credentials never logged or exposed
- **Isolated Access**: Each project's credentials completely separate
- **User Control**: You can update or remove connections anytime

---

## 📊 Visual Data Management

### Database Designer

Regardless of which backend you choose, you get the same powerful visual tools:

#### **Visual Table Creator**
- Drag-and-drop table creation
- Define columns with types
- Set relationships visually
- Auto-generate migrations

#### **Data Types**
- UUID, Text, Integer, Boolean
- Timestamp, Date, Time
- JSON, JSONB
- Arrays, Custom types

#### **Relationships**
- One-to-One
- One-to-Many
- Many-to-Many
- Visual mapping

#### **Schema Management**
- Version control
- Migration history
- Rollback capability
- Export SQL

### API Builder

Create endpoints visually:

1. **Define Endpoint**
   - Path: `/api/users`
   - Method: GET, POST, PUT, DELETE

2. **Connect to Data**
   - Select table
   - Define query
   - Add filters

3. **Configure**
   - Authentication required?
   - Rate limiting
   - Validation rules

4. **Deploy**
   - Endpoint automatically deployed
   - Documentation generated
   - Test in builder

---

## 🔐 Multi-Tenancy & Data Isolation

### How We Ensure Data Privacy

#### JCAL Managed Backend

1. **Schema-Level Isolation**
   - Each project gets dedicated schema
   - PostgreSQL enforces separation
   - No cross-schema access

2. **Row-Level Security (RLS)**
   ```sql
   CREATE POLICY "project_isolation"
   ON project_xxxxx.app_data
   FOR ALL
   USING (
     EXISTS (
       SELECT 1 FROM public.projects
       WHERE id = 'project_id'
       AND user_id = auth.uid()
     )
   );
   ```

3. **API Key Isolation**
   - Each project gets unique keys
   - Keys can't access other projects
   - Automatic key rotation available

#### External Backend

1. **Credential Isolation**
   - Encrypted per-project
   - No shared credentials
   - Secure key management

2. **Connection Pooling**
   - Isolated connection pools
   - Resource limits per project
   - Automatic cleanup

---

## 🛠️ For Developers

### API Endpoints

#### Provision Backend
```typescript
POST /api/projects/{projectId}/backend/provision
Body: {
  "backendType": "jcal-managed" | "external",
  "config": {
    "externalProvider": "postgresql",
    "credentials": { ... }
  }
}
```

#### Get Backend Info
```typescript
GET /api/projects/{projectId}/backend/provision
Response: {
  "enabled": true,
  "backendType": "jcal-managed",
  "connectionInfo": { ... }
}
```

#### Deprovision Backend
```typescript
DELETE /api/projects/{projectId}/backend/provision
```

### Programmatic Access

```typescript
import { backendProvisioner } from '@/lib/backend/backend-provisioner';

// Provision managed backend
const result = await backendProvisioner.provisionBackend({
  projectId: 'xxx',
  userId: 'yyy',
  projectName: 'My App',
  backendType: 'jcal-managed',
});

// Get backend info
const info = await backendProvisioner.getBackendInfo(projectId);

// Deprovision
await backendProvisioner.deprovisionBackend(projectId);
```

---

## 📈 Monitoring & Management

### For Users

**In Builder:**
- View backend status
- See connection health
- Monitor API usage
- Access database directly

**Database Tab:**
- Visual query builder
- Table browser
- Real-time data viewer
- Export capabilities

### For Admins

**Centralized Dashboard:**
- All project backends
- Resource usage metrics
- Error tracking
- Performance monitoring

**Metrics Tracked:**
- Storage used (MB)
- API requests/month
- Bandwidth (MB)
- Active connections
- Error rate

**Alerts:**
- Quota warnings
- Connection failures
- Security issues
- Performance degradation

---

## 🔧 Troubleshooting

### Common Issues

#### "Backend provisioning failed"

**Cause**: Resource limits or connection issues

**Solution**:
1. Check your account quota
2. Retry provisioning
3. Contact support if persists

#### "External connection failed"

**Cause**: Incorrect credentials or firewall

**Solution**:
1. Verify credentials
2. Check firewall rules
3. Ensure database is accessible
4. Test with connection string manually

#### "Data not showing in app"

**Cause**: RLS policies or permissions

**Solution**:
1. Check RLS policies in database designer
2. Verify user authentication
3. Review API endpoint permissions

---

## 🚀 Best Practices

### For JCAL Managed Backend

✅ **Use for rapid prototyping** - Get started instantly  
✅ **Perfect for MVPs** - Production-ready from day one  
✅ **Ideal for no-code users** - Zero configuration  
✅ **Scalable** - Handles growth automatically  

### For External Backend

✅ **Use when you have existing infrastructure**  
✅ **Need specific database features**  
✅ **Compliance requirements** (data residency, etc.)  
✅ **Custom configurations**  

### General

✅ **Always test connections** before deploying  
✅ **Use SSL/TLS** for production databases  
✅ **Rotate credentials** regularly  
✅ **Monitor usage** to avoid surprises  
✅ **Backup regularly** (automatic with JCAL Managed)  

---

## 💡 Example Workflows

### Workflow 1: E-commerce App (JCAL Managed)

1. Create project: "My Store"
2. Click "Enable Backend" → Choose "JCAL Managed"
3. ✨ Backend provisioned in 2 seconds
4. Use AI: "Create a products table with name, price, image, stock"
5. AI generates table automatically
6. Build product catalog UI in visual builder
7. Connect components to products table
8. Deploy with one click
9. **You have a live e-commerce site!**

### Workflow 2: Internal Dashboard (External PostgreSQL)

1. Create project: "Company Dashboard"
2. Click "Enable Backend" → Choose "Bring Your Own"
3. Select "PostgreSQL"
4. Enter company database credentials
5. Test connection → ✅ Success
6. Connect database
7. JCAL analyzes existing schema
8. Build dashboards on top of existing data
9. Deploy internally
10. **Dashboard connected to live company data!**

---

## 📞 Support

- **Documentation**: This guide + inline help
- **Email**: backend-support@jcalai.com
- **Discord**: Backend channel
- **Status Page**: status.jcalai.com

---

## 🔮 Future Features

Coming soon:
- [ ] Real-time collaboration on database schema
- [ ] Visual query builder
- [ ] Automatic schema versioning
- [ ] Database branching (like Git)
- [ ] Advanced monitoring dashboards
- [ ] Custom backup schedules
- [ ] Multi-region support
- [ ] Edge database replicas

---

**JCAL.ai Backend System - Power and simplicity combined** 🚀


