import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatInterface from '../components/ChatInterface'
import InteractiveTimeline from '../components/InteractiveTimeline'
import { FloatingParticles } from '../components/LoadingComponents'

export default function Explore() {
  const [darkMode, setDarkMode] = useState(true) // Default to elite dark mode
  const [activeView, setActiveView] = useState('timeline')

  useEffect(() => {
    // Force dark mode class for elite aesthetic consistency
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-cyber-blue selection:text-white overflow-x-hidden">
      <Head>
        <title>Continuity Hub | Echoes of History</title>
        <meta name="description" content="Navigate the historical continuity engine and converse with the past." />
      </Head>

      <FloatingParticles count={10} />

      {/* Persistence Bar */}
      <nav className="relative z-50 p-8 border-b border-dark-800 bg-dark-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-4 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyber-blue/40 transition-all">
                <span className="text-white font-black text-xl">E</span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">Explore</h1>
            </motion.div>
          </Link>

          <div className="flex items-center space-x-2 bg-dark-800 p-1.5 rounded-2xl border border-dark-700">
            {['timeline', 'chat', 'both'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === view
                    ? 'bg-cyber-blue text-white shadow-xl shadow-cyber-blue/20'
                    : 'text-gray-500 hover:text-white'
                  }`}
              >
                {view}
              </button>
            ))}
          </div>

          <div className="hidden lg:block text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Historical Continuity Uplink: Active
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 pb-32">
        <div className="space-y-12">
          {/* Context Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-block px-3 py-1 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-[10px] font-black text-cyber-purple uppercase tracking-widest mb-4">
              Interactive Chronicles
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight uppercase mb-6">
              Master the <span className="text-cyber-blue">Timeline</span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed">
              Access the combined intelligence of the human archive. Toggle views to analyze chronology or engage in primary-source dialogue.
            </p>
          </motion.div>

          {/* Split Panel Architecture */}
          <motion.div
            layout
            className={`grid gap-12 transition-all duration-700 ${activeView === 'both' ? 'lg:grid-cols-[1.5fr,1fr]' : 'grid-cols-1'
              }`}
          >
            <AnimatePresence mode="wait">
              {(activeView === 'timeline' || activeView === 'both') && (
                <motion.div
                  key="timeline-pane"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-dark-800/50 backdrop-blur-xl border border-dark-700 rounded-[2.5rem] overflow-hidden min-h-[600px] flex flex-col"
                >
                  <div className="p-8 border-b border-dark-700 bg-dark-800/30 flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Chronological Continuity</h3>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-cyber-purple animate-pulse delay-75" />
                    </div>
                  </div>
                  <div className="flex-1 p-2 sm:p-6 overflow-y-auto">
                    <InteractiveTimeline darkMode={true} />
                  </div>
                </motion.div>
              )}

              {(activeView === 'chat' || activeView === 'both') && (
                <motion.div
                  key="chat-pane"
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`${activeView === 'both' ? 'h-[750px]' : 'max-w-4xl mx-auto w-full h-[800px]'}`}
                >
                  <ChatInterface darkMode={true} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
