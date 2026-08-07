'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: 'agent',
      content: 'SYSTEM INITIALIZED. AWAITING CANDIDATE INPUT. TYPE "START" TO BEGIN INTERVIEW.',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'candidate', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, history: messages }),
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'agent', content: data.reply }]);
      
      if (data.done) {
        setMessages((prev) => [...prev, { role: 'system', content: 'INTERVIEW CONCLUDED. FEEDBACK GENERATED.' }]);
        console.log("Feedback:", data.feedback);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'system', content: 'ERROR COMMUNICATING WITH SERVER.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 flex flex-col font-mono max-w-5xl mx-auto">
      
      <header className="mb-8 border-b-4 border-black pb-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          [AI_INTERVIEWER]
        </h1>
        <p className="bg-black text-white inline-block px-2 mt-2 font-bold uppercase">
          TRIForge Cohort Assessment Module v1.0
        </p>
      </header>

      <main className="flex-1 flex flex-col brutal-border brutal-shadow-static bg-[#f0f0f0] p-4 md:p-8 mb-8 overflow-hidden h-[60vh]">
        <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-4">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`max-w-[85%] ${m.role === 'candidate' ? 'self-end' : 'self-start'}`}
            >
              <div className="text-xs font-bold uppercase mb-1 flex items-center gap-2">
                {m.role === 'agent' && <span className="w-3 h-3 bg-black inline-block rounded-none" />}
                {m.role === 'candidate' && <span className="w-3 h-3 bg-[#00ff00] brutal-border inline-block" />}
                {m.role === 'system' && <span className="w-3 h-3 bg-[#ff00ff] inline-block brutal-border" />}
                {m.role}
              </div>
              <div 
                className={`p-4 brutal-border text-lg ${
                  m.role === 'candidate' 
                    ? 'bg-[#00ff00] text-black brutal-shadow' 
                    : m.role === 'system'
                    ? 'bg-[#ff00ff] text-white font-bold'
                    : 'bg-white text-black brutal-shadow-static'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="self-start max-w-[85%]">
              <div className="text-xs font-bold uppercase mb-1">agent</div>
              <div className="p-4 brutal-border bg-white text-black text-lg animate-pulse">
                PROCESSING...
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </main>

      <footer className="mt-auto">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="TYPE YOUR RESPONSE..."
            className="flex-1 p-4 brutal-border brutal-shadow text-xl uppercase placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-[#ff00ff]"
          />
          <button 
            type="submit"
            disabled={loading}
            className="brutal-button brutal-shadow text-xl px-8 disabled:opacity-50"
          >
            SEND
          </button>
        </form>
      </footer>
    </div>
  );
}
