// Test script to check AI chat functionality
const testAIChat = async () => {
  try {
    console.log('Testing AI Chat API...');
    
    const response = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, can you help me?',
        projectId: 'test-project-id',
        mode: 'chat'
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('AI Response:', data);
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testAIChat();

