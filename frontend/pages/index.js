import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import { FloatingParticles } from '../components/LoadingComponents'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-cyber-blue selection:text-white">
      <Head>
        <title>Echoes of History | The Human Archive</title>
        <meta name="description" content="Explore humanity's greatest stories through immersive 3D, AI-driven conversations, and cinematic historical analysis." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FloatingParticles count={15} />

      {/* Persistence Bar / Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-dark-950/80 backdrop-blur-xl border-b border-dark-700 py-4' : 'bg-transparent py-8'
        }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyber-blue/40 transition-all">
                <span className="text-white font-black">E</span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic hidden sm:block">Echoes</h1>
            </motion.div>
          </Link>

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              {['Explore', 'Chronicle', 'Archive'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-cyber-blue cursor-pointer transition-colors">
                    {item}
                  </span>
                </Link>
              ))}
            </nav>
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-white text-dark-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-cyber-blue hover:text-white transition-all shadow-xl shadow-white/5"
              >
                Identity Uplink
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Hero Section - The First Impression */}
              <section className="relative">
                <HeroSection />
              </section>

              {/* Data Density / Social Proof */}
              <section className="bg-dark-950 border-y border-dark-800">
                <StatsSection />
              </section>

              {/* Core Offerings Grid */}
              <section className="py-24 sm:py-32 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FeatureCard
                    icon="🏛️"
                    title="THE GREAT ARCHIVE"
                    description="Access deep-linked historical records processed through our cinematic engine. Thousands of figures across 5,000 years of recorded history."
                    href="/cinematic-search"
                    accent="cyber-blue"
                  />
                  <FeatureCard
                    icon="🧬"
                    title="AI CONVERSATIONS"
                    description="Converse with high-fidelity digital representations of historical figures. Trained on authentic primary sources for maximum resonance."
                    href="/explore"
                    accent="cyber-purple"
                  />
                  <FeatureCard
                    icon="⏳"
                    title="THE CHRONICLE"
                    description="An interactive continuity engine that parses historical events into a seamless, navigatible timeline of human achievement."
                    href="/explore"
                    accent="cyber-pink"
                  />
                </div>
              </section>

              {/* Call to Action */}
              <section className="py-24 text-center container mx-auto px-6">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/20 p-16 sm:p-24 rounded-[3rem] space-y-8"
                >
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight uppercase max-w-3xl mx-auto">
                    Ready to bridge the gap between <span className="text-cyber-blue">eras?</span>
                  </h2>
                  <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto font-medium">
                    Join our initiative to preserve and explore the human story through the lens of modern tech.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Link href="/auth">
                      <button className="px-10 py-5 bg-cyber-blue text-white font-black tracking-widest uppercase rounded-2xl shadow-2xl shadow-cyber-blue/30 hover:shadow-cyber-blue/50 transition-all">
                        Initialize Account
                      </button>
                    </Link>
                    <Link href="/cinematic-search">
                      <button className="px-10 py-5 bg-dark-800 text-white font-black tracking-widest uppercase rounded-2xl border border-dark-700 hover:bg-dark-700 transition-all">
                        Open Archive
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-20 border-t border-dark-800 bg-dark-950">
        <div className="container mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center font-black">E</div>
            <span className="text-sm font-black uppercase tracking-widest italic">Echoes of History</span>
          </div>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 HUMAN PRESERVATION INITIATIVE • ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, href, accent }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative h-full p-8 sm:p-12 rounded-[2.5rem] bg-dark-800 border border-dark-700 hover:border-cyber-blue/50 transition-all cursor-pointer overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${accent}/5 blur-3xl`} />
        <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-4 tracking-tight uppercase italic">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 group-hover:text-gray-400 transition-colors">
          {description}
        </p>
        <div className="text-cyber-blue text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
          Initialize Module →
        </div>
      </motion.div>
    </Link>
  )
}
