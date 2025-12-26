"use client";

import { useState, useEffect } from "react";
// Import Charts
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  // --- STATE ---
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  // Chat State
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Stats State
  const [stats, setStats] = useState({ total: 0, hits: 0, graph: [] });

  const backendUrl = "https://nexusgateway.onrender.com"; 

  // --- EFFECT: LOAD STATS ---
  useEffect(() => {
    fetch(`${backendUrl}/api/stats`)
      .then(res => res.json())
      .then(data => {
        setStats({
            total: data.total_requests || 0,
            hits: data.cache_hits || 0,
            graph: data.graph_data || []
        });
      })
      .catch(err => console.log("Stats error", err));
  }, []);

  // --- ACTIONS ---

  // 1. Register User
  const handleRegister = async () => {
    if(!email) return alert("Enter an email!");
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setApiKey(data.api_key);
      else alert("Error: " + JSON.stringify(data));
    } catch (err) {
      alert("Server error");
    }
    setLoading(false);
  };

  // 2. Send Chat Message
  const handleChat = async () => {
    if (!apiKey) return alert("Enter API Key first");
    if (!message) return;
    setChatLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ message, model: model }),
      });
      const data = await res.json();
      
      if (res.status === 402) {
        setChatResponse("⛔ Quota Exceeded. Please Upgrade your plan below.");
      } else if (res.ok) {
        setChatResponse(data.choices?.[0]?.message?.content || "No response");
      } else {
        setChatResponse("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      setChatResponse("Connection Failed");
    }
    setChatLoading(false);
  };

  // 3. Upgrade Plan
  const handleUpgrade = async () => {
    if (!apiKey) return alert("Enter API Key first (Step 1)");
    try {
      const res = await fetch(`${backendUrl}/api/checkout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
      else alert("Checkout failed");
    } catch (err) {
      alert("Payment Error");
    }
  };

  // Calculate Money
  const moneySaved = (stats.hits * 0.002).toFixed(4);

  return (
    <div className="main-wrapper">
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{fontSize: '2.5rem', marginBottom:'5px'}}>Nexus Gateway</h1>
        <p style={{color:'#94a3b8', marginBottom:'20px'}}>High-Performance AI Semantic Caching Layer</p>
        
        <a href="/docs" style={{textDecoration:'none'}}>
            <button className="btn" style={{
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#e2e8f0', 
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px'
            }}>
                <span> Read Documentation</span>
                <span style={{opacity:0.5}}>→</span>
            </button>
        </a>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card" style={{padding: '15px', textAlign:'center'}}>
            <p style={{fontSize: '1.5rem', fontWeight:'bold', color: '#4ade80'}}>${moneySaved}</p>
            <p style={{fontSize: '0.7rem', color: '#94a3b8'}}>SAVED</p>
          </div>
          <div className="glass-card" style={{padding: '15px', textAlign:'center'}}>
            <p style={{fontSize: '1.5rem', fontWeight:'bold', color: '#a78bfa'}}>{stats.total}</p>
            <p style={{fontSize: '0.7rem', color: '#94a3b8'}}>REQUESTS</p>
          </div>
      </div>

      <div className="glass-card" style={{marginBottom: '30px', height: '220px', paddingBottom: '40px'}}>
        <h2 style={{fontSize: '0.9rem', marginBottom: '10px', border: 'none'}}>Last 24 Hours Traffic</h2>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.graph}>
                <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tick={false} />
                <Tooltip 
                    contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px'}} 
                    itemStyle={{color: '#fff'}}
                />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={false} />
            </LineChart>
        </ResponsiveContainer>
      </div>


      {/* AUTH SECTION */}
      <div className="glass-card">
        <h2>🔑 1. Get Access</h2>
        {!apiKey ? (
          <div className="input-group">
            <input 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <button className="btn btn-primary" onClick={handleRegister} disabled={loading}>
              {loading ? "..." : "Get Key"}
            </button>
          </div>
        ) : (
          <div>
            <div className="code-block">{apiKey}</div>
            <p style={{fontSize: '0.8rem', color: '#4ade80'}}>Key Generated Successfully!</p>
          </div>
        )}
      </div>

      {/* BILLING SECTION (Visible when Key is present) */}
      {apiKey && (
        <div className="glass-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderLeft: '4px solid #f43f5e'}}>
            <div>
                <h2 style={{border:'none', marginBottom:'5px', fontSize:'1.1rem'}}>Current Plan</h2>
                <p style={{fontSize:'0.8rem', color:'#94a3b8'}}>Free Tier (100 Requests)</p>
            </div>
            <button className="btn btn-secondary" onClick={handleUpgrade}>
                ⚡ Upgrade to Pro
            </button>
        </div>
      )}

      {/* CHAT SECTION */}
      <div className="glass-card">
        <h2>🤖 2. Test AI Chat</h2>

        <div style={{marginBottom: '15px'}}>
            <input 
              style={{width: '93%'}}
              placeholder="Paste API Key here..." 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
            />
        </div>

        <div style={{marginBottom: '15px'}}>
            <label style={{fontSize: '0.8rem', color:'#94a3b8', display:'block', marginBottom:'5px'}}>SELECT MODEL</label>
            <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{
                    width: '100%', padding: '10px', background: '#000', color: 'white', 
                    border: '1px solid rgba(255,255,255,0.125)', borderRadius: '8px'
                }}
            >
                <option value="gpt-3.5-turbo">OpenAI GPT-3.5 (Fast)</option>
                <option value="gpt-4">OpenAI GPT-4 (Smart)</option>
                <option value="claude-3-opus-20240229">Anthropic Claude 3 (Pro)</option>
            </select>
        </div>

        <div className="input-group">
          <input 
            placeholder="Ask AI something..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()} 
          />
          <button className="btn btn-primary" onClick={handleChat} disabled={chatLoading}>
            {chatLoading ? "..." : "Send"}
          </button>
        </div>

        {chatResponse && (
          <div className="response-box">
            {chatResponse}
          </div>
        )}
      </div>

      <footer style={{
    textAlign:'center', 
    marginTop:'60px', 
    padding:'20px', 
    borderTop: '1px solid rgba(255,255,255,0.1)',
    color:'#64748b', 
    fontSize:'0.8rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
}}>
    <span>© 2025 Nexus Gateway Inc.</span>
    <a href="https://github.com/ANANDSUNNY0899" target="_blank" className="hover:text-white transition-colors">GitHub</a>
    <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
    <a href="mailto:support@nexusgateway.com" className="hover:text-white transition-colors">Support</a>
</footer>

    </div>
  );
}