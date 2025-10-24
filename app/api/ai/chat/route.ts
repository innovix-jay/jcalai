import { NextRequest, NextResponse } from 'next/server';
import { AIModelRouter } from '@/lib/ai/model-router';

const modelRouter = new AIModelRouter();

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build conversation context
    const contextMessages = conversationHistory?.map((msg: any) => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n') || '';

    // Create prompt for conversational AI
    const prompt = `You are a helpful AI assistant for a no-code app builder platform called JCAL.ai. 
You are currently in CHAT mode - which means you should answer questions, provide advice, and have conversations, 
but you should NOT execute any builds or make changes to the user's project.

If the user asks you to build something, politely remind them to switch to "Agent Mode" where you can actually 
execute builds.

${contextMessages ? `\nConversation history:\n${contextMessages}\n` : ''}

User's message: ${message}

Respond in a friendly, helpful manner. Use markdown formatting for better readability. Be concise but informative.`;

    // Call AI model
    const aiResult = await modelRouter.generate(prompt, 'general', 'gemini');

    return NextResponse.json({
      response: aiResult.response.trim()
    });

  } catch (error: any) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error',
        response: "I apologize, but I'm having trouble responding right now. Please try again."
      },
      { status: 500 }
    );
  }
}
