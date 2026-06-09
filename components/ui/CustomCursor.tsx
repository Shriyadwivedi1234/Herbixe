'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    const move = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`

      requestAnimationFrame(animate)
    }

    animate()

    const expand = () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1.8)'
    }

    const shrink = () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1)'
    }

    window.addEventListener('mousemove', move)

    const elements = document.querySelectorAll('a, button')

    elements.forEach((el) => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('mousemove', move)

      elements.forEach((el) => {
        el.removeEventListener('mouseenter', expand)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
