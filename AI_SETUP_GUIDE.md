# 🤖 AI Configuration Guide

## Overview

JCAL.ai now uses **real LLM APIs** for the AI Assistant! The system automatically selects the best model for each task (like Cursor's agent), or you can manually choose your preferred model.

---

## 🔑 Required API Keys

You need to add API keys for the AI models you want to use. Add these to your `.env.local` file:

### Create `.env.local` file

Create a file called `.env.local` in the root directory of your project (next to `package.json`) with the following:

```bash
# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Model API Keys (Add these!)
# ================================

# Claude (Anthropic) - Best for code generation
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# OpenAI - Best for general conversation
OPENAI_API_KEY=sk-proj-xxxxx

# Google Gemini - Most cost-effective
GOOGLE_API_KEY=AIzaSyxxxxx
```

---

## 📝 How to Get API Keys

### 1. **Claude (Anthropic)**
- Go to: https://console.anthropic.com/
- Sign up / Log in
- Go to "API Keys"
- Create a new key
- Copy and paste into `ANTHROPIC_API_KEY`
- **Model used**: `claude-3-5-sonnet-20241022`
- **Cost**: ~$3 per million tokens (very reasonable)

### 2. **OpenAI (GPT-4)**
- Go to: https://platform.openai.com/api-keys
- Sign up / Log in
- Create a new API key
- Copy and paste into `OPENAI_API_KEY`
- **Model used**: `gpt-4-turbo-preview`
- **Cost**: ~$10 per million tokens
- **Note**: Requires payment method on file

### 3. **Google Gemini**
- Go to: https://makersuite.google.com/app/apikey
- Sign up / Log in with Google account
- Create API key
- Copy and paste into `GOOGLE_API_KEY`
- **Model used**: `gemini-1.5-pro`
- **Cost**: ~$1.25 per million tokens (cheapest!)
- **Free tier**: Yes, generous limits

---

## 🎯 Model Selection

### Auto Mode (Recommended)

The system automatically picks the best model based on the task:

- **Complex code/architecture** → Uses Claude (best code generation)
- **Creative UI components** → Uses OpenAI (best creativity)
- **Large conversations** → Uses Gemini (massive context window)
- **Simple tasks** → Uses Gemini (most cost-effective)

### Manual Selection

Click the model selector in the AI Assistant header:

```
🤖 Auto Select     ← Recommended
🧠 Claude Sonnet   ← Best code quality
💬 GPT-4 Turbo     ← Fast & creative
💎 Gemini Pro      ← Cost-effective
```

---

## ✅ Testing Your Setup

1. Add at least one API key to `.env.local`
2. Restart your dev server: `npm run dev`
3. Create a new project
4. Open the AI Assistant
5. Try chatting - you should see intelligent responses!

If you see an error about API keys:
- Check your `.env.local` file exists
- Make sure keys are valid (no extra spaces)
- Restart the dev server
- Check the console for specific error messages

---

## 💰 Cost Estimates

For typical use (building a project):

- **Conversation (~50 messages)**: $0.01 - $0.05
- **Plan generation**: $0.005 - $0.02
- **Total per project**: $0.02 - $0.10

### Free Tiers:

- **Gemini**: 60 requests/minute, 1,500/day (FREE!)
- **Claude**: $5 free credit for new users
- **OpenAI**: No free tier, but very cheap for testing

**Recommendation**: Start with Gemini (it's free and works great!)

---

## 🔧 How the System Works

### 1. **Auto Model Selection**

```typescript
// Example: User asks to build a task manager
System analyzes: "task manager" → code generation needed
→ Selects Claude (best for architecture)

// Example: User wants creative UI
System analyzes: "modern beautiful design"
→ Selects OpenAI (best for creativity)

// Example: Long conversation
System analyzes: conversation > 50,000 tokens
→ Selects Gemini (1M token context window!)
```

### 2. **Conversation Flow**

```
User: "I want to build a social media app"
   ↓
AI (using selected model):
   - Asks about target users
   - Asks about core features
   - Asks about design preferences
   ↓
Generates comprehensive project plan
   ↓
User confirms → Pages created automatically
```

### 3. **Smart Context Management**

- Conversation history saved to database
- Can resume conversations across sessions
- AI remembers previous answers
- Progressively builds requirements

---

## 🛠️ Advanced Configuration

### Customize Model Selection

Edit `lib/ai/model-router.ts` to change selection logic:

```typescript
// Example: Always use Claude for scaffolding
if (taskType === 'scaffold') {
  selectedProvider = 'claude';
}

// Example: Prefer OpenAI for everything
selectedProvider = 'openai'; // Override default
```

### Adjust Token Limits

```typescript
// In model-router.ts
max_tokens: 4096  // Increase for longer responses
```

### Add New Models

The system is extensible - you can add:
- Claude Opus (more powerful)
- GPT-4-32k (larger context)
- Custom fine-tuned models

---

## 📊 Monitoring Usage

### Check Costs:

- **Claude**: https://console.anthropic.com/settings/usage
- **OpenAI**: https://platform.openai.com/usage
- **Gemini**: Free tier, no billing needed

### Set Spending Limits:

All providers let you set monthly limits to prevent overcharges.

---

## 🚨 Troubleshooting

### "API key not configured"
→ Check `.env.local` file exists and has correct key names

### "Failed to process message"
→ Check API key is valid (no extra characters/spaces)

### "Rate limit exceeded"
→ You've hit the API limit. Wait a few minutes or switch models.

### "Quota exceeded"
→ You've used your free tier or need to add payment method

### Still having issues?
1. Check browser console (F12) for detailed errors
2. Verify `.env.local` is in the correct directory
3. Restart dev server after changing .env
4. Test each API key individually by selecting it manually

---

## 🎉 Ready to Use!

Once you've added at least one API key:

1. **Create a new project** → `/builder/new`
2. **Land on builder page** → AI panel opens automatically
3. **Start chatting** → Real AI responds intelligently!
4. **Review plan** → Beautiful summary card
5. **Confirm** → Pages generated automatically
6. **Celebrate** → Confetti! 🎊

---

## 📚 Further Reading

- [Claude API Docs](https://docs.anthropic.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Model Router Source](./lib/ai/model-router.ts)
- [Onboarding Service](./services/ai-onboarding-service.ts)

---

**Questions? Issues? Check the console logs or contact support!**

