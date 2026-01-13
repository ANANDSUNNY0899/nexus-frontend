

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
//   const [quotaExceeded, setQuotaExceeded] = useState(false);

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


//   // 2. Send Chat Message (The Working Logic)
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
//             // Check for explicit stop signal
//             if (line.includes("[DONE]")) {
//                 done = true;
//                 break;
//             }
            
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
//       // This ensures the button ALWAYS resets
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
        
//         {/* BUTTON GROUP (Docs + Logs) */}
//         <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            
//             {/* Docs Button */}
//             <a href="/docs" style={{textDecoration:'none'}}>
//                 <button className="btn" style={{
//                     background: 'rgba(255, 255, 255, 0.05)', 
//                     border: '1px solid rgba(255,255,255,0.1)', 
//                     color: '#e2e8f0', 
//                     fontSize: '0.9rem',
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                     padding: '8px 20px'
//                 }}>
//                     <span> Read Documentation</span>
//                 </button>
//             </a>

//             {/* Logs Button */}
//             <a href="/logs" style={{textDecoration:'none'}}>
//                 <button className="btn" style={{
//                     background: 'rgba(167, 139, 250, 0.1)', // Purple Tint
//                     border: '1px solid rgba(167, 139, 250, 0.2)', 
//                     color: '#d8b4fe', 
//                     fontSize: '0.9rem',
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                     padding: '8px 20px'
//                 }}>
//                     <span>🔍 Inspect Logs</span>
//                 </button>
//             </a>

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

//       {/* FIXED CHART SECTION */}
//       <div className="glass-card" style={{marginBottom: '30px', paddingBottom: '20px'}}>
//         <h2 style={{fontSize: '0.9rem', marginBottom: '10px', border: 'none'}}>Live Traffic (Last 60 Mins)</h2>
//         {/* Explicit Height Container to Fix Recharts Error */}
//         <div style={{width: '100%', height: '250px'}}>
//             <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={stats.graph}>
//                     <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tick={false} />
//                     <Tooltip 
//                         contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px'}} 
//                         itemStyle={{color: '#fff'}}
//                     />
//                     <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={false} />
//                 </LineChart>
//             </ResponsiveContainer>
//         </div>
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
//       <div className="glass-card" style={{marginTop: '20px', borderLeft: '4px solid #3b82f6'}}>
//         <h2 style={{border:'none', marginBottom:'10px', fontSize:'1rem'}}> Developers: Use the Python SDK</h2>
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

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="main-wrapper" style={{maxWidth: '1200px', padding: '0'}}>
      
      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, 
        padding: '20px 40px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrolled ? 'rgba(3, 0, 20, 0.9)' : 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
        zIndex: 100, transition: 'all 0.3s'
      }}>
        <div style={{fontWeight: 'bold', fontSize: '1.2rem', color: 'white'}}>
            {/* LOGO SECTION */}
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            {/* Increased size from 30 -> 50 */}
            <img src="/favicon.ico" alt="Nexus Logo" width="50" height="50" style={{filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'}} />
            
            {/* Increased font from 1.2rem -> 1.5rem */}
            <span style={{fontWeight:'bold', fontSize:'1.5rem', color:'white', letterSpacing:'-0.5px'}}>
                Nexus<span style={{color:'#6366f1'}}>Gateway</span>
            </span>
        </div>
        </div>
        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <a href="/docs" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem'}}>Docs</a>
            <a href="https://github.com/ANANDSUNNY0899/NexusGateway" target="_blank" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem'}}>GitHub</a>
            <Link href="/dashboard">
                <button className="btn btn-primary" style={{padding: '8px 20px', fontSize:'0.9rem'}}>Launch App</button>
            </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        paddingTop: '80px'
      }}>
        <div style={{
            background: 'linear-gradient(to right, #818cf8, #c084fc)', 
            padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', 
            color: 'white', marginBottom: '20px', fontWeight: 'bold'
        }}>
             High-Performance Infrastructure for AI
        </div>
        
        <h1 style={{fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '20px', maxWidth: '900px'}}>
            The High-Performance Gateway<br/> for <span style={{
                background: 'linear-gradient(to right, #4f46e5, #ec4899)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>AI Engineering.</span>
        </h1>
        
        <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', marginBottom: '30px'}}>
            Semantic Caching, PII Redaction, and Universal Routing for OpenAI & Anthropic. 
            Built in <b>Go (Golang)</b> for sub-millisecond overhead.
        </p>

        <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
            <Link href="/dashboard">
                <button className="btn btn-primary" style={{fontSize: '1.1rem', padding: '15px 40px'}}>Start for Free</button>
            </Link>
            <Link href="/docs">
                <button className="btn" style={{
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', 
                    color: 'white', fontSize: '1.1rem', padding: '15px 40px'
                }}>Read Docs</button>
            </Link>
        </div>

        <p style={{color: '#64748b', fontSize: '0.9rem'}}>
            ⭐ Trusted by 2,000+ developers. Open-source & Enterprise-ready.
        </p>

        {/* TERMINAL PREVIEW */}
        <div style={{marginTop: '60px', width: '100%', maxWidth: '700px', textAlign: 'left'}}>
            <div className="glass-card" style={{padding: '0', overflow: 'hidden'}}>
                <div style={{background: '#1e293b', padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ef4444'}}></div>
                    <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#eab308'}}></div>
                    <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#22c55e'}}></div>
                    <span style={{marginLeft: '10px', fontSize: '0.8rem', color: '#64748b'}}>bash</span>
                </div>
                <div style={{padding: '20px', background: '#0f172a', fontFamily: 'monospace', color: '#e2e8f0'}}>
                    <p><span style={{color: '#818cf8'}}>$</span> pip install nexus-gateway</p>
                    <p style={{color: '#94a3b8', marginTop: '10px'}}># Initialize Client</p>
                    <p>client = NexusClient(api_key=<span style={{color: '#4ade80'}}>"nk-..."</span>)</p>
                    <p>response = client.chat(<span style={{color: '#4ade80'}}>"Explain Quantum Computing"</span>)</p>
                    
                    <p style={{color: '#94a3b8', marginTop: '15px'}}># Output:</p>
                    <p style={{color: '#4ade80'}}># {`{ "status": "200 OK", "latency": "12ms (Cache Hit)", "redacted_pii": 0 }`}</p>
                </div>
            </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{padding: '80px 20px'}}>
        <h2 style={{textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', border: 'none'}}>Why Engineers Choose Nexus</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px'}}>
            <FeatureCard 
                icon="🛡️" 
                title="PII Firewall (New)" 
                desc="Automatically redact emails, phone numbers, and API keys before they leave your infrastructure. GDPR compliance by default." 
                highlight={true}
            />
            <FeatureCard 
                icon="⚡" 
                title="Sub-ms Latency" 
                desc="Serve repeated queries instantly from Redis & Pinecone. No more waiting 3s for OpenAI." 
                highlight={false}
            />
            <FeatureCard 
                icon="💸" 
                title="90% Cost Reduction" 
                desc="Why pay twice for the same answer? Semantic caching stops the burn immediately." 
                highlight={false}
            />
            <FeatureCard 
                icon="🔀" 
                title="Universal Router" 
                desc="Switch between GPT-4, Claude 3, and Llama without changing your code structure." 
                highlight={false}
            />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        textAlign:'center', marginTop:'40px', padding:'40px', 
        borderTop: '1px solid rgba(255,255,255,0.1)', color:'#64748b'
      }}>
        <p>© 2025 Nexus Gateway Inc. · <a href="/docs" style={{color:'inherit'}}>Documentation</a> · <a href="/dashboard" style={{color:'inherit'}}>Login</a></p>
      </footer>

    </div>
  );
}

function FeatureCard({icon, title, desc, highlight}: {icon: string, title: string, desc: string, highlight: boolean}) {
    return (
        <div className="glass-card" style={{
            padding: '30px', 
            border: highlight ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
            background: highlight ? 'rgba(99, 102, 241, 0.1)' : 'rgba(17, 25, 40, 0.75)'
        }}>
            <div style={{fontSize: '2.5rem', marginBottom: '20px'}}>{icon}</div>
            <h3 style={{fontSize: '1.3rem', color: 'white', marginBottom: '10px'}}>{title}</h3>
            <p style={{color: '#94a3b8'}}>{desc}</p>
        </div>
    )
}