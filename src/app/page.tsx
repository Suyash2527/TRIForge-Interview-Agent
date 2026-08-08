'use client';

import { useState, useRef, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';

/* ── tiny icon helpers ── */
const Icon = {
  Send: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Stop: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><rect x="9" y="9" width="6" height="6" />
    </svg>
  ),
  Check: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Up: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  Star: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Alert: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [showSplash, setShowSplash] = useState(true);
  const [sessionId] = useState<number>(() => Date.now());
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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, feedback]);

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

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <div
        className={`h-screen w-full flex flex-col overflow-hidden relative transition-opacity duration-700 ${
          showSplash ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* ── Header ── */}
        <header className="site-header h-[52px] flex items-center justify-between px-5 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
              TRI<span style={{ color: 'var(--accent)' }}>Forge</span>
            </span>
            <span className="hidden sm:inline text-[var(--text-tertiary)] text-xs">/ Interview Agent</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[var(--text-secondary)]">
            <div className="hidden sm:flex items-center gap-2">
              <div className="status-dot" />
              <span>Session active</span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-[var(--border-strong)]" />
            <span className="hidden md:block">Difficulty: Adaptive</span>
            <div className="h-3 w-px bg-[var(--border-strong)] hidden md:block" />
            <span
              className="font-mono text-[10px] text-[var(--text-tertiary)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              #{mounted ? String(sessionId).slice(-6) : '------'}
            </span>
          </div>
        </header>

        {/* ── Main workspace ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left sidebar ── */}
          <aside className="hidden lg:flex w-[220px] xl:w-[240px] flex-col site-sidebar p-5 gap-7 shrink-0">

            {/* Session progress */}
            <div className="flex flex-col gap-4">
              <span className="label-xs">Current Session</span>
              <div className="panel-inner p-4 flex flex-col gap-3">

                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[var(--text-secondary)]">Questions</span>
                  <span
                    className="font-semibold text-[var(--text)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {isStarted ? `${currentQ}` : '0'}<span className="text-[var(--text-tertiary)]">/{totalQ}</span>
                  </span>
                </div>

                {/* Segmented bar */}
                <div className="flex gap-0.5">
                  {Array.from({ length: totalQ }).map((_, i) => (
                    <div
                      key={i}
                      className={`progress-segment ${
                        isStarted && i < currentQ - 1
                          ? 'completed'
                          : isStarted && i === currentQ - 1
                          ? 'active'
                          : ''
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[var(--text-secondary)]">Score</span>
                  {dynamicScore !== null ? (
                    <span className="score-badge">
                      <Icon.Up />
                      {dynamicScore}%
                    </span>
                  ) : (
                    <span
                      className="text-[11px] text-[var(--text-tertiary)]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      --
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="flex flex-col gap-4">
              <span className="label-xs">Topics</span>
              <ul className="flex flex-col gap-2">
                {topics.map((t, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2.5 text-[13px] rounded-lg px-2.5 py-1.5 transition-colors ${
                      t.state === 'active' ? 'bg-[rgba(124,109,250,0.05)]' : ''
                    }`}
                  >
                    <div className={`topic-ring ${t.state}`}>
                      {t.state === 'completed' && <Icon.Check />}
                    </div>
                    <span
                      className={
                        t.state === 'completed'
                          ? 'text-[var(--text)]'
                          : t.state === 'active'
                          ? 'text-[var(--text)] font-medium'
                          : 'text-[var(--text-tertiary)]'
                      }
                    >
                      {t.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spacer + footer hint */}
            <div className="mt-auto">
              <div className="divider-gradient mb-4" />
              <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed">
                Press <kbd className="px-1 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--text-secondary)] text-[9px]">⏎</kbd> to send,{' '}
                <kbd className="px-1 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--text-secondary)] text-[9px]">⇧⏎</kbd> for new line.
              </p>
            </div>
          </aside>

          {/* ── Chat area ── */}
          <main className="flex-1 flex flex-col relative min-w-0">
            <div className="flex-1 overflow-y-auto px-4 py-8 md:px-10 lg:px-16 scroll-smooth">
              <div className="max-w-[680px] mx-auto flex flex-col gap-7 pb-36">

                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 animate-slide-up ${
                      m.role === 'candidate' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {m.role === 'agent' && <div className="avatar-ai mt-0.5 shrink-0">AI</div>}
                    {m.role === 'candidate' && <div className="avatar-user mt-0.5 shrink-0">You</div>}

                    <div className={`flex flex-col gap-1 min-w-0 ${m.role === 'candidate' ? 'items-end' : 'items-start'} flex-1`}>
                      {m.role !== 'system' && (
                        <div className={`flex items-center gap-2 ${m.role === 'candidate' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                            {m.role === 'agent' ? 'TRIForge AI' : 'You'}
                          </span>
                          <span
                            className="text-[10px] text-[var(--text-tertiary)]"
                            style={{ fontFamily: 'var(--font-mono)' }}
                            suppressHydrationWarning
                          >
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}

                      <div
                        className={`whitespace-pre-wrap ${
                          m.role === 'candidate'
                            ? 'msg-candidate px-4 py-3 text-[14.5px] leading-relaxed max-w-[88%]'
                            : m.role === 'system'
                            ? 'msg-system w-full text-center py-2 text-xs tracking-wide'
                            : 'msg-agent max-w-[92%]'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-3 items-start animate-slide-up">
                    <div className="avatar-ai mt-0.5 shrink-0">AI</div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-[var(--text-secondary)]">TRIForge AI</span>
                      <div className="flex items-center gap-1.5 py-3 px-1">
                        <span className="w-1.5 h-1.5 typing-dot" />
                        <span className="w-1.5 h-1.5 typing-dot" />
                        <span className="w-1.5 h-1.5 typing-dot" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Feedback report ── */}
                {feedback && (
                  <div className="mt-8 w-full animate-slide-up">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="divider-gradient flex-1" />
                      <span className="label-xs text-[var(--text-secondary)]">Interview Report</span>
                      <div className="divider-gradient flex-1" />
                    </div>

                    <div className="panel p-6 md:p-8 flex flex-col gap-8">

                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold tracking-tight">Performance Report</h2>
                          <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                            AI-generated assessment of your session.
                          </p>
                        </div>
                        <span
                          className={`self-start sm:self-auto px-4 py-1.5 rounded-lg font-semibold text-[13px] ${
                            feedback.grade === 'PASS' ? 'grade-pass' : 'grade-fail'
                          }`}
                        >
                          {feedback.grade ?? 'COMPLETE'}
                        </span>
                      </div>

                      {/* Summary */}
                      <div className="panel-inner p-5">
                        <span className="label-xs mb-3 block">Summary</span>
                        <p
                          className="text-[14px] text-[var(--text-secondary)] leading-relaxed"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {feedback.summary}
                        </p>
                      </div>

                      {/* Strengths & Growth */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="panel-inner p-5 flex flex-col gap-4">
                          <span className="label-xs flex items-center gap-1.5" style={{ color: 'var(--success)' }}>
                            <Icon.Star /> Strengths
                          </span>
                          <ul className="flex flex-col gap-2.5">
                            {feedback.strengths?.map((s: string, i: number) => (
                              <li key={i} className="flex gap-2.5 text-[13px] text-[var(--text-secondary)] items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="panel-inner p-5 flex flex-col gap-4">
                          <span className="label-xs flex items-center gap-1.5" style={{ color: 'var(--warning)' }}>
                            <Icon.Alert /> Areas to Improve
                          </span>
                          <ul className="flex flex-col gap-2.5">
                            {feedback.weaknesses?.map((w: string, i: number) => (
                              <li key={i} className="flex gap-2.5 text-[13px] text-[var(--text-secondary)] items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Competency scores */}
                      <div>
                        <span className="label-xs block mb-4">Competency Scores</span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { label: 'Technical Depth', val: feedback.scores?.technicalDepth ?? 0 },
                            { label: 'Communication',   val: feedback.scores?.communication   ?? 0 },
                            { label: 'Problem Solving', val: feedback.scores?.problemSolving  ?? 0 },
                            { label: 'System Design',   val: feedback.scores?.systemDesign    ?? 0 },
                          ].map((stat, i) => (
                            <div key={i} className="metric-card">
                              <span
                                className="text-2xl font-bold text-[var(--text)]"
                                style={{ fontFamily: 'var(--font-mono)' }}
                              >
                                {stat.val}
                                <span className="text-base font-normal text-[var(--text-secondary)]">%</span>
                              </span>
                              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">
                                {stat.label}
                              </span>
                              {/* Mini fill bar */}
                              <div className="w-full h-1 rounded-full bg-[var(--surface)] mt-2 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-1000"
                                  style={{
                                    width: `${stat.val}%`,
                                    background: 'linear-gradient(90deg, var(--accent), #a89cfb)',
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                <div ref={endRef} className="h-2" />
              </div>
            </div>

            {/* ── Floating composer ── */}
            <div className="absolute bottom-0 left-0 right-0 px-4 md:px-10 lg:px-16 pb-5 pt-8 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/90 to-transparent pointer-events-none">
              <div className="max-w-[680px] mx-auto pointer-events-auto">
                {!isStarted && !feedback && !loading ? (
                  <div className="animate-slide-up">
                    <button
                      onClick={() => submit('START')}
                      className="btn-primary w-full py-3.5 text-[14px] font-medium tracking-wide flex items-center justify-center gap-2"
                    >
                      Begin Interview
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="floating-composer flex items-end p-2 animate-slide-up"
                  >
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      disabled={loading || feedback !== null}
                      placeholder={feedback ? 'Session closed.' : 'Type your answer…'}
                      className="w-full resize-none overflow-y-auto bg-transparent text-[14.5px] text-[var(--text)] outline-none disabled:opacity-40 px-3 py-3 min-h-[44px] placeholder:text-[var(--text-tertiary)] leading-relaxed"
                      rows={1}
                      style={{ maxHeight: '200px' }}
                    />

                    <div className="flex items-center gap-1 mb-1.5 mr-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => submit('[END_INTERVIEW]')}
                        title="End interview"
                        disabled={loading || feedback !== null}
                        className="btn-icon p-2 hover:bg-[rgba(240,101,101,0.1)] hover:text-[var(--error)] disabled:opacity-40"
                      >
                        <Icon.Stop />
                      </button>
                      <button
                        type="submit"
                        disabled={loading || feedback !== null || !input.trim()}
                        className="btn-primary p-2 flex items-center justify-center disabled:opacity-40 disabled:shadow-none disabled:bg-[var(--surface-raised)] disabled:text-[var(--text-tertiary)]"
                      >
                        <Icon.Send />
                      </button>
                    </div>
                  </form>
                )}

                <p className="text-center mt-3 text-[10px] text-[var(--text-tertiary)]">
                  Practice session — AI-generated questions and feedback are for preparation only.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
