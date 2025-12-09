"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  // This function talks to your Go Backend
  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://nexusgateway.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setApiKey(data.api_key);
      } else {
        alert("Error: " + data);
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-500">
          Nexus Gateway
        </h1>
        <p className="text-gray-400 text-center mb-8">
          The AI Semantic Caching Layer
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
            <p className="text-green-400 text-2xl font-bold">$0.00</p>
            <p className="text-xs text-gray-500 uppercase mt-1">Saved</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
            <p className="text-purple-400 text-2xl font-bold">0</p>
            <p className="text-xs text-gray-500 uppercase mt-1">Hits</p>
          </div>
        </div>

        {/* Input Form */}
        {!apiKey ? (
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email to get API Key"
              className="flex-1 bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleRegister}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              {loading ? "..." : "Get Key"}
            </button>
          </div>
        ) : (
          <div className="bg-green-900/30 border border-green-800 p-4 rounded-lg">
            <p className="text-green-400 text-sm mb-1">Your API Key:</p>
            <code className="block bg-black p-2 rounded text-green-300 break-all text-sm">
              {apiKey}
            </code>
            <button 
              onClick={() => {navigator.clipboard.writeText(apiKey); alert("Copied!");}}
              className="mt-3 text-xs text-gray-400 hover:text-white underline"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}