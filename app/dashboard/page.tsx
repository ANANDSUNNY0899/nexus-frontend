// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function Landing() {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <div className="main-wrapper" style={{maxWidth: '1200px', padding: '0'}}>
      
//       {/* NAVBAR */}
//       <nav style={{
//         position: 'fixed', top: 0, left: 0, right: 0, 
//         padding: '20px 40px', 
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         background: scrolled ? 'rgba(3, 0, 20, 0.9)' : 'transparent',
//         backdropFilter: 'blur(10px)',
//         borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
//         zIndex: 100, transition: 'all 0.3s'
//       }}>
//         <div style={{fontWeight: 'bold', fontSize: '1.2rem', color: 'white'}}>
//             🔷 Nexus<span style={{color:'#6366f1'}}>Gateway</span>
//         </div>
//         <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
//             <a href="/docs" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem'}}>Docs</a>
//             <a href="https://github.com/ANANDSUNNY0899/NexusGateway" target="_blank" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem'}}>GitHub</a>
//             <Link href="/dashboard">
//                 <button className="btn btn-primary" style={{padding: '8px 20px', fontSize:'0.9rem'}}>Launch App</button>
//             </Link>
//         </div>
//       </nav>

//       {/* HERO SECTION */}
//       <section style={{
//         height: '90vh', display: 'flex', flexDirection: 'column', 
//         alignItems: 'center', justifyContent: 'center', textAlign: 'center',
//         marginTop: '60px'
//       }}>
//         <div style={{
//             background: 'linear-gradient(to right, #818cf8, #c084fc)', 
//             padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', 
//             color: 'white', marginBottom: '20px', fontWeight: 'bold'
//         }}>
//             🚀 Now with Anthropic Claude 3 Support
//         </div>
        
//         <h1 style={{fontSize: '4rem', lineHeight: '1.1', marginBottom: '20px', maxWidth: '800px'}}>
//             Stop overpaying for <br/> <span style={{
//                 background: 'linear-gradient(to right, #4f46e5, #ec4899)', 
//                 WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
//             }}>AI API calls.</span>
//         </h1>
        
//         <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '40px'}}>
//             Nexus Gateway is the intelligent caching layer for OpenAI & Anthropic. 
//             Reduce latency by 95% and costs by 90% with one line of code.
//         </p>

//         <div style={{display: 'flex', gap: '15px'}}>
//             <Link href="/dashboard">
//                 <button className="btn btn-primary" style={{fontSize: '1.1rem', padding: '15px 40px'}}>Start for Free</button>
//             </Link>
//             <Link href="/docs">
//                 <button className="btn" style={{
//                     background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', 
//                     color: 'white', fontSize: '1.1rem', padding: '15px 40px'
//                 }}>Read Docs</button>
//             </Link>
//         </div>

//         {/* TERMINAL PREVIEW */}
//         <div style={{marginTop: '60px', width: '100%', maxWidth: '700px', textAlign: 'left'}}>
//             <div className="glass-card" style={{padding: '0', overflow: 'hidden'}}>
//                 <div style={{background: '#1e293b', padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center'}}>
//                     <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ef4444'}}></div>
//                     <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#eab308'}}></div>
//                     <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#22c55e'}}></div>
//                     <span style={{marginLeft: '10px', fontSize: '0.8rem', color: '#64748b'}}>bash</span>
//                 </div>
//                 <div style={{padding: '20px', background: '#0f172a', fontFamily: 'monospace', color: '#e2e8f0'}}>
//                     <p><span style={{color: '#818cf8'}}>$</span> pip install nexus-gateway</p>
//                     <p style={{color: '#94a3b8', marginTop: '10px'}}># Initialize Client</p>
//                     <p><span style={{color: '#c084fc'}}>from</span> nexus_gateway <span style={{color: '#c084fc'}}>import</span> NexusClient</p>
//                     <p>client = NexusClient(api_key=<span style={{color: '#4ade80'}}>"nk-..."</span>)</p>
//                     <p style={{color: '#94a3b8', marginTop: '10px'}}># Automatic Caching & Routing</p>
//                     <p>response = client.chat(<span style={{color: '#4ade80'}}>"Explain Quantum Computing"</span>)</p>
//                 </div>
//             </div>
//         </div>
//       </section>

//       {/* FEATURES GRID */}
//       <section style={{padding: '80px 20px'}}>
//         <h2 style={{textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', border: 'none'}}>Why Engineers Choose Nexus</h2>
        
//         <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px'}}>
//             <FeatureCard 
//                 icon="⚡" 
//                 title="Sub-ms Latency" 
//                 desc="Serve repeated queries instantly from Redis & Pinecone. No more waiting 3s for OpenAI." 
//             />
//             <FeatureCard 
//                 icon="💸" 
//                 title="90% Cost Reduction" 
//                 desc="Why pay twice for the same answer? Semantic caching stops the burn immediately." 
//             />
//             <FeatureCard 
//                 icon="🔀" 
//                 title="Universal Router" 
//                 desc="Switch between GPT-4, Claude 3, and Llama without changing your code structure." 
//             />
//             <FeatureCard 
//                 icon="🛡️" 
//                 title="PII Firewall" 
//                 desc="Automatically redact emails and phone numbers before they leave your infrastructure." 
//             />
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer style={{
//         textAlign:'center', marginTop:'40px', padding:'40px', 
//         borderTop: '1px solid rgba(255,255,255,0.1)', color:'#64748b'
//       }}>
//         <p>© 2025 Nexus Gateway Inc. · <a href="/docs" style={{color:'inherit'}}>Documentation</a> · <a href="/dashboard" style={{color:'inherit'}}>Login</a></p>
//       </footer>

//     </div>
//   );
// }

// function FeatureCard({icon, title, desc}: {icon: string, title: string, desc: string}) {
//     return (
//         <div className="glass-card" style={{padding: '30px'}}>
//             <div style={{fontSize: '2.5rem', marginBottom: '20px'}}>{icon}</div>
//             <h3 style={{fontSize: '1.3rem', color: 'white', marginBottom: '10px'}}>{title}</h3>
//             <p style={{color: '#94a3b8'}}>{desc}</p>
//         </div>
//     )
// }


"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  // --- STATE ---
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  // Chat State
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  
  // NEW: User Provider Key (BYOK)
  const [providerKey, setProviderKey] = useState("");

  // Stats State
  const [stats, setStats] = useState({ total: 0, hits: 0, graph: [] });

  const backendUrl = "https://nexusgateway.onrender.com"; 
  const billingRef = useRef<null | HTMLDivElement>(null);

  const fetchStats = useCallback(() => {
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

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

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
      if (res.ok) {
        setApiKey(data.api_key);
        setQuotaExceeded(false);
      }
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
    setChatResponse(""); 
    setQuotaExceeded(false);

    // Prepare Headers
    const headers: any = { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${apiKey}` 
    };

    // <--- NEW: Add Provider Key if exists --->
    if (providerKey) {
        headers["x-nexus-openai-key"] = providerKey;
    }

    try {
      const res = await fetch(`${backendUrl}/api/chat/stream`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ message, model: model }),
      });

      if (res.status === 402) {
        // If they provided a key, 402 shouldn't happen, but just in case
        setChatResponse("⛔ Quota Exceeded. Add your own OpenAI Key below or Upgrade.");
        setQuotaExceeded(true);
        setTimeout(() => billingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        return;
      }

      if (res.status === 403) {
         setChatResponse("⛔ Premium Model Locked. Enter your own OpenAI Key to use GPT-4.");
         return;
      }

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunkValue = decoder.decode(value);
          const lines = chunkValue.split("\n").filter(line => line.trim() !== "");
          
          for (const line of lines) {
            if (line.includes("[DONE]")) {
                done = true;
                break;
            }
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.replace("data: ", "");
                const data = JSON.parse(jsonStr);
                const content = data.choices?.[0]?.delta?.content || "";
                setChatResponse(prev => prev + content);
              } catch (e) { }
            }
          }
        }
      }
      fetchStats(); 
    } catch (err) {
      console.error(err);
      setChatResponse("Connection Failed.");
    } finally {
      setChatLoading(false);
    }
  };

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

  const moneySaved = (stats.hits * 0.002).toFixed(4);

  return (
    <div className="main-wrapper">
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', marginBottom:'10px'}}>
            <img src="/favicon.ico" alt="Nexus Logo" width="50" height="50" style={{filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'}} />
            <h1 style={{fontSize: '2.5rem', margin:0}}>Nexus<span style={{color:'#6366f1'}}>Gateway</span></h1>
        </div>
        <p style={{color:'#94a3b8'}}>High-Performance AI Semantic Caching Layer</p>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop:'20px' }}>
            <a href="/docs"><button className="btn btn-secondary" style={{fontSize: '0.8rem'}}> Documentation</button></a>
            <a href="/logs"><button className="btn btn-secondary" style={{fontSize: '0.8rem'}}>🔍 Inspector</button></a>
        </div>
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

      {/* CHART */}
      <div className="glass-card" style={{marginBottom: '30px', paddingBottom: '20px'}}>
        <h2 style={{fontSize: '0.9rem', marginBottom: '10px', border: 'none'}}>Live Traffic</h2>
        <div style={{width: '100%', height: '200px'}}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.graph}>
                    <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tick={false} />
                    <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} itemStyle={{color: '#fff'}} />
                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* AUTH */}
      <div className="glass-card">
        <h2>🔑 1. Get Access</h2>
        {!apiKey ? (
          <div className="input-group">
            <input placeholder="Enter email..." value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn btn-primary" onClick={handleRegister} disabled={loading}>{loading ? "..." : "Get Key"}</button>
          </div>
        ) : (
          <div className="code-block">{apiKey}</div>
        )}
      </div>

      {/* CHAT SECTION */}
      <div className="glass-card">
        <h2> 2. Test AI Chat</h2>

        <div style={{marginBottom: '15px'}}>
            <input style={{width: '93%'}} placeholder="Paste API Key here..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </div>

        {/* --- NEW: PROVIDER SETTINGS (BYOK) --- */}
        <div style={{marginBottom: '20px', padding:'15px', background:'rgba(255,255,255,0.05)', borderRadius:'8px', border:'1px dashed #6366f1'}}>
            <label style={{fontSize: '0.8rem', color:'#a5b4fc', display:'block', marginBottom:'5px', fontWeight:'bold'}}>
                🔐 Bring Your Own Key (Optional)
            </label>
            <p style={{fontSize: '0.75rem', color:'#94a3b8', marginBottom:'10px'}}>
                Enter your OpenAI Key to use <b>GPT-4</b> and get <b>Unlimited Requests</b>. We do not store this key.
            </p>
            <input 
                type="password"
                style={{width: '93%', border: providerKey ? '1px solid #4ade80' : '1px solid #374151'}}
                placeholder="sk-..." 
                value={providerKey} 
                onChange={(e) => setProviderKey(e.target.value)} 
            />
        </div>
        {/* --- END NEW SECTION --- */}

        <div style={{marginBottom: '15px'}}>
            <label style={{fontSize: '0.8rem', color:'#94a3b8'}}>SELECT MODEL</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} style={{width: '100%', padding: '10px', background: '#000', color: 'white', border: '1px solid #333', borderRadius: '8px', marginTop:'5px'}}>
                <option value="gpt-3.5-turbo">OpenAI GPT-3.5 (Fast)</option>
                <option value="gpt-4">OpenAI GPT-4 (Requires BYOK)</option>
                <option value="claude-3-opus-20240229">Anthropic Claude 3 (Pro)</option>
            </select>
        </div>

        <div className="input-group" style={{ alignItems: 'flex-start' }}>
          <textarea 
            placeholder="Ask AI something..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(); }}}
            style={{flex: 1, background: '#000', border: '1px solid #374151', color: 'white', padding: '12px', borderRadius: '8px', minHeight: '50px', resize: 'none'}}
            rows={1}
          />
          <button className="btn btn-primary" onClick={handleChat} disabled={chatLoading} style={{ height: '50px' }}>
            {chatLoading ? "..." : "Send"}
          </button>
        </div>

        {chatResponse && <div className="response-box" style={{color: '#e2e8f0'}}>{chatResponse}</div>}
      </div>

      <footer style={{textAlign:'center', marginTop:'60px', color:'#64748b', fontSize:'0.8rem'}}>
        <span>© 2025 Nexus Gateway Inc.</span>
      </footer>

    </div>
  );
}