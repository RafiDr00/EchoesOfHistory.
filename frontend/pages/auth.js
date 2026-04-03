import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '../lib/api'

const S = {
  page: {
    minHeight: '100vh', background: '#000',
    display: 'flex', alignItems: 'stretch',
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#f5e8c8',
  },
  left: {
    flex: 1, display: 'flex', flexDirection: 'column',
    justifyContent: 'center', padding: '4rem 5rem',
    position: 'relative', overflow: 'hidden',
  },
  right: {
    width: '480px', background: 'rgba(12,11,20,0.95)',
    borderLeft: '1px solid rgba(200,160,80,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '3rem',
  },
}

const FIGURES = [
  { glyph: '𓂀', name: 'Leonardo da Vinci', era: '1452 – 1519' },
  { glyph: '𓆙', name: 'Cleopatra VII', era: '69 – 30 BC' },
  { glyph: '𓇌', name: 'Napoleon Bonaparte', era: '1769 – 1821' },
]

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLogin && form.password !== form.confirmPassword) {
      setStatus({ ok: false, text: 'Passwords do not match.' })
      return
    }
    setLoading(true); setStatus(null)
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const payload = isLogin
        ? { username: form.email, password: form.password }
        : { email: form.email, password: form.password, username: form.username }
      const data = await api.post(endpoint, payload)
      if (isLogin) {
        localStorage.setItem('token', data.access_token)
        setStatus({ ok: true, text: 'Access granted. Entering archive...' })
        setTimeout(() => window.location.href = '/explore', 1200)
      } else {
        setStatus({ ok: true, text: 'Identity created. Proceed to sign in.' })
        setTimeout(() => setIsLogin(true), 1500)
      }
    } catch (err) {
      setStatus({ ok: false, text: err.message || 'Authentication failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <Head><title>{isLogin ? 'Sign In' : 'Register'} — Echoes of History</title></Head>

      {/* Left — decorative */}
      <div style={S.left}>
        {/* Radial glow */}
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(200,160,80,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Link href="/" style={{ textDecoration: 'none', marginBottom: '4rem', display: 'inline-block' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: 'italic', fontSize: '1.25rem', color: '#f5e8c8', borderBottom: '1px solid rgba(200,160,80,0.4)', paddingBottom: '2px' }}>Echoes</span>
        </Link>

        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.5)', marginBottom: '1.5rem' }}>
          The Human Archive
        </p>

        <h1 style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.5rem', maxWidth: '480px' }}>
          Five thousand years<br />
          <span style={{ background: 'linear-gradient(135deg,#ffd080,#c8903a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            await you.
          </span>
        </h1>

        <p style={{ fontSize: '1rem', color: 'rgba(245,232,200,0.45)', lineHeight: 1.8, maxWidth: '380px', fontStyle: 'italic', marginBottom: '3rem' }}>
          Create an identity to save your discoveries, converse with historical figures, and navigate the full archive.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FIGURES.map(f => (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.25rem', border: '1px solid rgba(200,160,80,0.1)', borderRadius: '4px', background: 'rgba(200,160,80,0.03)' }}>
              <span style={{ fontSize: '1.5rem', opacity: 0.7 }}>{f.glyph}</span>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f5e8c8' }}>{f.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(200,160,80,0.45)', marginTop: '2px' }}>{f.era}</div>
              </div>
            </div>
          ))}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(245,232,200,0.2)', paddingLeft: '0.25rem' }}>
            + 12,000 more figures
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={S.right}>
        <div style={{ width: '100%', maxWidth: '360px' }}>

          {/* Tab toggle */}
          <div style={{ display: 'flex', marginBottom: '2.5rem', borderBottom: '1px solid rgba(200,160,80,0.12)' }}>
            {['Sign In', 'Register'].map((label, i) => {
              const active = (i === 0) === isLogin
              return (
                <button key={label} onClick={() => setIsLogin(i === 0)} style={{
                  flex: 1, padding: '0.875rem', background: 'none', border: 'none',
                  fontFamily: "'Space Mono', monospace", fontSize: '10px',
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: active ? '#ffd080' : 'rgba(245,232,200,0.3)',
                  borderBottom: active ? '1px solid #ffd080' : '1px solid transparent',
                  marginBottom: '-1px', cursor: 'pointer', transition: 'all 0.15s',
                }}>{label}</button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.55)' }}>Username</span>
                <input name="username" type="text" value={form.username} onChange={handleChange} required={!isLogin}
                  placeholder="your_name" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </label>
            )}

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.55)' }}>Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.55)' }}>Password</span>
              <input name="password" type="password" value={form.password} onChange={handleChange} required
                placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </label>

            {!isLogin && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.55)' }}>Confirm Password</span>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required={!isLogin}
                  placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </label>
            )}

            {status && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '3px', fontSize: '0.8rem',
                background: status.ok ? 'rgba(200,160,80,0.08)' : 'rgba(200,60,60,0.08)',
                border: `1px solid ${status.ok ? 'rgba(200,160,80,0.3)' : 'rgba(200,60,60,0.3)'}`,
                color: status.ok ? '#ffd080' : '#f08080',
                fontFamily: "'Space Mono', monospace", fontSize: '11px',
              }}>{status.text}</div>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop: '0.5rem', padding: '0.9rem',
              background: loading ? 'rgba(200,160,80,0.05)' : 'rgba(200,160,80,0.1)',
              border: '1px solid rgba(200,160,80,0.4)',
              borderRadius: '3px', color: '#ffd080',
              fontFamily: "'Space Mono', monospace", fontSize: '11px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: loading ? 'default' : 'pointer',
              transition: 'all 0.18s', opacity: loading ? 0.6 : 1,
            }}
              onMouseOver={e => { if (!loading) { e.currentTarget.style.background = 'rgba(200,160,80,0.2)'; e.currentTarget.style.borderColor = 'rgba(200,160,80,0.65)' } }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(200,160,80,0.1)'; e.currentTarget.style.borderColor = 'rgba(200,160,80,0.4)' }}
            >
              {loading ? 'Verifying...' : (isLogin ? 'Enter Archive' : 'Create Identity')}
            </button>
          </form>

          <p style={{ marginTop: '2rem', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,232,200,0.2)', textAlign: 'center' }}>
            {isLogin ? (
              <span>No account? <span style={{ color: 'rgba(200,160,80,0.5)', cursor: 'pointer' }} onClick={() => setIsLogin(false)}>Register here</span></span>
            ) : (
              <span>Have an account? <span style={{ color: 'rgba(200,160,80,0.5)', cursor: 'pointer' }} onClick={() => setIsLogin(true)}>Sign in</span></span>
            )}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes ehFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: rgba(245,232,200,0.2) !important; }
        @media (max-width: 768px) {
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; min-height: 100vh; }
        }
      `}</style>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '0.875rem 1rem',
  background: 'rgba(245,232,200,0.03)',
  border: '1px solid rgba(200,160,80,0.2)',
  borderRadius: '3px', color: '#f5e8c8',
  fontFamily: "'Playfair Display', serif", fontSize: '0.9rem',
  outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
}
const onFocus = e => { e.target.style.borderColor = 'rgba(200,160,80,0.6)'; e.target.style.boxShadow = '0 0 20px rgba(200,160,80,0.08)' }
const onBlur  = e => { e.target.style.borderColor = 'rgba(200,160,80,0.2)'; e.target.style.boxShadow = 'none' }
