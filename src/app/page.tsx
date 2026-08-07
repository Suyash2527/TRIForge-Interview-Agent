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
    <div className="min-h-screen bg-[var(--bg-color)] p-6 md:p-12 flex flex-col max-w-6xl mx-auto">
      
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[var(--primary)]" style={{textShadow: '3px 3px 0px #000'}}>
            [AI_INTERVIEWER]
          </h1>
          <p className="mt-4 text-lg font-medium text-gray-700">
            TRIForge Cohort Assessment Module v1.0
          </p>
        </div>
        <div className="hidden md:block neo-border neo-shadow-static bg-[var(--success)] px-4 py-2 text-white font-bold uppercase">
          System Online
        </div>
      </header>

      <main className="flex-1 flex flex-col neo-border neo-shadow-static bg-white p-6 md:p-10 mb-12 overflow-hidden h-[60vh]">
        <div className="flex-1 overflow-y-auto flex flex-col gap-8 pr-4">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`max-w-[85%] md:max-w-[75%] ${m.role === 'candidate' ? 'self-end' : 'self-start'}`}
            >
              <div className="text-sm font-bold uppercase mb-2 flex items-center gap-2 tracking-wide">
                {m.role === 'agent' && <span className="w-4 h-4 bg-[var(--primary)] neo-border inline-block rounded-full" />}
                {m.role === 'candidate' && <span className="w-4 h-4 bg-[var(--accent)] neo-border inline-block rounded-full" />}
                {m.role === 'system' && <span className="w-4 h-4 bg-[var(--secondary)] neo-border inline-block rounded-full" />}
                {m.role}
              </div>
              <div 
                className={`p-6 neo-border neo-shadow-static text-lg md:text-xl leading-relaxed ${
                  m.role === 'candidate' 
                    ? 'msg-candidate' 
                    : m.role === 'system'
                    ? 'msg-system'
                    : 'msg-agent'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="self-start max-w-[85%] md:max-w-[75%]">
              <div className="text-sm font-bold uppercase mb-2 flex items-center gap-2 tracking-wide">
                <span className="w-4 h-4 bg-[var(--primary)] neo-border inline-block rounded-full" />
                agent
              </div>
              <div className="p-6 neo-border neo-shadow-static msg-agent text-lg md:text-xl animate-pulse">
                Processing input...
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </main>

      <footer className="mt-auto">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your response here..."
            className="flex-1 neo-input neo-border neo-shadow neo-interactive disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={loading}
            className="neo-button neo-border neo-shadow neo-interactive text-xl px-12 py-4 disabled:opacity-50"
          >
            SEND
          </button>
        </form>
      </footer>
    </div>
  );
}
