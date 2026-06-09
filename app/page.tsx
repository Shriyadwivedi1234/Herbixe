'use client'

import { useEffect, useRef, JSX } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore, useCartHydrated } from '@/store/cartStore'
import { useAuth } from '@/components/providers/AuthProvider'
import { PRODUCTS, getFeaturedProducts } from '@/lib/products'
export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const hydrated = useCartHydrated()
  const { items, isOpen, toggleCart, closeCart, addItem, removeItem, subtotal } = useCartStore()
  const cartItems = hydrated ? items : []
  const total = hydrated ? subtotal() : 0
  const count = cartItems.reduce((s, i) => s + i.qty, 0)
  const featured = getFeaturedProducts()

  // ── Notification helper ──
  const notify = (msg: string) => {
    const el = document.getElementById('notification')
    if (!el) return
    el.textContent = msg
    el.classList.add('show')
    setTimeout(() => el.classList.remove('show'), 2500)
  }

  // ── Scroll reveal ──
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])



  // ── Three.js Hero (empty scene — canvas only) ──
  useEffect(() => {
    const THREE = (window as any).THREE
    if (!THREE) return
    const canvas   = document.getElementById('hero-canvas') as HTMLCanvasElement
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200)
    camera.position.set(0, 0, 13)
    scene.add(new THREE.AmbientLight(0x1a3d1a, 0.7))
    const dl = new THREE.DirectionalLight(0xc9a84c, 2.2); dl.position.set(5, 10, 8); scene.add(dl)
    const pl1 = new THREE.PointLight(0x4a7c4a, 3.5, 28); pl1.position.set(-6, -2, 9); scene.add(pl1)
    const pl2 = new THREE.PointLight(0xc9a84c, 2.0, 22); pl2.position.set(6, 4, 5); scene.add(pl2)
    const pl3 = new THREE.PointLight(0x1a5e3a, 1.8, 18); pl3.position.set(0, -7, 4); scene.add(pl3)
    let mouseX = 0, mouseY = 0
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)
    let t = 0, raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t += 0.007
      camera.position.x += (mouseX * 1.8 - camera.position.x) * 0.028
      camera.position.y += (-mouseY * 1.3 - camera.position.y) * 0.028
      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }
    animate()
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  // ── Three.js Philosophy (DNA double helix) ──
  useEffect(() => {
    const THREE = (window as any).THREE
    if (!THREE) return
    const canvas   = document.getElementById('phil-canvas') as HTMLCanvasElement
    if (!canvas) return
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(canvas.parentElement!.offsetWidth, canvas.parentElement!.offsetHeight)
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, canvas.parentElement!.offsetWidth / canvas.parentElement!.offsetHeight, 0.1, 100)
    camera.position.set(0, 0, 8)
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dl = new THREE.DirectionalLight(0xc9a84c, 2); dl.position.set(3, 5, 5); scene.add(dl)
    const pl = new THREE.PointLight(0x7a9e6e, 3, 20); pl.position.set(-3, -2, 4); scene.add(pl)
    const helixPoints: any[] = []
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 6 - Math.PI * 3
      helixPoints.push(new THREE.Vector3(Math.cos(t) * 1.5, t / 3, Math.sin(t) * 1.5))
    }
    const helixCurve  = new THREE.CatmullRomCurve3(helixPoints)
    const helixGeo    = new THREE.TubeGeometry(helixCurve, 200, 0.025, 8, false)
    scene.add(new THREE.Mesh(helixGeo, new THREE.MeshStandardMaterial({ color: 0x7a9e6e, emissive: 0x2a4e1a, emissiveIntensity: 0.5 })))
    const helixPoints2 = helixPoints.map((_p, i) => {
      const t = (i / 100) * Math.PI * 6 - Math.PI * 3
      return new THREE.Vector3(-Math.cos(t) * 1.5, t / 3, -Math.sin(t) * 1.5)
    })
    const helixGeo2 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints2), 200, 0.025, 8, false)
    scene.add(new THREE.Mesh(helixGeo2, new THREE.MeshStandardMaterial({ color: 0xc9a84c, emissive: 0x6a4814, emissiveIntensity: 0.3 })))
    for (let i = 5; i < 95; i += 8) {
      const p1 = helixPoints[i], p2 = helixPoints2[i]
      const mid = new THREE.Vector3().lerpVectors(p1, p2, 0.5)
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, p1.distanceTo(p2), 4),
        new THREE.MeshStandardMaterial({ color: 0xd4e0ca, transparent: true, opacity: 0.5 })
      )
      bar.position.copy(mid); bar.lookAt(p2); bar.rotateX(Math.PI / 2)
      scene.add(bar)
    }
    let t = 0, raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t += 0.005
      scene.rotation.y = t * 0.3
      scene.position.y = Math.sin(t * 0.5) * 0.3
      renderer.render(scene, camera)
    }
    animate()
    return () => { cancelAnimationFrame(raf); renderer.dispose() }
  }, [])

  // ── Three.js Featured (rotating jar) ──
  useEffect(() => {
    const THREE = (window as any).THREE
    if (!THREE) return
    const canvas   = document.getElementById('featured-canvas') as HTMLCanvasElement
    if (!canvas) return
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    const w = canvas.parentElement!.offsetWidth, h = canvas.parentElement!.offsetHeight
    renderer.setSize(w, h)
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.set(0, 0, 7)
    scene.add(new THREE.AmbientLight(0x4a5e3a, 0.8))
    const dl = new THREE.DirectionalLight(0xc9a84c, 3); dl.position.set(2, 4, 4); scene.add(dl)
    const pl = new THREE.PointLight(0x7a9e6e, 2, 15); pl.position.set(-2, -1, 3); scene.add(pl)
    const jar = new THREE.Group()
    jar.add(new THREE.Mesh(
      new THREE.CylinderGeometry(1, 0.9, 2.5, 32),
      new THREE.MeshStandardMaterial({ color: 0x1a2e0a, metalness: 0.1, roughness: 0.4, transparent: true, opacity: 0.9 })
    ))
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.8, roughness: 0.2 }))
    lid.position.y = 1.45; jar.add(lid)
    const label = new THREE.Mesh(new THREE.CylinderGeometry(1.01, 0.92, 1.5, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x2c3d1e, transparent: true, opacity: 0.7, side: THREE.DoubleSide }))
    label.position.y = -0.2; jar.add(label)
    scene.add(jar)
    const herbParticles: any[] = []
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.06, 6, 6)
      const mat = new THREE.MeshStandardMaterial({ color: Math.random() > 0.5 ? 0x7a9e6e : 0xc9a84c, emissive: 0x2a4e1a, emissiveIntensity: 0.4 })
      const p = new THREE.Mesh(geo, mat)
      const a = Math.random() * Math.PI * 2, r = 2 + Math.random() * 1.5
      herbParticles.push({ mesh: p, angle: a, radius: r, speed: (Math.random() - 0.5) * 0.02, yOff: (Math.random() - 0.5) * 4, phase: Math.random() * Math.PI * 2 })
      scene.add(p)
    }
    let t = 0, raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t += 0.01
      jar.rotation.y = Math.sin(t * 0.5) * 0.4 + t * 0.1
      jar.position.y = Math.sin(t * 0.7) * 0.2
      herbParticles.forEach(p => {
        p.angle += p.speed
        p.mesh.position.set(Math.cos(p.angle) * p.radius, p.yOff + Math.sin(t + p.phase) * 0.5, Math.sin(p.angle) * p.radius)
      })
      renderer.render(scene, camera)
    }
    animate()
    return () => { cancelAnimationFrame(raf); renderer.dispose() }
  }, [])

  const checkout = () => {
    if (!cartItems.length) { notify('Add items to cart first!'); return }
    closeCart()
    router.push(user ? '/checkout' : '/login?redirect=%2Fcheckout')
  }

  return (
    <>
      {/* ── Cart overlay ── */}
      <div id="cart-overlay" onClick={toggleCart} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1999, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none', transition:'opacity 0.4s' }} />

      {/* ── Cart sidebar ── */}
      <div style={{ position:'fixed', right:0, top:0, bottom:0, width:420, background:'var(--bark)', zIndex:2000, transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition:'transform 0.5s cubic-bezier(0.4,0,0.2,1)', borderLeft:'1px solid rgba(201,168,76,0.2)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:32, borderBottom:'1px solid rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:24, fontWeight:300 }}>Your Cart <span style={{ background:'var(--gold)', color:'var(--dark)', borderRadius:'50%', width:18, height:18, fontSize:10, display:'inline-flex', alignItems:'center', justifyContent:'center', marginLeft:6, fontWeight:500 }}>{count}</span></h3>
          <button onClick={toggleCart} style={{ background:'none', border:'none', color:'var(--cream)', fontSize:20, cursor:'none', opacity:0.6 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          {cartItems.length === 0
            ? <p style={{ color:'rgba(245,240,232,0.4)', fontSize:13, textAlign:'center', marginTop:40 }}>Your cart is empty</p>
            : cartItems.map((item, i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 1fr auto', gap:16, padding:'16px 0', borderBottom:'1px solid rgba(201,168,76,0.1)' }}>
                  <div style={{ width:60, height:60, background:'rgba(74,94,58,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{item.product.icon}</div>
                  <div>
                    <div style={{ fontSize:14, marginBottom:4 }}>{item.product.name}</div>
                    <div style={{ fontSize:13, color:'var(--gold)' }}>₹{item.product.price} × {item.qty}</div>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} style={{ background:'none', border:'none', color:'rgba(245,240,232,0.4)', cursor:'none', fontSize:16 }}>✕</button>
                </div>
              ))
          }
        </div>
        <div style={{ padding:24, borderTop:'1px solid rgba(201,168,76,0.15)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24, fontFamily:'Cormorant Garamond,serif', fontSize:20 }}>
            <span>Total</span><span style={{ color:'var(--gold)' }}>₹{total.toLocaleString()}</span>
          </div>
          <button onClick={checkout} style={{ width:'100%', background:'var(--gold)', color:'var(--dark)', border:'none', padding:18, fontFamily:'Jost', fontSize:12, letterSpacing:'0.25em', textTransform:'uppercase', cursor:'none', transition:'all 0.3s' }}>Proceed to Checkout</button>
          <p style={{ fontSize:10, color:'rgba(245,240,232,0.3)', textAlign:'center', marginTop:12, letterSpacing:'0.1em' }}>Razorpay · UPI · Cards · Net Banking</p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'28px 60px', background:'linear-gradient(to bottom, rgba(26,18,8,0.9) 0%, transparent 100%)', backdropFilter:'blur(2px)' }}>
        <a href="#" style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28, fontWeight:300, letterSpacing:'0.15em', color:'var(--gold)', textDecoration:'none' }}>
          Herb<span style={{ fontStyle:'italic', color:'var(--sage)' }}>ixe</span>
        </a>
        <ul style={{ display:'flex', gap:40, listStyle:'none' }}>
          {[['Our Story','/our-story'],['Collection','/products'],['Ingredients','#ingredients'],['Process','#process']].map(([l,h]) => (
            <li key={l}><Link href={h} style={{ color:'var(--cream)', textDecoration:'none', fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', opacity:0.7, transition:'opacity 0.3s' }}>{l}</Link></li>
          ))}
        </ul>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {!user && (
            <Link href="/login?redirect=%2Fcheckout" style={{ color:'rgba(245,240,232,0.6)', textDecoration:'none', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase' }}>Sign In</Link>
          )}
          <a href="#" onClick={(e) => { e.preventDefault(); toggleCart() }} style={{ background:'transparent', border:'1px solid var(--gold)', color:'var(--gold)', padding:'10px 28px', fontFamily:'Jost', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', cursor:'none', transition:'all 0.3s' }}>
            Cart <span style={{ background:'var(--gold)', color:'var(--dark)', borderRadius:'50%', width:18, height:18, fontSize:10, display:'inline-flex', alignItems:'center', justifyContent:'center', marginLeft:6, fontWeight:500 }}>{count}</span>
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" style={{ position:'relative', height:'100vh', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <canvas id="hero-canvas" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 20px' }}>
          <p style={{ fontSize:11, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--sage)', opacity:0, animation:'fadeUp 1s 0.5s forwards', marginBottom:24 }}>Pure • Potent • Botanical</p>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(64px,10vw,140px)', fontWeight:300, lineHeight:0.9, opacity:0, animation:'fadeUp 1.2s 0.8s forwards' }}>
            Where Herbs<br /><em style={{ fontStyle:'italic', color:'var(--gold)', display:'block' }}>Transform Hair</em>
          </h1>
          <p style={{ fontSize:14, letterSpacing:'0.15em', color:'var(--mist)', opacity:0, animation:'fadeUp 1s 1.2s forwards', marginTop:28, maxWidth:420, marginLeft:'auto', marginRight:'auto', lineHeight:1.8 }}>Ancient botanical wisdom meets modern formulation science. Herbixe creates haircare that truly works.</p>
          <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:48, opacity:0, animation:'fadeUp 1s 1.5s forwards' }}>
            <a href="#products" style={{ background:'var(--gold)', color:'var(--dark)', padding:'16px 44px', fontFamily:'Jost', fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', textDecoration:'none', transition:'all 0.3s', border:'1px solid var(--gold)' }}>Explore Collection</a>
            <a href="#philosophy" style={{ background:'transparent', color:'var(--cream)', padding:'16px 44px', fontFamily:'Jost', fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', textDecoration:'none', border:'1px solid rgba(245,240,232,0.3)', transition:'all 0.3s' }}>Our Philosophy</a>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:48, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:0, animation:'fadeIn 1s 2s forwards', zIndex:2 }}>
          <span style={{ fontSize:9, letterSpacing:'0.3em', color:'var(--gold)', textTransform:'uppercase', writingMode:'vertical-lr' }}>Scroll</span>
          <div style={{ width:1, height:60, background:'linear-gradient(to bottom, transparent, var(--gold))', animation:'scrollPulse 2s infinite' }} />
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ background:'var(--moss)', padding:'16px 0', overflow:'hidden', borderTop:'1px solid rgba(201,168,76,0.2)', borderBottom:'1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ display:'flex', animation:'marquee 20s linear infinite', whiteSpace:'nowrap' }}>
          {['Herbal Hair Paste','Premium Hair Oil','Botanical Extracts','100% Natural','Cruelty Free','Handcrafted','Herbal Hair Paste','Premium Hair Oil','Botanical Extracts','100% Natural','Cruelty Free','Handcrafted'].map((item, i) => (
            <span key={i} style={{ padding:'0 40px', fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--mist)', display:'flex', alignItems:'center', gap:40 }}>
              {item}<span style={{ color:'var(--gold)' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Philosophy ── */}
      <section id="philosophy" style={{ padding:'140px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', maxWidth:1400, margin:'0 auto' }}>
        <div className="reveal phil-visual" style={{ position:'relative', height:600 }}>
          <canvas id="phil-canvas" style={{ width:'100%', height:'100%' }} />
        </div>
        <div className="reveal" style={{ paddingLeft:40 }}>
          <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--gold)', marginBottom:20, display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ width:40, height:1, background:'var(--gold)', display:'inline-block' }} />Our Philosophy
          </p>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(38px,4vw,60px)', fontWeight:300, lineHeight:1.1, marginBottom:28 }}>
            Nature holds every<br /><em style={{ fontStyle:'italic', color:'var(--sage)' }}>answer your hair needs</em>
          </h2>
          <p style={{ fontSize:15, lineHeight:2, color:'rgba(245,240,232,0.7)', marginBottom:24 }}>At Herbixe, we believe that centuries of Ayurvedic wisdom hold solutions that no laboratory can replicate. Each product is a careful distillation of botanicals known for their transformative effects on hair health.</p>
          <p style={{ fontSize:15, lineHeight:2, color:'rgba(245,240,232,0.7)', marginBottom:24 }}>We source our herbs from trusted growers across India's most fertile regions — from the tulsi of Mathura to the bhringraj of Bengal — and process them with cold-press techniques that preserve every active compound.</p>
          <div style={{ display:'flex', gap:48, marginTop:48 }}>
            {[['23+','Active Botanicals'],['0%','Synthetic Chemicals'],['4.9','Avg. Rating']].map(([n,l]) => (
              <div key={l} style={{ borderLeft:'1px solid var(--gold)', paddingLeft:20 }}>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:48, fontWeight:300, color:'var(--gold)', lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:11, letterSpacing:'0.15em', opacity:0.6, marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section id="products" style={{ padding:'120px 60px', maxWidth:1400, margin:'0 auto' }}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:80 }}>
          <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--gold)', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
            <span style={{ width:40, height:1, background:'var(--gold)', display:'inline-block' }} />Our Collection<span style={{ width:40, height:1, background:'var(--gold)', display:'inline-block' }} />
          </p>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(38px,4vw,60px)', fontWeight:300, lineHeight:1.1, maxWidth:500, margin:'0 auto 20px' }}>Crafted for every <em style={{ fontStyle:'italic', color:'var(--sage)' }}>hair story</em></h2>
          <p style={{ fontSize:15, lineHeight:2, color:'rgba(245,240,232,0.7)', maxWidth:480, margin:'0 auto' }}>Each formula is tested for a minimum of 6 months before launch. No shortcuts. No compromises.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
          {featured.map((p, i) => (
            <div key={p.id} className="reveal product-card" style={{ transitionDelay:`${i * 0.1}s`, position:'relative', overflow:'hidden', background:'rgba(74,94,58,0.1)', border:'1px solid rgba(201,168,76,0.1)', transition:'all 0.5s ease', cursor:'none' }}>
              <Link href={`/products/${p.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
                <div style={{ height:320, position:'relative', overflow:'hidden', background:'linear-gradient(135deg, rgba(74,94,58,0.3) 0%, rgba(26,18,8,0.8) 100%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div className="product-glow" style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 60%, rgba(201,168,76,0.1) 0%, transparent 70%)', opacity:0, transition:'opacity 0.5s' }} />
                  <div style={{ fontSize:80, filter:'drop-shadow(0 0 30px rgba(201,168,76,0.3))', transition:'transform 0.5s ease', display:'flex', alignItems:'center', justifyContent:'center', width:120, height:120 }}>{p.icon}</div>
                  {p.badge && <div style={{ position:'absolute', top:20, right:20, background:'var(--gold)', color:'var(--dark)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'6px 12px' }}>{p.badge}</div>}
                </div>
              </Link>
              <div style={{ padding:32 }}>
                <Link href={`/products/${p.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
                  <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--sage)', marginBottom:12 }}>{p.category.replace(/-/g, ' ')}</div>
                  <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:24, fontWeight:400, marginBottom:12 }}>{p.name}</div>
                </Link>
                <div style={{ fontSize:13, lineHeight:1.8, color:'rgba(245,240,232,0.6)', marginBottom:24 }}>{p.description}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
                  {p.ingredients.slice(0,4).map(ing => (
                    <span key={ing} style={{ fontSize:10, letterSpacing:'0.1em', border:'1px solid rgba(122,158,110,0.4)', color:'var(--sage)', padding:'4px 12px' }}>{ing}</span>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid rgba(201,168,76,0.1)', paddingTop:20 }}>
                  <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28, fontWeight:300, color:'var(--gold)' }}>₹{p.price.toLocaleString()} <span style={{ fontSize:14, color:'rgba(245,240,232,0.4)' }}>/ {p.size}</span></div>
                  <button onClick={() => { addItem(p); notify(`${p.name} added to cart`) }} style={{ background:'transparent', border:'1px solid var(--gold)', color:'var(--gold)', padding:'10px 24px', fontFamily:'Jost', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'none', transition:'all 0.3s' }}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ textAlign:'center', marginTop:48 }}>
          <Link href="/products" style={{ display:'inline-block', border:'1px solid var(--gold)', color:'var(--gold)', padding:'16px 44px', fontFamily:'Jost', fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', textDecoration:'none', transition:'all 0.3s' }}>
            View Full Collection
          </Link>
        </div>
      </section>

      {/* ── Featured ── */}
      <section id="featured" className="reveal" style={{ margin:'0 auto 120px', background:'linear-gradient(135deg, rgba(74,94,58,0.2), rgba(26,18,8,0.9))', border:'1px solid rgba(201,168,76,0.2)', display:'grid', gridTemplateColumns:'1fr 1fr', overflow:'hidden', maxWidth:1280 }}>
        <div style={{ height:500, position:'relative', background:'radial-gradient(circle at 40% 50%, rgba(201,168,76,0.15), transparent 70%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <canvas id="featured-canvas" style={{ width:'100%', height:'100%' }} />
        </div>
        <div style={{ padding:'80px 60px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <span style={{ fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--gold)', marginBottom:16, background:'rgba(201,168,76,0.1)', display:'inline-block', padding:'6px 16px', border:'1px solid rgba(201,168,76,0.3)' }}>⭐ Bestseller</span>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:48, fontWeight:300, lineHeight:1.1, marginBottom:20 }}>Bhringraj<br /><em style={{ fontStyle:'italic', color:'var(--gold)', display:'block' }}>Power Paste</em></h2>
          <p style={{ fontSize:15, lineHeight:2, color:'rgba(245,240,232,0.7)', marginBottom:24 }}>Our most potent formula. A rich herbal paste loaded with Bhringraj, Amla, and Methi — the trinity of hair regrowth. Apply, leave for 45 minutes, and transform your hair in 4 weeks.</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:32 }}>
            {['Bhringraj','Amla','Methi','Brahmi','Neem'].map(ing => <span key={ing} style={{ fontSize:10, letterSpacing:'0.1em', border:'1px solid rgba(122,158,110,0.4)', color:'var(--sage)', padding:'4px 12px' }}>{ing}</span>)}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:32 }}>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28, fontWeight:300, color:'var(--gold)' }}>₹649 <span style={{ fontSize:14, color:'rgba(245,240,232,0.4)' }}>/ 200g</span></div>
            <Link href={`/products/${PRODUCTS[0].slug}`} style={{ background:'transparent', border:'1px solid var(--gold)', color:'var(--gold)', padding:'10px 24px', fontFamily:'Jost', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', cursor:'none', transition:'all 0.3s', display:'inline-block' }}>View Product</Link>
            <button onClick={() => { addItem(PRODUCTS[0]); notify('Bhringraj Power Paste added to cart') }} style={{ background:'transparent', border:'1px solid var(--gold)', color:'var(--gold)', padding:'10px 24px', fontFamily:'Jost', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'none', transition:'all 0.3s' }}>Add to Cart</button>
          </div>
        </div>
      </section>

      {/* ── Ingredients ── */}
      <section id="ingredients" style={{ padding:'140px 60px', textAlign:'center', background:'linear-gradient(to bottom, transparent, rgba(74,94,58,0.08), transparent)' }}>
        <div className="reveal">
          <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--gold)', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
            <span style={{ width:40, height:1, background:'var(--gold)', display:'inline-block' }} />Botanical Library<span style={{ width:40, height:1, background:'var(--gold)', display:'inline-block' }} />
          </p>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(38px,4vw,60px)', fontWeight:300, lineHeight:1.1 }}>Nature's finest <em style={{ fontStyle:'italic', color:'var(--sage)' }}>active ingredients</em></h2>
        </div>
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:1, maxWidth:1000, margin:'80px auto 0' }}>
          {[['🌿','Bhringraj','Growth Activator'],['🫐','Amla','Strengthener'],['🍃','Brahmi','Scalp Nourisher'],['🌱','Methi','Anti-Dandruff'],['🌺','Hibiscus','Shine Booster'],['🌰','Castor Oil','Deep Conditioning'],['🌾','Neem','Scalp Purifier'],['🫚','Coconut Oil','Base Carrier'],['🌸','Tulsi','Anti-Microbial'],['🌿','Shikakai','Natural Cleanser']].map(([icon,name,prop]) => (
            <div key={name} style={{ padding:'48px 24px', border:'1px solid rgba(201,168,76,0.08)', transition:'all 0.4s', textAlign:'center' }}>
              <span style={{ fontSize:40, display:'block', marginBottom:16 }}>{icon}</span>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, marginBottom:8 }}>{name}</div>
              <div style={{ fontSize:11, color:'var(--sage)', letterSpacing:'0.1em' }}>{prop}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" style={{ padding:'140px 60px', maxWidth:1200, margin:'0 auto' }}>
        <div className="reveal">
          <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--gold)', marginBottom:20, display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ width:40, height:1, background:'var(--gold)', display:'inline-block' }} />How We Make It
          </p>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(38px,4vw,60px)', fontWeight:300, lineHeight:1.1 }}>From root to <em style={{ fontStyle:'italic', color:'var(--sage)' }}>ritual</em></h2>
        </div>
        <div style={{ marginTop:0 }}>
          {[['01','Ethical Sourcing','We partner with certified organic farms across India, ensuring every herb is grown without pesticides in its native soil and climate for maximum potency.'],['02','Cold Press Extraction','Active compounds are extracted at low temperatures to preserve delicate phytochemicals that heat-based processing would destroy — your hair gets every benefit.'],['03','Formulation & Testing','Each formula undergoes 6+ months of blind testing with a panel of 50 volunteers across different hair types before we approve it for launch.'],['04','Small-Batch Crafting','We produce in controlled small batches to guarantee freshness, potency, and quality consistency in every jar you receive.']].map(([n,t,d]) => (
            <div key={n} className="reveal" style={{ display:'grid', gridTemplateColumns:'80px 1fr 1fr', gap:40, alignItems:'start', padding:'48px 0', borderBottom:'1px solid rgba(201,168,76,0.1)' }}>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:72, fontWeight:300, color:'rgba(201,168,76,0.15)', lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:32, fontWeight:300, color:'var(--gold)', paddingTop:16 }}>{t}</div>
              <div style={{ fontSize:14, lineHeight:2, color:'rgba(245,240,232,0.6)', paddingTop:20 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>


      {/* ── Testimonials ── */}
      <section id="testimonials" style={{ padding:'140px 60px', textAlign:'center' }}>
        <div className="reveal">
          <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--gold)', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
            <span style={{ width:40, height:1, background:'var(--gold)', display:'inline-block' }} />Real Results<span style={{ width:40, height:1, background:'var(--gold)', display:'inline-block' }} />
          </p>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(38px,4vw,60px)', fontWeight:300, lineHeight:1.1 }}>What our community <em style={{ fontStyle:'italic', color:'var(--sage)' }}>says</em></h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2, marginTop:80 }}>
          {[['P','Priya Sharma','Mumbai, Maharashtra','The bhringraj paste has genuinely transformed my hair in 6 weeks. I had tried everything — this is the first product that actually worked on my hair fall.'],['A','Ananya Krishnan','Bangalore, Karnataka','The premium oil smells divine and leaves my scalp feeling nourished. No greasiness, just deep conditioning. I\'ll never go back to drugstore brands.'],['R','Riya Mehta','Delhi, India','The packaging alone tells you this is a premium brand that cares. But the results — my hair texture has completely changed. Dense, shiny, strong.']].map(([init,name,loc,text]) => (
            <div key={name} className="reveal" style={{ padding:'48px 36px', border:'1px solid rgba(201,168,76,0.08)', textAlign:'left', position:'relative', transition:'border-color 0.4s' }}>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:120, fontWeight:300, color:'rgba(201,168,76,0.1)', position:'absolute', top:-20, left:24, lineHeight:1 }}>"</div>
              <div style={{ color:'var(--gold)', fontSize:12, marginBottom:20, letterSpacing:2 }}>★★★★★</div>
              <p style={{ fontSize:15, lineHeight:2, color:'rgba(245,240,232,0.75)', marginBottom:32, position:'relative' }}>{text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg, var(--moss), var(--earth))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garamond,serif', fontSize:18 }}>{init}</div>
                <div>
                  <div style={{ fontSize:13, letterSpacing:'0.05em' }}>{name}</div>
                  <div style={{ fontSize:11, color:'var(--sage)', marginTop:2 }}>{loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background:'var(--bark)', padding:'80px 60px 40px', borderTop:'1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:60, marginBottom:60, maxWidth:1200, marginLeft:'auto', marginRight:'auto' }}>
          <div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:32, fontWeight:300, color:'var(--gold)', letterSpacing:'0.15em', marginBottom:20 }}>Herbixe</div>
            <p style={{ fontSize:13, lineHeight:1.9, color:'rgba(245,240,232,0.5)' }}>Ancient herbs. Modern science. Extraordinary hair. Herbixe is a premium botanical haircare brand rooted in Ayurvedic wisdom and driven by results.</p>
          </div>
          {[['Products',[['Hair Pastes','/products?category=hair-paste'],['Herbal Oils','/products?category=herbal-oil'],['Gift Sets','/products?category=premium-package'],['Scalp Care','/products?category=scalp-care']]],['Brand',[['Our Story','/our-story'],['Ingredients','#ingredients'],['Our Process','#process'],['Sustainability','/sustainability']]],['Support',[['Track Order','/track-order'],['Returns','/returns'],['Hair Quiz','/hair-quiz'],['Contact Us','/contact']]]].map(([title, links]) => (
            <div key={title as string}>
              <h4 style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--gold)', marginBottom:24 }}>{title as string}</h4>
              <ul style={{ listStyle:'none' }}>
                {(links as [string,string][]).map(([label,href]) => (
                  <li key={label} style={{ marginBottom:12 }}><Link href={href} style={{ color:'rgba(245,240,232,0.5)', textDecoration:'none', fontSize:13, transition:'color 0.3s' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(201,168,76,0.1)', paddingTop:32, display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:1200, margin:'0 auto', fontSize:11, color:'rgba(245,240,232,0.3)' }}>
          <span>© 2025 Herbixe. All rights reserved.</span>
          <span>
            <Link href="/privacy" style={{ color:'inherit', textDecoration:'none' }}>Privacy Policy</Link>
            {' · '}
            <Link href="/terms" style={{ color:'inherit', textDecoration:'none' }}>Terms</Link>
            {' · '}
            <Link href="/refund" style={{ color:'inherit', textDecoration:'none' }}>Refund Policy</Link>
          </span>
          <span>Made with 🌿 in India</span>
        </div>
      </footer>

      {/* ── Notification ── */}
      <div id="notification" style={{ position:'fixed', bottom:40, left:'50%', transform:'translateX(-50%) translateY(100px)', background:'var(--moss)', color:'var(--cream)', padding:'16px 32px', fontSize:13, letterSpacing:'0.1em', border:'1px solid rgba(122,158,110,0.5)', zIndex:3000, transition:'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }} />

      {/* ── Global styles ── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes scrollPulse { 0%,100% { opacity:0.3; transform:scaleY(1); } 50% { opacity:1; transform:scaleY(1.2); } }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-20px); } }
        .reveal { opacity:0; transform:translateY(40px); transition:all 0.9s cubic-bezier(0.4,0,0.2,1); }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .product-card:hover { border-color:rgba(201,168,76,0.4) !important; transform:translateY(-4px); z-index:2; }
        .product-card:hover .product-glow { opacity:1 !important; }
        #notification.show { transform:translateX(-50%) translateY(0) !important; }
        nav a:hover { opacity:1 !important; color:var(--gold) !important; }
        .ingredient-card:hover { background:rgba(201,168,76,0.05) !important; border-color:rgba(201,168,76,0.3) !important; }
        button:hover { opacity:0.9; }
      `}</style>
    </>
  )
}
