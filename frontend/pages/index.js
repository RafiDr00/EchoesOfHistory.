import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Load Hero3D only client-side — Three.js needs window
const Hero3D = dynamic(() => import('../components/Hero3D'), { ssr: false })

const NAV_LINKS = ['Explore', 'Archive', 'Chronicle']

const FEATURES = [
  {
    glyph: '𓂀',
    title: 'The Great Archive',
    body: 'Deep-linked historical records spanning 5,000 years. Every figure, every epoch — indexed and cross-referenced.',
    href: '/cinematic-search',
    accent: 'rgba(200,160,80,0.12)',
    accentBorder: 'rgba(200,160,80,0.35)',
  },
  {
    glyph: '𓆙',
    title: 'AI Conversations',
    body: 'Converse with high-fidelity representations of historical figures. Trained on primary sources for maximum resonance.',
    href: '/explore',
    accent: 'rgba(180,120,60,0.1)',
    accentBorder: 'rgba(180,120,60,0.3)',
  },
  {
    glyph: '𓇌',
    title: 'The Chronicle',
    body: 'An interactive continuity engine parsing historical events into a seamless, navigable timeline of human achievement.',
    href: '/explore',
    accent: 'rgba(160,100,50,0.1)',
    accentBorder: 'rgba(160,100,50,0.3)',
  },
]

const STATS = [
  { value: '5,000+', label: 'Years Covered' },
  { value: '12,000+', label: 'Historical Figures' },
  { value: '300+', label: 'Civilisations' },
  { value: '∞', label: 'Connections' },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)
  const router = { push: (p) => window.location.href = p }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!statsRef.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.3 })
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const handleSearch = (q) => window.location.href = `/search?q=${encodeURIComponent(q)}`
  const handleCinematicSearch = (q) => window.location.href = `/cinematic-search?q=${encodeURIComponent(q)}`

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#f5e8c8' }}>
      <Head>
        <title>Echoes of History — The Human Archive</title>
        <meta name="description" content="Explore five thousand years of human history through AI-powered search, interactive timelines, and cinematic historical analysis." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <nav className={`eh-nav${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{
              width: '32px', height: '32px', border: '1px solid rgba(200,160,80,0.4)',
              borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', color: '#ffd080',
            }}>𓂀</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em', color: '#f5e8c8' }}>
              Echoes
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {NAV_LINKS.map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} style={{ textDecoration: 'none' }}>
              <span className="eh-label" style={{ cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseOver={e => e.target.style.color = '#ffd080'}
                onMouseOut={e => e.target.style.color = ''}>
                {item}
              </span>
            </Link>
          ))}
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button className="eh-btn eh-btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
              Enter Archive
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <Hero3D onSearch={handleSearch} onCinematicSearch={handleCinematicSearch} />

      {/* ── Stats Band ────────────────────────────────────────────── */}
      <div ref={statsRef} style={{ background: '#05040a', borderTop: '1px solid rgba(200,160,80,0.08)', borderBottom: '1px solid rgba(200,160,80,0.08)', padding: '3rem 2rem' }}>
        <div className="eh-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
          {STATS.map(({ value, label }, i) => (
            <div key={label} style={{ animation: statsVisible ? `ehFadeUp 0.6s ease ${i*0.1}s both` : 'none' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: '#ffd080', lineHeight: 1 }}>{value}</div>
              <div className="eh-label" style={{ marginTop: '0.5rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature Cards ─────────────────────────────────────────── */}
      <section className="eh-section">
        <div className="eh-container">
          <p className="eh-label" style={{ textAlign: 'center', marginBottom: '1rem' }}>What We Offer</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '4rem', color: '#f5e8c8' }}>
            Three ways into<br /><span style={{ background: 'linear-gradient(135deg,#ffd080,#c8903a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>the past</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {FEATURES.map(({ glyph, title, body, href, accent, accentBorder }) => (
              <Link key={title} href={href} style={{ textDecoration: 'none' }}>
                <div className="eh-card" style={{ padding: '2.5rem', height: '100%', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = accentBorder; e.currentTarget.style.background = accent }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(200,160,80,0.12)'; e.currentTarget.style.background = 'var(--surface)' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle at top right, ${accent}, transparent 70%)` }} />
                  <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1 }}>{glyph}</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.15rem', fontWeight: 600, color: '#f5e8c8', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{title}</h3>
                  <p className="eh-prose" style={{ fontSize: '0.875rem', margin: 0 }}>{body}</p>
                  <div className="eh-label" style={{ marginTop: '2rem', color: '#ffd080' }}>Access Module →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="eh-divider" />

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="eh-section">
        <div className="eh-container" style={{ textAlign: 'center' }}>
          <p className="eh-label" style={{ marginBottom: '1.5rem' }}>Begin Your Journey</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem', color: '#f5e8c8' }}>
            Ready to bridge<br />the gap between eras?
          </h2>
          <p className="eh-prose" style={{ maxWidth: '440px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
            Join our initiative to preserve and explore the human story through the lens of modern technology.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth">
              <button className="eh-btn eh-btn-primary" style={{ padding: '0.9rem 2rem' }}>
                Initialize Account
              </button>
            </Link>
            <Link href="/cinematic-search">
              <button className="eh-btn eh-btn-ghost" style={{ padding: '0.9rem 2rem' }}>
                Open Archive
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(200,160,80,0.08)', background: '#05040a', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.2rem' }}>𓂀</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'0.9rem', color:'rgba(245,232,200,0.4)' }}>Echoes of History</span>
        </div>
        <p className="eh-label" style={{ color: 'rgba(245,232,200,0.2)' }}>
          © 2026 Human Preservation Initiative · All Rights Reserved
        </p>
      </footer>
    </div>
  )
}
