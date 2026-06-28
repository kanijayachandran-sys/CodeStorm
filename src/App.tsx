import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Instagram, Globe, Layout, Cpu, BrainCircuit, Users, Award, Menu, X } from 'lucide-react';
import Hero from './components/Hero';
import Sandbox from './components/Sandbox';
import AIStormer from './components/AIStormer';
import PassGenerator from './components/PassGenerator';
import Lobby from './components/Lobby';
import { HackerPass, ProjectIdea, LobbyPost } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('portal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [pass, setPass] = useState<HackerPass>({
    badgeId: 'CS2026-X8',
    name: '',
    role: '',
    discord: '',
    teamName: '',
    style: 'cyberpunk',
    projectTitle: '',
    joinedAt: new Date().toLocaleDateString(),
  });

  // Load pass on init
  useEffect(() => {
    const saved = localStorage.getItem('codestorm_pass');
    if (saved) {
      try {
        setPass(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load pass', e);
      }
    } else {
      // Generate random badge ID
      const randId = `CS2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const initialPass = { ...pass, badgeId: randId };
      setPass(initialPass);
      localStorage.setItem('codestorm_pass', JSON.stringify(initialPass));
    }
  }, []);

  const handleUpdatePass = (updated: HackerPass) => {
    setPass(updated);
    localStorage.setItem('codestorm_pass', JSON.stringify(updated));
  };

  const handleSelectIdeaForPass = (idea: ProjectIdea) => {
    const updated = { ...pass, projectTitle: idea.title };
    setPass(updated);
    localStorage.setItem('codestorm_pass', JSON.stringify(updated));
    setActiveTab('pass');
  };

  const handlePostIdeaToLobby = (idea: ProjectIdea) => {
    // Read current lobby posts
    const saved = localStorage.getItem('codestorm_lobby');
    let posts: LobbyPost[] = [];
    if (saved) {
      try {
        posts = JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load posts', e);
      }
    }

    const newPost: LobbyPost = {
      id: `post-${Date.now()}`,
      author: pass.name || 'Anonymous Hacker',
      discord: pass.discord || 'unverified#0000',
      role: pass.role || 'Full-Stack Developer',
      title: idea.title,
      description: idea.description,
      category: idea.category,
      size: 1,
      maxMembers: 4,
      members: [pass.name || 'Anonymous Hacker'],
      createdAt: new Date().toISOString()
    };

    posts = [newPost, ...posts];
    localStorage.setItem('codestorm_lobby', JSON.stringify(posts));
    setActiveTab('lobby');
  };

  const handleApplyLobbyProjectToPass = (projectTitle: string) => {
    const updated = { ...pass, projectTitle };
    setPass(updated);
    localStorage.setItem('codestorm_pass', JSON.stringify(updated));
    setActiveTab('pass');
  };

  const menuItems = [
    { id: 'portal', label: 'Portal Home', icon: Layout },
    { id: 'sandbox', label: 'Quantum Sandbox', icon: Cpu },
    { id: 'stormer', label: 'AI Idea Stormer', icon: BrainCircuit },
    { id: 'pass', label: 'Hacker Pass', icon: Award },
    { id: 'lobby', label: 'Team Matching', icon: Users },
  ];

  return (
    <div className="min-h-screen frosted-bg text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative">
      {/* Background dot pattern */}
      <div className="absolute inset-0 frosted-dot-pattern opacity-30 pointer-events-none z-0" />

      {/* Global Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/[0.04] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('portal')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-slate-950 animate-pulse" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                CODESTORM
              </span>
              <span className="block text-[8px] font-mono text-cyan-400 tracking-widest mt-0.5">
                MONTH 2 // ACTIVE
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-white/[0.04]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                    active
                      ? 'bg-white/10 text-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Area (Status info) */}
          <div className="hidden lg:flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-500">
              USER: <span className="text-slate-300 font-bold">{pass.name || 'GUEST'}</span>
            </span>
            <div className="h-4 w-px bg-white/10" />
            <button
              onClick={() => setActiveTab('pass')}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono hover:bg-cyan-900/30 transition-colors cursor-pointer"
            >
              ID: #{pass.badgeId}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-[69px] left-0 right-0 z-40 bg-slate-950/95 border-b border-white/[0.04] p-4 backdrop-blur-lg"
          >
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-all cursor-pointer ${
                      active
                        ? 'bg-white/10 text-cyan-400 font-medium'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'portal' && <Hero onNavigate={(tab) => setActiveTab(tab)} />}
            {activeTab === 'sandbox' && <Sandbox />}
            {activeTab === 'stormer' && (
              <AIStormer 
                onSelectIdea={handleSelectIdeaForPass}
                onPostToLobby={handlePostIdeaToLobby}
              />
            )}
            {activeTab === 'pass' && (
              <PassGenerator 
                pass={pass}
                onUpdatePass={handleUpdatePass}
              />
            )}
            {activeTab === 'lobby' && (
              <Lobby 
                pass={pass}
                onApplyProject={handleApplyLobbyProjectToPass}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <footer className="relative z-10 glass-panel border-t border-white/[0.04] py-12 px-4 sm:px-6 mt-16 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-display font-bold text-slate-300">CODESTORM 2026</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              A multi-month creative web engineering hackathon blitz. Join official workspaces, experiment with dynamic technologies, and build tomorrow's layouts.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Navigation Channels</span>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Connect Channels</span>
            <div className="flex flex-col gap-2 text-xs">
              <a 
                href="https://discord.gg/codestorm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors group"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                Join CodeStorm Discord
              </a>
              <a 
                href="https://instagram.com/code_storm_hackathon" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-violet-400 transition-colors group"
              >
                <Instagram className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 transition-colors" />
                Follow CodeStorm on Instagram
              </a>
              <a 
                href="https://codestorm.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-fuchsia-400 transition-colors group"
              >
                <Globe className="w-3.5 h-3.5 text-slate-600 group-hover:text-fuchsia-400 transition-colors" />
                CodeStorm Official Web
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/[0.04] pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono">
          <span>© 2026 CODESTORM HACKATHON. ALL RIGHTS RESERVED.</span>
          <span>MONTH 2 // EST. 2026.06.27</span>
        </div>
      </footer>
    </div>
  );
}
