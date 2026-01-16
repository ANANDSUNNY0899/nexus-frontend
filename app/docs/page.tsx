"use client";

import Link from "next/link";

export default function Docs() {
  return (
    <div className="main-wrapper" style={{
        minHeight: '100vh',
        padding: '80px 20px',
        // --- LANDING PAGE BACKGROUND DNA ---
        background: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #020617 100%)',
        color: '#fff'
    }}>
      
      <div style={{maxWidth: '900px', margin: '0 auto'}}>
        
        {/* 1. HEADER SECTION */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '60px'
        }}>
          <div>
              <h1 style={{
                  fontSize:'3.2rem', 
                  fontWeight: '900', 
                  margin: 0,
                  letterSpacing: '-2px',
                  background: 'linear-gradient(to right, #fff, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
              }}>
                  Documentation
              </h1>
              <p style={{color:'#94a3b8', marginTop: '10px', fontSize: '1.1rem'}}>
                  Technical specifications for the Nexus Gateway Protocol.
              </p>
          </div>
          
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ 
                  padding: '12px 28px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                  color: '#fff', 
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                  transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                  Back to Dashboard
              </button>
          </Link>
        </div>

        {/* 2. SECTION: IMPLEMENTATION (GLASS CARD) */}
        <div className="glass-card" style={{
            padding: '40px', 
            marginBottom: '40px', 
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <h2 style={{color: '#fff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '2px'}}>Implementation</h2>
          <div style={{display:'flex', flexDirection:'column', gap:'40px'}}>
              {[
                  { title: "Authentication", detail: "Generate a unique API Key from the Nexus Dashboard to authenticate your requests." },
                  { title: "Configuration", detail: "Select your preferred model engine (GPT-4, Claude, Llama 3, or Gemini)." },
                  { title: "Integration", detail: "Authorize requests using the Bearer token protocol in your HTTP headers." }
              ].map((step, i) => (
                  <div key={i} style={{display:'flex', gap:'24px', alignItems: 'flex-start'}}>
                      <span style={{
                          color: '#6366f1', 
                          fontWeight: '900', 
                          fontSize: '1.1rem',
                          fontFamily: 'monospace',
                          background: 'rgba(99, 102, 241, 0.1)',
                          padding: '4px 10px',
                          borderRadius: '8px'
                      }}>0{i+1}</span>
                      <div>
                          <p style={{color: '#fff', fontWeight: '700', fontSize: '1.1rem', margin: '0 0 6px 0'}}>{step.title}</p>
                          <p style={{color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6'}}>{step.detail}</p>
                      </div>
                  </div>
              ))}
          </div>
        </div>

        {/* 3. SECTION: BYOK (PROVIDER KEYS) */}
        <div style={{
            padding: '32px', 
            marginBottom: '40px', 
            borderRadius: '24px',
            background: 'rgba(99, 102, 241, 0.05)', 
            border: '1px solid rgba(99, 102, 241, 0.2)',
            backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{color: '#a5b4fc', fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px'}}>Provider Key Pass-Through</h2>
          <p style={{color: '#cbd5e1', fontSize: '1rem', marginBottom: '24px', lineHeight: '1.6'}}>
              Nexus Gateway supports a zero-knowledge key architecture. To utilize your own provider billing and bypass Nexus credit limits, include these headers.
          </p>
          <div style={{background: '#000', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '0.9rem', color: '#e2e8f0'}}>
              <p style={{color: '#475569', marginBottom: '10px'}}># Set Header: x-nexus-[provider]-key</p>
              <p style={{marginBottom: '6px'}}><span style={{color: '#6366f1'}}>x-nexus-openai-key:</span> sk-your-key</p>
              <p style={{marginBottom: '6px'}}><span style={{color: '#6366f1'}}>x-nexus-groq-key:</span> gsk_your-key</p>
              <p><span style={{color: '#6366f1'}}>x-nexus-gemini-key:</span> AIza_your-key</p>
          </div>
        </div>

        {/* 4. SECTION: API REFERENCE */}
        <div className="glass-card" style={{
            padding: '40px', 
            marginBottom: '40px', 
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <h2 style={{color: '#fff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '2px'}}>API Reference</h2>

          {/* Streaming Endpoint */}
          <div style={{marginBottom: '48px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px'}}>
                  <span style={{border: '1px solid #22c55e', color:'#22c55e', padding:'4px 12px', borderRadius:'8px', fontWeight:'800', fontSize:'0.75rem'}}>POST</span>
                  <code style={{fontSize:'1.2rem', color:'#fff', fontWeight: '700'}}>/api/chat/stream</code>
              </div>
              <p style={{color: '#94a3b8', fontSize: '1rem', marginBottom: '24px'}}>Primary streaming endpoint for real-time inference. Requests are automatically routed based on the model parameter.</p>
              
              <div style={{background: '#000', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '0.9rem'}}>
<pre style={{color: '#e2e8f0', margin: 0}}>
{`{
  "model": "llama3-70b-8192",
  "message": "Technical query here..."
}`}
</pre>
              </div>
          </div>

          {/* Stats */}
          <div>
              <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px'}}>
                  <span style={{border: '1px solid #3b82f6', color:'#3b82f6', padding:'4px 12px', borderRadius:'8px', fontWeight:'800', fontSize:'0.75rem'}}>GET</span>
                  <code style={{fontSize:'1.2rem', color:'#fff', fontWeight: '700'}}>/api/stats</code>
              </div>
              <p style={{color: '#94a3b8', fontSize: '1rem'}}>Returns real-time telemetry including cache efficiency and cost mitigation data.</p>
          </div>
        </div>

        {/* 5. SECTION: MODEL ENGINES */}
        <div style={{marginTop: '60px', textAlign: 'center'}}>
          <h2 style={{color: '#fff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px'}}>Supported Model Engines</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px'}}>
              {[
                  { name: "GPT-4o", provider: "OpenAI" },
                  { name: "Llama 3", provider: "Groq" },
                  { name: "Gemini 1.5", provider: "Google" },
                  { name: "Claude 3.5", provider: "Anthropic" }
              ].map((m, i) => (
                  <div key={i} style={{
                      padding:'24px', 
                      borderRadius:'16px', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      background: 'rgba(255,255,255,0.02)',
                      backdropFilter: 'blur(5px)'
                  }}>
                      <p style={{color:'#fff', fontWeight:'800', fontSize: '1.1rem', margin: '0 0 6px 0'}}>{m.name}</p>
                      <p style={{fontSize:'0.75rem', color: '#818cf8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px'}}>{m.provider}</p>
                  </div>
              ))}
          </div>
        </div>

        <footer style={{textAlign:'center', color:'#475569', fontSize:'0.8rem', marginTop:'100px', letterSpacing: '2px', textTransform: 'uppercase'}}>
          Nexus Gateway Infrastructure · v2.2.0-STABLE
        </footer>

      </div>
    </div>
  );
}