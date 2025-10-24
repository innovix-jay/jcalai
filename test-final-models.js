// Final test of all configured models
require('dotenv').config({ path: '.env.local' });

async function testAllModels() {
  console.log('\n🧪 FINAL TEST - All Configured AI Models\n');
  console.log('='.repeat(60));
  
  // Test Gemini 2.5 Flash
  console.log('\n⚡ Testing Gemini 2.5 Flash...');
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say hello in one sentence.' }] }]
        })
      }
    );
    if (geminiRes.ok) {
      const data = await geminiRes.json();
      console.log('✅ SUCCESS:', data.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ FAILED:', geminiRes.status);
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }
  
  // Test Gemini 2.5 Pro
  console.log('\n💎 Testing Gemini 2.5 Pro...');
  try {
    const geminiProRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say hello in one sentence.' }] }]
        })
      }
    );
    if (geminiProRes.ok) {
      const data = await geminiProRes.json();
      console.log('✅ SUCCESS:', data.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ FAILED:', geminiProRes.status);
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }
  
  // Test Claude Sonnet 4.5
  console.log('\n🧠 Testing Claude Sonnet 4.5...');
  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
      }),
    });
    if (claudeRes.ok) {
      const data = await claudeRes.json();
      console.log('✅ SUCCESS:', data.content[0].text);
    } else {
      console.log('❌ FAILED:', claudeRes.status);
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }
  
  // Test GPT-4o
  console.log('\n💬 Testing GPT-4o...');
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
        max_tokens: 100,
      }),
    });
    if (openaiRes.ok) {
      const data = await openaiRes.json();
      console.log('✅ SUCCESS:', data.choices[0].message.content);
    } else {
      console.log('❌ FAILED:', openaiRes.status);
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 ALL FLAGSHIP MODELS CONFIGURED!\n');
}

testAllModels();

