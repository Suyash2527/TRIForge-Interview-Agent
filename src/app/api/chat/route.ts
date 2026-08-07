import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { generateSystemPrompt } from '@/lib/agent/prompt';
import { Curriculum, Candidate } from '@/lib/models/types';

// TODO: Replace with real dynamic data injection in production
const MOCK_CURRICULUM: Curriculum = {
  modules: [{ n: 1, title: 'AI Foundations', days: [1, 2] }],
  days: [
    { day: 1, title: 'Embeddings', type: 'AI_CORE', tools: ['Pinecone'], objectives: ['Understand vectors'] },
    { day: 2, title: 'Agentic Frameworks', type: 'BUILD', tools: ['LangChain'], objectives: ['Build an agent'] }
  ]
};

const MOCK_CANDIDATE: Candidate = {
  member: { id: 'c1', name: 'Alex', jobRole: 'Software Engineer', yearsExperience: 3, education: 'BSc CS', status: 'Graduated' },
  missions: [
    { day: 1, title: 'Embeddings', passed: true, skipped: false, attempts: 1 },
    { day: 2, title: 'Agentic Frameworks', passed: true, skipped: false, attempts: 3 }
  ],
  signals: { commitDays: 10, missionsCompleted: 2, missionsFirstTry: 1 }
};

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "SYSTEM ERROR: GEMINI_API_KEY not configured in environment." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = generateSystemPrompt(MOCK_CURRICULUM, MOCK_CANDIDATE);

    // Map history to GenAI SDK format
    const contents = history.map((msg: any) => ({
      role: msg.role === 'candidate' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt
      }
    });

    const replyText = response.text || '';
    
    // Check if the reply contains the final JSON feedback block
    let feedback = null;
    let isDone = false;
    let cleanReply = replyText;

    const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      isDone = true;
      try {
        feedback = JSON.parse(jsonMatch[1]);
        cleanReply = replyText.replace(/```json\n[\s\S]*?\n```/, '').trim();
      } catch (e) {
        console.error("Failed to parse final JSON feedback", e);
      }
    }

    return NextResponse.json({ 
      reply: cleanReply, 
      done: isDone,
      feedback: feedback
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: 'SYSTEM ERROR: Unable to process request.' }, { status: 500 });
  }
}
