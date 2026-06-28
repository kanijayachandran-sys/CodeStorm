import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Save, ShieldAlert, ArrowRight, UserCheck, Eye, RefreshCw, Layers } from 'lucide-react';
import { HackerPass, BadgeStyle } from '../types';

export default function PassGenerator({ pass, onUpdatePass }: { 
  pass: HackerPass; 
  onUpdatePass: (updated: HackerPass) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineX, setShineX] = useState(50);
  const [shineY, setShineY] = useState(50);
  const [copied, setCopied] = useState(false);

  // Holographic card mouse tilt calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    // Convert to degrees (-15 to 15)
    const rx = (py - 0.5) * -22;
    const ry = (px - 0.5) * 22;

    setRotateX(rx);
    setRotateY(ry);

    // Shine percentage
    setShineX(px * 100);
    setShineY(py * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShineX(50);
    setShineY(50);
  };

  const badgeThemes: Record<BadgeStyle, {
    bg: string;
    border: string;
    text: string;
    glow: string;
    accent: string;
    name: string;
    foil: string;
  }> = {
    cyberpunk: {
      bg: 'bg-gradient-to-br from-cyan-950 via-slate-900 to-pink-950',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      accent: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      name: 'Cyberpunk Neon',
      foil: 'linear-gradient(135deg, rgba(6,182,212,0.4) 0%, rgba(236,72,153,0.4) 50%, rgba(236,72,153,0) 100%)',
    },
    obsidian: {
      bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950',
      border: 'border-zinc-700/60',
      text: 'text-zinc-300',
      glow: 'shadow-[0_0_30px_rgba(255,255,255,0.02)]',
      accent: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      name: 'Dark Obsidian',
      foil: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0) 100%)',
    },
    aurora: {
      bg: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.12)]',
      accent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      name: 'Aurora Eclipse',
      foil: 'linear-gradient(135deg, rgba(16,185,129,0.4) 0%, rgba(139,92,246,0.4) 50%, rgba(139,92,246,0) 100%)',
    },
    terminal: {
      bg: 'bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900',
      border: 'border-green-500/40',
      text: 'text-green-400',
      glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
      accent: 'bg-green-500/10 text-green-400 border-green-500/20',
      name: 'Retro Terminal',
      foil: 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(59,130,246,0.3) 50%, rgba(59,130,246,0) 100%)',
    }
  };

  const handleExport = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTheme = badgeThemes[pass.style];

  return (
    <div className="relative p-4 sm:p-6 text-white max-w-7xl mx-auto w-full min-h-[85vh]">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/45 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-wider mb-4">
          <Layers className="w-3.5 h-3.5" />
          HOLOGRAPHIC CREDENTIAL LAB
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Dynamic Hacker Badge Customizer
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto font-sans">
          Construct your official CodeStorm 2026 hacker badge. Customize foil textures, roles, and project specs to save your credential.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Customize Fields panel */}
        <div className="lg:col-span-5 glass-panel rounded-2xl border-white/[0.04] p-6 flex flex-col gap-5">
          <h3 className="font-display text-lg font-medium text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Hacker Parameters
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed -mt-1">
            Input your programmer coordinates to configure your holographic pass structure.
          </p>

          <hr className="border-white/5" />

          {/* Name input */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-1.5">
              HACKER DISPLAY NAME
            </label>
            <input
              type="text"
              value={pass.name}
              onChange={(e) => onUpdatePass({ ...pass, name: e.target.value })}
              placeholder="e.g. Satoshi Nakamoto"
              className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-1.5">
              PRIMARY SPECIALIZATION
            </label>
            <input
              type="text"
              value={pass.role}
              onChange={(e) => onUpdatePass({ ...pass, role: e.target.value })}
              placeholder="e.g. Pixel Architect, AI Whisperer, Audio Sorcerer"
              className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Discord and Team handles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-1.5">
                DISCORD ALIAS
              </label>
              <input
                type="text"
                value={pass.discord}
                onChange={(e) => onUpdatePass({ ...pass, discord: e.target.value })}
                placeholder="e.g. sato#1337"
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-1.5">
                TEAM NAME (1-6)
              </label>
              <input
                type="text"
                value={pass.teamName}
                onChange={(e) => onUpdatePass({ ...pass, teamName: e.target.value })}
                placeholder="e.g. ZeroLag Crew"
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Selected project */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-1.5">
              COMMITTED HACKATHON PROJECT
            </label>
            <input
              type="text"
              value={pass.projectTitle || ''}
              onChange={(e) => onUpdatePass({ ...pass, projectTitle: e.target.value })}
              placeholder="Ideate via the 'AI Idea Stormer' or write your own"
              className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Theme customizer */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-2">
              FOIL CHROMATIC SPECTRUM
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(badgeThemes) as BadgeStyle[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdatePass({ ...pass, style: st })}
                  className={`px-3 py-2 rounded-xl text-xs font-sans text-left border flex items-center justify-between transition-all cursor-pointer ${
                    pass.style === st
                      ? 'bg-white/10 border-cyan-500/50 text-white'
                      : 'bg-slate-950/40 border-white/[0.04] text-slate-500 hover:border-white/10'
                  }`}
                >
                  <span>{badgeThemes[st].name}</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st === 'cyberpunk' ? '#06b6d4' : st === 'obsidian' ? '#71717a' : st === 'aurora' ? '#10b981' : '#22c55e' }}></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic tilting credential */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4">
          <div className="perspective-[1000px] w-full flex justify-center">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: 'preserve-3d',
              }}
              className={`w-72 sm:w-80 h-[480px] rounded-3xl ${currentTheme.bg} border-2 ${currentTheme.border} ${currentTheme.glow} p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ease-out select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
            >
              {/* Foil glow effect overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-300"
                style={{
                  background: currentTheme.foil,
                  opacity: rotateX !== 0 || rotateY !== 0 ? 0.65 : 0.25,
                  backgroundPosition: `${shineX}% ${shineY}%`,
                }}
              />

              {/* Grid decorative backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

              {/* Top Banner Header */}
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="block text-[8px] font-mono tracking-widest text-slate-500 uppercase">
                    OFFICIAL MEMBER
                  </span>
                  <span className={`block text-[11px] font-mono tracking-wider font-semibold ${currentTheme.text} mt-0.5`}>
                    CODESTORM // 2026
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 py-1 px-2.5 rounded-lg border border-white/5 font-bold">
                    HACKER
                  </span>
                </div>
              </div>

              {/* Chip illustration */}
              <div className="relative z-10 flex justify-between items-center mt-6">
                <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-600 opacity-80 border border-yellow-400/30 flex flex-col justify-between p-1.5">
                  <div className="h-px bg-yellow-950/30 w-full" />
                  <div className="h-px bg-yellow-950/30 w-full" />
                  <div className="h-px bg-yellow-950/30 w-full" />
                </div>
                <div className="text-right font-mono text-[8px] text-slate-500">
                  ID: #{pass.badgeId}
                </div>
              </div>

              {/* Main Hacker Info */}
              <div className="relative z-10 my-auto flex flex-col justify-center">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  PARTICIPANT NAME
                </span>
                <span className="block font-display text-2xl font-bold text-white tracking-tight leading-none mt-1 truncate max-w-full">
                  {pass.name || 'Satoshi'}
                </span>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                      SPECIALTY
                    </span>
                    <span className={`block text-xs font-display font-medium text-slate-200 mt-1 truncate`}>
                      {pass.role || 'General Maker'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                      TEAM ASSIGNED
                    </span>
                    <span className="block text-xs font-display font-medium text-slate-200 mt-1 truncate">
                      {pass.teamName || 'Solo Operator'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.04]">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                    TARGET BLUEPRINT
                  </span>
                  <span className="block text-xs font-sans text-slate-300 italic mt-0.5 truncate">
                    &quot;{pass.projectTitle || 'Formulating Idea...'}&quot;
                  </span>
                </div>
              </div>

              {/* Barcode and bottom details */}
              <div className="relative z-10 flex justify-between items-end border-t border-white/[0.04] pt-4 mt-2">
                <div>
                  <span className="block text-[8px] font-mono text-slate-500">
                    DISCORD HANDLE:
                  </span>
                  <span className="block text-[10px] font-mono text-slate-300 mt-0.5">
                    {pass.discord || 'unverified#0000'}
                  </span>
                </div>
                
                {/* Simulated high-tech custom QR vector */}
                <div className="w-10 h-10 bg-white p-1 rounded-lg shrink-0 select-none">
                  <div className="w-full h-full bg-slate-950 flex flex-col justify-between p-0.5">
                    <div className="flex justify-between">
                      <span className="w-2 h-2 bg-white rounded-sm" />
                      <span className="w-2 h-2 bg-white rounded-sm" />
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="w-1 h-1 bg-white rounded-full" />
                      <span className="w-2 h-2 bg-white rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-8 w-full max-w-sm justify-center">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-slate-950 font-display font-semibold text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_4px_15px_rgba(6,182,212,0.25)]"
            >
              <Save className="w-4 h-4" />
              {copied ? 'Badge Details Cached!' : 'Generate Virtual Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
