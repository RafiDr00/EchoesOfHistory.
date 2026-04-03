import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import InteractiveTimeline from './InteractiveTimeline'

const TOKEN = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase',
}

const SectionHeader = ({ glyph, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
    <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>{glyph}</span>
    <span style={{ ...TOKEN, color: 'rgba(200,160,80,0.6)' }}>{label}</span>
    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(200,160,80,0.15), transparent)' }} />
  </div>
)

const MediaGallery = ({ media = [] }) => {
  const [selected, setSelected] = useState(null)
  if (!media.length) return null
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '0.75rem' }}>
        {media.map((item, i) => (
          <div key={i} onClick={() => setSelected(item)} style={{ position: 'relative', aspectRatio: '1', borderRadius: '3px', overflow: 'hidden', cursor: 'zoom-in', border: '1px solid rgba(200,160,80,0.08)', background: '#0c0b14' }}>
            <img src={item.url} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'opacity 0.2s, transform 0.3s' }}
              onMouseOver={e => { e.target.style.opacity = 1; e.target.style.transform = 'scale(1.05)' }}
              onMouseOut={e => { e.target.style.opacity = 0.7; e.target.style.transform = 'scale(1)' }} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '900px', width: '100%', border: '1px solid rgba(200,160,80,0.15)', borderRadius: '4px', overflow: 'hidden', background: '#05040a' }}>
              <img src={selected.url} alt={selected.title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', background: '#000' }} />
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(200,160,80,0.1)' }}>
                <div style={{ fontSize: '0.9rem', fontFamily: "'Playfair Display',serif", fontWeight: 600, color: '#f5e8c8', marginBottom: '4px' }}>{selected.title}</div>
                <div style={{ ...TOKEN, color: 'rgba(200,160,80,0.4)' }}>{selected.source} · {selected.credit}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const CinematicSearchResults = ({ query, searchData, isLoading, error, onRetry }) => {
  const router = useRouter()

  if (isLoading) return (
    <div style={{ padding: '6rem 3rem', textAlign: 'center', fontFamily: "'Playfair Display',serif" }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[0,1,2,3].map(i => (
            <motion.div key={i} animate={{ scaleY: [0.4,1,0.4], opacity: [0.3,1,0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i*0.15 }}
              style={{ width: '3px', height: '28px', background: 'rgba(200,160,80,0.6)', borderRadius: '2px' }} />
          ))}
        </div>
        <p style={{ ...TOKEN, color: 'rgba(200,160,80,0.4)' }}>Searching the archive for {query}</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ padding: '6rem 3rem', textAlign: 'center', fontFamily: "'Playfair Display',serif" }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>𓂀</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#f5e8c8' }}>Archive Unreachable</h3>
      <p style={{ color: 'rgba(245,232,200,0.4)', fontStyle: 'italic', marginBottom: '2rem', fontSize: '0.9rem' }}>{error.message || 'The historical records are temporarily unavailable.'}</p>
      <button onClick={onRetry} style={{ ...TOKEN, padding: '0.7rem 1.5rem', background: 'rgba(200,160,80,0.08)', border: '1px solid rgba(200,160,80,0.3)', borderRadius: '3px', color: '#ffd080', cursor: 'pointer' }}>
        Retry
      </button>
    </div>
  )

  if (!searchData) return null

  const { biography, timeline, related_articles, media } = searchData

  return (
    <div style={{ fontFamily: "'Playfair Display',Georgia,serif", color: '#f5e8c8', padding: '2.5rem 3rem 5rem', maxWidth: '1280px', margin: '0 auto' }}>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', minHeight: '300px', marginBottom: '3rem', border: '1px solid rgba(200,160,80,0.12)' }}>

        {media?.[0]?.url && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src={media[0].url} alt={query} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.5))' }} />
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1, padding: '3rem 3.5rem' }}>
          <p style={{ ...TOKEN, color: 'rgba(200,160,80,0.5)', marginBottom: '1rem' }}>Archive Result</p>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '1.25rem' }}>{query}</h1>
          {biography?.summary && (
            <p style={{ fontSize: '1rem', color: 'rgba(245,232,200,0.55)', lineHeight: 1.8, maxWidth: '580px', fontStyle: 'italic' }}>{biography.summary}</p>
          )}
          {biography?.known_for?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
              {biography.known_for.map((t,i) => (
                <span key={i} style={{ padding: '0.35rem 0.875rem', background: 'rgba(200,160,80,0.06)', border: '1px solid rgba(200,160,80,0.18)', borderRadius: '2px', fontSize: '0.75rem', color: 'rgba(245,232,200,0.6)' }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Body grid */}
      <div style={{ display: 'grid', gridTemplateColumns: related_articles?.length ? '1fr 300px' : '1fr', gap: '3rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Timeline */}
          {timeline?.length > 0 && (
            <section>
              <SectionHeader glyph="𓇌" label="Historical Timeline" />
              <div style={{ border: '1px solid rgba(200,160,80,0.1)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(12,11,20,0.5)', padding: '1.5rem' }}>
                <InteractiveTimeline events={timeline} />
              </div>
            </section>
          )}

          {/* Media */}
          {media?.length > 0 && (
            <section>
              <SectionHeader glyph="𓁼" label="Visual Record" />
              <MediaGallery media={media} />
            </section>
          )}
        </div>

        {/* Sidebar */}
        {related_articles?.length > 0 && (
          <div>
            <SectionHeader glyph="𓂻" label="Related Records" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {related_articles.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '1rem 1.25rem', border: '1px solid rgba(200,160,80,0.1)', borderRadius: '3px', background: 'rgba(12,11,20,0.5)', transition: 'all 0.18s', cursor: 'pointer' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(200,160,80,0.35)'; e.currentTarget.style.background = 'rgba(200,160,80,0.05)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(200,160,80,0.1)'; e.currentTarget.style.background = 'rgba(12,11,20,0.5)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f5e8c8', marginBottom: '4px', lineHeight: 1.4 }}>{a.title}</div>
                    <div style={{ ...TOKEN, color: 'rgba(200,160,80,0.4)', marginBottom: '6px' }}>{a.category || 'Reference'}</div>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(245,232,200,0.35)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(200,160,80,0.08)' }}>
        <button onClick={() => router.push('/')} style={{ ...TOKEN, padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid rgba(245,232,200,0.1)', borderRadius: '3px', color: 'rgba(245,232,200,0.4)', cursor: 'pointer', transition: 'all 0.18s' }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(200,160,80,0.35)'; e.currentTarget.style.color = '#ffd080' }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(245,232,200,0.1)'; e.currentTarget.style.color = 'rgba(245,232,200,0.4)' }}
        >← Return to Archive</button>
      </div>
    </div>
  )
}

export default CinematicSearchResults
