"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"

const codeExamples = {
  python: `from nexus_gateway import NexusClient

# Initialize the Sovereign Gateway
client = NexusClient(
    api_key="nk-9f1dd0c03f592be27590c97717d1470a"
)

# Execute inference with Adaptive Routing
response = client.chat(
    model="llama-3.3-70b-versatile",
    message="Optimize this Go connection pool for 25 MaxConns.",
    stream=True
)

for chunk in response:
    print(chunk.content, end="", flush=True)`,
  nodejs: `import { NexusClient } from 'nexus-gateway-js';

// Initialize the Sovereign Gateway
const nexus = new NexusClient({
  apiKey: 'nk-9f1dd0c03f592be27590c97717d1470a'
});

// Execute universal inference through the bridge
const stream = await nexus.chat({
  model: 'gemini-1.5-flash',
  message: 'Explain Quantum-Safe Cryptography and its impact.',
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}`,
  cli: `# Install Nexus Protocol CLI
$ npm install -g @nexus-gateway/cli

# Authenticate your local environment
$ nexus auth login --key nk-9f1dd0c03f592be27590c97717d1470a

# Execute universal inference from terminal
$ nexus chat --model llama-3.3-70b --prompt "System Status Check"

# Nexus Gateway Output:
✅ [SUCCESS] Routing to Groq Engine...
Latency: 5ms (Cache Hit)
Savings: $0.0124
Response: All infrastructure nodes operational. Protocol v3.1 active.`,
}

function SyntaxHighlight({ code, language }: { code: string; language: string }) {
  const highlightedLines = useMemo(() => {
    const keywords = [
      "from",
      "import",
      "const",
      "let",
      "var",
      "await",
      "async",
      "for",
      "if",
      "else",
      "return",
      "export",
      "function",
      "class",
    ]
    const booleans = ["True", "False", "None", "true", "false", "null", "undefined"]

    return code.split("\n").map((line, lineIndex) => {
      const tokens: { text: string; className: string }[] = []
      let remaining = line

      // Check if line is a comment
      if (remaining.trim().startsWith("#") || remaining.trim().startsWith("//")) {
        return { lineIndex, tokens: [{ text: remaining, className: "text-slate-500" }] }
      }

      // Check for CLI prompt
      if (remaining.startsWith("$ ")) {
        tokens.push({ text: "$ ", className: "text-indigo-400" })
        remaining = remaining.slice(2)
      }

      // Simple character-by-character tokenization
      let i = 0
      while (i < remaining.length) {
        const char = remaining[i]

        // Handle strings
        if (char === '"' || char === "'" || char === "`") {
          const quote = char
          let end = i + 1
          while (end < remaining.length && remaining[end] !== quote) {
            if (remaining[end] === "\\") end++
            end++
          }
          end++
          tokens.push({ text: remaining.slice(i, end), className: "text-emerald-400" })
          i = end
          continue
        }

        // Handle CLI flags
        if (remaining.slice(i, i + 2) === "--") {
          let end = i + 2
          while (end < remaining.length && /\w/.test(remaining[end])) end++
          tokens.push({ text: remaining.slice(i, end), className: "text-cyan-400" })
          i = end
          continue
        }

        // Handle words (keywords, booleans, identifiers)
        if (/[a-zA-Z_]/.test(char)) {
          let end = i
          while (end < remaining.length && /\w/.test(remaining[end])) end++
          const word = remaining.slice(i, end)

          if (keywords.includes(word)) {
            tokens.push({ text: word, className: "text-purple-400" })
          } else if (booleans.includes(word)) {
            tokens.push({ text: word, className: "text-orange-400" })
          } else if (word === "nexus") {
            tokens.push({ text: word, className: "text-indigo-400" })
          } else {
            tokens.push({ text: word, className: "text-slate-200" })
          }
          i = end
          continue
        }

        // Handle numbers
        if (/\d/.test(char)) {
          let end = i
          while (end < remaining.length && /[\d.]/.test(remaining[end])) end++
          tokens.push({ text: remaining.slice(i, end), className: "text-amber-400" })
          i = end
          continue
        }

        // Handle other characters
        tokens.push({ text: char, className: "text-slate-200" })
        i++
      }

      return { lineIndex, tokens }
    })
  }, [code])

  return (
    <div className="font-mono text-sm leading-relaxed">
      {highlightedLines.map(({ lineIndex, tokens }) => (
        <div key={lineIndex} className="flex">
          <span className="w-8 text-right pr-4 text-slate-600 select-none">{lineIndex + 1}</span>
          <span>
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={token.className}>
                {token.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"python" | "nodejs" | "cli">("python")

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">
      {/* Background Radial Mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent)",
        }}
      />

      {/* Command Navbar */}
      <nav className="relative z-10 border-b border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
                src="/LOGO.png" 
                alt="Nexus Gateway" 
                width={105} 
                height={105} 
                className="rounded-xl shadow-lg shadow-indigo-500/10" 
            />
            <span className="text-2xl font-black tracking-tighter italic uppercase">
                Nexus <span className="text-indigo-500">Gateway</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-slate-400 hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="/logs" className="text-sm text-slate-400 hover:text-white transition-colors">
              Trace Inspector
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-8 pt-24 pb-16">
        <div className="max-w-4xl">
          <p className="text-sm font-mono text-indigo-400 tracking-widest uppercase mb-6">
            Infrastructure Protocol v2.2.0
          </p>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            <span className="text-white">The Universal</span>
            <br />
            <span className="bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
              AI Engineering
            </span>
            <br />
            <span className="text-white">Gateway</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
            Enterprise-grade inference routing, semantic caching, and unified model orchestration. Route to 200+ models
            across providers with a single API endpoint and sub-millisecond overhead.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/25"
            >
              Access Dashboard
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-slate-300 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Protocol Showcase - Code Window */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-8 pb-24">
        <div className="bg-black rounded-xl border border-indigo-500/20 overflow-hidden shadow-2xl shadow-indigo-500/10">
          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-1">
              {(["python", "nodejs", "cli"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-xs font-mono rounded-md transition-all ${
                    activeTab === tab
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab === "nodejs" ? "Node.js" : tab.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="text-xs font-mono text-slate-600">
              nexus-gateway-example.{activeTab === "python" ? "py" : activeTab === "nodejs" ? "ts" : "sh"}
            </div>
          </div>

          {/* Code Content */}
          <div className="p-6 overflow-x-auto">
            <SyntaxHighlight code={codeExamples[activeTab]} language={activeTab} />
          </div>

          {/* Output Preview */}
          <div className="border-t border-white/[0.05] bg-white/[0.01] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-slate-600">NEXUS OUTPUT</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400">200 OK</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs font-mono">
                <span className="text-slate-500">
                  latency: <span className="text-indigo-400">12ms</span>
                </span>
                <span className="text-slate-500">
                  tokens: <span className="text-indigo-400">847</span>
                </span>
                <span className="text-slate-500">
                  cache: <span className="text-emerald-400">HIT</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <p className="text-sm font-mono text-indigo-400 tracking-widest uppercase mb-4">Infrastructure Pillars</p>
          <h2 className="text-4xl font-bold tracking-tight text-white">Enterprise-Grade Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BYOK Card */}
          <div className="group p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl hover:border-indigo-500/30 hover:bg-white/[0.03] transition-all">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-400"
              >
                <path
                  d="M21 2L19 4M11.3891 11.6109C12.3844 12.6062 13 13.9812 13 15.5C13 18.5376 10.5376 21 7.5 21C4.46243 21 2 18.5376 2 15.5C2 12.4624 4.46243 10 7.5 10C9.01878 10 10.3938 10.6156 11.3891 11.6109ZM11.3891 11.6109L15.5 7.5M15.5 7.5L18 10L21 7L18.5 4.5M15.5 7.5L18.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Bring Your Own Key</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Use your existing API keys from OpenAI, Anthropic, or any provider. Zero vendor lock-in with complete key
              sovereignty.
            </p>
          </div>

          {/* SDKs Card */}
          <div className="group p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl hover:border-indigo-500/30 hover:bg-white/[0.03] transition-all">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-400"
              >
                <path
                  d="M16 18L22 12L16 6M8 6L2 12L8 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Full-Stack SDKs</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Native SDKs for Python, Node.js, Go, and Rust. Type-safe interfaces with streaming support and automatic
              retries.
            </p>
          </div>

          {/* Caching Card */}
          <div className="group p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl hover:border-indigo-500/30 hover:bg-white/[0.03] transition-all">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-400"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Semantic Caching</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vector-based response caching with configurable similarity thresholds. Reduce costs by up to 70% on
              repeated queries.
            </p>
          </div>

          {/* Router Card */}
          <div className="group p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-xl hover:border-indigo-500/30 hover:bg-white/[0.03] transition-all">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-400"
              >
                <path
                  d="M22 12H18L15 21L9 3L6 12H2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Universal Router</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Intelligent request routing across 200+ models. Automatic failover, load balancing, and latency-optimized
              selection.
            </p>
          </div>
        </div>
      </section>

      {/* Industrial Footer */}
      <footer className="relative z-10 border-t border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">Protocol v2.2.0-STABLE</span>
              <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">Encrypted Data Plane</span>
              <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">SOC2 Type II</span>
            </div>
            <div className="text-xs font-mono text-slate-600">2025 NEXUS GATEWAY INFRASTRUCTURE</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
