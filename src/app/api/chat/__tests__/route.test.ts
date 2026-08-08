import { POST } from '../route';
import { GoogleGenAI } from '@google/genai';

// Mock the GoogleGenAI sdk
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: 'Here is the mock AI response. \n```json\n{\n  "liveScore": 92\n}\n```',
          }),
        },
      };
    }),
  };
});

describe('POST /api/chat', () => {
  let req: Request;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-mock-key';
  });

  it('handles a valid request and parses liveScore', async () => {
    req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'This is my test answer',
        history: [{ role: 'agent', content: 'Question 1' }],
        sessionSeed: 12345,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.reply).toBe('Here is the mock AI response.');
    expect(json.liveScore).toBe(92);
    expect(json.done).toBe(false);
  });

  it('handles errors gracefully when API fails', async () => {
    // Override the mock for this specific test
    (GoogleGenAI as jest.Mock).mockImplementationOnce(() => ({
      models: {
        generateContent: jest.fn().mockRejectedValue(new Error('API failure')),
      }
    }));

    req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'This is my test answer',
        history: [{ role: 'agent', content: 'Question 1' }],
        sessionSeed: 12345,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    
    const json = await res.json();
    expect(json.reply).toBe('SYSTEM ERROR: Unable to process request.');
  });
});

