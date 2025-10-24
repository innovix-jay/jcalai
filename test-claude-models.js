// Test all Claude model variations to find what's available
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.ANTHROPIC_API_KEY;

async function testClaude(model) {
  console.log(`\n=== Testing ${model} ===`);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('❌ FAILED:', response.status);
      console.log('Error type:', error.error?.type);
      return false;
    }

    const data = await response.json();
    console.log('✅ SUCCESS!');
    console.log('Response:', data.content[0].text);
    return true;
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    return false;
  }
}

async function main() {
  const models = [
    // Claude 4 Family
    'claude-sonnet-4-5-20250929',
    'claude-sonnet-4-20250514',
    'claude-opus-4-20250514',
    
    // Claude 3.5 Family
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    
    // Legacy Claude 3 Family (we know this one works)
    'claude-3-haiku-20240307',
  ];
  
  console.log('\n🧪 Testing Claude Models\n');
  console.log('='.repeat(50));
  
  const results = {};
  for (const model of models) {
    results[model] = await testClaude(model);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:');
  Object.entries(results).forEach(([model, success]) => {
    console.log(success ? '✅' : '❌', model);
  });
  
  const working = Object.entries(results).filter(([_, s]) => s);
  console.log('\n' + (working.length > 0 ? `🎉 ${working.length} models working!` : '⚠️  No models working'));
}

main();

