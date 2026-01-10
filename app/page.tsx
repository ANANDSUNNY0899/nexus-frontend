

// "use client";

// import { useState, useEffect, useRef } from "react";
// // Import Charts
// import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// export default function Home() {
//   // --- STATE ---
//   const [email, setEmail] = useState("");
//   const [apiKey, setApiKey] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Chat State
//   const [message, setMessage] = useState("");
//   const [model, setModel] = useState("gpt-3.5-turbo");
//   const [chatResponse, setChatResponse] = useState("");
//   const [chatLoading, setChatLoading] = useState(false);
//   const [quotaExceeded, setQuotaExceeded] = useState(false); // <--- NEW STATE

//   // Stats State
//   const [stats, setStats] = useState({ total: 0, hits: 0, graph: [] });

//   const backendUrl = "https://nexusgateway.onrender.com"; 
//   const billingRef = useRef<null | HTMLDivElement>(null); // To scroll to billing

//   // --- EFFECT: LOAD STATS ---
//   useEffect(() => {
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

//   // --- ACTIONS ---

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
//         setQuotaExceeded(false); // Reset error if they get a new key
//       }
//       else alert("Error: " + JSON.stringify(data));
//     } catch (err) {
//       alert("Server error");
//     }
//     setLoading(false);
//   };


//   // 2. Send Chat Message (Improved Logic)
//   const handleChat = async () => {
//     if (!apiKey) return alert("Enter API Key first");
//     if (!message) return;
    
//     setChatLoading(true);
//     setChatResponse(""); // Clear previous
//     setQuotaExceeded(false);

//     try {
//       const res = await fetch(`${backendUrl}/api/chat/stream`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
//         body: JSON.stringify({ message, model: model }),
//       });

//       if (res.status === 402) {
//         setChatResponse("⛔ Quota Exceeded. Upgrade below.");
//         setQuotaExceeded(true);
//         setTimeout(() => billingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//         return; // Button will reset in 'finally' block
//       }

//       if (!res.body) return;
//       const reader = res.body.getReader();
//       const decoder = new TextDecoder();
//       let done = false;
//       let fullText = "";

//       while (!done) {
//         const { value, done: doneReading } = await reader.read();
//         done = doneReading;
        
//         if (value) {
//           const chunkValue = decoder.decode(value);
//           const lines = chunkValue.split("\n").filter(line => line.trim() !== "");
          
//           for (const line of lines) {
//             if (line.includes("[DONE]")) return; 
            
//             if (line.startsWith("data: ")) {
//               try {
//                 const jsonStr = line.replace("data: ", "");
//                 const data = JSON.parse(jsonStr);
//                 const content = data.choices?.[0]?.delta?.content || "";
                
//                 fullText += content;
//                 setChatResponse(fullText);
//               } catch (e) {
//                 // Ignore parse errors for partial chunks
//               }
//             }
//           }
//         }
//       }

//     } catch (err) {
//       console.error(err);
//       setChatResponse("Connection Failed.");
//     } finally {
//       // <--- THIS IS THE FIX --->
//       // This runs ALWAYS, ensuring the button goes back to "Send" immediately
//       setChatLoading(false);
//     }
//   };

//   // 3. Upgrade Plan
//   const handleUpgrade = async () => {
//     if (!apiKey) return alert("Enter API Key first (Step 1)");
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

//   // Calculate Money
//   const moneySaved = (stats.hits * 0.002).toFixed(4);

//   return (
//     <div className="main-wrapper">
      
//       {/* HEADER */}
//       <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//         <h1 style={{fontSize: '2.5rem', marginBottom:'5px'}}>Nexus Gateway</h1>
//         <p style={{color:'#94a3b8', marginBottom:'20px'}}>High-Performance AI Semantic Caching Layer</p>
        
//         <a href="/docs" style={{textDecoration:'none'}}>
//             <button className="btn" style={{
//                 background: 'rgba(255, 255, 255, 0.05)', 
//                 border: '1px solid rgba(255,255,255,0.1)', 
//                 color: '#e2e8f0', 
//                 fontSize: '0.9rem',
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 padding: '8px 20px'
//             }}>
//                 <span> Read Documentation</span>
//                 <span style={{opacity:0.5}}>→</span>
//             </button>
//         </a>
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

//       <div className="glass-card" style={{marginBottom: '30px', height: '220px', paddingBottom: '40px'}}>
//         <h2 style={{fontSize: '0.9rem', marginBottom: '10px', border: 'none'}}>Last 24 Hours Traffic</h2>
//         <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={stats.graph}>
//                 <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tick={false} />
//                 <Tooltip 
//                     contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px'}} 
//                     itemStyle={{color: '#fff'}}
//                 />
//                 <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={false} />
//             </LineChart>
//         </ResponsiveContainer>
//       </div>


//       {/* AUTH SECTION */}
//       <div className="glass-card">
//         <h2>🔑 1. Get Access</h2>
//         {!apiKey ? (
//           <div className="input-group">
//             <input 
//               placeholder="Enter your email" 
//               value={email} 
//               onChange={(e) => setEmail(e.target.value)} 
//             />
//             <button className="btn btn-primary" onClick={handleRegister} disabled={loading}>
//               {loading ? "..." : "Get Key"}
//             </button>
//           </div>
//         ) : (
//           <div>
//             <div className="code-block">{apiKey}</div>
//             <p style={{fontSize: '0.8rem', color: '#4ade80'}}>Key Generated Successfully!</p>
//           </div>
//         )}
//       </div>

//       {/* BILLING SECTION (Dynamic Highlighting) */}
//       {apiKey && (
//         <div 
//             ref={billingRef} // Target for auto-scroll
//             className="glass-card" 
//             style={{
//                 display:'flex', 
//                 justifyContent:'space-between', 
//                 alignItems:'center', 
//                 // Change border color to RED if quota exceeded
//                 borderLeft: quotaExceeded ? '4px solid #ef4444' : '4px solid #f43f5e',
//                 boxShadow: quotaExceeded ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'none',
//                 transition: 'all 0.3s ease'
//             }}
//         >
//             <div>
//                 <h2 style={{border:'none', marginBottom:'5px', fontSize:'1.1rem'}}>Current Plan</h2>
//                 <p style={{fontSize:'0.8rem', color: quotaExceeded ? '#ef4444' : '#94a3b8'}}>
//                     {quotaExceeded ? "⚠️ LIMIT REACHED" : "Free Tier (100 Requests)"}
//                 </p>
//             </div>
//             <button 
//                 className="btn" 
//                 style={{
//                     backgroundColor: quotaExceeded ? '#ef4444' : '#f43f5e',
//                     color: 'white',
//                     animation: quotaExceeded ? 'pulse 2s infinite' : 'none'
//                 }}
//                 onClick={handleUpgrade}
//             >
//                 {quotaExceeded ? "🔓 Unlock Pro Now" : "⚡ Upgrade to Pro"}
//             </button>
//         </div>
//       )}

//       {/* SDK PROMOTION SECTION */}
//       <div className="glass-card" style={{borderLeft: '4px solid #3b82f6'}}>
//         <h2 style={{border:'none', marginBottom:'10px'}}>📦 Developers: Use the Python SDK</h2>
//         <p style={{fontSize:'0.9rem', color:'#94a3b8', marginBottom:'15px'}}>
//             Integrate Nexus into your Python apps in 3 lines of code.
//         </p>
        
//         <div className="code-block" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//             <span>pip install nexus-gateway</span>
//             <button 
//                 onClick={() => {navigator.clipboard.writeText("pip install nexus-gateway"); alert("Copied!");}}
//                 style={{background:'none', border:'none', cursor:'pointer', color:'#60a5fa'}}
//             >
//                 📋
//             </button>
//         </div>
        
//         <a href="https://pypi.org/project/nexus-gateway/" target="_blank" style={{fontSize:'0.8rem', color:'#60a5fa', marginTop:'10px', display:'block'}}>
//             View on PyPI →
//         </a>
//       </div>
      

//       {/* CHAT SECTION */}
//       <div className="glass-card">
//         <h2> 2. Test AI Chat</h2>

//         <div style={{marginBottom: '15px'}}>
//             <input 
//               style={{width: '93%'}}
//               placeholder="Paste API Key here..." 
//               value={apiKey} 
//               onChange={(e) => setApiKey(e.target.value)} 
//             />
//         </div>

//         <div style={{marginBottom: '15px'}}>
//             <label style={{fontSize: '0.8rem', color:'#94a3b8', display:'block', marginBottom:'5px'}}>SELECT MODEL</label>
//             <select 
//                 value={model}
//                 onChange={(e) => setModel(e.target.value)}
//                 style={{
//                     width: '100%', padding: '10px', background: '#000', color: 'white', 
//                     border: '1px solid rgba(255,255,255,0.125)', borderRadius: '8px'
//                 }}
//             >
//                 <option value="gpt-3.5-turbo">OpenAI GPT-3.5 (Fast)</option>
//                 <option value="gpt-4">OpenAI GPT-4 (Smart)</option>
//                 <option value="claude-3-opus-20240229">Anthropic Claude 3 (Pro)</option>
//             </select>
//         </div>

//         <div className="input-group" style={{ alignItems: 'flex-start' }}>
//           <textarea 
//             placeholder="Ask AI something..." 
//             value={message} 
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault(); 
//                     handleChat(); 
//                 }
//             }}
//             style={{
//                 flex: 1,
//                 background: '#000',
//                 border: '1px solid #374151',
//                 color: 'white',
//                 padding: '12px',
//                 borderRadius: '8px',
//                 fontSize: '1rem',
//                 outline: 'none',
//                 resize: 'none',
//                 minHeight: '50px',
//                 maxHeight: '150px',
//                 overflowY: 'auto'
//             }}
//             rows={1}
//           />
//           <button 
//             className="btn btn-primary" 
//             onClick={handleChat} 
//             disabled={chatLoading}
//             style={{ height: '50px' }}
//           >
//             {chatLoading ? "..." : "Send"}
//           </button>
//         </div>

//         {chatResponse && (
//           <div className="response-box" style={{
//               // Make error red
//               borderColor: chatResponse.includes("Quota") ? '#ef4444' : 'transparent',
//               color: chatResponse.includes("Quota") ? '#ef4444' : '#e2e8f0'
//           }}>
//             {chatResponse}
//           </div>
//         )}
//       </div>

//       {/* FOOTER */}
//       <footer style={{
//         textAlign:'center', 
//         marginTop:'60px', 
//         padding:'20px', 
//         borderTop: '1px solid rgba(255,255,255,0.1)',
//         color:'#64748b', 
//         fontSize:'0.8rem',
//         display: 'flex',
//         justifyContent: 'center',
//         gap: '20px'
//       }}>
//         <span>© 2025 Nexus Gateway Inc.</span>
//         <a href="https://github.com/ANANDSUNNY0899" target="_blank" className="hover:text-white transition-colors">GitHub</a>
//         <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
//         <a href="mailto:support@nexusgateway.com" className="hover:text-white transition-colors">Support</a>
//       </footer>

//     </div>
//   );
// }




"use client";

import { useState, useEffect, useRef } from "react";
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
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Stats State
  const [stats, setStats] = useState({ total: 0, hits: 0, graph: [] });

  const backendUrl = "https://nexusgateway.onrender.com"; 
  const billingRef = useRef<null | HTMLDivElement>(null); // To scroll to billing

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
      if (res.ok) {
        setApiKey(data.api_key);
        setQuotaExceeded(false); // Reset error if they get a new key
      }
      else alert("Error: " + JSON.stringify(data));
    } catch (err) {
      alert("Server error");
    }
    setLoading(false);
  };


  // 2. Send Chat Message (The Working Logic)
  const handleChat = async () => {
    if (!apiKey) return alert("Enter API Key first");
    if (!message) return;
    
    setChatLoading(true);
    setChatResponse(""); // Clear previous
    setQuotaExceeded(false);

    try {
      const res = await fetch(`${backendUrl}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ message, model: model }),
      });

      if (res.status === 402) {
        setChatResponse("⛔ Quota Exceeded. Upgrade below.");
        setQuotaExceeded(true);
        setTimeout(() => billingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        return; // Button will reset in 'finally' block
      }

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunkValue = decoder.decode(value);
          const lines = chunkValue.split("\n").filter(line => line.trim() !== "");
          
          for (const line of lines) {
            // Check for explicit stop signal
            if (line.includes("[DONE]")) {
                done = true;
                break;
            }
            
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.replace("data: ", "");
                const data = JSON.parse(jsonStr);
                const content = data.choices?.[0]?.delta?.content || "";
                
                fullText += content;
                setChatResponse(fullText);
              } catch (e) {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
      }

    } catch (err) {
      console.error(err);
      setChatResponse("Connection Failed.");
    } finally {
      // This ensures the button ALWAYS resets
      setChatLoading(false);
    }
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
        
        {/* BUTTON GROUP (Docs + Logs) */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            
            {/* Docs Button */}
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
                </button>
            </a>

            {/* Logs Button */}
            <a href="/logs" style={{textDecoration:'none'}}>
                <button className="btn" style={{
                    background: 'rgba(167, 139, 250, 0.1)', // Purple Tint
                    border: '1px solid rgba(167, 139, 250, 0.2)', 
                    color: '#d8b4fe', 
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 20px'
                }}>
                    <span>🔍 Inspect Logs</span>
                </button>
            </a>

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

      {/* FIXED CHART SECTION */}
      <div className="glass-card" style={{marginBottom: '30px', paddingBottom: '20px'}}>
        <h2 style={{fontSize: '0.9rem', marginBottom: '10px', border: 'none'}}>Live Traffic (Last 60 Mins)</h2>
        {/* Explicit Height Container to Fix Recharts Error */}
        <div style={{width: '100%', height: '250px'}}>
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

      {/* BILLING SECTION (Dynamic Highlighting) */}
      {apiKey && (
        <div 
            ref={billingRef} // Target for auto-scroll
            className="glass-card" 
            style={{
                display:'flex', 
                justifyContent:'space-between', 
                alignItems:'center', 
                // Change border color to RED if quota exceeded
                borderLeft: quotaExceeded ? '4px solid #ef4444' : '4px solid #f43f5e',
                boxShadow: quotaExceeded ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'none',
                transition: 'all 0.3s ease'
            }}
        >
            <div>
                <h2 style={{border:'none', marginBottom:'5px', fontSize:'1.1rem'}}>Current Plan</h2>
                <p style={{fontSize:'0.8rem', color: quotaExceeded ? '#ef4444' : '#94a3b8'}}>
                    {quotaExceeded ? "⚠️ LIMIT REACHED" : "Free Tier (100 Requests)"}
                </p>
            </div>
            <button 
                className="btn" 
                style={{
                    backgroundColor: quotaExceeded ? '#ef4444' : '#f43f5e',
                    color: 'white',
                    animation: quotaExceeded ? 'pulse 2s infinite' : 'none'
                }}
                onClick={handleUpgrade}
            >
                {quotaExceeded ? "🔓 Unlock Pro Now" : "⚡ Upgrade to Pro"}
            </button>
        </div>
      )}

      {/* SDK PROMOTION SECTION */}
      <div className="glass-card" style={{marginTop: '20px', borderLeft: '4px solid #3b82f6'}}>
        <h2 style={{border:'none', marginBottom:'10px', fontSize:'1rem'}}> Developers: Use the Python SDK</h2>
        <p style={{fontSize:'0.9rem', color:'#94a3b8', marginBottom:'15px'}}>
            Integrate Nexus into your Python apps in 3 lines of code.
        </p>
        
        <div className="code-block" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span>pip install nexus-gateway</span>
            <button 
                onClick={() => {navigator.clipboard.writeText("pip install nexus-gateway"); alert("Copied!");}}
                style={{background:'none', border:'none', cursor:'pointer', color:'#60a5fa'}}
            >
                📋
            </button>
        </div>
        
        <a href="https://pypi.org/project/nexus-gateway/" target="_blank" style={{fontSize:'0.8rem', color:'#60a5fa', marginTop:'10px', display:'block'}}>
            View on PyPI →
        </a>
      </div>
      

      {/* CHAT SECTION */}
      <div className="glass-card">
        <h2> 2. Test AI Chat</h2>

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

        <div className="input-group" style={{ alignItems: 'flex-start' }}>
          <textarea 
            placeholder="Ask AI something..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); 
                    handleChat(); 
                }
            }}
            style={{
                flex: 1,
                background: '#000',
                border: '1px solid #374151',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                resize: 'none',
                minHeight: '50px',
                maxHeight: '150px',
                overflowY: 'auto'
            }}
            rows={1}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleChat} 
            disabled={chatLoading}
            style={{ height: '50px' }}
          >
            {chatLoading ? "..." : "Send"}
          </button>
        </div>

        {chatResponse && (
          <div className="response-box" style={{
              // Make error red
              borderColor: chatResponse.includes("Quota") ? '#ef4444' : 'transparent',
              color: chatResponse.includes("Quota") ? '#ef4444' : '#e2e8f0'
          }}>
            {chatResponse}
          </div>
        )}
      </div>

      {/* FOOTER */}
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