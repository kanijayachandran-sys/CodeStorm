import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, MessageSquare, Tag, Check, Calendar, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { LobbyPost, HackerPass, ProjectIdea } from '../types';

export default function Lobby({ pass, onApplyProject }: { 
  pass: HackerPass;
  onApplyProject: (title: string) => void;
}) {
  const [posts, setPosts] = useState<LobbyPost[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [pitchTitle, setPitchTitle] = useState<string>('');
  const [pitchDesc, setPitchDesc] = useState<string>('');
  const [pitchCategory, setPitchCategory] = useState<string>('AI-powered web utilities');
  const [pitchMaxMembers, setPitchMaxMembers] = useState<number>(4);

  // Load from LocalStorage or seed initial mock listings
  useEffect(() => {
    const saved = localStorage.getItem('codestorm_lobby');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
        return;
      } catch (e) {
        console.warn("Failed to load lobby", e);
      }
    }

    // Pre-seed some extremely impressive mock postings
    const initialSeed: LobbyPost[] = [
      {
        id: 'mock-1',
        author: 'Alice Spark',
        discord: 'alice_spark#4421',
        role: '3D Graphics Sorceress',
        title: 'Cosmic Fluid Shader Board',
        description: 'Building an interactive 3D particle shader space that generates customizable lo-fi celestial waves based on real-time mouse acceleration and scroll speeds.',
        category: 'Creative frontend experiments',
        size: 3,
        maxMembers: 5,
        members: ['Alice Spark', 'NeoCode', 'WaveMaker'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
      },
      {
        id: 'mock-2',
        author: 'Satoshi Dev',
        discord: 'satoshi#0021',
        role: 'Web Audio Architect',
        title: 'Interactive Physics Synthesizer',
        description: 'A browser game where players drop bouncing elements into gravity rings, generating procedural ambient melodies. Need designers and sound engineers.',
        category: 'Browser-based games',
        size: 2,
        maxMembers: 3,
        members: ['Satoshi Dev', 'AeroSynth'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
      },
      {
        id: 'mock-3',
        author: 'Hana AI',
        discord: 'hanacoder#8891',
        role: 'AI Product Whisperer',
        title: 'Contextual Prompt Sandbox',
        description: 'A productivity interface that auto-structures code schemas, utilizing custom animations and side-by-side smart editor canvases that feel completely alive.',
        category: 'AI-powered web utilities',
        size: 1,
        maxMembers: 4,
        members: ['Hana AI'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
      }
    ];

    setPosts(initialSeed);
    localStorage.setItem('codestorm_lobby', JSON.stringify(initialSeed));
  }, []);

  const savePosts = (updated: LobbyPost[]) => {
    setPosts(updated);
    localStorage.setItem('codestorm_lobby', JSON.stringify(updated));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchTitle.trim() || !pitchDesc.trim()) return;

    const newPost: LobbyPost = {
      id: `post-${Date.now()}`,
      author: pass.name || 'Anonymous Hacker',
      discord: pass.discord || 'unverified#0000',
      role: pass.role || 'Full-Stack Developer',
      title: pitchTitle,
      description: pitchDesc,
      category: pitchCategory,
      size: 1,
      maxMembers: pitchMaxMembers,
      members: [pass.name || 'Anonymous Hacker'],
      createdAt: new Date().toISOString()
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Reset Form
    setPitchTitle('');
    setPitchDesc('');
    setShowAddForm(false);
  };

  const handleJoinTeam = (postId: string) => {
    const hackerName = pass.name || 'Anonymous Hacker';
    
    const updated = posts.map(post => {
      if (post.id === postId) {
        // Prevent duplicate joining
        if (post.members.includes(hackerName)) return post;
        // Check capacity
        if (post.members.length >= post.maxMembers) return post;
        
        return {
          ...post,
          size: post.members.length + 1,
          members: [...post.members, hackerName]
        };
      }
      return post;
    });

    savePosts(updated);
  };

  const handleLeaveTeam = (postId: string) => {
    const hackerName = pass.name || 'Anonymous Hacker';

    const updated = posts.map(post => {
      if (post.id === postId) {
        if (!post.members.includes(hackerName)) return post;
        // Don't leave if you are the owner (first member)
        if (post.members[0] === hackerName) return post;

        return {
          ...post,
          size: post.members.length - 1,
          members: post.members.filter(m => m !== hackerName)
        };
      }
      return post;
    });

    savePosts(updated);
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
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/45 border border-violet-500/20 text-violet-400 text-xs font-mono tracking-wider mb-4">
          <Users className="w-3.5 h-3.5" />
          MATCHMAKING LOBBY
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Virtual Matching Hub &amp; Idea Board
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto font-sans">
          Propose your next-generation tech pitches, recruit other hackers, or join active squads to construct dynamic projects together.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <span className="font-mono text-xs text-slate-500">
          SHOWING {posts.length} ACTIVE TEAM LISTINGS
        </span>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-slate-950 font-display font-semibold text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Pitch Your Project Idea
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-10"
          >
            <form 
              onSubmit={handleCreatePost}
              className="glass-panel rounded-2xl border-white/[0.04] p-6 flex flex-col gap-5 max-w-3xl mx-auto"
            >
              <h3 className="font-display text-lg font-medium text-slate-100">Post Team Request</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-1.5">
                    PROJECT TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={pitchTitle}
                    onChange={(e) => setPitchTitle(e.target.value)}
                    placeholder="e.g. Neo-Wave Synthesizer"
                    className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-1.5">
                    PROJECT CATEGORY
                  </label>
                  <select
                    value={pitchCategory}
                    onChange={(e) => setPitchCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider mb-1.5">
                  SHORT CONCEPT PITCH
                </label>
                <textarea
                  required
                  value={pitchDesc}
                  onChange={(e) => setPitchDesc(e.target.value)}
                  placeholder="Describe your project, features, what stacks you intend to use, and who you are looking to team with..."
                  rows={3}
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">MAX TEAM MEMBERS</span>
                    <span className="text-violet-400 font-bold">{pitchMaxMembers} maximum</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={pitchMaxMembers}
                    onChange={(e) => setPitchMaxMembers(Number(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-slate-950 font-display font-semibold transition-colors cursor-pointer text-sm"
                  >
                    Publish Pitch
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post) => {
          const isMember = post.members.includes(pass.name || 'Anonymous Hacker');
          const isFull = post.members.length >= post.maxMembers;
          const isOwner = post.members[0] === (pass.name || 'Anonymous Hacker');

          return (
            <div
              key={post.id}
              className="glass-panel rounded-2xl border-white/[0.04] p-5 flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300 relative group"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3.5">
                  <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-mono tracking-wider border border-violet-500/20 truncate max-w-[200px]">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-slate-100 group-hover:text-violet-400 transition-colors duration-200">
                  {post.title}
                </h4>

                <p className="text-slate-400 text-xs mt-2.5 leading-relaxed line-clamp-3">
                  {post.description}
                </p>

                <hr className="border-white/5 my-4" />

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Founded by:</span>
                    <span className="text-slate-300 font-medium font-sans">
                      {post.author} ({post.role})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Squad List ({post.members.length}/{post.maxMembers}):</span>
                    <span className="text-slate-300 font-mono text-[11px] truncate max-w-[180px]">
                      {post.members.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-5 pt-4 border-t border-white/5">
                {isMember ? (
                  <button
                    onClick={() => handleLeaveTeam(post.id)}
                    disabled={isOwner}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans transition-colors cursor-pointer ${
                      isOwner
                        ? 'bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed'
                        : 'bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isOwner ? 'Leader (Cannot Leave)' : 'Leave Team'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinTeam(post.id)}
                    disabled={isFull}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans transition-colors cursor-pointer ${
                      isFull
                        ? 'bg-slate-900 border border-white/5 text-slate-600 cursor-not-allowed'
                        : 'bg-violet-600 hover:bg-violet-500 text-slate-950 font-semibold'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {isFull ? 'Team Full' : 'Request to Join'}
                  </button>
                )}

                <button
                  onClick={() => onApplyProject(post.title)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white transition-all text-xs cursor-pointer flex items-center justify-center"
                  title="Apply title to your Hacker Badge"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
