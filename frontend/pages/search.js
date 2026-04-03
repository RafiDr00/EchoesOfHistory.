import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import CinematicSearchResults from '../components/CinematicSearchResults'
import ErrorBoundary from '../components/ErrorBoundary'
import EchoeNav from '../components/EchoeNav'
import { api } from '../lib/api'

export default function SearchPage() {
  const router = useRouter()
  const { q: queryParam } = router.query
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searchResponse, setSearchResponse] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (queryParam) { setQuery(queryParam); executeSearch(queryParam) }
  }, [queryParam])

  const executeSearch = async (target) => {
    setIsSearching(true); setShowResults(true); setError(null)
    try {
      const data = await api.post('/cinematic', { q: target, include_biography: true, include_media: true, include_timeline: true })
      setSearchResponse(data)
    } catch (err) { setError(err) }
    finally { setIsSearching(false) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`, undefined, { shallow: true })
  }

  const fetchSuggestions = async (val) => {
    setQuery(val)
    if (val.length < 2) { setSuggestions([]); return }
    try {
      const data = await api.get('/suggestions', { q: val })
      setSuggestions(data.suggestions || [])
    } catch {}
  }

  return (
    <ErrorBoundary>
      <Head><title>{queryParam ? `${queryParam} — Search` : 'Archive Search'} | Echoes of History</title></Head>

      <div style={{ minHeight: '100vh', background: '#000', color: '#f5e8c8', fontFamily: "'Playfair Display', Georgia, serif" }}>

        {/* Sticky header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(5,4,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,160,80,0.1)', padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', maxWidth: '1120px', margin: '0 auto' }}>
            <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: 'italic', fontSize: '1.1rem', color: '#f5e8c8', borderBottom: '1px solid rgba(200,160,80,0.4)', paddingBottom: '1px' }}>Echoes</span>
            </Link>

            <form onSubmit={handleSubmit} style={{ flex: 1, maxWidth: '700px', position: 'relative' }}>
              <input
                type="text" value={query} autoFocus
                onChange={e => fetchSuggestions(e.target.value)}
                placeholder="Search the archive..."
                style={{
                  width: '100%', padding: '0.75rem 3rem 0.75rem 1.25rem',
                  background: 'rgba(245,232,200,0.04)',
                  border: '1px solid rgba(200,160,80,0.2)',
                  borderRadius: '3px', color: '#f5e8c8',
                  fontFamily: "'Playfair Display', serif", fontSize: '0.9rem',
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,160,80,0.55)'}
                onBlur={e => { e.target.style.borderColor = 'rgba(200,160,80,0.2)'; setTimeout(() => setSuggestions([]), 200) }}
              />
              <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(200,160,80,0.6)', cursor: 'pointer', fontSize: '1rem' }}>→</button>

              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#0c0b14', border: '1px solid rgba(200,160,80,0.15)', borderRadius: '3px', overflow: 'hidden', zIndex: 200 }}>
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => { setQuery(s); setSuggestions([]); router.push(`/search?q=${encodeURIComponent(s)}`) }}
                        style={{ display: 'block', width: '100%', padding: '0.75rem 1.25rem', background: 'none', border: 'none', borderBottom: '1px solid rgba(200,160,80,0.06)', color: 'rgba(245,232,200,0.6)', fontFamily: "'Playfair Display', serif", fontSize: '0.875rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.1s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(200,160,80,0.06)'; e.currentTarget.style.color = '#ffd080' }}
                        onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(245,232,200,0.6)' }}
                      >{s}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,232,200,0.25)' }}>Live</span>
            </div>
          </div>
        </div>

        <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '3rem 2rem' }}>
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.4 }}>𓂀</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>The Archive Awaits</h2>
                <p style={{ color: 'rgba(245,232,200,0.4)', fontStyle: 'italic', fontSize: '1rem' }}>Type a query above to search the historical record.</p>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CinematicSearchResults query={queryParam || query} searchData={searchResponse} isLoading={isSearching} error={error} onRetry={() => executeSearch(queryParam || query)} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  )
}
