import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const router = useRouter();

  // Initialize with URL query parameter
  useEffect(() => {
    if (router.query.q) {
      const initialQuery = router.query.q;
      setQuery(initialQuery);
      performEnhancedSearch(initialQuery);
    }
  }, [router.query.q]);

  // Debounced suggestions fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(data.suggestions?.length > 0);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const performEnhancedSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setShowSuggestions(false);
    
    try {
      const response = await fetch('http://localhost:8080/api/search/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          include_images: true,
          include_quotes: true,
          max_results: 8
        })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selectedSuggestion = suggestions[selectedIndex];
          setQuery(selectedSuggestion.title);
          performEnhancedSearch(selectedSuggestion.title);
        } else {
          performEnhancedSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.title);
    performEnhancedSearch(suggestion.title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-purple-900/20 to-black relative overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="neural-network"></div>
      </div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="cyber-grid"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Enhanced Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-glow mb-4">
            <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
              Enhanced Historical Search
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover history with AI-powered search, live suggestions, and immersive visual results
          </p>
        </motion.div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-12 relative"
        >
          <div className="relative" ref={searchRef}>
            <div className="glass-cyber rounded-2xl p-6 border border-cyber-blue/30">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for historical figures, events, civilizations..."
                    className="w-full bg-transparent text-xl text-white placeholder-gray-400 focus:outline-none"
                  />
                  
                  {/* Search Icon */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 border-2 border-cyber-blue rounded-full animate-glow-pulse"></div>
                  </div>
                </div>
                
                <button
                  onClick={() => performEnhancedSearch()}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {/* Live Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-xl border border-cyber-blue/30 overflow-hidden z-50"
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className={`p-4 flex items-center space-x-4 cursor-pointer transition-all duration-200 ${
                        index === selectedIndex 
                          ? 'bg-cyber-blue/20 border-l-4 border-cyber-blue' 
                          : 'hover:bg-gray-800/50'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      {suggestion.image && (
                        <img
                          src={suggestion.image}
                          alt={suggestion.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{suggestion.title}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">{suggestion.snippet}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="max-w-7xl mx-auto"
            >
              {/* Summary Section */}
              {results.summary && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-cyber rounded-2xl p-6 mb-8 border border-cyber-blue/30"
                >
                  <h2 className="text-2xl font-bold text-cyber-blue mb-4">AI Summary</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{results.summary}</p>
                </motion.div>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Results */}
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-3xl font-bold text-glow mb-6">Search Results</h2>
                  
                  {results.results?.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-dark rounded-xl p-6 border border-gray-700/50 hover:border-cyber-blue/50 transition-all duration-300"
                    >
                      <h3 className="text-xl font-bold text-cyber-blue mb-2">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-cyber-pink transition-colors"
                        >
                          {result.title}
                        </a>
                      </h3>
                      <p 
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Images */}
                  {results.images?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-dark rounded-xl p-6 border border-gray-700/50"
                    >
                      <h3 className="text-xl font-bold text-cyber-purple mb-4">Historical Images</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {results.images.slice(0, 6).map((image, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="relative group cursor-pointer"
                          >
                            <img
                              src={image.url}
                              alt={image.title}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                              <p className="text-white text-xs text-center p-2">{image.title}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Quotes */}
                  {results.quotes?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-dark rounded-xl p-6 border border-gray-700/50"
                    >
                      <h3 className="text-xl font-bold text-cyber-pink mb-4">Famous Quotes</h3>
                      <div className="space-y-4">
                        {results.quotes.map((quote, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="border-l-4 border-cyber-blue pl-4"
                          >
                            <p className="text-gray-300 italic mb-2">"{quote.quote}"</p>
                            <p className="text-cyber-blue text-sm font-semibold">— {quote.author}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Related Topics */}
                  {results.related_topics?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass-dark rounded-xl p-6 border border-gray-700/50"
                    >
                      <h3 className="text-xl font-bold text-cyber-green mb-4">Explore Related</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.related_topics.map((topic, index) => (
                          <motion.button
                            key={index}
                            onClick={() => {
                              setQuery(topic);
                              performEnhancedSearch(topic);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-2 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border border-cyber-blue/30 rounded-lg text-sm text-cyber-blue hover:border-cyber-blue transition-all duration-300"
                          >
                            {topic}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && !results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl text-gray-300">Searching the depths of history...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearch;
