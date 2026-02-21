import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FloatingParticles } from '../components/LoadingComponents'

export default function Custom404() {
  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-cyber-blue selection:text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <Head>
        <title>Identity Lost | 404 Echoes of History</title>
      </Head>

      <FloatingParticles count={20} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl space-y-12"
      >
        {/* Cinematic Glitch Title */}
        <div className="relative">
          <motion.h1
            animate={{
              textShadow: [
                "0 0 0px #00f0ff",
                "2px 2px 0px #00f0ff",
                "-2px -2px 0px #ff00ff",
                "0 0 0px #00f0ff"
              ]
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
            className="text-[8rem] sm:text-[12rem] font-black tracking-tighter italic opacity-10"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-white">
              LOST IN <span className="text-cyber-blue">TIME</span>
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-gray-400 text-lg sm:text-2xl font-medium leading-relaxed">
            The historical record for this specific coordinates has been redacted or never existed in the current continuity.
          </p>
          <div className="h-0.5 w-24 bg-dark-700 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            Uplink Error: ERR_TEMPORAL_OFFSET_404
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-cyber-blue text-white font-black tracking-widest uppercase rounded-2xl shadow-2xl shadow-cyber-blue/20 hover:shadow-cyber-blue/50 transition-all border border-cyber-blue/50"
            >
              Return to Present
            </motion.button>
          </Link>
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-dark-800 text-white font-black tracking-widest uppercase rounded-2xl border border-dark-700 hover:bg-dark-700 transition-all"
            >
              Open Archive Hub
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Background Decorative Rings */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dark-800 rounded-full opacity-30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-dark-800 rounded-full opacity-10"
        />
      </div>
    </div>
  )
}
