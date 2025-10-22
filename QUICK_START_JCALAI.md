# JCAL.ai - Quick Start Guide

Get JCAL.ai running in 5 minutes! 🚀

---

## Prerequisites

- Node.js 18+ installed
- Supabase account (free)
- At least one AI API key (Claude, OpenAI, or Gemini)

---

## 1️⃣ Install Dependencies

\`\`\`bash
npm install
\`\`\`

---

## 2️⃣ Set Up Supabase

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name it "jcalai"
4. Wait ~2 minutes for setup

### Get Credentials
1. Go to Settings > API
2. Copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key

### Run Migrations
1. Go to SQL Editor
2. Create new query
3. Copy/paste each migration file:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_jcalai_platform_schema.sql`
   - `supabase/migrations/004_jcalai_rls_policies.sql`
4. Run each one

---

## 3️⃣ Configure Environment

Create `.env.local`:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# At least ONE AI key required
ANTHROPIC_API_KEY=sk-ant-xxx   # Claude
OPENAI_API_KEY=sk-xxx          # GPT-4
GOOGLE_API_KEY=AIza-xxx        # Gemini
\`\`\`

---

## 4️⃣ Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

---

## 5️⃣ Create Your First App

1. **Sign Up**
   - Click "Get Started"
   - Enter email/password
   - Verify email

2. **Create with AI**
   - Click "Create with AI"
   - Enter prompt: 
     ```
     Build a modern task management app with projects,
     tasks, and team collaboration features
     ```
   - Click "Generate"
   - Wait 10-15 seconds

3. **Customize**
   - Builder opens automatically
   - Drag components from sidebar
   - Edit in properties panel
   - Use AI to add features

4. **Deploy**
   - Click "Deploy" button
   - Wait 2-3 minutes
   - Your app is live! 🎉

---

## 🎯 Next Steps

- **Explore Templates**: Browse pre-built templates
- **Add Integrations**: Connect Stripe, SendGrid, etc.
- **Customize Design**: Use the visual editor
- **Export Code**: Download source code
- **Read Docs**: Check `JCALAI_COMPLETE_GUIDE.md`

---

## ⚠️ Common Issues

### "Supabase connection error"
- Check your URL and keys in `.env.local`
- Verify migrations ran successfully

### "AI generation failed"
- Verify API key is correct
- Check API key has credits
- Try a different model

### "Page not loading"
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache
- Check console for errors

---

## 🆘 Need Help?

- 📖 Full Guide: `JCALAI_COMPLETE_GUIDE.md`
- 📊 Implementation: `JCALAI_IMPLEMENTATION_SUMMARY.md`
- 💬 Discord: [Join Community](https://discord.gg/jcalai)
- 📧 Email: support@jcalai.com

---

**That's it! You're ready to build amazing apps with JCAL.ai 🚀**


