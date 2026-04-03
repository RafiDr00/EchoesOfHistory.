import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatInterface from '../components/ChatInterface'
import InteractiveTimeline from '../components/InteractiveTimeline'
import EchoeNav from '../components/EchoeNav'

const VIEWS = [
  { id: 'timeline', label: 'Chronicle', glyph: '𓇌' },
  { id: 'chat',     label: 'Dialogue',  glyph: '𓂀' },
  { id: 'both',     label: 'Split',     glyph: '𓆙' },
]

export default function Explore() {
  const [activeView, setActiveView] = useState('timeline')

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#f5e8c8', fontFamily: "'Playfair Display', Georgia, serif" }}>
      <Head>
        <title>Explore — Echoes of History</title>
        <meta name="description" content="Navigate the historical timeline and converse with figures from the past." />
      </Head>

      <EchoeNav current="explore" />

      {/* Page header */}
      <div style={{ paddingTop: '9rem', paddingBottom: '3rem', paddingLeft: '3rem', paddingRight: '3rem', borderBottom: '1px solid rgba(200,160,80,0.08)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 60% 0%, rgba(200,160,80,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.5)', marginBottom: '1rem' }}>
            Interactive Chronicles
          </p>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '1rem' }}>
            Navigate the{' '}
            <span style={{ background: 'linear-gradient(135deg,#ffd080,#c8903a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Archive
            </span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(245,232,200,0.45)', maxWidth: '480px', lineHeight: 1.75, fontStyle: 'italic' }}>
            Browse the chronological continuity engine or engage in direct dialogue with figures from the past.
          </p>
        </div>
      </div>

      {/* View toggle */}
      <div style={{ padding: '1.5rem 3rem', borderBottom: '1px solid rgba(200,160,80,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setActiveView(v.id)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            background: activeView === v.id ? 'rgba(200,160,80,0.1)' : 'transparent',
            border: `1px solid ${activeView === v.id ? 'rgba(200,160,80,0.4)' : 'rgba(200,160,80,0.1)'}`,
            borderRadius: '3px',
            color: activeView === v.id ? '#ffd080' : 'rgba(245,232,200,0.35)',
            fontFamily: "'Space Mono', monospace", fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{v.glyph}</span>
            {v.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,232,200,0.25)' }}>
            Archive Online
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '2.5rem 3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: activeView === 'both' ? '1.4fr 1fr' : '1fr',
              gap: '2rem',
            }}
          >
            {(activeView === 'timeline' || activeView === 'both') && (
              <div style={{ border: '1px solid rgba(200,160,80,0.12)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(12,11,20,0.6)' }}>
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(200,160,80,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.5)' }}>Chronological View</p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>The Chronicle</h2>
                  </div>
                  <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>𓇌</span>
                </div>
                <div style={{ padding: '1.5rem', minHeight: '600px', overflowY: 'auto' }}>
                  <InteractiveTimeline darkMode={true} />
                </div>
              </div>
            )}

            {(activeView === 'chat' || activeView === 'both') && (
              <div style={{ border: '1px solid rgba(200,160,80,0.12)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(12,11,20,0.6)', height: activeView === 'both' ? '700px' : '800px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(200,160,80,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <div>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.5)' }}>AI Dialogue</p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>Speak with History</h2>
                  </div>
                  <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>𓂀</span>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <ChatInterface darkMode={true} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
