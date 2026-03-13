import React, { useEffect, useState } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"
import { MousePointer2 } from "lucide-react"

export function CursorTrail() {
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Motion values for the cursor position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Create a long, flowing trail with 12 segments
  const trailCount = 12
  const trailPoints = Array.from({ length: trailCount }).map((_, i) => {
    // Smoother physics for a "liquid aura" feel
    const stiffness = 300 - i * 15
    const damping = 40 - i * 1.5
    
    return {
      x: useSpring(mouseX, { stiffness, damping }),
      y: useSpring(mouseY, { stiffness, damping }),
      size: Math.max(2, 8 - i * (6 / trailCount)),
      opacity: Math.max(0.05, 0.7 - i * (0.6 / trailCount)),
      glowSize: Math.max(4, 16 - i * (12 / trailCount)), // The aura size
    }
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    if (!isMobile) {
      document.body.style.cursor = 'none'
      const style = document.createElement('style')
      style.id = 'cursor-none-style'
      style.innerHTML = `
        * { cursor: none !important; }
        a, button, [role="button"], input, select, textarea { cursor: none !important; }
      `
      document.head.appendChild(style)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)
    document.body.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.style.cursor = 'auto'
      document.getElementById('cursor-none-style')?.remove()
    }
  }, [mouseX, mouseY, isVisible, isMobile])

  if (isMobile) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* The Aura Trail */}
      {trailPoints.map((point, i) => (
        <React.Fragment key={i}>
          {/* Main Glow/Aura Segment */}
          <motion.div
            className="fixed bg-primary/20 blur-[4px] rounded-full"
            style={{
              x: point.x,
              y: point.y,
              width: point.glowSize,
              height: point.glowSize,
              left: -point.glowSize / 2,
              top: -point.glowSize / 2,
              display: isVisible ? "block" : "none",
            }}
          />
          {/* Solid Core Segment with Thin Border */}
          <motion.div
            className="fixed bg-primary rounded-full border-[0.5px] border-white/40 shadow-sm"
            style={{
              x: point.x,
              y: point.y,
              width: point.size,
              height: point.size,
              opacity: point.opacity,
              left: -point.size / 2,
              top: -point.size / 2,
              display: isVisible ? "block" : "none",
            }}
          />
        </React.Fragment>
      ))}

      {/* The Directional Mouse Pointer with Thin Stroke */}
      <motion.div
        className="fixed text-primary"
        style={{
          x: mouseX,
          y: mouseY,
          left: -4,
          top: -2,
          display: isVisible ? "block" : "none",
          filter: "drop-shadow(0 0 10px oklch(0.45 0.15 160 / 0.5))",
          zIndex: 100,
        }}
      >
        <MousePointer2 
          size={24} 
          fill="currentColor" 
          stroke="white" 
          strokeWidth={1.2} 
          className="-rotate-[10deg]" 
        />
      </motion.div>
    </div>
  )
}
