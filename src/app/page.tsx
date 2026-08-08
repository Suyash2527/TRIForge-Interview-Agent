'use client';

import { useState, useRef, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
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
  const currentQuestion = Math.min(Math.ceil(messages.length / 2), 10);
  const totalQuestions = 10;

  // Calculate dynamic score based on feedback or active interview progression
  const dynamicScore = feedback?.scores
    ? Math.round(
        (feedback.scores.technicalDepth +
          feedback.scores.communication +
          feedback.scores.problemSolving +
          feedback.scores.systemDesign) / 4
      )
    : isInterviewStarted
    ? Math.min(70 + Math.floor(messages.length * 2.2), 94)
    : null;

  // Dynamic topic tracking based on current question number
  const getTopicState = (topicIndex: number) => {
    if (!isInterviewStarted) return 'upcoming';
    const qNum = currentQuestion;
    if (qNum > (topicIndex + 1) * 2.5) return 'completed';
    if (qNum > topicIndex * 2.5) return 'active';
    return 'upcoming';
  };

  const topics = [
    { name: 'Embeddings', state: getTopicState(0) },
    { name: 'Vector Databases', state: getTopicState(1) },
    { name: 'Agentic Frameworks', state: getTopicState(2) },
    { name: 'Prompt Engineering', state: getTopicState(3) },
  ];

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={`h-screen w-full flex flex-col bg-[var(--bg)] overflow-hidden relative transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Minimal Header */}
        <header className="h-12 border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0 z-10">
          <span className="text-sm font-semibold text-[var(--text)] tracking-tight">AI Interviewer</span>
          
          <div className="hidden md:flex items-center gap-5 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              Session Active
            </div>
            <div className="h-3 w-px bg-[var(--border)]"></div>
            <div>Difficulty: Medium</div>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:flex w-60 flex-col border-r border-[var(--border)] p-5 gap-6 bg-[var(--surface)]">
            
            {/* Session Progress */}
            <div>
              <h2 className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-4">Current Session</h2>
              <div className="panel-inner p-4 flex flex-col gap-3">
                <div className="flex justify-between items-baseline text-[13px]">
                  <span className="text-[var(--text-secondary)]">Question</span>
                  <span className="font-medium text-[var(--text)]">{isInterviewStarted ? `${currentQuestion} / ${totalQuestions}` : `0 / ${totalQuestions}`}</span>
                </div>
                
                {/* Segmented Progress */}
                <div className="flex gap-1">
                  {Array.from({ length: totalQuestions }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`progress-segment ${isInterviewStarted && i < currentQuestion - 1 ? 'completed' : isInterviewStarted && i === currentQuestion - 1 ? 'active' : ''}`}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-[13px] mt-1">
                  <span className="text-[var(--text-secondary)]">Score</span>
                  {dynamicScore !== null ? (
                    <span className="score-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                      {dynamicScore}%
                    </span>
                  ) : (
                    <span className="text-[11px] text-[var(--text-tertiary)] font-mono">--</span>
                  )}
                </div>
              </div>
            </div>

            {/* Topics */}
            <div>
              <h2 className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-4">Topics Covered</h2>
              <ul className="flex flex-col gap-2.5">
                {topics.map((topic, i) => (
                  <li 
                    key={i} 
                    className={`flex items-center gap-2.5 text-[13px] rounded-lg px-2.5 py-1.5 transition-colors ${
                      topic.state === 'active' ? 'bg-[rgba(212,148,58,0.06)]' : ''
                    }`}
                  >
                    <div className={`topic-ring ${topic.state}`}>
                      {topic.state === 'completed' && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      )}
                    </div>
                    <span className={
                      topic.state === 'completed' ? 'text-[var(--text)]' :
                      topic.state === 'active' ? 'text-[var(--text)] font-medium' :
                      'text-[var(--text-tertiary)]'
                    }>
                      {topic.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Central Chat Area */}
          <main className="flex-1 flex flex-col relative">
            <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12 lg:px-20 scroll-smooth">
              <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-32">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`flex gap-3 animate-slide-up ${m.role === 'candidate' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    {m.role === 'agent' && (
                      <div className="avatar-ai mt-1">AI</div>
                    )}
                    {m.role === 'candidate' && (
                      <div className="avatar-user mt-1">You</div>
                    )}

                    {/* Message */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className={`flex items-center gap-2 ${m.role === 'candidate' ? 'justify-end' : ''}`}>
                        <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                          {m.role === 'agent' ? 'AI Interviewer' : m.role === 'candidate' ? 'You' : ''}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)]" suppressHydrationWarning>
                          {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      
                      <div 
                        className={`whitespace-pre-wrap max-w-[92%] ${
                          m.role === 'candidate' 
                            ? 'msg-candidate rounded-xl rounded-tr-sm px-4 py-3 text-[15px] leading-relaxed ml-auto' 
                            : m.role === 'system'
                            ? 'msg-system text-center w-full max-w-full my-4 py-2'
                            : 'msg-agent pr-8'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* AI Typing Indicator */}
                {loading && (
                  <div className="flex gap-3 items-start animate-slide-up">
                    <div className="avatar-ai mt-1">AI</div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-[var(--text-secondary)]">AI Interviewer</span>
                      <div className="flex items-center gap-1.5 py-3">
                        <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full typing-dot" />
                        <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full typing-dot" />
                        <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full typing-dot" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Analytics Feedback Dashboard */}
                {feedback && (
                  <div className="mt-12 w-full animate-slide-up">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px bg-[var(--border)] flex-1"></div>
                      <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.1em]">Interview Report</span>
                      <div className="h-px bg-[var(--border)] flex-1"></div>
                    </div>
                    
                    <div className="panel p-6 md:p-8 flex flex-col gap-8">
                      
                      {/* Header Score Row */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-xl font-semibold">Performance Analytics</h2>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">Detailed breakdown of your engineering interview.</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold text-sm border ${feedback.grade === 'PASS' ? 'bg-[rgba(91,168,114,0.1)] text-[var(--success)] border-[rgba(91,168,114,0.2)]' : 'bg-[rgba(199,92,92,0.1)] text-[var(--error)] border-[rgba(199,92,92,0.2)]'}`}>
                          FINAL GRADE: {feedback.grade}
                        </div>
                      </div>

                      {/* AI Summary */}
                      <div className="panel-inner p-5">
                        <h3 className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-3">AI Synthesis</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                          {feedback.summary}
                        </p>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="panel-inner p-5 flex flex-col gap-4">
                          <h3 className="text-[11px] font-semibold text-[var(--success)] uppercase tracking-[0.08em] flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Key Strengths
                          </h3>
                          <ul className="flex flex-col gap-3">
                            {feedback.strengths?.map((s: string, i: number) => (
                              <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mt-1.5 shrink-0"></span>
                                <span className="leading-relaxed">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="panel-inner p-5 flex flex-col gap-4">
                          <h3 className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-[0.08em] flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            Areas for Growth
                          </h3>
                          <ul className="flex flex-col gap-3">
                            {feedback.weaknesses?.map((w: string, i: number) => (
                              <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0"></span>
                                <span className="leading-relaxed">{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Competency Metrics */}
                      <div>
                        <h3 className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-4">Competency Scores</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { label: 'Technical Depth', val: feedback.scores?.technicalDepth ?? 0 },
                            { label: 'Communication', val: feedback.scores?.communication ?? 0 },
                            { label: 'Problem Solving', val: feedback.scores?.problemSolving ?? 0 },
                            { label: 'System Design', val: feedback.scores?.systemDesign ?? 0 },
                          ].map((stat, i) => (
                            <div key={i} className="panel-inner p-4 flex flex-col gap-1 items-center justify-center text-center">
                              <span className="text-lg font-semibold text-[var(--text)]">{stat.val}%</span>
                              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</span>
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

            {/* Floating Composer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:px-12 lg:px-20 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/95 to-transparent pb-6">
              <div className="max-w-2xl mx-auto">
                {!isInterviewStarted && !feedback && !loading ? (
                  <div className="flex flex-col items-center gap-4 animate-slide-up">
                    <button 
                      onClick={() => submitMessage("START")}
                      className="btn-primary w-full py-3.5 text-sm tracking-wide flex items-center justify-center"
                    >
                      Begin Interview
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="floating-composer relative flex items-end p-2 animate-slide-up">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={loading || feedback !== null}
                      placeholder={feedback ? "Session closed." : "Type your answer..."}
                      className="w-full resize-none overflow-y-auto bg-transparent text-[15px] text-[var(--text)] outline-none disabled:opacity-50 px-3 py-3 min-h-[44px] placeholder:text-[var(--text-tertiary)]"
                      rows={1}
                      style={{ maxHeight: '200px' }}
                    />
                    
                    <div className="flex items-center gap-1 mb-1.5 mr-1.5 shrink-0">
                      <button 
                        type="button"
                        onClick={() => submitMessage("[END_INTERVIEW]")}
                        title="End Interview"
                        disabled={loading || feedback !== null}
                        className="btn-icon p-2 hover:bg-[rgba(199,92,92,0.1)] hover:text-[var(--error)] transition-colors disabled:opacity-50"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>
                      </button>
                      <button 
                        type="submit"
                        disabled={loading || feedback !== null || !input.trim()}
                        className="btn-primary p-2 flex items-center justify-center disabled:opacity-50 disabled:bg-[var(--surface-raised)] disabled:text-[var(--text-tertiary)]"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              <div className="text-center mt-3">
                <span className="text-[10px] text-[var(--text-tertiary)]">Practice session — AI-generated questions and feedback are for preparation only, not a substitute for real interviews.</span>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}
