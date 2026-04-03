import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function EchoeNav({ current = '' }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = ['Explore', 'Archive', 'Chronicle']

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '1rem 3rem' : '1.75rem 3rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(5,4,10,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(200,160,80,0.1)' : 'none',
      transition: 'all 0.35s ease',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700, fontStyle: 'italic',
          fontSize: '1.25rem', letterSpacing: '0.01em',
          color: '#f5e8c8',
          borderBottom: '1px solid rgba(200,160,80,0.4)',
          paddingBottom: '2px', cursor: 'pointer',
        }}>Echoes</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        {links.map(l => (
          <Link key={l} href={`/${l.toLowerCase()}`} style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px', letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: current === l.toLowerCase() ? '#ffd080' : 'rgba(245,232,200,0.35)',
              cursor: 'pointer', transition: 'color 0.15s',
            }}
              onMouseOver={e => e.target.style.color = '#ffd080'}
              onMouseOut={e => e.target.style.color = current === l.toLowerCase() ? '#ffd080' : 'rgba(245,232,200,0.35)'}
            >{l}</span>
          </Link>
        ))}
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '0.6rem 1.2rem',
            background: 'rgba(200,160,80,0.08)',
            border: '1px solid rgba(200,160,80,0.35)',
            borderRadius: '3px', color: '#ffd080',
            cursor: 'pointer', transition: 'all 0.18s',
          }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(200,160,80,0.18)'; e.currentTarget.style.borderColor = 'rgba(200,160,80,0.65)' }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(200,160,80,0.08)'; e.currentTarget.style.borderColor = 'rgba(200,160,80,0.35)' }}
          >Enter Archive</button>
        </Link>
      </div>
    </nav>
  )
}
