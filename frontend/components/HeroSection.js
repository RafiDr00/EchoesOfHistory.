import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export const HeroSection = ({ onSearch, onCinematicSearch }) => {
    const [displayText, setDisplayText] = useState('')
    const [query, setQuery] = useState('')
    const fullText = 'Experience History Like Never Before'

    useEffect(() => {
        let index = 0
        const timer = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText(fullText.slice(0, index + 1))
                index++
            } else {
                clearInterval(timer)
            }
        }, 100)
        return () => clearInterval(timer)
    }, [])

    const handleSearch = () => {
        if (query.trim()) onSearch(query)
    }

    const handleCinematicSearch = () => {
        if (query.trim()) onCinematicSearch(query)
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 40% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)'
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="w-full h-full"
                />
            </div>

            <div className="absolute inset-0 z-5">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, -100, -20],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 bg-black/40 z-10"></div>

            <div className="relative z-20 text-center max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="space-y-8"
                >
                    <motion.div
                        animate={{
                            rotateY: [0, 360],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="text-8xl lg:text-9xl mb-8"
                    >
                        🏛️
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                            ECHOES OF HISTORY
                        </h1>

                        <motion.p
                            className="text-xl lg:text-3xl text-gray-300 min-h-[3rem] font-light"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            {displayText}
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="ml-1"
                            >
                                |
                            </motion.span>
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCinematicSearch()}
                                placeholder="Search for historical figures, events, or periods..."
                                className="w-full px-6 py-4 pl-12 bg-gray-900/80 backdrop-blur-sm text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-cyan-400 transition-all text-lg"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={handleCinematicSearch} className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-500 hover:to-purple-500 shadow-lg shadow-cyan-500/25 transition-all">
                                🎬 Cinematic Search
                            </button>
                            <button onClick={handleSearch} className="px-8 py-3 bg-gray-800/80 text-white font-semibold rounded-lg border border-gray-600/50 hover:bg-gray-700 transition-all">
                                📚 Classic Search
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
