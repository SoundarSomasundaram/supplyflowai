import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, ChevronDown, Cpu, Eye, CheckSquare, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const guideRef = useRef(null);

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#222222] text-white flex flex-col font-sans relative overflow-x-hidden select-none">
      {/* Top Navbar */}
      <header className="px-8 py-6 flex justify-between items-center w-full relative z-20 max-w-[1200px] mx-auto">
        {/* Left */}
        <div className="text-xs tracking-wider text-gray-300 font-medium cursor-pointer hover:text-white transition-colors">
          Flowchain AI
        </div>

        {/* Center Logo - REMOVED AS REQUESTED */}
        <div className="flex-1"></div>

        {/* Right */}
        <nav className="flex items-center gap-6">
          <button 
            onClick={scrollToGuide}
            className="text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Inventory Guide
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs text-gray-300 hover:text-[#f3db05] transition-colors cursor-pointer"
          >
            Sample Data
          </button>
          <button 
            onClick={() => navigate('/workspace')}
            className="bg-[#f3db05] text-black text-xs font-bold px-4 py-2.5 rounded-full hover:opacity-90 transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-md"
          >
            Launch Workspace
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </nav>
      </header>

      {/* Hero fold (First screen min-h-screen) */}
      <section className="min-h-[calc(100vh-88px)] flex flex-col justify-center px-8 md:px-16 py-12 max-w-[1200px] w-full mx-auto relative">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Left Hero Texts */}
          <div className="md:col-span-3 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold">
                FLOWCHAIN SUPPLY INTELLIGENCE
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-white font-sans"
            >
              A new era of <br />
              supply chain starts here.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-sm md:text-base text-gray-400 max-w-lg leading-relaxed"
            >
              Transform scattered information into actionable business insights using a collaborative network of AI agents.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex gap-4 pt-4"
            >
              <button
                onClick={() => navigate('/workspace')}
                className="bg-white text-black font-bold text-xs py-3 px-6 rounded-full hover:bg-gray-100 flex items-center gap-2 transition-all cursor-pointer border border-transparent shadow-md"
              >
                Explore Workspace
                <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 text-black stroke-[3]" />
                </div>
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-[#f3db05] text-black font-bold text-xs py-3 px-6 rounded-full hover:opacity-90 flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                Sample Data
                <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 text-black stroke-[3]" />
                </div>
              </button>
            </motion.div>
          </div>

          {/* Right Hero Image (Play button and tags removed, expanded size to max-w-[420px], shifted upwards) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-2 flex flex-col items-center justify-center md:-mt-16 -mt-6"
          >
            <div className="relative max-w-[420px] w-full border border-white/10 p-2 bg-[#2d2d2d] rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.01]">
              <img 
                src="/image.png" 
                alt="Flowchain Supply System" 
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={scrollToGuide}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-10"
        >
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Scroll</span>
          <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
        </div>
      </section>

      {/* Glassmorphic card guide */}
      <section 
        ref={guideRef} 
        id="inventory-guide" 
        className="min-h-screen flex flex-col justify-center px-8 py-20 relative max-w-[991px] mx-auto w-full"
      >
        {/* Glow Spheres for aesthetic depth */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-brand/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-[#f3db05]/5 blur-[120px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="glass-card p-10 relative z-10 w-full"
        >
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#f3db05] uppercase font-bold">
              Operations Playbook
            </span>
            <h2 className="text-3xl font-bold mt-2 font-sans tracking-tight">
              Supply Chain Inventory Management
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 1. Web Intelligence */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#f3db05] flex-shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Web Intelligence</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Real-time retrieval of relevant information from trusted online sources to ensure every decision is backed by current data.
                </p>
              </div>
            </div>

            {/* 2. Context Understanding */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#f3db05] flex-shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Context Understanding</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Processes raw information into structured, meaningful business context by extracting the facts that matter most.
                </p>
              </div>
            </div>

            {/* 3. Decision Generation */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#f3db05] flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Decision Generation</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Synthesizes collected evidence into clear, explainable recommendations tailored to the user's objective.
                </p>
              </div>
            </div>

            {/* 4. Quality Validation */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#f3db05] flex-shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Quality Validation</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Systematically audits, scores, and refines decisions through multi-agent critiques before deployment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-gray-500 relative z-10">
        <div className="max-w-[991px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; 2026 Flowchain AI Systems. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
