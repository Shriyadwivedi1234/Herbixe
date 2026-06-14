'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Torus, Sphere } from '@react-three/drei'
import * as THREE from 'three'




// ── Mouse-reactive camera rig ─────────────────────────────────────────────
function CameraRig() {
  useFrame((state) => {
    const { mouse, camera } = state
    camera.position.x += (mouse.x * 1.8 - camera.position.x) * 0.028
    camera.position.y += (-mouse.y * 1.3 - camera.position.y) * 0.028
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ── Scene lights ──────────────────────────────────────────────────────────
function Lights() {
  return (
    <>
      <ambientLight color="#1a3d1a" intensity={0.7} />
      <directionalLight color="#c9a84c" intensity={2.2} position={[5, 10, 8]} />
      <pointLight color="#4a7c4a" intensity={3.5} distance={28} position={[-6, -2, 9]} />
      <pointLight color="#c9a84c" intensity={2.0} distance={22} position={[6, 4, 5]} />
      <pointLight color="#1a5e3a" intensity={1.8} distance={18} position={[0, -7, 4]} />
    </>
  )
}

// ── Public export — the full R3F canvas ──────────────────────────────────
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 52 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Lights />
      <CameraRig />
    </Canvas>
  )
}
