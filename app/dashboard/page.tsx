

"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { TelemetryChart } from "@/components/dashboard/telemetry-chart"
import { AccessProvisioning } from "@/components/dashboard/access-provisioning"
import { InferenceConfig } from "@/components/dashboard/inference-config"
import { Playground } from "@/components/dashboard/playground"

export interface Stats {
  total: number
  hits: number
  savings: number
  latency: number
  tokens: number
  graph: Array<{ time: string; count: number }>
}

export default function Dashboard() {
  // --- 1. STATE MANAGEMENT ---
  const [email, setEmail] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState("llama-3.3-70b-versatile")
  const [message, setMessage] = useState("")
  const [chatResponse, setChatResponse] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [providerKey, setProviderKey] = useState("")
  const [quotaExceeded, setQuotaExceeded] = useState(false)
  const [upgradeError, setUpgradeError] = useState(false)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    hits: 0,
    savings: 0,
    latency: 0,
    tokens: 0,
    graph: [],
  })
  const [usage, setUsage] = useState({ used: 0, limit: 100 });

  const backendUrl = "https://nexusgateway.onrender.com"

  // --- 2. FETCH GLOBAL TELEMETRY (FIXED: Added this function) ---
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/stats`)
      const data = await res.json()
      setStats({
        total: data.total_requests || 0,
        hits: data.cache_hits || 0,
        savings: data.total_savings || 0,
        latency: data.avg_latency || 0,
        tokens: data.total_tokens || 0,
        graph: data.graph_data || [],
      })
    } catch (err) {
      console.error("Stats fetch failed", err)
    }
  }, [backendUrl])

  // --- 3. FETCH USER QUOTA ---
  const fetchUsage = useCallback(async () => {
    if (!apiKey) return;
    try {
      const res = await fetch(`${backendUrl}/api/user/usage`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      const data = await res.json();
      setUsage({ used: data.used, limit: data.limit });
    } catch (err) {
      console.error("Usage fetch failed", err);
    }
  }, [apiKey, backendUrl]);

  // --- 4. POLLING ENGINE ---
  useEffect(() => {
    fetchStats();
    if (apiKey) fetchUsage();
    
    const interval = setInterval(() => {
        fetchStats();
        if (apiKey) fetchUsage();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fetchStats, fetchUsage, apiKey]);

  // --- 5. REGISTER HANDLER ---
  const handleRegister = async () => {
    if (!email) return alert("Enter email")
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) setApiKey(data.api_key)
      else alert("Error: " + data.error)
    } catch {
      alert("Server error")
    }
    setLoading(false)
  }

  // --- 6. STRIPE UPGRADE HANDLER ---
  const handleUpgrade = async () => {
    setUpgradeError(false)
    try {
      const res = await fetch(`${backendUrl}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ plan: "pro" }),
      })
      const data = await res.json()
      if (data.checkout_url || data.url) {
        window.location.href = data.checkout_url || data.url
      } else {
        console.error("[Nexus] Checkout failed", data)
        setUpgradeError(true)
      }
    } catch (err) {
      setUpgradeError(true)
    }
  }

  // --- 7. CHAT EXECUTION (SSE STREAMING) ---
  const handleChat = async () => {
    if (!apiKey) return alert("Enter Nexus API Key first")
    if (!message) return;
    
    setChatLoading(true)
    setChatResponse("")
    setQuotaExceeded(false)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }

    if (providerKey) {
      const m = model.toLowerCase()
      if (m.includes("gpt")) headers["x-nexus-openai-key"] = providerKey
      else if (m.includes("llama") || m.includes("mixtral")) headers["x-nexus-groq-key"] = providerKey
      else if (m.includes("gemini")) headers["x-nexus-gemini-key"] = providerKey
      else if (m.includes("claude")) headers["x-nexus-anthropic-key"] = providerKey
    }

    try {
      const res = await fetch(`${backendUrl}/api/chat/stream`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message, model }),
      })

      if (res.status === 402) {
        setQuotaExceeded(true)
        setChatLoading(false)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      while (reader) {
        const { value, done } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ") && !line.includes("[DONE]")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""))
              setChatResponse((prev) => prev + (data.choices?.[0]?.delta?.content || ""))
            } catch {}
          }
        }
      }
      fetchStats();
      fetchUsage();
    } catch {
      setChatResponse("Connection Failed.")
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background radial gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,rgba(30,27,75,0.4)_0%,transparent_70%)]" />

      <div className="relative max-w-[1440px] mx-auto p-8 lg:p-10 space-y-8">
        <DashboardHeader />
        
        {/* STATS: Pulling from unified state */}
        <StatsGrid stats={stats} />
        
        <TelemetryChart data={stats.graph} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 pb-10">
          <div className="space-y-6">
            <AccessProvisioning
              email={email}
              setEmail={setEmail}
              apiKey={apiKey}
              loading={loading}
              onRegister={handleRegister}
              usage={usage}
            />
            <InferenceConfig
              providerKey={providerKey}
              setProviderKey={setProviderKey}
              model={model}
              setModel={setModel}
            />
          </div>
          <Playground
            message={message}
            setMessage={setMessage}
            chatResponse={chatResponse}
            chatLoading={chatLoading}
            onExecute={handleChat}
            quotaExceeded={quotaExceeded}
            onUpgrade={handleUpgrade}
            upgradeError={upgradeError}
          />
        </div>
      </div>

      <footer className="max-w-[1440px] mx-auto px-8 lg:px-10 py-8 border-t border-white/5 flex justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest">
        <span>© 2025 Nexus Gateway Infrastructure</span>
        <span>Secure Data Plane · SOC2 Type II Ready</span>
      </footer>
    </div>
  )
}