"use client";

import Link from "next/link";

export default function Docs() {
  return (
    <div className="main-wrapper" style={{maxWidth: '800px'}}>
      
      {/* HEADER & NAV */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
            <h1>Documentation</h1>
            <p>Developer Guide for Nexus Gateway</p>
        </div>
        <Link href="/">
            <button className="btn btn-secondary">← Dashboard</button>
        </Link>
      </div>

      {/* SECTION 1: QUICK START */}
      <div className="glass-card">
        <h2> Quick Start</h2>
        <p style={{marginBottom: '15px'}}>Follow these steps to integrate Nexus into your app:</p>
        
        <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <span style={{background:'#4f46e5', width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>1</span>
                <span>Go to the Dashboard and enter your email.</span>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <span style={{background:'#4f46e5', width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>2</span>
                <span>Copy your <code>nk-</code> API Key.</span>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <span style={{background:'#4f46e5', width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>3</span>
                <span>Add the key to your request Header: <code>Authorization: Bearer YOUR_KEY</code></span>
            </div>
        </div>
      </div>

      {/* SECTION 2: API REFERENCE */}
      <div className="glass-card">
        <h2> API Reference</h2>

        {/* Chat Endpoint */}
        <div style={{marginBottom: '30px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                <span style={{background:'#22c55e', color:'black', padding:'2px 8px', borderRadius:'4px', fontWeight:'bold', fontSize:'0.8rem'}}>POST</span>
                <code style={{fontSize:'1.1rem', color:'white'}}>/api/chat</code>
            </div>
            <p>Send a prompt to the AI. Automatically routes to OpenAI or Anthropic.</p>
            
            <div className="code-block" style={{marginTop:'10px'}}>
{`{
  "model": "gpt-3.5-turbo",
  "message": "Explain quantum computing"
}`}
            </div>
        </div>

        {/* Stats Endpoint */}
        <div>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                <span style={{background:'#3b82f6', color:'black', padding:'2px 8px', borderRadius:'4px', fontWeight:'bold', fontSize:'0.8rem'}}>GET</span>
                <code style={{fontSize:'1.1rem', color:'white'}}>/api/stats</code>
            </div>
            <p>Retrieve global usage statistics and total money saved.</p>
        </div>
      </div>

      {/* SECTION 3: MODELS */}
      <div className="glass-card">
        <h2> Supported Models</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
            <div style={{background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'8px'}}>
                <p style={{color:'white', fontWeight:'bold'}}>OpenAI GPT-3.5</p>
                <p style={{fontSize:'0.8rem'}}>Fast, cheap, reliable.</p>
            </div>
            <div style={{background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'8px'}}>
                <p style={{color:'white', fontWeight:'bold'}}>OpenAI GPT-4</p>
                <p style={{fontSize:'0.8rem'}}>High intelligence.</p>
            </div>
            <div style={{background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'8px'}}>
                <p style={{color:'white', fontWeight:'bold'}}>Anthropic Claude 3</p>
                <p style={{fontSize:'0.8rem'}}>Great for writing and logic.</p>
            </div>
        </div>
      </div>

      <footer style={{textAlign:'center', color:'#64748b', fontSize:'0.8rem', marginTop:'20px'}}>
        Nexus Gateway Documentation · 2025
      </footer>

    </div>
  );
}