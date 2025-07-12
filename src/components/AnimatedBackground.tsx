import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const createParticles = () => {
      if (!backgroundRef.current) return

      // Create floating particles
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div')
        particle.className = 'floating-particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.width = Math.random() * 8 + 4 + 'px'
        particle.style.height = particle.style.width
        particle.style.animationDelay = Math.random() * 20 + 's'
        backgroundRef.current.appendChild(particle)
      }

      // Create geometric shapes
      for (let i = 0; i < 8; i++) {
        const shape = document.createElement('div')
        shape.className = 'geometric-shape'
        shape.style.left = Math.random() * 100 + '%'
        shape.style.top = Math.random() * 100 + '%'
        const size = Math.random() * 60 + 20
        shape.style.width = size + 'px'
        shape.style.height = size + 'px'
        shape.style.animationDelay = Math.random() * 30 + 's'
        backgroundRef.current.appendChild(shape)
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