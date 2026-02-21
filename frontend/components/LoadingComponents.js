import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Holographic Loading Animation
export const HolographicLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-24 h-24 mb-6">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyber-blue border-r-cyber-purple"
        />
        
        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-cyber-pink border-l-cyber-blue"
        />
        
        {/* Center orb */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-4 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple shadow-lg shadow-cyber-blue/50"
        />
      </div>
      
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-cyber-blue text-lg font-medium"
      >
        {message}
      </motion.p>
    </div>
  )
}

// Floating Particles Background
export const FloatingParticles = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: `${particle.x}vw`, 
            y: `${particle.y}vh`,
            opacity: 0 
          }}
          animate={{ 
            y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
            opacity: [0, 0.6, 0]
          }}
          transition={{ 
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay
          }}
          className="absolute w-1 h-1 bg-cyber-blue rounded-full shadow-lg shadow-cyber-blue/50"
        />
      ))}
    </div>
  )
}

// Search Results Skeleton
export const SearchResultsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section Skeleton */}
      <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Skeleton */}
      <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-dark-700/50 rounded-xl p-6 space-y-4">
                <div className="h-5 bg-gray-600 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-600 rounded w-full"></div>
                  <div className="h-3 bg-gray-600 rounded w-5/6"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-600 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-600 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress Bar Component
export const ProgressBar = ({ progress = 0, className = "" }) => {
  return (
    <div className={`relative w-full h-2 bg-dark-700 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full shadow-lg shadow-cyber-blue/25"
      />
      
      {/* Shimmer effect */}
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ width: '50%' }}
      />
    </div>
  )
}

// Error State Component
export const ErrorDisplay = ({ 
  title = "Something went wrong", 
  message = "Please try again later.",
  onRetry = null 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-6"
      >
        ⚠️
      </motion.div>
      
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <p className="text-gray-400 mb-8 max-w-md">{message}</p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyber-blue/25 transition-all"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

// Loading Overlay
export const LoadingOverlay = ({ isVisible, message = "Loading..." }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-dark-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 text-center max-w-sm mx-4"
          >
            <HolographicLoader message={message} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default {
  HolographicLoader,
  FloatingParticles,
  SearchResultsSkeleton,
  ProgressBar,
  ErrorDisplay,
  LoadingOverlay
}
