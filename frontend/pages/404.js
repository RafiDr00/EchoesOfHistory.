import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function Custom404() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,160,80,${p.opacity})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#f5e8c8', fontFamily: "'Playfair Display', Georgia, serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <Head><title>Lost in Time — 404 | Echoes of History</title></Head>

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.4)', marginBottom: '2rem' }}>
          Temporal Error
        </p>

        <div style={{ fontSize: 'clamp(6rem,20vw,12rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '1rem', opacity: 0.08, userSelect: 'none' }}>
          404
        </div>

        <div style={{ marginTop: '-6rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Lost in<br />
            <span style={{ background: 'linear-gradient(135deg,#ffd080,#c8903a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Time
            </span>
          </h1>
        </div>

        <p style={{ fontSize: '1rem', color: 'rgba(245,232,200,0.4)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '3rem' }}>
          The record you seek has been redacted or never existed in the current continuity.
        </p>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.25)', marginBottom: '3rem' }}>
          ERR_TEMPORAL_OFFSET_404
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '0.875rem 2rem',
              background: 'rgba(200,160,80,0.1)',
              border: '1px solid rgba(200,160,80,0.4)',
              borderRadius: '3px', color: '#ffd080',
              fontFamily: "'Space Mono', monospace", fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(200,160,80,0.2)'; e.currentTarget.style.borderColor = 'rgba(200,160,80,0.65)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(200,160,80,0.1)'; e.currentTarget.style.borderColor = 'rgba(200,160,80,0.4)' }}
            >Return to Present</button>
          </Link>
          <Link href="/explore" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '0.875rem 2rem',
              background: 'transparent',
              border: '1px solid rgba(245,232,200,0.12)',
              borderRadius: '3px', color: 'rgba(245,232,200,0.5)',
              fontFamily: "'Space Mono', monospace", fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(245,232,200,0.3)'; e.currentTarget.style.color = '#f5e8c8' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(245,232,200,0.12)'; e.currentTarget.style.color = 'rgba(245,232,200,0.5)' }}
            >Open Archive</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
