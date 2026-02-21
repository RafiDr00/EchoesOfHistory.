import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Fallback 2D Hero Component (no 3D dependencies)
const Hero3D = ({ 
  title = "Echoes of History", 
  subtitle = "Experience history like never before", 
  showSearch = true,
  height = "80vh",
  onSearch,
  onCinematicSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleCinematicSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim() && onCinematicSearch) {
      onCinematicSearch(searchQuery)
    }
  }

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"
      style={{ height }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window?.innerWidth || 1920, 
              y: Math.random() * window?.innerHeight || 1080,
              opacity: 0 
            }}
            animate={{ 
              y: [null, -20, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-2 h-2 bg-cyber-blue rounded-full shadow-lg shadow-cyber-blue/50"
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* Holographic Portrait Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-12 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border-2 border-cyber-blue/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border border-cyber-purple/50"
              />
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 backdrop-blur-xl border border-gray-600/50 flex items-center justify-center">
                <div className="text-4xl md:text-6xl">🏛️</div>
              </div>
            </div>
          </motion.div>

          {/* Search Interface */}
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search through the echoes of time..."
                    className="w-full px-6 py-4 text-lg bg-dark-800/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyber-blue/50 focus:bg-dark-700/50 transition-all"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyber-blue/25 transition-all"
                  >
                    Search
                  </motion.button>
                </div>
              </form>

              {/* Search Mode Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCinematicSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyber-blue/25 transition-all"
                >
                  🎬 Cinematic Search
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-dark-700/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 hover:border-cyber-blue/50 transition-all font-semibold"
                >
                  📚 Classic Search
                </motion.button>
              </div>

              {/* Quick Search Examples */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
              >
                <span className="text-gray-400 text-sm">Try searching:</span>
                {['Napoleon Bonaparte', 'Ancient Egypt', 'Renaissance', 'World War II', 'Cleopatra'].map((example, index) => (
                  <motion.button
                    key={example}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery(example)}
                    className="text-xs px-3 py-1 bg-cyber-blue/20 text-cyber-blue rounded-full hover:bg-cyber-blue/30 transition-colors"
                  >
                    {example}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              { number: '10,000+', label: 'Historical Events' },
              { number: '500+', label: 'Civilizations' },
              { number: '∞', label: 'Stories to Discover' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero3D
