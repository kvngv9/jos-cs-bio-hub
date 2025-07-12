import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const createParticles = () => {
      if (!backgroundRef.current) return

      // Create more visible floating particles
      for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div')
        particle.className = 'floating-particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.width = Math.random() * 12 + 6 + 'px'
        particle.style.height = particle.style.width
        particle.style.animationDelay = Math.random() * 20 + 's'
        particle.style.opacity = String(Math.random() * 0.6 + 0.4)
        backgroundRef.current.appendChild(particle)
      }

      // Create more visible geometric shapes
      for (let i = 0; i < 12; i++) {
        const shape = document.createElement('div')
        shape.className = 'geometric-shape'
        shape.style.left = Math.random() * 100 + '%'
        shape.style.top = Math.random() * 100 + '%'
        const size = Math.random() * 80 + 30
        shape.style.width = size + 'px'
        shape.style.height = size + 'px'
        shape.style.animationDelay = Math.random() * 30 + 's'
        shape.style.opacity = String(Math.random() * 0.4 + 0.3)
        backgroundRef.current.appendChild(shape)
      }

      // Add gradient orbs for more visual impact
      for (let i = 0; i < 6; i++) {
        const orb = document.createElement('div')
        orb.className = 'gradient-orb'
        orb.style.left = Math.random() * 100 + '%'
        orb.style.top = Math.random() * 100 + '%'
        const size = Math.random() * 150 + 100
        orb.style.width = size + 'px'
        orb.style.height = size + 'px'
        orb.style.animationDelay = Math.random() * 25 + 's'
        backgroundRef.current.appendChild(orb)
      }
    }

    const timer = setTimeout(createParticles, 100)
    
    return () => {
      clearTimeout(timer)
      if (backgroundRef.current) {
        backgroundRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div ref={backgroundRef} className="animated-background" />
  )
}