
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// export default function Dashboard() {
//   // --- STATE ---
//   const [email, setEmail] = useState("");
//   const [apiKey, setApiKey] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Chat State
//   const [message, setMessage] = useState("");
//   const [model, setModel] = useState("gpt-3.5-turbo");
//   const [chatResponse, setChatResponse] = useState("");
//   const [chatLoading, setChatLoading] = useState(false);
//   const [quotaExceeded, setQuotaExceeded] = useState(false);
  
//   // NEW: User Provider Key (BYOK)
//   const [providerKey, setProviderKey] = useState("");

//   // Stats State
//   const [stats, setStats] = useState({ total: 0, hits: 0, graph: [] });

//   const backendUrl = "https://nexusgateway.onrender.com"; 
//   const billingRef = useRef<null | HTMLDivElement>(null);

//   const fetchStats = useCallback(() => {
//     fetch(`${backendUrl}/api/stats`)
//       .then(res => res.json())
//       .then(data => {
//         setStats({
//             total: data.total_requests || 0,
//             hits: data.cache_hits || 0,
//             graph: data.graph_data || []
//         });
//       })
//       .catch(err => console.log("Stats error", err));
//   }, []);

//   useEffect(() => {
//     fetchStats();
//     const interval = setInterval(fetchStats, 10000);
//     return () => clearInterval(interval);
//   }, [fetchStats]);

//   // 1. Register User
//   const handleRegister = async () => {
//     if(!email) return alert("Enter an email!");
//     setLoading(true);
//     try {
//       const res = await fetch(`${backendUrl}/api/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setApiKey(data.api_key);
//         setQuotaExceeded(false);
//       }
//       else alert("Error: " + JSON.stringify(data));
//     } catch (err) {
//       alert("Server error");
//     }
//     setLoading(false);
//   };

//   // 2. Send Chat Message
//   const handleChat = async () => {
//     if (!apiKey) return alert("Enter API Key first");
//     if (!message) return;
    
//     setChatLoading(true);
//     setChatResponse(""); 
//     setQuotaExceeded(false);

//     // Prepare Headers
//     const headers: any = { 
//         "Content-Type": "application/json", 
//         "Authorization": `Bearer ${apiKey}` 
//     };

//     // <--- NEW: Add Provider Key if exists --->
//     if (providerKey) {
//         headers["x-nexus-openai-key"] = providerKey;
//     }

//     try {
//       const res = await fetch(`${backendUrl}/api/chat/stream`, {
//         method: "POST",
//         headers: headers,
//         body: JSON.stringify({ message, model: model }),
//       });

//       if (res.status === 402) {
//         // If they provided a key, 402 shouldn't happen, but just in case
//         setChatResponse("⛔ Quota Exceeded. Add your own OpenAI Key below or Upgrade.");
//         setQuotaExceeded(true);
//         setTimeout(() => billingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//         return;
//       }

//       if (res.status === 403) {
//          setChatResponse("⛔ Premium Model Locked. Enter your own OpenAI Key to use GPT-4.");
//          return;
//       }

//       if (!res.body) return;
//       const reader = res.body.getReader();
//       const decoder = new TextDecoder();
//       let done = false;

//       while (!done) {
//         const { value, done: doneReading } = await reader.read();
//         done = doneReading;
        
//         if (value) {
//           const chunkValue = decoder.decode(value);
//           const lines = chunkValue.split("\n").filter(line => line.trim() !== "");
          
//           for (const line of lines) {
//             if (line.includes("[DONE]")) {
//                 done = true;
//                 break;
//             }
//             if (line.startsWith("data: ")) {
//               try {
//                 const jsonStr = line.replace("data: ", "");
//                 const data = JSON.parse(jsonStr);
//                 const content = data.choices?.[0]?.delta?.content || "";
//                 setChatResponse(prev => prev + content);
//               } catch (e) { }
//             }
//           }
//         }
//       }
//       fetchStats(); 
//     } catch (err) {
//       console.error(err);
//       setChatResponse("Connection Failed.");
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   const handleUpgrade = async () => {
//     if (!apiKey) return alert("Enter API Key first");
//     try {
//       const res = await fetch(`${backendUrl}/api/checkout`, {
//         method: "POST",
//         headers: { "Authorization": `Bearer ${apiKey}` }
//       });
//       const data = await res.json();
//       if (data.checkout_url) window.location.href = data.checkout_url;
//       else alert("Checkout failed");
//     } catch (err) {
//       alert("Payment Error");
//     }
//   };

//   const moneySaved = (stats.hits * 0.002).toFixed(4);

//   return (
//     <div className="main-wrapper">
      
//       {/* HEADER */}
//       <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//         <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', marginBottom:'10px'}}>
//             <img src="/favicon.ico" alt="Nexus Logo" width="50" height="50" style={{filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'}} />
//             <h1 style={{fontSize: '2.5rem', margin:0}}>Nexus<span style={{color:'#6366f1'}}>Gateway</span></h1>
//         </div>
//         <p style={{color:'#94a3b8'}}>High-Performance AI Semantic Caching Layer</p>
        
//         <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop:'20px' }}>
//             <a href="/docs"><button className="btn btn-secondary" style={{fontSize: '0.8rem'}}> Documentation</button></a>
//             <a href="/logs"><button className="btn btn-secondary" style={{fontSize: '0.8rem'}}>🔍 Inspector</button></a>
//         </div>
//       </div>

//       {/* STATS SECTION */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="glass-card" style={{padding: '15px', textAlign:'center'}}>
//             <p style={{fontSize: '1.5rem', fontWeight:'bold', color: '#4ade80'}}>${moneySaved}</p>
//             <p style={{fontSize: '0.7rem', color: '#94a3b8'}}>SAVED</p>
//           </div>
//           <div className="glass-card" style={{padding: '15px', textAlign:'center'}}>
//             <p style={{fontSize: '1.5rem', fontWeight:'bold', color: '#a78bfa'}}>{stats.total}</p>
//             <p style={{fontSize: '0.7rem', color: '#94a3b8'}}>REQUESTS</p>
//           </div>
//       </div>

//       {/* CHART */}
//       <div className="glass-card" style={{marginBottom: '30px', paddingBottom: '20px'}}>
//         <h2 style={{fontSize: '0.9rem', marginBottom: '10px', border: 'none'}}>Live Traffic</h2>
//         <div style={{width: '100%', height: '200px'}}>
//             <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={stats.graph}>
//                     <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tick={false} />
//                     <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} itemStyle={{color: '#fff'}} />
//                     <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={false} />
//                 </LineChart>
//             </ResponsiveContainer>
//         </div>
//       </div>

//       {/* AUTH */}
//       <div className="glass-card">
//         <h2>🔑 1. Get Access</h2>
//         {!apiKey ? (
//           <div className="input-group">
//             <input placeholder="Enter email..." value={email} onChange={(e) => setEmail(e.target.value)} />
//             <button className="btn btn-primary" onClick={handleRegister} disabled={loading}>{loading ? "..." : "Get Key"}</button>
//           </div>
//         ) : (
//           <div className="code-block">{apiKey}</div>
//         )}
//       </div>

//       {/* CHAT SECTION */}
//       <div className="glass-card">
//         <h2> 2. Test AI Chat</h2>

//         <div style={{marginBottom: '15px'}}>
//             <input style={{width: '93%'}} placeholder="Paste API Key here..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
//         </div>

//         {/* --- NEW: PROVIDER SETTINGS (BYOK) --- */}
//         <div style={{marginBottom: '20px', padding:'15px', background:'rgba(255,255,255,0.05)', borderRadius:'8px', border:'1px dashed #6366f1'}}>
//             <label style={{fontSize: '0.8rem', color:'#a5b4fc', display:'block', marginBottom:'5px', fontWeight:'bold'}}>
//                 🔐 Bring Your Own Key (Optional)
//             </label>
//             <p style={{fontSize: '0.75rem', color:'#94a3b8', marginBottom:'10px'}}>
//                 Enter your OpenAI Key to use <b>GPT-4</b> and get <b>Unlimited Requests</b>. We do not store this key.
//             </p>
//             <input 
//                 type="password"
//                 style={{width: '93%', border: providerKey ? '1px solid #4ade80' : '1px solid #374151'}}
//                 placeholder="sk-..." 
//                 value={providerKey} 
//                 onChange={(e) => setProviderKey(e.target.value)} 
//             />
//         </div>
//         {/* --- END NEW SECTION --- */}

//         <div style={{marginBottom: '15px'}}>
//             <label style={{fontSize: '0.8rem', color:'#94a3b8'}}>SELECT MODEL</label>
//             <select value={model} onChange={(e) => setModel(e.target.value)} style={{width: '100%', padding: '10px', background: '#000', color: 'white', border: '1px solid #333', borderRadius: '8px', marginTop:'5px'}}>
//                 <option value="gpt-3.5-turbo">OpenAI GPT-3.5 (Fast)</option>
//                 <option value="gpt-4">OpenAI GPT-4 (Requires BYOK)</option>
//                 <option value="claude-3-opus-20240229">Anthropic Claude 3 (Pro)</option>
//             </select>
//         </div>

//         <div className="input-group" style={{ alignItems: 'flex-start' }}>
//           <textarea 
//             placeholder="Ask AI something..." 
//             value={message} 
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(); }}}
//             style={{flex: 1, background: '#000', border: '1px solid #374151', color: 'white', padding: '12px', borderRadius: '8px', minHeight: '50px', resize: 'none'}}
//             rows={1}
//           />
//           <button className="btn btn-primary" onClick={handleChat} disabled={chatLoading} style={{ height: '50px' }}>
//             {chatLoading ? "..." : "Send"}
//           </button>
//         </div>

//         {chatResponse && <div className="response-box" style={{color: '#e2e8f0'}}>{chatResponse}</div>}
//       </div>

//       <footer style={{textAlign:'center', marginTop:'60px', color:'#64748b', fontSize:'0.8rem'}}>
//         <span>© 2025 Nexus Gateway Inc.</span>
//       </footer>

//     </div>
//   );
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

    // <--- BYOK LOGIC --->
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
        setChatResponse("⛔ Quota Exceeded. Add your own OpenAI Key below or Upgrade.");
        setQuotaExceeded(true);
        setTimeout(() => billingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        return;
      }

      if (res.status === 403) {
         setChatResponse("⛔ Premium Model Locked. Enter your own Key to use this model.");
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
            <img src="/LOGO.png" alt="Nexus Logo" width="80" height="80" style={{filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'}} />
            <h1 style={{fontSize: '2.5rem', margin:0}}>Nexus<span style={{color:'#6366f1'}}>Gateway</span></h1>
        </div>
        <p style={{color:'#94a3b8'}}>High-Performance AI Semantic Caching Layer</p>
        
        {/* ACTION BUTTONS */}
<div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
    <a href="/docs" style={{ textDecoration: 'none' }}>
        <button style={{ 
            padding: '10px 24px', 
            borderRadius: '8px', 
            border: 'none', 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
            color: '#fff', 
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            Documentation
        </button>
    </a>
    <a href="/logs" style={{ textDecoration: 'none' }}>
        <button style={{ 
            padding: '10px 24px', 
            borderRadius: '8px', 
            border: '1px solid #334155', 
            background: 'rgba(30, 41, 59, 0.5)', 
            color: '#e2e8f0', 
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)'}
        >🔍 Inspector</button></a>
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
        <h2 style={{fontSize: '0.9rem', marginBottom: '10px', border: 'none'}}>Last 24 Hours Traffic</h2>
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

        {/* --- PROVIDER SETTINGS (BYOK) --- */}
        <div style={{marginBottom: '20px', padding:'15px', background:'rgba(255,255,255,0.05)', borderRadius:'8px', border:'1px dashed #6366f1'}}>
            <label style={{fontSize: '0.8rem', color:'#a5b4fc', display:'block', marginBottom:'5px', fontWeight:'bold'}}>
                🔐 Bring Your Own Key (Optional)
            </label>
            <p style={{fontSize: '0.75rem', color:'#94a3b8', marginBottom:'10px'}}>
                Enter your OpenAI/Anthropic Key to use <b>GPT-4</b> or <b>Claude</b>. We do not store this key.
            </p>
            <input 
                type="password"
                style={{width: '93%', border: providerKey ? '1px solid #4ade80' : '1px solid #374151'}}
                placeholder="sk-..." 
                value={providerKey} 
                onChange={(e) => setProviderKey(e.target.value)} 
            />
        </div>

        {/* --- MODEL SELECTOR --- */}
        <div style={{marginBottom: '15px'}}>
            <label style={{fontSize: '0.8rem', color:'#94a3b8'}}>SELECT MODEL</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} style={{width: '100%', padding: '10px', background: '#000', color: 'white', border: '1px solid #333', borderRadius: '8px', marginTop:'5px'}}>
                <option value="gpt-3.5-turbo">OpenAI GPT-3.5 (Free Tier)</option>
                <option value="llama3-8b-8192">Groq Llama 3 (Fast & Free)</option>
                <option value="gemini-1.5-flash">Google Gemini 1.5 (Free)</option>
                <option value="gpt-4">OpenAI GPT-4 (Requires BYOK)</option>
                <option value="claude-3-opus-20240229">Anthropic Claude 3 (Requires BYOK)</option>
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