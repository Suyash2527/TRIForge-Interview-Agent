import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { generateSystemPrompt } from '@/lib/agent/prompt';
import { Curriculum, Candidate } from '@/lib/models/types';

// Candidate & Curriculum Pool for diverse, dynamic session generation
const CANDIDATE_POOL: { candidate: Candidate; curriculum: Curriculum }[] = [
  {
    candidate: {
      member: { id: 'c1', name: 'Alex', jobRole: 'AI Systems Engineer', yearsExperience: 3, education: 'BSc CS', status: 'Graduated' },
      missions: [
        { day: 1, title: 'Embeddings & Vector Search', passed: true, skipped: false, attempts: 1 },
        { day: 2, title: 'Agentic Frameworks & ReAct', passed: true, skipped: false, attempts: 3 },
        { day: 3, title: 'Pinecone Metadata Filtering', passed: true, skipped: false, attempts: 1 },
        { day: 4, title: 'Hybrid Search (BM25 + Dense)', passed: false, skipped: false, attempts: 2 }
      ],
      signals: { commitDays: 14, missionsCompleted: 4, missionsFirstTry: 2 }
    },
    curriculum: {
      modules: [{ n: 1, title: 'RAG & Agents', days: [1, 2, 3, 4] }],
      days: [
        { day: 1, title: 'Embeddings & Vector Search', type: 'AI_CORE', tools: ['Pinecone', 'OpenAI'], objectives: ['Vector dimension selection', 'Distance metrics'] },
        { day: 2, title: 'Agentic Frameworks & ReAct', type: 'BUILD', tools: ['LangChain', 'LangGraph'], objectives: ['ReAct decision loops', 'Tool calling guardrails'] },
        { day: 3, title: 'Pinecone Metadata Filtering', type: 'AI_CORE', tools: ['Pinecone'], objectives: ['Pre-filtering vs post-filtering', 'Single-stage filtering'] },
        { day: 4, title: 'Hybrid Search (BM25 + Dense)', type: 'AI_CORE', tools: ['BM25', 'SPLADE'], objectives: ['Recall optimization', 'Medical jargon retrieval'] }
      ]
    }
  },
  {
    candidate: {
      member: { id: 'c2', name: 'Sarah', jobRole: 'Backend Architect', yearsExperience: 5, education: 'MSc Software Engineering', status: 'Graduated' },
      missions: [
        { day: 1, title: 'Model Context Protocol (MCP)', passed: true, skipped: false, attempts: 1 },
        { day: 2, title: 'LLM Evaluation & Benchmarking', passed: true, skipped: false, attempts: 1 },
        { day: 3, title: 'Fine-Tuning & LoRA', passed: true, skipped: false, attempts: 2 },
        { day: 4, title: 'Streaming & Latency Optimization', passed: false, skipped: false, attempts: 1 }
      ],
      signals: { commitDays: 20, missionsCompleted: 4, missionsFirstTry: 3 }
    },
    curriculum: {
      modules: [{ n: 1, title: 'Advanced LLM Architecture', days: [1, 2, 3, 4] }],
      days: [
        { day: 1, title: 'Model Context Protocol (MCP)', type: 'BUILD', tools: ['MCP SDK', 'TypeScript'], objectives: ['Tool protocol design', 'Context window management'] },
        { day: 2, title: 'LLM Evaluation & Benchmarking', type: 'AI_CORE', tools: ['Ragas', 'DeepEval'], objectives: ['Faithfulness metrics', 'Hallucination detection'] },
        { day: 3, title: 'Fine-Tuning & LoRA', type: 'AI_CORE', tools: ['Unsloth', 'HuggingFace'], objectives: ['Parameter-efficient fine-tuning', 'Dataset curation'] },
        { day: 4, title: 'Streaming & Latency Optimization', type: 'SHIP_IT', tools: ['vLLM', 'FastAPI'], objectives: ['Time-to-first-token', 'KVCache optimization'] }
      ]
    }
  },
  {
    candidate: {
      member: { id: 'c3', name: 'Jordan', jobRole: 'Data Engineer', yearsExperience: 2, education: 'BSc Data Science', status: 'Graduated' },
      missions: [
        { day: 1, title: 'Chunking Strategies & Overlap', passed: true, skipped: false, attempts: 2 },
        { day: 2, title: 'Qdrant & Milvus Setup', passed: true, skipped: false, attempts: 1 },
        { day: 3, title: 'Document Parsing & OCR', passed: true, skipped: false, attempts: 3 },
        { day: 4, title: 'Contextual Compression & Reranking', passed: false, skipped: false, attempts: 1 }
      ],
      signals: { commitDays: 12, missionsCompleted: 4, missionsFirstTry: 1 }
    },
    curriculum: {
      modules: [{ n: 1, title: 'Data Ingestion & Retrieval', days: [1, 2, 3, 4] }],
      days: [
        { day: 1, title: 'Chunking Strategies & Overlap', type: 'AI_CORE', tools: ['Unstructured', 'LangChain TextSplitter'], objectives: ['Semantic chunking', 'Negation context preservation'] },
        { day: 2, title: 'Qdrant & Milvus Setup', type: 'BUILD', tools: ['Qdrant', 'Milvus'], objectives: ['HNSW indexing parameters', 'Vector payload schema'] },
        { day: 3, title: 'Document Parsing & OCR', type: 'BUILD', tools: ['LlamaParse', 'PDFPlumber'], objectives: ['Table extraction', 'Clinical note formatting'] },
        { day: 4, title: 'Contextual Compression & Reranking', type: 'AI_CORE', tools: ['Cohere Rerank', 'Cross-Encoders'], objectives: ['Top-k reranking', 'Context window efficiency'] }
      ]
    }
  }
];

export async function POST(req: Request) {
  try {
    const { message, history, sessionSeed } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "SYSTEM ERROR: GEMINI_API_KEY not configured in environment." }, { status: 500 });
    }

    // Pick candidate & curriculum dynamically per session
    const seed = sessionSeed || (history[0]?.content ? history[0].content.length : Date.now());
    const profileIndex = Math.abs(typeof seed === 'number' ? seed : String(seed).length) % CANDIDATE_POOL.length;
    const { candidate, curriculum } = CANDIDATE_POOL[profileIndex];

    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = generateSystemPrompt(curriculum, candidate);

    // Map history to GenAI SDK format
    const contents = history.map((msg: any) => ({
      role: msg.role === 'candidate' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.95
      }
    });

    const replyText = response.text || '';
    
    // Check if the reply contains the final JSON feedback block or a liveScore block
    let feedback = null;
    let liveScore = null;
    let isDone = false;
    let cleanReply = replyText;

    const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        cleanReply = replyText.replace(/```json\n[\s\S]*?\n```/, '').trim();
        
        if (parsed.grade) {
          isDone = true;
          feedback = parsed;
        } else if (parsed.liveScore !== undefined) {
          liveScore = parsed.liveScore;
        }
      } catch (e) {
        console.error("Failed to parse JSON feedback", e);
      }
    }

    return NextResponse.json({ 
      reply: cleanReply, 
      done: isDone,
      feedback: feedback,
      liveScore: liveScore
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: 'SYSTEM ERROR: Unable to process request.' }, { status: 500 });
  }
}
