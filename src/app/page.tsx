'use client';

import { useState, useRef, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [showSplash, setShowSplash] = useState(false); // Disable old splash screen for now, since it doesn't match new branding
  const [sessionId, setSessionId] = useState<number>(() => Date.now());
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: 'agent',
      content:
        'Welcome to your AI engineering interview.\n\nRole: AI Systems Engineer\nDifficulty: Adaptive\nEstimated Time: 20 minutes\n\nPress Begin Interview when you\'re ready.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [liveScore, setLiveScore] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, feedback]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [input]);

  const submit = async (text: string) => {
    if (!text.trim() || loading || feedback !== null) return;
    setMessages((p) => [...p, { role: 'candidate', content: text }]);
    setInput('');
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages, sessionSeed: sessionId }),
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMessages((p) => [...p, { role: 'agent', content: data.reply }]);
      
      if (data.liveScore !== undefined && data.liveScore !== null) {
        setLiveScore(data.liveScore);
      }
      
      if (data.done) {
        setMessages((p) => [...p, { role: 'system', content: 'Interview concluded — generating report…' }]);
        if (data.feedback) setFeedback(data.feedback);
      }
    } catch {
      setMessages((p) => [...p, { role: 'system', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); submit(input); };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input); }
  };

  const isStarted = messages.length > 1;
  const currentQ = Math.min(Math.ceil(messages.length / 2), 10);
  const totalQ = 10;

  const dynamicScore = feedback?.scores
    ? Math.round(
        (feedback.scores.technicalDepth +
          feedback.scores.communication +
          feedback.scores.problemSolving +
          feedback.scores.systemDesign) / 4
      )
    : liveScore !== null
    ? liveScore
    : isStarted
    ? 75
    : null;

  const topicState = (i: number) => {
    if (!isStarted) return 'upcoming';
    if (currentQ > (i + 1) * 2.5) return 'completed';
    if (currentQ > i * 2.5) return 'active';
    return 'upcoming';
  };

  const topics = [
    { name: 'Embeddings' },
    { name: 'Vector Databases' },
    { name: 'Agentic Frameworks' },
    { name: 'Prompt Engineering' },
  ].map((t, i) => ({ ...t, state: topicState(i) }));

  const restartSession = () => {
    setSessionId(Date.now());
    setMessages([
      {
        role: 'agent',
        content:
          'Welcome to your AI engineering interview.\n\nRole: AI Systems Engineer\nDifficulty: Adaptive\nEstimated Time: 20 minutes\n\nPress Begin Interview when you\'re ready.',
      },
    ]);
    setInput('');
    setFeedback(null);
    setLiveScore(null);
  };

  if (!mounted) return null;

  return (
    <>
      <div className="bg-surface text-on-surface h-screen overflow-hidden flex flex-col">
        
        {/* TopNavBar */}
        <nav className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 shrink-0 z-10">
          <div className="flex items-center gap-md">
            <span className="text-[14px] font-bold tracking-tight text-primary">AI Interviewer</span>
          </div>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-[var(--color-error)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                fiber_manual_record
              </span>
              <span className="text-[14px] text-primary font-bold">
                {feedback ? 'Completed' : 'Live'}
              </span>
            </div>
            <div className="h-6 w-px bg-outline-variant hidden md:block"></div>
            <span className="text-[14px] text-primary font-bold hidden md:block">
              {dynamicScore !== null ? `${dynamicScore}% Score` : '--'}
            </span>
          </div>
        </nav>

        <div className="flex flex-1 overflow-hidden">
          
          {/* SideNavBar */}
          <aside className="bg-surface-container-low text-primary hidden md:flex flex-col h-full py-md border-r border-outline-variant w-64 shrink-0 overflow-y-auto z-10">
            <div className="px-md mb-lg">
              <h2 className="text-[24px] font-bold">Interview Progress</h2>
              <p className="text-[12px] text-[var(--color-on-surface-variant)] mt-xs">10 Questions | 4 Topics</p>
            </div>
            
            <nav className="flex-1 overflow-y-auto">
              <ul className="flex flex-col">
                {Array.from({ length: totalQ }).map((_, i) => {
                  const state = !isStarted ? 'upcoming' : i < currentQ - 1 ? 'completed' : i === currentQ - 1 ? 'active' : 'upcoming';
                  
                  if (state === 'completed') {
                    return (
                      <li key={i}>
                        <div className="flex items-center gap-md px-md py-sm text-[var(--color-on-surface-variant)] group">
                          <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="text-[12px]">Completed Q{i + 1}</span>
                        </div>
                      </li>
                    );
                  }
                  
                  if (state === 'active') {
                    return (
                      <li key={i}>
                        <div className="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container font-semibold translate-x-1 transition-transform">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                          <span className="text-[12px]">Active Q{i + 1}</span>
                        </div>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={i}>
                      <div className="flex items-center gap-md px-md py-sm text-[var(--color-on-surface-variant)] group">
                        <span className="material-symbols-outlined">radio_button_unchecked</span>
                        <span className="text-[12px]">Upcoming Q{i + 1}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
              <div className="h-px bg-outline-variant mx-md my-md"></div>
              
              <ul className="flex flex-col">
                {topics.map((t, i) => (
                  <li key={i}>
                    <div className={`flex items-center gap-md px-md py-sm ${t.state === 'active' ? 'bg-[var(--color-surface-container-high)] font-semibold' : 'text-[var(--color-on-surface-variant)]'} transition-all`}>
                      <span className={`material-symbols-outlined ${t.state === 'completed' ? 'text-[var(--color-secondary)]' : ''}`} style={{ fontVariationSettings: t.state === 'completed' ? "'FILL' 1" : undefined }}>
                        pie_chart
                      </span>
                      <span className="text-[12px]">Topic: {t.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Chat Canvas */}
          <main className="flex-1 flex flex-col bg-[var(--color-surface)] relative">
            <div className="flex-1 overflow-y-auto px-lg md:px-xl py-xl space-y-xl scroll-smooth">
              <div className="max-w-4xl mx-auto w-full">
                
                {messages.map((m, idx) => (
                  <div key={idx} className={m.role === 'candidate' ? "mb-xl pl-lg md:pl-xl" : "mb-lg border-b border-[var(--color-outline-variant)] pb-lg"}>
                    
                    {m.role === 'agent' && (
                      <div className="flex gap-md">
                        <div className="w-1 bg-[var(--color-secondary)] rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-[14px] text-[var(--color-secondary)] mb-xs font-bold uppercase tracking-widest">Interviewer (AI)</div>
                          <div className="text-[24px] text-[var(--color-on-surface)] leading-relaxed whitespace-pre-wrap font-semibold">
                            {m.content}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {m.role === 'candidate' && (
                      <>
                        <div className="text-[12px] text-[var(--color-on-surface-variant)] mb-xs uppercase tracking-widest">Candidate</div>
                        <div className="text-[18px] text-[var(--color-on-surface)] leading-relaxed text-opacity-90 whitespace-pre-wrap">
                          {m.content}
                        </div>
                      </>
                    )}

                    {m.role === 'system' && (
                       <div className="text-center py-4 text-[14px] text-[var(--color-on-surface-variant)] uppercase tracking-widest">
                         {m.content}
                       </div>
                    )}

                  </div>
                ))}
                
                {loading && (
                  <div className="mb-lg pb-lg">
                    <div className="flex gap-md">
                      <div className="w-1 bg-[var(--color-secondary)] rounded-full flex-shrink-0 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="text-[14px] text-[var(--color-secondary)] mb-xs font-bold uppercase tracking-widest">Interviewer (AI)</div>
                        <div className="flex items-center gap-1 mt-2">
                           <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                           <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse delay-75" />
                           <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse delay-150" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {feedback && (
                  <div className="mt-xl p-lg border border-[var(--color-outline-variant)] rounded-xl bg-[var(--color-surface-container-low)] mb-xl">
                     <h3 className="text-[24px] font-bold mb-md">Performance Report</h3>
                     <div className="mb-md">
                       <span className="text-[14px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Grade</span>
                       <div className={`mt-xs font-bold text-[18px] ${feedback.grade === 'PASS' ? 'text-[var(--color-secondary)]' : 'text-[var(--color-error)]'}`}>{feedback.grade}</div>
                     </div>
                     <div className="mb-md">
                       <span className="text-[14px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Summary</span>
                       <p className="mt-xs text-[16px] text-[var(--color-on-surface)]">{feedback.summary}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-md mb-md">
                        <div>
                          <span className="text-[14px] font-bold uppercase tracking-widest text-[var(--color-secondary)]">Strengths</span>
                          <ul className="mt-xs list-disc pl-4 text-[16px]">
                            {feedback.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[14px] font-bold uppercase tracking-widest text-[var(--color-error)]">Growth Areas</span>
                          <ul className="mt-xs list-disc pl-4 text-[16px]">
                            {feedback.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                     </div>
                  </div>
                )}

                <div ref={endRef} className="h-4" />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-[var(--color-surface-container-lowest)] border-t border-outline-variant p-lg md:p-xl shrink-0">
              <div className="max-w-4xl mx-auto w-full flex flex-col gap-sm">
                
                {!isStarted && !feedback && !loading ? (
                  <button onClick={() => submit('START')} className="bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded px-lg py-md hover:opacity-90 transition-opacity w-full font-bold">
                    Begin Interview
                  </button>
                ) : feedback ? (
                  <button onClick={restartSession} className="bg-[var(--color-secondary)] text-[var(--color-on-secondary)] rounded px-lg py-md hover:opacity-90 transition-opacity w-full font-bold flex items-center justify-center gap-sm">
                    <span className="material-symbols-outlined">refresh</span>
                    <span>Start New Session</span>
                  </button>
                ) : (
                  <>
                    <label className="text-[12px] text-[var(--color-on-surface-variant)] uppercase tracking-widest" htmlFor="answer-input">Your Response</label>
                    <div className="relative flex items-end gap-md">
                      <textarea 
                        id="answer-input"
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        disabled={loading}
                        placeholder="Type your answer..."
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded p-md text-[16px] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all resize-none disabled:opacity-50"
                        rows={1}
                        style={{ maxHeight: '200px' }}
                      />
                      <button 
                        onClick={handleSubmit}
                        disabled={loading || !input.trim()}
                        className="bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded px-lg py-md h-[48px] flex items-center justify-center gap-sm hover:opacity-90 transition-opacity shrink-0 disabled:opacity-50"
                      >
                        <span className="text-[14px]">Submit Answer</span>
                        <span className="material-symbols-outlined">send</span>
                      </button>
                    </div>
                  </>
                )}
                
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
