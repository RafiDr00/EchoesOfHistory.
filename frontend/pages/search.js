import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import CinematicSearchResults from '../components/CinematicSearchResults';
import { HolographicLoader, FloatingParticles } from '../components/LoadingComponents';
import ErrorBoundary from '../components/ErrorBoundary';
import { api } from '../lib/api';

export default function SearchPage() {
  const router = useRouter();
  const { q: queryParam } = router.query;
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchResponse, setSearchResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      executeSearch(queryParam);
    }
  }, [queryParam]);

  const executeSearch = async (targetQuery) => {
    if (!targetQuery.trim()) return;
    setIsSearching(true);
    setShowResults(true);
    setError(null);

    try {
      const data = await api.post('/cinematic', {
        q: targetQuery,
        include_biography: true,
        include_media: true,
        include_timeline: true
      });
      setSearchResponse(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`, undefined, { shallow: true });
  };

  const fetchSuggestions = async (val) => {
    setQuery(val);
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await api.get('/suggestions', { q: val });
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Suggestions failure:', err);
    }
  };

  return (
    <ErrorBoundary>
      <Head>
        <title>{queryParam ? `${queryParam} | Search` : 'Cinematic Search'} | Echoes of History</title>
      </Head>

      <div className="min-h-screen bg-dark-900 text-white selection:bg-cyber-blue selection:text-white">
        <FloatingParticles count={10} />

        {/* Elite Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-[100] bg-dark-950/80 backdrop-blur-2xl border-b border-dark-800"
        >
          <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-8">
            <Link href="/" className="flex-shrink-0">
              <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center font-black text-cyber-blue cursor-pointer">E</div>
            </Link>

            <div className="flex-1 max-w-3xl relative">
              <form onSubmit={handleManualSearch} className="relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => fetchSuggestions(e.target.value)}
                  placeholder="Analyze historical figure..."
                  className="w-full pl-6 pr-24 py-3 bg-dark-900 border border-dark-700 rounded-2xl outline-none focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 transition-all text-sm font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-cyber-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyber-blue/20"
                >
                  Analyze
                </button>
              </form>

              <AnimatePresence>
                {suggestions.length > 0 && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden overflow-y-auto max-h-[300px]"
                  >
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(s);
                          setSuggestions([]);
                          router.push(`/search?q=${encodeURIComponent(s)}`);
                        }}
                        className="w-full px-6 py-3 text-left text-xs font-bold text-gray-400 hover:bg-dark-700 hover:text-white border-b border-dark-700 last:border-0 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex flex-shrink-0 items-center space-x-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Live Intel</span>
            </div>
          </div>
        </motion.div>

        <main className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {!showResults && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-2xl mx-auto text-center py-24 space-y-12"
              >
                <div className="text-8xl">🏛️</div>
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">History <span className="text-cyber-blue">Archived</span></h1>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">Initialized. Awaiting historical query to populate the cinematic continuity engine.</p>
                </div>
              </motion.div>
            )}

            {showResults && (
              <div key="results-container">
                <CinematicSearchResults
                  query={queryParam || query}
                  searchData={searchResponse}
                  isLoading={isSearching}
                  error={error}
                  onRetry={() => executeSearch(queryParam || query)}
                />
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  );
}

import Link from 'next/link';
