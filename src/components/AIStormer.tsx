import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, BrainCircuit, Code, Milestone, Radio, Star, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { ProjectIdea } from '../types';

export default function AIStormer({ onSelectIdea, onPostToLobby }: { 
  onSelectIdea: (idea: ProjectIdea) => void;
  onPostToLobby: (idea: ProjectIdea) => void;
}) {
  const [category, setCategory] = useState<string>('AI-powered web utilities');
  const [keywords, setKeywords] = useState<string>('');
  const [teamSize, setTeamSize] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [starredIds, setStarredIds] = useState<string[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWarning(null);
    setIdeas([]);

    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, keywords, teamSize }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.ideas)) {
        setIdeas(data.ideas);
        if (data.warning) {
          setWarning(data.warning);
        }
      } else {
        throw new Error(data.error || 'Failed to generate project suggestions.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connecting to Gemini API failed. Please ensure the backend is running with a valid GEMINI_API_KEY.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = (id: string) => {
    setStarredIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const CATEGORIES = [
    'AI-powered web utilities',
    'Interactive websites',
    'Productivity applications',
    'Creative frontend experiments',
    'Browser-based games',
    'Real-time web applications'
  ];

  return (
    <div className="relative p-4 sm:p-6 text-white max-w-7xl mx-auto w-full min-h-[85vh]">
      {/* Background decorations */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/45 border border-violet-500/20 text-violet-400 text-xs font-mono tracking-wider mb-4">
          <BrainCircuit className="w-3.5 h-3.5" />
          AI IDEATION SUITE
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          AI Co-Captain &amp; Idea Stormer
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-sans">
          Brainstorm groundbreaking visual hackathon pitches with Gemini. Generate customized concepts that center responsive, sensory layouts to make your project stand out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel */}
        <form 
          onSubmit={handleGenerate}
          className="lg:col-span-4 glass-panel rounded-2xl border-white/[0.04] p-6 flex flex-col gap-6"
        >
          <div>
            <h3 className="font-display text-lg font-medium text-slate-100">Configure Sandbox</h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">Customize your focus vertical to construct ideal blueprints.</p>
          </div>

          <hr className="border-white/5" />

          {/* Focus Category */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-2">
              HACKATHON CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-2">
              CONCEPT KEYWORDS (OPTIONAL)
            </label>
            <textarea
              placeholder="e.g. ambient space ambient noise, visual retro wave synthesizers, modular task calendars"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-white/[0.08] rounded-xl p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {/* Team Size */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">TARGET TEAM MEMBERS</span>
              <span className="text-violet-400 font-bold">{teamSize} programmers</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-slate-950 font-display font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Consulting Mentor...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Creative Blueprints
              </>
            )}
          </button>
        </form>

        {/* Results panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel rounded-2xl border-white/[0.04] p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-t-2 border-violet-500 animate-spin"></div>
                  <BrainCircuit className="w-8 h-8 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h4 className="font-display text-lg font-medium text-slate-200">Analyzing Month 2 Dynamics</h4>
                <p className="text-slate-500 text-sm mt-1.5 max-w-sm">
                  Synthesizing next-gen mechanics, interactive Web Audio ideas, and performance roadmap strategies with Gemini-3.5-flash.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/35 rounded-2xl p-6 flex gap-4 items-start"
              >
                <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-medium text-red-200">Ideation Stalled</h4>
                  <p className="text-red-400/80 text-sm mt-1.5 leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}

            {!loading && !error && ideas.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel rounded-2xl border-white/[0.04] p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <BrainCircuit className="w-12 h-12 text-slate-700 mb-4" />
                <h4 className="font-display text-base font-medium text-slate-400">Your Hackathon Board is Empty</h4>
                <p className="text-slate-600 text-sm mt-1 max-w-xs leading-relaxed">
                  Select a hackathon category, enter potential concepts, and run the simulator to view outstanding interactive layouts.
                </p>
              </motion.div>
            )}

            {!loading && ideas.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                {warning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex gap-4 items-start"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-200">System Fallback Mode</h4>
                      <p className="text-amber-300/80 text-xs mt-1 leading-relaxed font-mono">{warning}</p>
                    </div>
                  </motion.div>
                )}

                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-2xl border-white/[0.04] p-6 hover:border-violet-500/30 transition-all duration-300 relative group"
                  >
                    {/* Star Button */}
                    <button
                      onClick={() => toggleStar(idea.id)}
                      className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-900 border border-white/5 cursor-pointer text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                      <Star className={`w-4 h-4 ${starredIds.includes(idea.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </button>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-mono tracking-wider uppercase border border-violet-500/20">
                        {idea.category}
                      </span>
                    </div>

                    <h4 className="font-display text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-violet-400 transition-colors duration-200">
                      {idea.title}
                    </h4>
                    
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                      {idea.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5">
                      {/* Features */}
                      <div>
                        <span className="flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-3">
                          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                          Key Features
                        </span>
                        <ul className="space-y-1.5 text-slate-400 text-xs leading-relaxed">
                          {idea.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-violet-400 mt-1">•</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Make it feel alive */}
                      <div className="bg-cyan-950/20 border border-cyan-500/10 rounded-xl p-4">
                        <span className="flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-2.5">
                          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          SENSORY &quot;ALIVE&quot; FEEDBACK
                        </span>
                        <ul className="space-y-1.5 text-slate-300 text-xs leading-relaxed">
                          {idea.aliveEnhancements.map((enh, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-cyan-400 mt-1">→</span>
                              <span>{enh}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Tech Stack */}
                      <div>
                        <span className="flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2">
                          <Code className="w-3.5 h-3.5 text-slate-500" />
                          Recommended Stack
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {idea.techStack.map((tech, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-slate-900 border border-white/5 text-[10px] font-mono text-slate-400">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Rapid Timeline */}
                      <div>
                        <span className="flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2">
                          <Milestone className="w-3.5 h-3.5 text-slate-500" />
                          Rapid Prototyping Timeline
                        </span>
                        <ol className="space-y-1 text-slate-400 text-xs">
                          {idea.roadmap.map((step, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="font-mono text-[10px] text-violet-400 font-bold">0{i+1}</span>
                              <span className="truncate">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/5">
                      <button
                        onClick={() => onSelectIdea(idea)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-slate-950 font-display font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Select for Hacker Pass
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onPostToLobby(idea)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 font-display text-xs transition-colors cursor-pointer"
                      >
                        Post in Lobby (Find Team)
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
