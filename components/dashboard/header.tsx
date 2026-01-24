"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FileText, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center border-b border-white/5 pb-10 mb-10">
      <div className="flex items-center gap-10">
        {/* 🚀 LOGO SIZE UPDATED TO 105px */}
        <div className="relative group transition-transform duration-500 hover:scale-105">
          <Image 
            src="/LOGO.png" 
            alt="Nexus Gateway Logo" 
            width={105} 
            height={105} 
            className="rounded-2xl shadow-2xl shadow-indigo-500/20 border border-white/5" 
            priority
          />
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl -z-10 group-hover:bg-indigo-500/20 transition-all" />
        </div>
        
        <div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
                Nexus <span className="text-indigo-500">Gateway</span>
            </h1>
            <div className="flex items-center gap-3 mt-4">
                <span className="h-[1px] w-8 bg-indigo-500/50"></span>
                <p className="text-[10px] font-mono text-slate-500 tracking-[0.4em] uppercase font-bold">
                    Control.Plane.v3.1
                </p>
            </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/docs">
            <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                <FileText size={14}/> DOCUMENTATION
            </button>
        </Link>
        <Link href="/logs">
            <button className="bg-indigo-600 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 shadow-2xl shadow-indigo-500/20 transition-all flex items-center gap-2 border border-indigo-400/20">
                <Search size={14}/> TRACE INSPECTOR
            </button>
        </Link>
      </div>
    </header>
  );
}