import { useState } from 'react';
import './App.css';

export default function App() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([0,0,0,0]);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState(null);
  const [queries, setQueries] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const setStage = (i, val) => setStages(prev => {
    const n = [...prev]; n[i] = val; return n;
  });

  const askNexus = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setStages([0,0,0,0]);
    setElapsed(0);

    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed(((Date.now()-start)/1000).toFixed(1));
    }, 100);

    setStage(0,1);
    const t1 = setTimeout(() => { setStage(0,2); setStage(1,1); }, 3000);
    const t2 = setTimeout(() => { setStage(1,2); setStage(2,1); }, 6000);
    const t3 = setTimeout(() => { setStage(2,2); setStage(3,1); }, 9000);

    try {
      const res = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({question})
      });
      const data = await res.json();
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearInterval(timer);
      setStages([2,2,2,2]);
      const t = ((Date.now()-start)/1000);
      setElapsed(t.toFixed(1));
      setQueries(q => q+1);
      setTotalTime(tt => tt+t);
      setResult(data);
 } catch(e) {
    clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    clearInterval(timer);
    setStages([0,0,0,0]);
    setResult({
        plan: "Backend is currently offline. Clone the repo and run locally to see NEXUS in action.",
        research: "See GitHub for setup instructions: github.com/sharmaakarshit60-maker/Nexus",
        answer: "NEXUS requires the Python backend running locally with your API keys.",
        final: "Visit the GitHub repo for full setup and demo walkthrough."
    });
}
    setLoading(false);
  };

  const stateClass = (s) => s===1?'active':s===2?'done':'';

  const agents = [
    {icon:'🧠', label:'Planner', key:'plan'},
    {icon:'🔍', label:'Researcher', key:'research'},
    {icon:'⚡', label:'Reasoner', key:'answer'},
    {icon:'🎯', label:'Final Answer', key:'final'},
  ];

  return (
    <div className="nx-root">
      <div className="nx-grid"/>
      <div className="nx-orb"/>
      <div className="nx-inner">
        <div className="nx-eyebrow">Autonomous Reasoning System</div>
        <h1 className="nx-title">NEXUS</h1>
        <p className="nx-sub">Four specialized agents. One intelligent answer.</p>

        <div className="nx-stats">
          <div className="nx-stat"><div className="nx-stat-val">4</div><div className="nx-stat-lbl">Agents</div></div>
          <div className="nx-stat"><div className="nx-stat-val">{queries}</div><div className="nx-stat-lbl">Queries</div></div>
          <div className="nx-stat"><div className="nx-stat-val">{queries>0?(totalTime/queries).toFixed(1)+'s':'—'}</div><div className="nx-stat-lbl">Avg Time</div></div>
        </div>

        <div className="nx-box">
          <textarea
            className="nx-textarea"
            value={question}
            onChange={e=>setQuestion(e.target.value)}
            onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter')askNexus();}}
            placeholder="Ask anything — NEXUS will plan, research, reason, and critique before answering."
            rows={3}
            disabled={loading}
          />
          <div className="nx-toolbar">
            <span className="nx-hint">⌘ + Enter to submit</span>
            <button className={`nx-btn${(!question.trim()||loading)?' disabled':''}`} onClick={askNexus} disabled={loading||!question.trim()}>
              {loading?'Processing...':'Ask NEXUS'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="nx-thinking">
            <div className="nx-agent-grid">
              {agents.map((a,i)=>(
                <div key={i} className={`nx-agent ${stateClass(stages[i])}`}>
                  <div className="nx-agent-icon">{a.icon}</div>
                  <div className="nx-agent-name">{a.label}</div>
                  <div className="nx-agent-status">
                    {stages[i]===1&&<><span className="nx-pulse"/><span>Running</span></>}
                    {stages[i]===2&&<span>✓ Done</span>}
                    {stages[i]===0&&<span>Waiting</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="nx-timer"><span className="nx-pulse"/>{elapsed}s elapsed</div>
          </div>
        )}

        {result && (
          <div className="nx-results">
            <div className="nx-results-hdr">
              <span className="nx-results-lbl">Response</span>
              <span className="nx-results-time">Completed in {elapsed}s</span>
            </div>
            {agents.map((a,i)=>(
              <div key={i} className="nx-card">
                <div className="nx-card-head">
                  <span className="nx-card-icon">{a.icon}</span>
                  <span className="nx-card-title">{a.label}</span>
                  <span className="nx-badge">Complete</span>
                </div>
                <div className="nx-card-body">{result[a.key]}</div>
              </div>
            ))}
          </div>
        )}

        <div className="nx-footer">NEXUS AI — Multi-Agent Reasoning System</div>
      </div>
    </div>
  );
}