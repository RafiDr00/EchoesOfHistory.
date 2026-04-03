'use client'
import { useEffect, useRef, useState } from 'react'

const HISTORICAL_PINS = [
  { lat: 41.9,  lon: 12.5,  label: 'Rome',         year: '27 BC' },
  { lat: 29.9,  lon: 31.1,  label: 'Giza',         year: '2560 BC' },
  { lat: 37.9,  lon: 23.7,  label: 'Athens',        year: '461 BC' },
  { lat: 39.9,  lon: 116.4, label: 'Beijing',       year: '1420' },
  { lat: 27.1,  lon: 78.0,  label: 'Agra',          year: '1631' },
  { lat: 51.5,  lon: -0.1,  label: 'London',        year: '1066' },
  { lat: 48.8,  lon: 2.3,   label: 'Paris',         year: '1789' },
  { lat: -13.1, lon: -72.5, label: 'Machu Picchu',  year: '1450' },
  { lat: 35.6,  lon: 139.6, label: 'Edo',           year: '1603' },
  { lat: 19.4,  lon: -99.1, label: 'Tenochtitlan',  year: '1325' },
  { lat: 30.0,  lon: 31.2,  label: 'Alexandria',    year: '331 BC' },
  { lat: 36.4,  lon: 36.9,  label: 'Antioch',       year: '300 BC' },
]

function latLonToVec3(lat, lon, r) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return {
    x: -(r * Math.sin(phi) * Math.cos(theta)),
    y:   r * Math.cos(phi),
    z:   r * Math.sin(phi) * Math.sin(theta),
  }
}

export default function Hero3D({ onSearch, onCinematicSearch }) {
  const canvasRef = useRef(null)
  const [query, setQuery] = useState('')
  const disposeRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onCinematicSearch?.(query)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.onload = () => initScene()
    document.head.appendChild(script)
    return () => {
      disposeRef.current?.()
      try { document.head.removeChild(script) } catch {}
    }
  }, [])

  function initScene() {
    const THREE = window.THREE
    const canvas = canvasRef.current
    if (!canvas) return

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(W(), H())
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 1000)
    camera.position.set(0.6, 0, 3.2)

    // Lights
    scene.add(new THREE.AmbientLight(0xfff5e0, 0.4))
    const sun = new THREE.DirectionalLight(0xffd580, 2.2)
    sun.position.set(-3, 2, 2)
    scene.add(sun)
    const rim = new THREE.PointLight(0xc8a96e, 0.8, 20)
    rim.position.set(3, -1, -2)
    scene.add(rim)

    // Procedural globe texture
    const tc = document.createElement('canvas')
    tc.width = 1024; tc.height = 512
    const ctx = tc.getContext('2d')
    ctx.fillStyle = '#060c1a'; ctx.fillRect(0, 0, 1024, 512)

    // Ocean shimmer
    const oceanGrad = ctx.createLinearGradient(0, 0, 1024, 512)
    oceanGrad.addColorStop(0, 'rgba(10,20,50,0.9)')
    oceanGrad.addColorStop(0.5, 'rgba(15,30,70,0.6)')
    oceanGrad.addColorStop(1, 'rgba(8,16,40,0.9)')
    ctx.fillStyle = oceanGrad; ctx.fillRect(0, 0, 1024, 512)

    // Landmasses
    const continents = [
      [490, 145, 65, 55, 0.4],   // Europe
      [495, 200, 58, 110, 0.35], // Africa
      [590, 118, 180, 95, 0.38], // Asia
      [185, 105, 55, 90, 0.32],  // N.America
      [230, 280, 40, 70, 0.28],  // S.America
      [720, 270, 65, 42, 0.25],  // Australia
    ]
    continents.forEach(([x, y, w, h, op]) => {
      const g = ctx.createRadialGradient(x,y, 0, x,y, Math.max(w,h))
      g.addColorStop(0,   `rgba(170,120,50,${op})`)
      g.addColorStop(0.5, `rgba(120,80,30,${op*0.6})`)
      g.addColorStop(1,   'rgba(80,50,20,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(x, y, w, h, 0.2, 0, Math.PI * 2)
      ctx.fill()
    })

    // Grid
    ctx.strokeStyle = 'rgba(200,160,80,0.07)'; ctx.lineWidth = 0.5
    for (let i = 0; i < 1024; i += 85) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke() }
    for (let i = 0; i < 512; i += 42) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(1024,i); ctx.stroke() }

    const globeTex = new THREE.CanvasTexture(tc)
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ map: globeTex, specular: new THREE.Color(0xc8a050), shininess: 20 })
    )
    scene.add(globe)

    // Atmosphere
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0xd4a050, transparent: true, opacity: 0.035, side: THREE.BackSide })
    ))

    // Wireframe
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.004, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xc8a050, wireframe: true, transparent: true, opacity: 0.035 })
    ))

    // Pins
    const pinGroup = new THREE.Group()
    scene.add(pinGroup)
    const pulseRings = []

    HISTORICAL_PINS.forEach(pin => {
      const p = latLonToVec3(pin.lat, pin.lon, 1.02)
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffd080 })
      )
      dot.position.set(p.x, p.y, p.z)
      pinGroup.add(dot)

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.024, 0.036, 16),
        new THREE.MeshBasicMaterial({ color: 0xffd080, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      )
      ring.position.set(p.x, p.y, p.z)
      ring.lookAt(0, 0, 0)
      pinGroup.add(ring)
      pulseRings.push(ring)
    })

    // Stars
    const sPos = new Float32Array(1400 * 3)
    for (let i = 0; i < 1400; i++) {
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      const r = 8 + Math.random() * 6
      sPos[i*3]   = r*Math.sin(p)*Math.cos(t)
      sPos[i*3+1] = r*Math.sin(p)*Math.sin(t)
      sPos[i*3+2] = r*Math.cos(p)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xfff8e8, size: 0.022, transparent: true, opacity: 0.75 })))

    // Dust
    const dPos = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      dPos[i*3]   = (Math.random()-0.5)*5
      dPos[i*3+1] = (Math.random()-0.5)*5
      dPos[i*3+2] = (Math.random()-0.5)*5
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xd4a060, size: 0.007, transparent: true, opacity: 0.25 })))

    // Equator ring
    const eqPts = []
    for (let i = 0; i <= 128; i++) {
      const a = (i/128)*Math.PI*2
      eqPts.push(new THREE.Vector3(Math.cos(a)*1.55, 0, Math.sin(a)*1.55))
    }
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(eqPts),
      new THREE.LineBasicMaterial({ color: 0xc8a050, transparent: true, opacity: 0.1 })
    ))

    // Interaction
    let rotY = 0, rotX = 0, dragging = false, prevX = 0, prevY = 0, autoSpin = true

    const onMouseMove = (e) => {
      if (!dragging) return
      rotY += (e.clientX - prevX) * 0.005
      rotX += (e.clientY - prevY) * 0.003
      rotX = Math.max(-0.8, Math.min(0.8, rotX))
      prevX = e.clientX; prevY = e.clientY
      autoSpin = false; setTimeout(() => { autoSpin = true }, 3000)
    }
    const onDown = (e) => { dragging = true; prevX = e.clientX; prevY = e.clientY }
    const onUp   = () => { dragging = false }
    const onTouch = (e) => {
      const t = e.touches[0]
      rotY += (t.clientX - prevX) * 0.005
      prevX = t.clientX; prevY = t.clientY
    }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchstart', (e) => { prevX = e.touches[0].clientX; prevY = e.touches[0].clientY })
    canvas.addEventListener('touchmove', onTouch)

    const onResize = () => {
      renderer.setSize(W(), H())
      camera.aspect = W() / H()
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let frame = 0, rafId
    const tick = () => {
      rafId = requestAnimationFrame(tick)
      frame++
      if (autoSpin) rotY += 0.0018
      globe.rotation.y += (rotY - globe.rotation.y) * 0.06
      globe.rotation.x += (rotX - globe.rotation.x) * 0.06
      pinGroup.rotation.y = globe.rotation.y
      pinGroup.rotation.x = globe.rotation.x
      pulseRings.forEach((r, i) => {
        r.material.opacity = 0.25 + 0.45 * Math.abs(Math.sin(frame * 0.04 + i * 0.6))
      })
      renderer.render(scene, camera)
    }
    tick()

    disposeRef.current = () => {
      cancelAnimationFrame(rafId)
      renderer.dispose()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('resize', onResize)
    }
  }

  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', background: '#000' }}>
      {/* WebGL */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.88) 100%)' }} />

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.25,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
        backgroundSize: '160px'
      }} />

      {/* UI */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>

        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(200,160,80,0.55)', marginBottom: '2rem', animation: 'ehFadeDown 1.2s ease both' }}>
          Human Archive · Est. 3000 BC
        </p>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(3rem, 9vw, 8rem)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          color: '#f5e8c8',
          textShadow: '0 0 80px rgba(200,160,80,0.25), 0 2px 4px rgba(0,0,0,0.9)',
          animation: 'ehFadeUp 1s ease 0.3s both',
          maxWidth: '900px',
          padding: '0 2rem',
          margin: 0,
        }}>
          Echoes of<br />
          <span style={{ background: 'linear-gradient(135deg,#ffd080,#c8903a,#ffd080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            History
          </span>
        </h1>

        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.9rem, 1.8vw, 1.25rem)',
          color: 'rgba(245,232,200,0.45)',
          marginTop: '1.5rem',
          letterSpacing: '0.04em',
          animation: 'ehFadeUp 1s ease 0.6s both',
          textAlign: 'center',
          maxWidth: '480px',
          padding: '0 1.5rem',
        }}>
          Five thousand years of human achievement — now searchable.
        </p>

        <div style={{ width: '48px', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(200,160,80,0.5),transparent)', margin: '2rem 0', animation: 'ehFadeIn 1s ease 0.9s both' }} />

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '520px', padding: '0 1.5rem', animation: 'ehFadeUp 1s ease 0.9s both', pointerEvents: 'auto' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search a figure, era, or event..."
              style={{
                width: '100%', padding: '0.95rem 3rem 0.95rem 1.4rem',
                background: 'rgba(245,232,200,0.04)',
                border: '1px solid rgba(200,160,80,0.28)',
                borderRadius: '3px',
                color: '#f5e8c8', fontSize: '0.9rem',
                fontFamily: "'Playfair Display', serif",
                outline: 'none', backdropFilter: 'blur(20px)',
                letterSpacing: '0.02em', boxSizing: 'border-box',
              }}
              onFocus={e => { e.target.style.borderColor='rgba(200,160,80,0.65)'; e.target.style.boxShadow='0 0 24px rgba(200,160,80,0.1)' }}
              onBlur={e => { e.target.style.borderColor='rgba(200,160,80,0.28)'; e.target.style.boxShadow='none' }}
            />
            <button type="submit" style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(200,160,80,0.6)', cursor:'pointer', display:'flex', alignItems:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>

          <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
            <button type="submit" className="eh-btn-primary">✦ Cinematic Search</button>
            <button type="button" className="eh-btn-ghost" onClick={() => { if(query.trim()) onSearch?.(query) }}>Archive Search</button>
          </div>
        </form>

        <p style={{ position:'absolute', bottom:'2.5rem', fontFamily:"'Space Mono',monospace", fontSize:'9px', letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(200,160,80,0.28)', animation:'ehFadeIn 2s ease 2s both' }}>
          Drag to rotate · {HISTORICAL_PINS.length} sites mapped
        </p>
      </div>

      <style>{`
        @keyframes ehFadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ehFadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ehFadeIn   { from{opacity:0} to{opacity:1} }
        .eh-btn-primary {
          flex:1; padding:0.7rem; cursor:pointer;
          background:rgba(200,160,80,0.1); border:1px solid rgba(200,160,80,0.38); border-radius:3px;
          color:#ffd080; font-size:10px; font-family:'Space Mono',monospace;
          letter-spacing:0.18em; text-transform:uppercase;
          transition:all 0.18s;
        }
        .eh-btn-primary:hover { background:rgba(200,160,80,0.2); border-color:rgba(200,160,80,0.65); }
        .eh-btn-ghost {
          flex:1; padding:0.7rem; cursor:pointer;
          background:transparent; border:1px solid rgba(245,232,200,0.1); border-radius:3px;
          color:rgba(245,232,200,0.45); font-size:10px; font-family:'Space Mono',monospace;
          letter-spacing:0.18em; text-transform:uppercase;
          transition:all 0.18s;
        }
        .eh-btn-ghost:hover { background:rgba(245,232,200,0.05); color:rgba(245,232,200,0.75); }
      `}</style>
    </section>
  )
}
