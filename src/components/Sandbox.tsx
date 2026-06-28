import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Zap, Flame, Compass, RefreshCw, AudioLines, Settings } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

const PALETTES = {
  cyberpunk: ['#06b6d4', '#8b5cf6', '#ec4899', '#f43f5e', '#a855f7'],
  solar: ['#f97316', '#f59e0b', '#ef4444', '#facc15', '#ea580c'],
  matrix: ['#10b981', '#34d399', '#059669', '#a7f3d0', '#047857'],
  aurora: ['#a855f7', '#6366f1', '#3b82f6', '#14b8a6', '#06b6d4'],
};

export default function Sandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [palette, setPalette] = useState<keyof typeof PALETTES>('cyberpunk');
  const [physicsMode, setPhysicsMode] = useState<'attract' | 'repel' | 'vortex' | 'turbulence'>('attract');
  const [particleCount, setParticleCount] = useState<number>(400);
  const [speed, setSpeed] = useState<number>(1.5);
  const [gravity, setGravity] = useState<number>(1.2);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.2);

  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; isInside: boolean }>({
    x: 0,
    y: 0,
    isDown: false,
    isInside: false,
  });

  // Live Touch & Pointer Sensor Telemetry state
  const [sensorState, setSensorState] = useState<{
    x: number;
    y: number;
    eventType: string;
    isDown: boolean;
    maxTouchPoints: number;
    velocity: number;
    history: { x: number; y: number; velocity: number; time: number }[];
  }>({
    x: 0,
    y: 0,
    eventType: 'IDLE',
    isDown: false,
    maxTouchPoints: typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0,
    velocity: 0,
    history: [],
  });

  const lastEventTimeRef = useRef<number>(Date.now());
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const updateTelemetry = (x: number, y: number, eventType: string, isDown: boolean) => {
    const safeX = isNaN(x) ? 0 : x;
    const safeY = isNaN(y) ? 0 : y;
    const now = Date.now();
    const dt = Math.max(1, now - lastEventTimeRef.current);
    const dx = safeX - lastPosRef.current.x;
    const dy = safeY - lastPosRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let currentVelocity = parseFloat(((dist / dt) * 10).toFixed(2));
    if (isNaN(currentVelocity)) currentVelocity = 0;

    lastEventTimeRef.current = now;
    lastPosRef.current = { x: safeX, y: safeY };

    setSensorState((prev) => {
      const updatedHistory = [
        { x: safeX, y: safeY, velocity: currentVelocity, time: now },
        ...prev.history,
      ].slice(0, 15);

      return {
        x: Math.round(safeX),
        y: Math.round(safeY),
        eventType,
        isDown,
        maxTouchPoints: typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0,
        velocity: currentVelocity,
        history: updatedHistory,
      };
    });
  };

  // Web Audio Context (lazy-loaded to satisfy user gesture policy)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.value = audioVolume;
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSynthNote = (frequency: number, type: 'sine' | 'triangle' | 'sine' = 'sine') => {
    if (!audioEnabled || !audioCtxRef.current || !gainNodeRef.current) return;
    
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const nodeGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Simple ADSR envelope for cozy space sound
      nodeGain.gain.setValueAtTime(0, ctx.currentTime);
      nodeGain.gain.linearRampToValueAtTime(audioVolume, ctx.currentTime + 0.05);
      nodeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(nodeGain);
      nodeGain.connect(gainNodeRef.current);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Synth trigger failed:", e);
    }
  };

  // Trigger shockwave on click
  const triggerShockwave = (cx: number, cy: number) => {
    // Generate synth bell tone based on click Y coordinate
    if (audioEnabled) {
      initAudio();
      const canvas = canvasRef.current;
      if (canvas) {
        const pctY = 1 - cy / canvas.height;
        // Pentatonic scale frequency calculation
        const baseFreq = 146.83; // D3
        const scale = [1, 1.125, 1.25, 1.5, 1.667, 2, 2.25, 2.5, 3, 3.333, 4];
        const noteIndex = Math.floor(pctY * scale.length);
        const freq = baseFreq * (scale[noteIndex] || 1);
        playSynthNote(freq, 'triangle');
      }
    }

    // Explode particles away from click source
    particlesRef.current.forEach((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 10;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 1.5;
        p.vy += Math.sin(angle) * force * 1.5;
        p.size = p.baseSize * 2.5; // Sparkle size expansion
      }
    });
  };

  // Re-generate particles
  const regenerateParticles = (width: number, height: number, forceClear = false) => {
    const currentCount = particlesRef.current.length;
    const colors = PALETTES[palette];

    if (forceClear) {
      particlesRef.current = [];
    }

    const target = particleCount;
    if (particlesRef.current.length < target) {
      const countToAdd = target - particlesRef.current.length;
      for (let i = 0; i < countToAdd; i++) {
        const baseSize = Math.random() * 3 + 1;
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          baseSize,
          size: baseSize,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.3,
          decay: Math.random() * 0.002 + 0.001,
        });
      }
    } else if (particlesRef.current.length > target) {
      particlesRef.current = particlesRef.current.slice(0, target);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing beautifully
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      regenerateParticles(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Main animation Loop
    let animationId: number;

    const tick = () => {
      const colors = PALETTES[palette];
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Draw faint dark backing with trails
      ctx.fillStyle = 'rgba(11, 16, 27, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // Keep particles counts in check
      if (particlesRef.current.length !== particleCount) {
        regenerateParticles(width, height);
      }

      particlesRef.current.forEach((p) => {
        // Friction / drag
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Apply mouse physics interaction
        const m = mouseRef.current;
        if (m.isInside) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 320) {
            const force = (320 - dist) / 320;
            const angle = Math.atan2(dy, dx);

            if (physicsMode === 'attract') {
              p.vx += Math.cos(angle) * force * gravity * 0.45;
              p.vy += Math.sin(angle) * force * gravity * 0.45;
            } else if (physicsMode === 'repel') {
              p.vx -= Math.cos(angle) * force * gravity * 0.55;
              p.vy -= Math.sin(angle) * force * gravity * 0.55;
            } else if (physicsMode === 'vortex') {
              // Add perpendicular forces
              p.vx += Math.sin(angle) * force * gravity * 0.65;
              p.vy -= Math.cos(angle) * force * gravity * 0.65;
            }
          }
        }

        // Apply general turbulence/noise mode
        if (physicsMode === 'turbulence') {
          p.vx += (Math.sin(p.y * 0.015) + Math.cos(p.x * 0.015)) * 0.08 * speed;
          p.vy += (Math.cos(p.y * 0.015) + Math.sin(p.x * 0.015)) * 0.08 * speed;
        }

        // Base motion
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        // Decay size adjustments
        if (p.size > p.baseSize) {
          p.size -= 0.08;
        }

        // Boundary checks (warp around or bounce gently)
        if (p.x < 0) {
          p.x = width;
        } else if (p.x > width) {
          p.x = 0;
        }

        if (p.y < 0) {
          p.y = height;
        } else if (p.y > height) {
          p.y = 0;
        }

        // Color updates if color palette changed
        if (!colors.includes(p.color)) {
          p.color = colors[Math.floor(Math.random() * colors.length)];
        }

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Dynamic glow based on speed
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const glowRadius = Math.min(25, currentSpeed * 2.5);
        ctx.shadowBlur = glowRadius;
        ctx.shadowColor = p.color;
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      });

      // Draw cursor connections
      const m = mouseRef.current;
      if (m.isInside && (physicsMode === 'attract' || physicsMode === 'vortex')) {
        particlesRef.current.forEach((p) => {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = (100 - dist) / 130;
            ctx.globalAlpha = (100 - dist) / 100 * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        });
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [palette, physicsMode, particleCount, speed, gravity]);

  // Handle audio state updates
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = audioVolume;
    }
  }, [audioVolume]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    mouseRef.current.x = cx;
    mouseRef.current.y = cy;
    
    // Smooth note glide when holding down mouse
    if (mouseRef.current.isDown && audioEnabled && Math.random() < 0.15) {
      const pctX = cx / rect.width;
      const freq = 200 + pctX * 600;
      playSynthNote(freq, 'sine');
    }
    updateTelemetry(cx, cy, 'mousemove', mouseRef.current.isDown);
  };

  const handleMouseEnter = () => {
    mouseRef.current.isInside = true;
    setSensorState((prev) => ({ ...prev, eventType: 'mouseenter' }));
  };

  const handleMouseLeave = () => {
    mouseRef.current.isInside = false;
    mouseRef.current.isDown = false;
    setSensorState((prev) => ({ ...prev, isDown: false, eventType: 'mouseleave' }));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.isDown = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    triggerShockwave(cx, cy);
    updateTelemetry(cx, cy, 'mousedown', true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.isDown = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    updateTelemetry(cx, cy, 'mouseup', false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    mouseRef.current.isInside = true;
    mouseRef.current.isDown = true;
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches[0].clientX - rect.left;
    const cy = e.touches[0].clientY - rect.top;
    mouseRef.current.x = cx;
    mouseRef.current.y = cy;
    triggerShockwave(cx, cy);
    updateTelemetry(cx, cy, 'touchstart', true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches[0].clientX - rect.left;
    const cy = e.touches[0].clientY - rect.top;
    mouseRef.current.x = cx;
    mouseRef.current.y = cy;
    
    if (audioEnabled && Math.random() < 0.25) {
      const pctX = cx / rect.width;
      const freq = 220 + pctX * 660;
      playSynthNote(freq, 'sine');
    }
    updateTelemetry(cx, cy, 'touchmove', true);
  };

  const handleTouchEnd = () => {
    mouseRef.current.isInside = false;
    mouseRef.current.isDown = false;
    setSensorState((prev) => ({ ...prev, isDown: false, eventType: 'touchend' }));
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col xl:flex-row gap-6 p-4 sm:p-6 text-white max-w-7xl mx-auto w-full">
      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative glass-panel rounded-2xl border-white/[0.04] overflow-hidden min-h-[450px] sm:min-h-[600px] flex flex-col group cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="absolute inset-0 w-full h-full block bg-slate-950"
        />

        {/* Ambient overlay guide */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none font-mono text-[11px] text-cyan-400 bg-slate-950/70 py-1.5 px-3 rounded-lg border border-cyan-500/20 backdrop-blur-md">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2"></span>
          PHYSICS SIMULATOR // CLICK/TAP & DRAG TO DISRUPT FIELD
        </div>

        {/* Bottom instructions */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:block font-sans text-xs text-slate-400 max-w-sm bg-slate-950/70 p-3 rounded-xl border border-white/5 backdrop-blur-md">
          <p className="font-semibold text-slate-200 mb-0.5">Website "Feels Alive" Metric:</p>
          <p className="leading-relaxed text-slate-400">High-performance canvas loops, cursor field integration, and Web Audio synths. Demonstrating sensory web feedback.</p>
        </div>
      </div>

      {/* Control Panel Panel */}
      <div className="w-full xl:w-96 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl border-white/[0.04] p-6 flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-100 flex items-center gap-2">
              <Settings className="w-6 h-6 text-cyan-400" />
              Quantum Sandbox
            </h2>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
              Experiment with dynamic vector loops, particle gravity forces, and custom synthesizer modules.
            </p>
          </div>

          <hr className="border-white/5" />

          {/* Mode Selector */}
          <div>
            <span className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-2.5">
              PHYSICS MODE
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'attract', label: 'Gravity Well', icon: Zap, color: 'text-cyan-400 bg-cyan-500/10' },
                { id: 'repel', label: 'Deflect Field', icon: Flame, color: 'text-rose-400 bg-rose-500/10' },
                { id: 'vortex', label: 'Vortex Cyclo', icon: Compass, color: 'text-violet-400 bg-violet-500/10' },
                { id: 'turbulence', label: 'Solar Winds', icon: RefreshCw, color: 'text-emerald-400 bg-emerald-500/10' },
              ].map((m) => {
                const Icon = m.icon;
                const active = physicsMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPhysicsMode(m.id as any)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-sans transition-all duration-300 cursor-pointer ${
                      active
                        ? 'bg-white/10 border-cyan-500/40 text-cyan-400'
                        : 'bg-slate-950/40 border-white/[0.04] text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <span className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-2.5">
              SPECTRUM PROFILE
            </span>
            <div className="flex gap-2">
              {(Object.keys(PALETTES) as Array<keyof typeof PALETTES>).map((p) => (
                <button
                  key={p}
                  onClick={() => setPalette(p)}
                  className={`flex-1 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 capitalize text-sm cursor-pointer ${
                    palette === p
                      ? 'bg-white/10 border-cyan-500/40 text-cyan-400'
                      : 'bg-slate-950/40 border-white/[0.04] text-slate-400 hover:border-white/10'
                  }`}
                >
                  <div className="flex gap-1">
                    {PALETTES[p].slice(0, 3).map((col, idx) => (
                      <span key={idx} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }}></span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Sliders */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">PARTICLE FLUIDITY</span>
                <span className="text-cyan-400 font-bold">{particleCount} units</span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="50"
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">GRAVITY MAGNITUDE</span>
                <span className="text-cyan-400 font-bold">{gravity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={gravity}
                onChange={(e) => setGravity(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">DRIFT SPEED MULTIPLIER</span>
                <span className="text-cyan-400 font-bold">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Synthesizer audio switch */}
          <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${audioEnabled ? 'bg-cyan-500/10 text-cyan-400 animate-pulse' : 'bg-slate-900 text-slate-500'}`}>
                <AudioLines className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-display font-medium text-slate-200">
                  Interactive Audio Synth
                </span>
                <span className="block text-xs text-slate-500 font-sans mt-0.5">
                  Play spatial synth bell chimes on interaction
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if (!audioEnabled) {
                  initAudio();
                }
                setAudioEnabled(!audioEnabled);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer border transition-all ${
                audioEnabled
                  ? 'bg-cyan-900/35 border-cyan-500/40 text-cyan-400'
                  : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10'
              }`}
            >
              {audioEnabled ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>

          <hr className="border-white/5" />

          {/* Pro Touch Sensor Diagnostic Board */}
          <div className="bg-slate-950/80 rounded-2xl border border-white/[0.08] p-4 font-mono text-[11px] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-cyan-400 font-bold tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                TOUCH/POINTER SENSOR
              </span>
              <span className="text-white/40 uppercase text-[9px]">Live Diagnostic Feed</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
              <div>
                <span className="text-white/40 block">EVENT TYPE</span>
                <span className="text-slate-200 font-semibold text-xs capitalize">
                  {sensorState.eventType}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">CONTACT STATE</span>
                <span className={`font-bold text-xs ${sensorState.isDown ? 'text-green-400' : 'text-amber-500'}`}>
                  {sensorState.isDown ? 'ACTIVE CONTACT' : 'RELEASED'}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">COORDINATES</span>
                <span className="text-slate-200 font-semibold text-xs">
                  X: {sensorState.x}px // Y: {sensorState.y}px
                </span>
              </div>
              <div>
                <span className="text-white/40 block">VELOCITY RATE</span>
                <span className="text-slate-200 font-semibold text-xs">
                  {sensorState.velocity} pt/ms
                </span>
              </div>
            </div>

            {/* Oscilloscope/Signal Wave Graph of Interactive Speed History */}
            <div className="mt-3">
              <div className="flex justify-between text-[9px] text-white/40 mb-1">
                <span>INTERACTION IMPULSE PROFILE</span>
                <span>{sensorState.maxTouchPoints > 0 ? `TOUCH CAPABLE (${sensorState.maxTouchPoints}PT)` : 'MOUSE DRIVEN'}</span>
              </div>
              <div className="h-16 bg-slate-950 rounded-lg border border-white/5 flex items-end overflow-hidden relative">
                {/* SVG Live Line chart representing touch/pointer velocities */}
                <svg className="w-full h-full absolute inset-0 text-cyan-500" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {sensorState.history.length > 1 && (
                    <path
                      d={`M ${sensorState.history.map((pt, i) => {
                        const divisor = sensorState.history.length > 1 ? sensorState.history.length - 1 : 1;
                        const rawX = (i / divisor) * 100;
                        const rawY = 40 - Math.min(38, (pt.velocity / 30) * 35);
                        const xPos = isNaN(rawX) ? 0 : rawX;
                        const yPos = isNaN(rawY) ? 40 : rawY;
                        return `${xPos},${yPos}`;
                      }).join(' L ')}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="transition-all duration-300"
                    />
                  )}
                  {sensorState.history.map((pt, i) => {
                    const divisor = sensorState.history.length > 1 ? sensorState.history.length - 1 : 1;
                    const rawX = (i / divisor) * 100;
                    const rawY = 40 - Math.min(38, (pt.velocity / 30) * 35);
                    const xPos = isNaN(rawX) ? 0 : rawX;
                    const yPos = isNaN(rawY) ? 40 : rawY;
                    return (
                      <circle
                        key={i}
                        cx={xPos}
                        cy={yPos}
                        r="1.5"
                        className="text-fuchsia-400 fill-current"
                      />
                    );
                  })}
                </svg>
                {/* Visual grid backing */}
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 pointer-events-none opacity-[0.03]">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="border-b border-r border-white"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
