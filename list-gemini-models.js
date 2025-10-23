// List available Gemini models for this API key
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_API_KEY;

async function listModels() {
  console.log('API Key:', API_KEY?.substring(0, 10) + '...');
  console.log('\n=== Fetching Available Gemini Models ===\n');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.text();
      console.log('❌ FAILED:', response.status, response.statusText);
      console.log('Error:', error);
      return;
    }
    
    const data = await response.json();
    console.log(`Found ${data.models.length} models:\n`);
    
    data.models.forEach((model) => {
      const supportsGenerate = model.supportedGenerationMethods.includes('generateContent');
      if (supportsGenerate) {
        console.log('✅', model.name);
        console.log('   Display Name:', model.displayName);
        console.log('   Description:', model.description);
        console.log('   Methods:', model.supportedGenerationMethods.join(', '));
        console.log('');
      }
    });
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

listModels();

