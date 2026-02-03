"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Key, Server, Code2, Zap } from "lucide-react"




export default function DocsPage() {

  const [userApiKey, setUserApiKey] = useState("nk-your-api-key");

  useEffect(() => {
    // Check if we are in the browser to avoid SSR errors
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("nexus_api_key"); 
      if (savedKey) setUserApiKey(savedKey);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% -20%, rgba(30, 27, 75, 0.5) 0%, transparent 50%)",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto">
        {/* Layout: Sidebar + Main Content */}
        <div className="flex min-h-screen">
          {/* Left Sidebar - Fixed Navigation */}
          <aside className="hidden lg:block w-[300px] border-r border-white/5 p-8 sticky top-0 h-screen">
            <div className="mb-12">
              <Link href="/" className="flex items-center gap-3 group">
                 <Image 
                    src="/LOGO.png" 
                    alt="Nexus Gateway Logo" 
                    width={105} 
                    height={105} 
                    className="rounded-2xl shadow-2xl shadow-indigo-500/20 border border-white/5 group-hover:scale-105 transition-transform" 
                />
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Documentation</h2>
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">v2.2.0</p>
                </div>
              </Link>
            </div>

            <nav className="space-y-2">
              {[
                { num: "01", label: "IMPLEMENTATION", href: "#implementation" },
                { num: "02", label: "BYOK CONFIGURATION", href: "#byok" },
                { num: "03", label: "API REFERENCE", href: "#api" },
                { num: "04", label: "MODEL ENGINES", href: "#models" },
              ].map((item) => (
                <a
                  key={item.num}
                  href={item.href}
                  className="flex items-center gap-4 p-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.02] transition-all group"
                >
                  <span className="font-mono text-xs text-indigo-500">{item.num}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="absolute bottom-8 left-8 right-8">
              <Link href="/dashboard">
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2">
                  Dashboard
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-8 lg:p-12 space-y-12">
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center mb-8">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Documentation</h1>
              <Link href="/dashboard">
                <button className="bg-indigo-600 px-4 py-2 rounded-lg text-xs font-bold uppercase text-white">
                  Dashboard
                </button>
              </Link>
            </div>

            {/* Hero Section */}
            <header className="border-b border-white/5 pb-12">
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
                Technical Specifications
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Complete integration guide for the Nexus Gateway Protocol. High-performance AI inference with semantic
                caching.
              </p>
            </header>

            {/* Section: Implementation */}
            <section id="implementation" className="scroll-mt-8">
              <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] rounded-2xl p-8 lg:p-10 hover:border-indigo-500/20 transition-all">
                <h2 className="text-xs font-sans uppercase tracking-widest text-white mb-10 flex items-center gap-3">
                  <span className="text-indigo-500 font-mono">01.</span>
                  Implementation
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      icon: <Key className="w-5 h-5" />,
                      title: "Authentication",
                      detail: "Generate a unique API Key from the Nexus Dashboard to authenticate your requests.",
                    },
                    {
                      icon: <Server className="w-5 h-5" />,
                      title: "Configuration",
                      detail: "Select your preferred model engine (GPT-4, Claude, Llama 3, or Gemini).",
                    },
                    {
                      icon: <Code2 className="w-5 h-5" />,
                      title: "Integration",
                      detail: "Authorize requests using the Bearer token protocol in your HTTP headers.",
                    },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg mb-2">{step.title}</p>
                        <p className="text-slate-400 leading-relaxed">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: BYOK */}
            <section id="byok" className="scroll-mt-8">
              <div className="bg-indigo-500/[0.03] border border-indigo-500/20 rounded-2xl p-8 lg:p-10 backdrop-blur-xl">
                <h2 className="text-xs font-sans uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-3">
                  <span className="font-mono">02.</span>
                  Provider Key Pass-Through
                </h2>
                <p className="text-slate-400 mb-8 max-w-2xl leading-relaxed">
                  Nexus Gateway supports a zero-knowledge key architecture. To utilize your own provider billing and
                  bypass Nexus credit limits, include these headers.
                </p>

                <div className="bg-black rounded-xl p-6 border border-white/10 font-mono text-sm overflow-x-auto">
                  <p className="text-slate-600 mb-4"># Set Headers for Sovereign Routing</p>
                  <div className="space-y-4">
                    {/* 1. Nexus Authorization (Asli Key yahan dikhegi) */}
                    <div>
                      <p className="text-indigo-400">Authorization:</p>
                      <p className="text-emerald-400 pl-4">Bearer {userApiKey}</p>
                    </div>

                    {/* 2. Provider Keys (Inhe default placeholder hi rehne do) */}
                    <div className="pt-4 border-t border-white/5 space-y-1">
                      <p className="text-slate-600"># Optional: BYOK Headers</p>
                      <p><span className="text-indigo-400">x-nexus-openai-key:</span> <span className="text-slate-500">sk-your-key</span></p>
                      <p><span className="text-indigo-400">x-nexus-groq-key:</span> <span className="text-slate-500">gsk_your-key</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: API Reference */}
            <section id="api" className="scroll-mt-8">
              <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] rounded-2xl p-8 lg:p-10 hover:border-indigo-500/20 transition-all">
                <h2 className="text-xs font-sans uppercase tracking-widest text-white mb-10 flex items-center gap-3">
                  <span className="text-indigo-500 font-mono">03.</span>
                  API Reference
                </h2>

                {/* Streaming Endpoint */}
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="border border-emerald-500 text-emerald-500 px-3 py-1 rounded-lg font-mono text-xs font-bold">
                      POST
                    </span>
                    <code className="text-xl text-white font-mono font-semibold">/api/chat/stream</code>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-2xl">
                    Primary streaming endpoint for real-time inference. Requests are automatically routed based on the
                    model parameter.
                  </p>

                  <div className="bg-black rounded-xl p-6 border border-white/10 font-mono text-sm">
                    <pre className="text-slate-300 overflow-x-auto">
                      {`{
                        "model": "llama3-70b-versatile",
                        "message": "Technical query here..."
                      }`}
                    </pre>
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-slate-600 mb-2"># Request Header</p>
                        <p className="text-indigo-300">Authorization: <span className="text-emerald-400">Bearer {userApiKey}</span></p>
                    </div>
                  </div>
                </div>

                {/* Stats Endpoint */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="border border-blue-500 text-blue-500 px-3 py-1 rounded-lg font-mono text-xs font-bold">
                      GET
                    </span>
                    <code className="text-xl text-white font-mono font-semibold">/api/stats</code>
                  </div>
                  <p className="text-slate-400">
                    Returns real-time telemetry including cache efficiency and cost mitigation data.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Model Engines */}
            <section id="models" className="scroll-mt-8">
              <h2 className="text-xs font-sans uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                <span className="text-indigo-500 font-mono">04.</span>
                Supported Model Engines
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "GPT-4o", provider: "OpenAI", icon: <Zap className="w-5 h-5" /> },
                  { name: "Llama 3", provider: "Groq", icon: <Zap className="w-5 h-5" /> },
                  { name: "Gemini 1.5", provider: "Google", icon: <Zap className="w-5 h-5" /> },
                  { name: "Claude 3.5", provider: "Anthropic", icon: <Zap className="w-5 h-5" /> },
                ].map((model, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-xl p-6 hover:border-indigo-500/20 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors">
                      {model.icon}
                    </div>
                    <p className="text-white font-bold text-lg mb-1">{model.name}</p>
                    <p className="text-xs font-mono text-indigo-400 uppercase tracking-wider">{model.provider}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 px-8 lg:px-12 py-8">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center">
            Nexus Gateway Infrastructure · v2.2.0-STABLE
          </p>
        </footer>
      </div>
    </div>
  )
}
