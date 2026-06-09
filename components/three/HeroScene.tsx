'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Torus, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// ── Swirling botanical wisp inside the ball ──────────────────────────────
function Wisp({ radius, tubeR, color, emissive, rotOffset = [0, 0, 0] }: {
  radius: number; tubeR: number; color: string; emissive: string; rotOffset?: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * Math.PI * 2
      const w = Math.sin(t * 3) * 0.3
      pts.push(new THREE.Vector3(
        Math.cos(t) * (radius + w),
        Math.sin(t * 1.7) * radius * 0.6,
        Math.sin(t) * (radius + w * 0.5),
      ))
    }
    return new THREE.CatmullRomCurve3(pts, true)
  }, [radius])

  const geo = useMemo(() =>
    new THREE.TubeGeometry(curve, 180, tubeR, 6, true), [curve, tubeR])

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.6
    meshRef.current.rotation.z += delta * 0.3
  })

  return (
    <mesh ref={meshRef} geometry={geo} rotation={rotOffset as unknown as THREE.Euler}>
      <meshStandardMaterial
        color={color} emissive={emissive} emissiveIntensity={1.2}
        transparent opacity={0.7}
      />
    </mesh>
  )
}

// ── The crystal ball itself ───────────────────────────────────────────────
function CrystalBall() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.12
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.18
  })

  return (
    <group ref={groupRef}>
      {/* Inner glowing core */}
      <Sphere args={[1.45, 48, 48]}>
        <meshStandardMaterial
          color="#0b2e10" emissive="#1a5a1a" emissiveIntensity={1.1}
          roughness={0.2} transparent opacity={0.92}
        />
      </Sphere>

      {/* Distorted mid-shell — gives the "living" swirl look */}
      <Sphere args={[1.88, 64, 64]}>
        <MeshDistortMaterial
          color="#1a4a20" emissive="#0d2e0d" emissiveIntensity={0.5}
          distort={0.18} speed={1.5}
          transparent opacity={0.45} roughness={0.6}
        />
      </Sphere>

      {/* Outer glass shell */}
      <Sphere args={[2.18, 64, 64]}>
        <meshStandardMaterial
          color="#3a6a3a" metalness={0.95} roughness={0.02}
          transparent opacity={0.16}
        />
      </Sphere>

      {/* Inner botanical wisps */}
      <Wisp radius={0.88} tubeR={0.028} color="#4a9a4a" emissive="#1a5a1a" />
      <Wisp radius={1.1}  tubeR={0.022} color="#c9a84c" emissive="#8b6914" rotOffset={[Math.PI / 3, 0, 0]} />
      <Wisp radius={0.7}  tubeR={0.018} color="#7aaa5a" emissive="#3a6a2a" rotOffset={[0, 0, Math.PI / 4]} />
    </group>
  )
}

// ── Pedestal ──────────────────────────────────────────────────────────────
function Pedestal() {
  const ref = useRef<THREE.Group>(null!)
  useFrame((state) => {
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.18
  })
  return (
    <group ref={ref}>
      {/* Stem */}
      <mesh position={[0, -2.85, 0]}>
        <cylinderGeometry args={[0.18, 0.35, 1.0, 16]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Foot */}
      <mesh position={[0, -3.38, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 0.18, 24]} />
        <meshStandardMaterial color="#b8941e" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Cup rim */}
      <Torus args={[0.38, 0.06, 8, 32]} position={[0, -2.35, 0]}>
        <meshStandardMaterial color="#d4a830" metalness={0.95} roughness={0.1} />
      </Torus>
    </group>
  )
}

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
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Lights />
      <CameraRig />
      <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0.2}>
        <CrystalBall />
        <Pedestal />
      </Float>
    </Canvas>
  )
}
