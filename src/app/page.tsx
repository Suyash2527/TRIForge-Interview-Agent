'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: 'agent',
      content: 'Hello! Welcome to your interview.\n\nRole:\nFrontend Developer\n\nDifficulty:\nMedium\n\nEstimated Time:\n20 Minutes\n\nPress Start Interview to begin.',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, feedback]);

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
        setMessages((prev) => [...prev, { role: 'system', content: 'INTERVIEW CONCLUDED. PROCESSING FEEDBACK...' }]);
        if (data.feedback) {
          setFeedback(data.feedback);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'system', content: 'ERROR COMMUNICATING WITH SERVER.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center mx-auto w-full">
      
      {/* 85% Viewport Container */}
      <div className="w-full md:w-[85%] max-w-7xl flex flex-col flex-1">
        
        {/* Modern SaaS Hero Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl md:text-5xl bg-white p-3 neo-border neo-shadow-static inline-flex items-center justify-center">
              🤖
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-color)]">
                AI Interviewer
              </h1>
              <p className="text-sm md:text-base font-medium text-gray-500 mt-1">
                Practice • Analyze • Improve
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <div className="neo-border bg-white px-3 py-1 text-sm font-bold flex items-center gap-2 shadow-[4px_4px_0px_0px_#000]">
              <span className="w-2.5 h-2.5 bg-[var(--success)] rounded-full animate-pulse" />
              AI ONLINE
            </div>
            <span className="text-xs font-semibold text-gray-500 mt-2 mr-1">
              Latency: 24ms
            </span>
          </div>
        </header>

        {/* 75vh Interview Panel */}
        <main className="flex-1 flex flex-col neo-border neo-shadow-static bg-white p-6 md:p-7 mb-8 overflow-hidden h-[75vh]">
          <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-4">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${m.role === 'candidate' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar */}
                {m.role === 'agent' && (
                  <div className="w-12 h-12 flex-shrink-0 bg-[var(--bg-color)] neo-border flex items-center justify-center text-xl shadow-[4px_4px_0px_0px_#000]">
                    🤖
                  </div>
                )}
                {m.role === 'system' && (
                  <div className="w-12 h-12 flex-shrink-0 bg-[var(--secondary)] neo-border flex items-center justify-center text-xl text-white shadow-[4px_4px_0px_0px_#000]">
                    ⚙️
                  </div>
                )}
                {m.role === 'candidate' && (
                  <div className="w-12 h-12 flex-shrink-0 bg-blue-100 neo-border flex items-center justify-center text-xl shadow-[4px_4px_0px_0px_#000]">
                    👤
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div 
                    className={`p-5 md:p-6 neo-border neo-shadow-static text-[1.05rem] leading-relaxed whitespace-pre-wrap ${
                      m.role === 'candidate' 
                        ? 'msg-candidate' 
                        : m.role === 'system'
                        ? 'msg-system'
                        : 'msg-agent'
                    }`}
                  >
                    {m.content}
                  </div>
                  <span suppressHydrationWarning className={`text-xs font-semibold text-gray-400 mt-1 ${m.role === 'candidate' ? 'text-right' : 'text-left'}`}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            
            {/* AI Typing Indicator */}
            {loading && (
              <div className="flex gap-4 max-w-[90%] md:max-w-[80%] self-start">
                <div className="w-12 h-12 flex-shrink-0 bg-[var(--bg-color)] neo-border flex items-center justify-center text-xl shadow-[4px_4px_0px_0px_#000]">
                  🤖
                </div>
                <div className="flex flex-col gap-1">
                  <div className="p-5 md:p-6 neo-border neo-shadow-static msg-agent flex items-center gap-1.5 h-[76px]">
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full typing-dot" />
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full typing-dot" />
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Feedback Report Rendering */}
            {feedback && (
              <div className="mt-8 mb-4 flex flex-col gap-4 self-center w-full max-w-4xl animate-[fade-in-up_0.5s_ease-out_forwards]">
                <div className="text-center mb-2">
                  <h2 className="text-3xl font-extrabold uppercase tracking-tight">Performance Report</h2>
                </div>
                
                <div className="neo-border bg-[#F8FAFC] p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col gap-6">
                  
                  {/* Grade Badge */}
                  <div className="flex items-center justify-between border-b-2 border-black pb-4">
                    <span className="text-xl font-bold uppercase">Final Grade</span>
                    <span className={`text-2xl font-extrabold px-4 py-2 neo-border ${feedback.grade === 'PASS' ? 'bg-[var(--success)] text-white' : 'bg-[var(--error)] text-white'}`}>
                      {feedback.grade}
                    </span>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-lg font-bold mb-2 uppercase">Summary</h3>
                    <p className="text-gray-800 text-[1.05rem] leading-relaxed bg-white p-4 neo-border">
                      {feedback.summary}
                    </p>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2 uppercase text-[var(--success)]">Strengths</h3>
                      <ul className="bg-white p-4 neo-border flex flex-col gap-2 h-full">
                        {feedback.strengths?.map((s: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-[var(--success)] font-bold">✓</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 uppercase text-[var(--error)]">Weaknesses</h3>
                      <ul className="bg-white p-4 neo-border flex flex-col gap-2 h-full">
                        {feedback.weaknesses?.map((w: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-[var(--error)] font-bold">✕</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                </div>
              </div>
            )}
            
            <div ref={endOfMessagesRef} />
          </div>
        </main>

        {/* Input Area */}
        <footer className="mt-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || feedback !== null}
              placeholder={feedback ? "Interview concluded." : "Type your answer..."}
              className="w-full neo-input neo-border neo-shadow neo-interactive disabled:opacity-50 pr-40 pl-6 py-5 text-lg"
            />
            
            <div className="absolute right-4 flex items-center gap-2">
              <button 
                type="button"
                className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border-2 border-transparent rounded-lg transition-colors"
                title="Voice Input (Mock)"
                disabled={feedback !== null}
              >
                🎤
              </button>
              <button 
                type="submit"
                disabled={loading || feedback !== null}
                className="neo-button neo-border shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-1 active:translate-x-1 transition-all disabled:opacity-50 flex items-center gap-2 px-6 py-3"
              >
                Send ➜
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}
