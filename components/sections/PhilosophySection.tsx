'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import * as THREE from 'three'

export default function PhilosophySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    const canvas = document.getElementById('phil-canvas') as HTMLCanvasElement
    if (!canvas || !canvas.parentElement) return

    const w = canvas.parentElement.offsetWidth
    const h = canvas.parentElement.offsetHeight

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 0, 8)

    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dl = new THREE.DirectionalLight(0xc9a84c, 2)
    dl.position.set(3, 5, 5)
    scene.add(dl)
    const pl = new THREE.PointLight(0x7a9e6e, 3, 20)
    pl.position.set(-3, -2, 4)
    scene.add(pl)

    const helixPoints: THREE.Vector3[] = []
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 6 - Math.PI * 3
      helixPoints.push(new THREE.Vector3(Math.cos(t) * 1.5, t / 3, Math.sin(t) * 1.5))
    }

    const helixCurve = new THREE.CatmullRomCurve3(helixPoints)
    const helixGeo   = new THREE.TubeGeometry(helixCurve, 200, 0.025, 8, false)
    scene.add(new THREE.Mesh(
      helixGeo,
      new THREE.MeshStandardMaterial({ color: 0x7a9e6e, emissive: 0x2a4e1a, emissiveIntensity: 0.5 })
    ))

    const helixPoints2 = helixPoints.map((_p, i) => {
      const t = (i / 100) * Math.PI * 6 - Math.PI * 3
      return new THREE.Vector3(-Math.cos(t) * 1.5, t / 3, -Math.sin(t) * 1.5)
    })
    const helixGeo2 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints2), 200, 0.025, 8, false)
    scene.add(new THREE.Mesh(
      helixGeo2,
      new THREE.MeshStandardMaterial({ color: 0xc9a84c, emissive: 0x6a4814, emissiveIntensity: 0.3 })
    ))

    for (let i = 5; i < 95; i += 8) {
      const p1 = helixPoints[i], p2 = helixPoints2[i]
      const mid = new THREE.Vector3().lerpVectors(p1, p2, 0.5)
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, p1.distanceTo(p2), 4),
        new THREE.MeshStandardMaterial({ color: 0xd4e0ca, transparent: true, opacity: 0.5 })
      )
      bar.position.copy(mid)
      bar.lookAt(p2)
      bar.rotateX(Math.PI / 2)
      scene.add(bar)
    }

    let elapsed = 0
    let raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      elapsed += 0.005
      scene.rotation.y = elapsed * 0.3
      scene.position.y = Math.sin(elapsed * 0.5) * 0.3
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!canvas.parentElement) return
      const nw = canvas.parentElement.offsetWidth
      const nh = canvas.parentElement.offsetHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <section
      id="philosophy"
      ref={ref}
      style={{
        padding: '140px 60px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80,
        alignItems: 'center',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      <div style={{ position: 'relative', height: 600 }}>
        <canvas
          id="phil-canvas"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      <div style={{ paddingLeft: 40 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 40, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
          Our Philosophy
        </p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(38px,4vw,60px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 28 }}>
          Nature holds every<br />
          <em style={{ fontStyle: 'italic', color: 'var(--sage)' }}>answer your hair needs</em>
        </h2>
        <p style={{ fontSize: 15, lineHeight: 2, color: 'rgba(245,240,232,0.7)', marginBottom: 24 }}>
          At Herbixe, we believe that centuries of Ayurvedic wisdom hold solutions that no laboratory can replicate. Each product is a careful distillation of botanicals known for their transformative effects on hair health.
        </p>
        <p style={{ fontSize: 15, lineHeight: 2, color: 'rgba(245,240,232,0.7)', marginBottom: 24 }}>
          We source our herbs from trusted growers across India's most fertile regions — from the tulsi of Mathura to the bhringraj of Bengal — and process them with cold-press techniques that preserve every active compound.
        </p>
        <div style={{ display: 'flex', gap: 48, marginTop: 48 }}>
          {[['23+', 'Active Botanicals'], ['0%', 'Synthetic Chemicals'], ['4.9', 'Avg. Rating']].map(([n, l]) => (
            <div key={l} style={{ borderLeft: '1px solid var(--gold)', paddingLeft: 20 }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.6, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
