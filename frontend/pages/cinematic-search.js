import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { motion } from 'framer-motion'
import CinematicSearchResults from '../components/CinematicSearchResults'
import LoadingComponents from '../components/LoadingComponents'
import ErrorBoundary from '../components/ErrorBoundary'
import { api } from '../lib/api'

const CinematicSearchPage = () => {
  const router = useRouter()
  const { q } = router.query
  const [searchResponse, setSearchResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (q && typeof q === 'string') {
      performSearch(q)
    }
  }, [q])

  const performSearch = async (query) => {
    setLoading(true)
    setError(null)

    try {
      const data = await api.post('/cinematic', {
        q: query,
        include_biography: true,
        include_media: true,
        include_timeline: true,
        include_related_articles: true
      })
      setSearchResponse(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = (newQuery) => {
    router.push(`/cinematic-search?q=${encodeURIComponent(newQuery)}`)
  }

  return (
    <ErrorBoundary>
      <Head>
        <title>{q ? `${q} - Cinematic Search` : 'Cinematic Search'} | Echoes of History</title>
        <meta name="description" content={`Immersive historical search results for ${q}`} />
      </Head>

      <div className="fixed inset-0 z-0 bg-dark-900">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {!q ? (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center space-y-12 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent mb-6">
                  Cinematic Search
                </h1>
                <p className="text-gray-400 text-xl leading-relaxed">
                  Bridge the gap between eras. Experience historical data through an immersive aesthetic lens.
                </p>
              </motion.div>

              <SearchBox onSearch={handleNewSearch} />

              <div className="space-y-6">
                <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Select an Era to Explore</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {['Leonardo da Vinci', 'Ancient Egypt', 'Napoleon', 'Marie Curie', 'The Renaissance'].map((example) => (
                    <motion.button
                      key={example}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNewSearch(example)}
                      className="px-6 py-2.5 bg-dark-800/50 text-cyber-blue rounded-xl border border-cyber-blue/20 hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all duration-300 text-sm font-medium"
                    >
                      {example}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen">
            <CinematicSearchResults
              query={q}
              searchData={searchResponse}
              isLoading={loading}
              error={error}
              onRetry={() => performSearch(q)}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="relative group max-w-xl mx-auto w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a figure, or event..."
          className="w-full px-8 py-5 pl-14 bg-dark-800/80 backdrop-blur-xl text-white placeholder-gray-500 border border-gray-700/50 rounded-2xl focus:outline-none focus:border-cyber-blue/50 focus:ring-4 focus:ring-cyber-blue/10 transition-all duration-300 text-lg shadow-2xl"
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2">
          <svg className="w-6 h-6 text-gray-500 group-focus-within:text-cyber-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          disabled={!query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-xl hover:shadow-lg hover:shadow-cyber-blue/25 disabled:opacity-50 transition-all font-bold text-sm"
        >
          EXPLORE
        </button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 rounded-2xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
    </form>
  )
}

export default CinematicSearchPage
