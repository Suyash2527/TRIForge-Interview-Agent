'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AiCore = dynamic(() => import('@/components/AiCore'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-[10px] animate-pulse">✨</div>
});

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, feedback]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const submitMessage = async (text: string) => {
    if (!text.trim() || loading || feedback !== null) return;

    const userMessage = { role: 'candidate', content: text };
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
        setMessages((prev) => [...prev, { role: 'system', content: 'Interview concluded. Processing feedback...' }]);
        if (data.feedback) {
          setFeedback(data.feedback);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'system', content: 'Error communicating with server.' }]);
    } finally {
      setLoading(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage(input);
    }
  };
  
  const isInterviewStarted = messages.length > 1;

  // Mock Stats Calculation
  const progressPercent = Math.min((messages.length / 10) * 100, 100);
  const currentQuestion = Math.ceil(messages.length / 2);

  return (
    <div className="h-screen w-full flex flex-col bg-[var(--bg-color)] overflow-hidden">
      
      {/* Sleek Navigation Header */}
      <header className="h-14 border-b border-[var(--border-color)] flex items-center justify-between px-6 shrink-0 bg-[var(--bg-color)]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center -ml-1">
            <AiCore isGenerating={loading} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-white leading-tight">AI Interviewer</h1>
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Practice • Analyze • Improve</span>
          </div>
        </div>
        
        {/* Mock Global Stats */}
        <div className="hidden md:flex items-center gap-6 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)] animate-pulse"></span>
            Connected (24ms)
          </div>
          <div className="h-3 w-px bg-[var(--border-color)]"></div>
          <div>Difficulty: Medium</div>
          <div className="h-3 w-px bg-[var(--border-color)]"></div>
          <div>00:14:32 Elapsed</div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar (Interview Progress) */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--border-color)] p-6 gap-6 bg-[var(--surface)]">
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Current Session</h2>
            <div className="premium-subpanel p-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Question</span>
                <span className="font-medium text-white">{currentQuestion} / 10</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[var(--bg-color)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm mt-1">
                <span className="text-[var(--text-secondary)]">Score</span>
                <span className="font-medium text-[var(--success)]">92%</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Topics Covered</h2>
            <ul className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2"><span className="text-[var(--success)]">✓</span> Embeddings</li>
              <li className="flex items-center gap-2"><span className="text-[var(--primary)]">●</span> Agentic Frameworks</li>
              <li className="flex items-center gap-2 opacity-50">○ Vector Databases</li>
              <li className="flex items-center gap-2 opacity-50">○ Prompt Engineering</li>
            </ul>
          </div>
        </aside>

        {/* Central Chat Area */}
        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12 lg:px-24 scroll-smooth">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-32">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col gap-1.5 animate-slide-up ${m.role === 'candidate' ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Label */}
                  <div className="flex items-center gap-2 px-1">
                    {m.role === 'agent' && (
                      <>
                        <div className="w-6 h-6 flex items-center justify-center">
                          <AiCore isGenerating={false} />
                        </div>
                        <span className="text-xs font-medium text-[var(--text-secondary)]">AI Interviewer</span>
                      </>
                    )}
                    {m.role === 'candidate' && (
                      <span className="text-xs font-medium text-[var(--text-secondary)]">You</span>
                    )}
                    <span className="text-[10px] text-gray-600">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div 
                    className={`px-5 py-3.5 text-[0.95rem] leading-relaxed whitespace-pre-wrap max-w-[90%] md:max-w-[85%] ${
                      m.role === 'candidate' 
                        ? 'msg-candidate rounded-2xl rounded-tr-sm' 
                        : m.role === 'system'
                        ? 'msg-system rounded-xl text-center w-full max-w-full my-4 py-2 border-dashed'
                        : 'msg-agent rounded-2xl rounded-tl-sm premium-panel shadow-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              
              {/* AI Typing Indicator */}
              {loading && (
                <div className="flex flex-col gap-1.5 items-start animate-slide-up">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <AiCore isGenerating={true} />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-secondary)]">AI Interviewer</span>
                  </div>
                  <div className="px-5 py-4 msg-agent premium-panel shadow-none rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full typing-dot" />
                    <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full typing-dot" />
                    <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full typing-dot" />
                  </div>
                </div>
              )}
              
              {/* Analytics Feedback Dashboard (Cursor/Linear Style) */}
              {feedback && (
                <div className="mt-12 w-full animate-slide-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-[var(--border-color)] flex-1"></div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">Interview Report</span>
                    <div className="h-px bg-[var(--border-color)] flex-1"></div>
                  </div>
                  
                  <div className="premium-panel bg-[var(--bg-color)] p-6 md:p-8 flex flex-col gap-8">
                    
                    {/* Header Score Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">Performance Analytics</h2>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Detailed breakdown of your engineering interview.</p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold text-sm border ${feedback.grade === 'PASS' ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' : 'bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20'}`}>
                        FINAL GRADE: {feedback.grade}
                      </div>
                    </div>

                    {/* AI Summary Card */}
                    <div className="premium-subpanel p-5">
                      <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">AI Synthesis</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {feedback.summary}
                      </p>
                    </div>

                    {/* Strengths & Weaknesses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="premium-subpanel p-5 flex flex-col gap-4">
                        <h3 className="text-xs font-semibold text-[var(--success)] uppercase tracking-wider flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                          Key Strengths
                        </h3>
                        <ul className="flex flex-col gap-3">
                          {feedback.strengths?.map((s: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mt-1.5 shrink-0"></span>
                              <span className="leading-relaxed">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="premium-subpanel p-5 flex flex-col gap-4">
                        <h3 className="text-xs font-semibold text-[var(--warning)] uppercase tracking-wider flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          Areas for Growth
                        </h3>
                        <ul className="flex flex-col gap-3">
                          {feedback.weaknesses?.map((w: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] mt-1.5 shrink-0"></span>
                              <span className="leading-relaxed">{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Metrics Radar/Grid */}
                    <div>
                      <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Competency Radar</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Technical Depth', val: feedback.scores?.technicalDepth ?? 0 },
                          { label: 'Communication', val: feedback.scores?.communication ?? 0 },
                          { label: 'Problem Solving', val: feedback.scores?.problemSolving ?? 0 },
                          { label: 'System Design', val: feedback.scores?.systemDesign ?? 0 },
                        ].map((stat, i) => (
                          <div key={i} className="premium-subpanel p-4 flex flex-col gap-1 items-center justify-center text-center">
                            <span className="text-xl font-semibold text-white">{stat.val}%</span>
                            <span className="text-[10px] text-[var(--text-secondary)] uppercase">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
              
              <div ref={endOfMessagesRef} className="h-4" />
            </div>
          </div>

          {/* Floating Composer Area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:px-12 lg:px-24 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/95 to-transparent pb-8">
            <div className="max-w-3xl mx-auto">
              {!isInterviewStarted && !feedback && !loading ? (
                <div className="flex flex-col items-center gap-4 animate-slide-up">
                  <button 
                    onClick={() => submitMessage("START")}
                    className="btn-primary w-full py-4 text-sm tracking-wide shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Initialize Session</span>
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono">↵ Enter</kbd>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="floating-composer relative flex items-end p-2 animate-slide-up backdrop-blur-xl">
                  {/* Left Action (Mock Voice) */}
                  <button 
                    type="button"
                    disabled={feedback !== null}
                    className="btn-icon p-2.5 mb-1 ml-1 disabled:opacity-50 flex-shrink-0"
                    title="Voice Input (Mock)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading || feedback !== null}
                    placeholder={feedback ? "Session closed." : "Message AI Interviewer..."}
                    className="w-full resize-none overflow-y-auto bg-transparent text-sm text-[var(--text-color)] outline-none disabled:opacity-50 px-3 py-3.5 min-h-[48px] placeholder:text-gray-500"
                    rows={1}
                    style={{ maxHeight: '200px' }}
                  />
                  
                  <div className="flex items-center gap-1.5 mb-1.5 mr-1.5 shrink-0">
                    <button 
                      type="button"
                      onClick={() => submitMessage("[END_INTERVIEW]")}
                      title="Terminate Session"
                      disabled={loading || feedback !== null}
                      className="btn-icon p-2 hover:bg-[var(--error)]/20 hover:text-[var(--error)] transition-colors disabled:opacity-50"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>
                    </button>
                    <button 
                      type="submit"
                      disabled={loading || feedback !== null || !input.trim()}
                      className="btn-primary p-2 flex items-center justify-center disabled:opacity-50 disabled:bg-[var(--surface-secondary)] disabled:text-gray-500"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            <div className="text-center mt-3">
              <span className="text-[10px] text-[var(--text-secondary)]">AI models can make mistakes. Verify critical clinical decisions.</span>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
