import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'

const FIGURES = [
  'Leonardo da Vinci', 'Cleopatra VII', 'Napoleon Bonaparte',
  'Joan of Arc', 'Julius Caesar', 'Marie Curie', 'Albert Einstein',
]

const TOKEN_STYLE = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase',
}

export default function ChatInterface() {
  const [messages, setMessages] = useState([{
    id: 1, type: 'assistant',
    content: 'Greetings. I am Leonardo da Vinci — painter, engineer, and perpetual student of nature. What would you like to explore?',
    figure: 'Leonardo da Vinci', timestamp: new Date(),
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [figure, setFigure] = useState('Leonardo da Vinci')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const text = input.trim()
    const userMsg = { id: Date.now(), type: 'user', content: text, timestamp: new Date() }
    setMessages(p => [...p, userMsg])
    setInput(''); setLoading(true)

    try {
      const data = await api.post('/chat', { figure, message: text })
      setMessages(p => [...p, {
        id: Date.now() + 1, type: 'assistant',
        content: data.response || data.reply || "The threads of time are momentarily tangled.",
        figure, timestamp: new Date(),
      }])
    } catch {
      setMessages(p => [...p, {
        id: Date.now() + 1, type: 'assistant',
        content: "I cannot respond at this moment. The connection has been lost.",
        figure, timestamp: new Date(), isError: true,
      }])
    } finally { setLoading(false) }
  }

  const changeFigure = (f) => {
    setFigure(f)
    setMessages([{
      id: Date.now(), type: 'assistant',
      content: `I am ${f}. How may I illuminate the past for you?`,
      figure: f, timestamp: new Date(),
    }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Playfair Display', Georgia, serif" }}>

      {/* Figure selector */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(200,160,80,0.1)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '180px' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(200,160,80,0.1)', border: '1px solid rgba(200,160,80,0.3)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#ffd080', flexShrink: 0 }}>
            {figure.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f5e8c8' }}>{figure}</div>
            <div style={{ ...TOKEN_STYLE, color: 'rgba(200,160,80,0.5)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Historical Mode
            </div>
          </div>
        </div>
        <select value={figure} onChange={e => changeFigure(e.target.value)} style={{
          padding: '0.5rem 0.75rem',
          background: 'rgba(245,232,200,0.03)',
          border: '1px solid rgba(200,160,80,0.2)',
          borderRadius: '3px', color: 'rgba(245,232,200,0.7)',
          fontFamily: "'Space Mono', monospace", fontSize: '9px',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          outline: 'none', cursor: 'pointer',
        }}>
          {FIGURES.map(f => <option key={f} value={f} style={{ background: '#0c0b14' }}>{f}</option>)}
        </select>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '82%' }}>
                <div style={{
                  padding: '0.875rem 1.1rem',
                  borderRadius: '3px',
                  fontSize: '0.875rem', lineHeight: 1.75,
                  background: msg.type === 'user'
                    ? 'rgba(200,160,80,0.1)'
                    : msg.isError
                      ? 'rgba(200,60,60,0.06)'
                      : 'rgba(245,232,200,0.04)',
                  border: msg.type === 'user'
                    ? '1px solid rgba(200,160,80,0.3)'
                    : msg.isError
                      ? '1px solid rgba(200,60,60,0.2)'
                      : '1px solid rgba(245,232,200,0.06)',
                  color: msg.type === 'user' ? '#f5e8c8' : msg.isError ? '#f08080' : 'rgba(245,232,200,0.75)',
                  fontStyle: msg.type === 'assistant' ? 'italic' : 'normal',
                }}>
                  {msg.content}
                </div>
                <div style={{ ...TOKEN_STYLE, color: 'rgba(245,232,200,0.2)', marginTop: '4px', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                  {msg.type === 'assistant' ? msg.figure : 'You'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '0.875rem 1.25rem', border: '1px solid rgba(245,232,200,0.06)', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ opacity: [0.2,1,0.2], scaleY: [0.5,1,0.5] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  style={{ width: '3px', height: '12px', background: 'rgba(200,160,80,0.5)', borderRadius: '2px' }} />
              ))}
              <span style={{ ...TOKEN_STYLE, color: 'rgba(200,160,80,0.4)', marginLeft: '4px' }}>Composing response</span>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(200,160,80,0.1)', flexShrink: 0 }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder={`Ask ${figure.split(' ')[0]}...`}
            style={{
              flex: 1, padding: '0.75rem 1rem',
              background: 'rgba(245,232,200,0.03)',
              border: '1px solid rgba(200,160,80,0.15)',
              borderRadius: '3px', color: '#f5e8c8',
              fontFamily: "'Playfair Display', serif", fontSize: '0.875rem',
              outline: 'none', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(200,160,80,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(200,160,80,0.15)'}
          />
          <button type="submit" disabled={!input.trim() || loading} style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(200,160,80,0.1)',
            border: '1px solid rgba(200,160,80,0.35)',
            borderRadius: '3px', color: '#ffd080',
            fontFamily: "'Space Mono', monospace", fontSize: '10px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            cursor: !input.trim() || loading ? 'default' : 'pointer',
            opacity: !input.trim() || loading ? 0.45 : 1,
            transition: 'all 0.15s',
          }}>Send</button>
        </form>
        <p style={{ ...TOKEN_STYLE, color: 'rgba(245,232,200,0.18)', marginTop: '0.75rem', textAlign: 'center' }}>
          Responses generated from historical records
        </p>
      </div>
    </div>
  )
}
