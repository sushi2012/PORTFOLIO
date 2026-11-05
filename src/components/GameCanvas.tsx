import { useEffect, useRef } from 'react'
import { createPhaserGame, destroyPhaserGame } from '@/game/PhaserGame'

// ── GameCanvas ───────────────────────────────────────────────────────────────
// Mounts a Phaser game into a full-screen div and tears it down on unmount.
// Keeping Phaser completely isolated from React's reconciler is intentional —
// Phaser owns the canvas DOM node; React only manages the wrapper div.

interface GameCanvasProps {
  className?: string
}

export function GameCanvas({ className = '' }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const game = createPhaserGame(el)

    return () => {
      // Only destroy when the component truly unmounts (not on StrictMode double-invoke)
      destroyPhaserGame()
      void game
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      aria-label="Fantasy game environment"
      role="img"
    />
  )
}
