

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
  const [activeTab, setActiveTab] = useState("python"); // python or node

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
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <img src="/LOGO.png" alt="Nexus Logo" width="80" height="80" style={{filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'}} />
            <span style={{fontWeight:'bold', fontSize:'1.5rem', color:'white'}}>
                Nexus<span style={{color:'#6366f1'}}>Gateway</span>
            </span>
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
        minHeight: '90vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        paddingTop: '100px'
      }}>
        <div style={{
            background: 'linear-gradient(to right, #818cf8, #c084fc)', 
            padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', 
            color: 'white', marginBottom: '20px', fontWeight: 'bold'
        }}>
             Now with Node.js & Python Support
        </div>
        
        <h1 style={{fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '20px', maxWidth: '900px'}}>
            The Universal Gateway<br/> for <span style={{
                background: 'linear-gradient(to right, #4f46e5, #ec4899)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>AI Engineering.</span>
        </h1>
        
        <p style={{fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', marginBottom: '30px'}}>
            Semantic Caching, BYOK Security, and Universal Routing. 
            Reduce latency by 95% and costs by 90% with one line of code.
        </p>

        <div style={{display: 'flex', gap: '15px', marginBottom: '40px'}}>
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

        {/* CODE WINDOW */}
        <div style={{width: '100%', maxWidth: '700px', textAlign: 'left'}}>
            <div className="glass-card" style={{padding: '0', overflow: 'hidden'}}>
                
                {/* Tabs */}
                <div style={{background: '#1e293b', display:'flex', borderBottom:'1px solid #334155'}}>
                    <button 
                        onClick={() => setActiveTab("python")}
                        style={{padding:'10px 20px', background: activeTab==="python" ? '#0f172a' : 'transparent', color: activeTab==="python" ? '#fff' : '#64748b', border:'none', cursor:'pointer'}}
                    >Python</button>
                    <button 
                        onClick={() => setActiveTab("node")}
                        style={{padding:'10px 20px', background: activeTab==="node" ? '#0f172a' : 'transparent', color: activeTab==="node" ? '#fff' : '#64748b', border:'none', cursor:'pointer'}}
                    >Node.js</button>
                    <button 
                        onClick={() => setActiveTab("cli")}
                        style={{padding:'10px 20px', background: activeTab==="cli" ? '#0f172a' : 'transparent', color: activeTab==="cli" ? '#fff' : '#64748b', border:'none', cursor:'pointer'}}
                    >CLI Tool</button>
                </div>

                {/* Code Content */}
                <div style={{padding: '25px', background: '#0f172a', fontFamily: 'monospace', color: '#e2e8f0', minHeight:'200px'}}>
                    
                    {activeTab === "python" && (
                        <>
                            <p className="mb-4"><span style={{color: '#818cf8'}}>$</span> pip install nexus-gateway</p>
                            <p style={{color: '#c084fc'}}>from</p> nexus_gateway <p style={{color: '#c084fc', display:'inline'}}>import</p> NexusClient
                            <br/><br/>
                            <p>client = NexusClient(api_key=<span style={{color: '#4ade80'}}>"nk-..."</span>)</p>
                            <p>response = client.chat(<span style={{color: '#4ade80'}}>"Hello World"</span>)</p>
                            
                            <p style={{color: '#94a3b8', marginTop: '20px', borderTop:'1px solid #334155', paddingTop:'10px'}}>
                                # Output: {`{ "status": "200 OK", "latency": "12ms (Cache Hit)" }`}
                            </p>
                        </>
                    )}

                    {activeTab === "node" && (
                        <>
                            <p className="mb-4"><span style={{color: '#818cf8'}}>$</span> npm install nexus-gateway-js</p>
                            <p style={{color: '#c084fc'}}>import</p> {'{ NexusClient }'} <p style={{color: '#c084fc', display:'inline'}}>from</p> 'nexus-gateway-js';
                            <br/><br/>
                            <p>const client = new NexusClient({'{'} apiKey: <span style={{color: '#4ade80'}}>"nk-..."</span> {'}'});</p>
                            <p>const res = await client.chat(<span style={{color: '#4ade80'}}>"Hello World"</span>);</p>
                            
                            <p style={{color: '#94a3b8', marginTop: '20px', borderTop:'1px solid #334155', paddingTop:'10px'}}>
                                // Output: {`{ "status": "200 OK", "latency": "15ms (Cache Hit)" }`}
                            </p>
                        </>
                    )}

                    {activeTab === "cli" && (
                        <>
                            <p className="mb-4" style={{color:'#94a3b8'}}># Python CLI</p>
                            <p className="mb-4"><span style={{color: '#818cf8'}}>$</span> nexus</p>
                            
                            <p className="mb-4" style={{color:'#94a3b8'}}># Node.js CLI</p>
                            <p><span style={{color: '#818cf8'}}>$</span> npx nexus-chat</p>

                            <div style={{marginTop:'20px', padding:'15px', background:'#000', borderRadius:'6px', border:'1px solid #334155'}}>
                                <p style={{color: '#4ade80'}}> Welcome to Nexus Gateway...</p>
                                <p>You: Hello</p>
                                <p style={{color: '#60a5fa'}}>Nexus: Hi there! How can I help you?</p>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
      </section>

      {/* FEATURES GRID */}
<section style={{padding: '100px 20px', maxWidth: '1200px', margin: '0 auto'}}>
  <h2 style={{textAlign: 'center', fontSize: '3rem', fontWeight: '800', marginBottom: '60px', border: 'none', letterSpacing: '-1px'}}>
    Why Engineers Choose <span style={{color: '#6366f1'}}>Nexus</span>
  </h2>
  
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px'}}>
    
    {/* CARD 1: BYOK */}
    <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
      <div className="mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" r="1" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">Bring Your Own Key</h3>
      <p className="text-slate-400 leading-relaxed">
        Zero-Knowledge Architecture. Pass your keys via headers. We process it, cache it, and forget it. Your keys **never touch our database**.
      </p>
    </div>

    {/* CARD 2: SDKS */}
    <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
      <div className="mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">Full-Stack SDKs</h3>
      <p className="text-slate-400 leading-relaxed">
        Native libraries for **Python (PyPI)** and **Node.js (NPM)**. Integrate into your production environment in seconds, not hours.
      </p>
    </div>

    {/* CARD 3: SEMANTIC CACHING */}
    <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
      <div className="mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">Semantic Caching</h3>
      <p className="text-slate-400 leading-relaxed">
        Don't pay for the same answer twice. We use **Pinecone Vector Search** to catch similar queries and reduce costs by up to 90%.
      </p>
    </div>

    {/* CARD 4: UNIVERSAL ROUTER */}
    <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
      <div className="mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">Universal Model Router</h3>
      <p className="text-slate-400 leading-relaxed">
        Switch between **GPT-4, Claude 3, GPT-3.5, Gemini and Llama 3** dynamically. Change models via a single string in your payload without changing code.
      </p>
    </div>

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