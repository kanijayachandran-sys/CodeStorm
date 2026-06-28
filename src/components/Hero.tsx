import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Trophy, ChevronRight, MessageSquare, Instagram, Zap, ExternalLink, Globe } from 'lucide-react';

export default function Hero({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [timeLeft, setTimeLeft] = useState({ days: 17, hours: 14, minutes: 30, seconds: 45 });

  useEffect(() => {
    // Target: July 15, 2026
    const targetDate = new Date('2026-07-15T00:00:00-07:00');
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="hero-section" className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-white px-4 py-16">
      {/* Background radial glows optimized for Frosted Glass theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
        {/* Hackathon Badge - Frosted Glass Styled */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-cyan-100 text-xs font-mono font-bold tracking-widest mb-8 shadow-lg"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          CODESTORM 2026 // MONTH 2 ACTIVE
        </motion.div>

        {/* Hero Title - Custom theme gradient */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6"
        >
          BUILD THE<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400">FUTURE</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/70 text-lg sm:text-xl max-w-2xl font-sans font-normal leading-relaxed mb-12"
        >
          Create websites that feel alive. Expand the boundaries of modern design and web functionality in our premier technology vertical. Bring high-fidelity motion, fluid sensory feedback, and AI co-intelligence to the browser.
        </motion.p>

        {/* Beautiful Countdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-4 gap-3 sm:gap-6 max-w-md sm:max-w-xl w-full mb-14"
        >
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl py-4 sm:py-6 px-2 text-center shadow-2xl">
              <span className="block font-display text-2xl sm:text-4xl font-semibold bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent font-mono">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="block text-[10px] sm:text-xs text-white/50 font-mono font-bold tracking-widest mt-1.5">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Main CTA buttons - Custom glass and high contrast physical button styling */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full px-4"
        >
          <button 
            onClick={() => onNavigate('sandbox')}
            className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Join Discord
            <ChevronRight className="w-5 h-5 transition-transform duration-300" />
          </button>
          
          <button 
            onClick={() => onNavigate('pass')}
            className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/20 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-white"
          >
            Claim Hacker Pass
            <Users className="w-5 h-5 text-cyan-400" />
          </button>
        </motion.div>

        {/* Feature Grid Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left max-w-4xl mt-6">
          <div className="glass-panel p-6 rounded-2xl border-white/[0.04] hover:border-cyan-500/20 transition-all duration-300">
            <Trophy className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="font-display text-lg font-medium text-slate-200 mb-1">Prizes & Glory</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Showcase your creativity to the world and secure unique digital trophies and global hackathon certificates.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-white/[0.04] hover:border-violet-500/20 transition-all duration-300">
            <Users className="w-8 h-8 text-violet-400 mb-4" />
            <h3 className="font-display text-lg font-medium text-slate-200 mb-1">Hacker Teams</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Collaborate with innovators globally. Team sizes range from 1 to 6 members to construct beautiful layouts.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-white/[0.04] hover:border-fuchsia-500/20 transition-all duration-300">
            <Calendar className="w-8 h-8 text-fuchsia-400 mb-4" />
            <h3 className="font-display text-lg font-medium text-slate-200 mb-1">July 15–22, 2026</h3>
            <p className="text-slate-400 text-sm leading-relaxed">A virtual, week-long prototyping blitz hosted directly inside our custom Discord server workspace.</p>
          </div>
        </div>

        {/* Discord and Social Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-6 items-center justify-center mt-16 text-slate-400 text-sm font-mono border-t border-slate-900 pt-8 w-full max-w-2xl"
        >
          <a 
            href="https://discord.gg/codestorm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-cyan-400 transition-colors duration-200 group"
          >
            <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            Join Official Discord
            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </a>
          
          <span className="text-slate-800">|</span>
          
          <a 
            href="https://instagram.com/code_storm_hackathon" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-violet-400 transition-colors duration-200 group"
          >
            <Instagram className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
            Instagram: @code_storm_hackathon
            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </a>
          
          <span className="text-slate-800">|</span>
          
          <a 
            href="https://codestorm.io" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-fuchsia-400 transition-colors duration-200 group"
          >
            <Globe className="w-4 h-4 text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
            Official Website
            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
