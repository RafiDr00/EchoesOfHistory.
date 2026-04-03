import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import CinematicSearchResults from '../components/CinematicSearchResults'
import ErrorBoundary from '../components/ErrorBoundary'
import EchoeNav from '../components/EchoeNav'
import { api } from '../lib/api'

const EXAMPLES = ['Leonardo da Vinci', 'Ancient Egypt', 'Napoleon Bonaparte', 'Marie Curie', 'The Renaissance', 'Julius Caesar']

export default function CinematicSearch() {
  const router = useRouter()
  const { q } = router.query
  const [query, setQuery] = useState('')
  const [searchResponse, setSearchResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (q) { setQuery(q); performSearch(q) }
  }, [q])

  const performSearch = async (target) => {
    setLoading(true); setError(null)
    try {
      const data = await api.post('/cinematic', { q: target, include_biography: true, include_media: true, include_timeline: true, include_related_articles: true })
      setSearchResponse(data)
    } catch (err) { setError(err) }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    router.push(`/cinematic-search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleExample = (ex) => {
    setQuery(ex)
    router.push(`/cinematic-search?q=${encodeURIComponent(ex)}`)
  }

  return (
    <ErrorBoundary>
      <Head>
        <title>{q ? `${q} — Archive` : 'Cinematic Search'} | Echoes of History</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#000', color: '#f5e8c8', fontFamily: "'Playfair Display', Georgia, serif" }}>
        <EchoeNav current="archive" />

        {!q ? (
          /* ── Empty state ── */
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(200,160,80,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '640px', position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.5)', marginBottom: '1.5rem' }}>
                The Great Archive
              </p>

              <h1 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '1.5rem' }}>
                Search<br />
                <span style={{ background: 'linear-gradient(135deg,#ffd080,#c8903a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  History
                </span>
              </h1>

              <p style={{ fontSize: '1rem', color: 'rgba(245,232,200,0.4)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '3rem' }}>
                Enter a historical figure, event, or era to receive an AI-curated analysis with media, timelines, and sources.
              </p>

              <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '2rem' }}>
                <input
                  type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. Cleopatra, The Renaissance, Battle of Thermopylae..."
                  autoFocus
                  style={{
                    width: '100%', padding: '1.1rem 4rem 1.1rem 1.5rem',
                    background: 'rgba(245,232,200,0.03)',
                    border: '1px solid rgba(200,160,80,0.25)',
                    borderRadius: '3px', color: '#f5e8c8',
                    fontFamily: "'Playfair Display', serif", fontSize: '1rem',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(200,160,80,0.6)'; e.target.style.boxShadow = '0 0 30px rgba(200,160,80,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(200,160,80,0.25)'; e.target.style.boxShadow = 'none' }}
                />
                <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(200,160,80,0.6)', cursor: 'pointer', fontSize: '1.1rem' }}>→</button>
              </form>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,232,200,0.2)', width: '100%', marginBottom: '0.5rem' }}>
                  Suggested
                </span>
                {EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => handleExample(ex)} style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(200,160,80,0.04)',
                    border: '1px solid rgba(200,160,80,0.15)',
                    borderRadius: '2px', color: 'rgba(245,232,200,0.5)',
                    fontFamily: "'Playfair Display', serif", fontSize: '0.8rem',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(200,160,80,0.4)'; e.currentTarget.style.color = '#ffd080' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(200,160,80,0.15)'; e.currentTarget.style.color = 'rgba(245,232,200,0.5)' }}
                  >{ex}</button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* ── Results ── */
          <div style={{ paddingTop: '5rem' }}>
            {/* Sticky search bar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,4,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,160,80,0.08)', padding: '1rem 3rem' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '800px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text" value={query} onChange={e => setQuery(e.target.value)}
                    style={{
                      width: '100%', padding: '0.7rem 3rem 0.7rem 1rem',
                      background: 'rgba(245,232,200,0.03)',
                      border: '1px solid rgba(200,160,80,0.2)',
                      borderRadius: '3px', color: '#f5e8c8',
                      fontFamily: "'Playfair Display', serif", fontSize: '0.875rem',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(200,160,80,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,160,80,0.2)'}
                  />
                  <button type="submit" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(200,160,80,0.5)', cursor: 'pointer' }}>→</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,232,200,0.25)' }}>Live</span>
                </div>
              </form>
            </div>

            <CinematicSearchResults query={q} searchData={searchResponse} isLoading={loading} error={error} onRetry={() => performSearch(q)} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
