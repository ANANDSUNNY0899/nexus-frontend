"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  // Chat State
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo"); // <--- NEW STATE
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const backendUrl = "https://nexusgateway.onrender.com"; 

  // 1. REGISTER
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

  // 2. CHAT
  const handleChat = async () => {
    if (!apiKey) return alert("Enter API Key first");
    if (!message) return;
    setChatLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        // NEW: We send the selected model
        body: JSON.stringify({ message, model: model }),
      });
      const data = await res.json();
      
      if (res.status === 402) {
        setChatResponse("⛔ Quota Exceeded. You need to upgrade.");
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

  // 3. UPGRADE
  const handleUpgrade = async () => {
    if (!apiKey) return alert("Enter API Key first");
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

  return (
    <div className="main-wrapper">
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Nexus Gateway</h1>
        <p>High-Performance AI Semantic Caching Layer</p>
      </div>

      {/* SECTION 1: AUTH */}
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

      {/* SECTION 2: CHAT */}
      <div className="glass-card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2>🤖 2. Test AI Chat</h2>
            {apiKey && (
                <button className="btn btn-secondary" style={{padding:'5px 10px', fontSize:'0.8rem'}} onClick={handleUpgrade}>
                    ⚡ Upgrade to Pro
                </button>
            )}
        </div>

        <div style={{marginBottom: '15px'}}>
            <input 
              style={{width: '93%'}}
              placeholder="Paste API Key here..." 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
            />
        </div>

        {/* NEW: MODEL SELECTOR */}
        <div style={{marginBottom: '15px'}}>
            <label style={{fontSize: '0.8rem', color:'#94a3b8', display:'block', marginBottom:'5px'}}>SELECT MODEL</label>
            <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{
                    width: '100%', 
                    padding: '10px', 
                    background: '#000', 
                    color: 'white', 
                    border: '1px solid rgba(255,255,255,0.125)', 
                    borderRadius: '8px'
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

    </div>
  );
}