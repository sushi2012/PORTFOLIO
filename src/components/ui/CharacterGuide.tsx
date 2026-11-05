import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { PageId } from '@/types/ui'

// ── Per-page dialogue ─────────────────────────────────────────────────────────
// Accepts both popup pages and 'about' (which is the top strip)
export const PAGE_GUIDE_TEXT: Record<PageId | 'about', string[]> = {
  'about': [
    "Welcome! I'm your guide through this realm ✨",
    "This scroll tells the tale of the adventurer behind the code.",
    "A Software & AI Engineer on a quest to build intelligent systems!",
  ],
  'skills-xp': [
    "Behold the skill tree and battle log! ⚔️",
    "Every spell mastered, every quest survived — it's all recorded here.",
    "These are the powers that shape the solutions I build.",
  ],
  'projects': [
    "Here lie the legendary quests — completed and shipped! 🏆",
    "Each project is a dungeon I've conquered with code.",
    "Click any quest to inspect the treasure inside!",
  ],
  'contact': [
    "A new quest awaits — let's talk! 📜",
    "Drop me a message and I'll respond swiftly.",
    "Great adventures start with a single conversation.",
  ],
}

const CHAR_SPEED = 26 // ms per character

interface Props {
  page: PageId | 'about' | 'contact'
  side?: 'left' | 'right'
}

export function CharacterGuide({ page, side = 'left' }: Props) {
  const lines = PAGE_GUIDE_TEXT[page]
  const [lineIdx, setLineIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset when page changes
  useEffect(() => {
    setLineIdx(0)
    setDisplayed('')
    setTyping(true)
    setVisible(true)
  }, [page])

  // Typewriter
  useEffect(() => {
    setDisplayed('')
    setTyping(true)
    let idx = 0
    const full = lines[lineIdx]
    function tick() {
      idx++
      setDisplayed(full.slice(0, idx))
      if (idx < full.length) {
        timerRef.current = setTimeout(tick, CHAR_SPEED)
      } else {
        setTyping(false)
        // Auto-advance to next line after a pause
        timerRef.current = setTimeout(() => {
          if (lineIdx < lines.length - 1) {
            setLineIdx(l => l + 1)
          }
        }, 2200)
      }
    }
    timerRef.current = setTimeout(tick, 120)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [lineIdx, lines])

  if (!visible) return null

  const isRight = side === 'right'

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRight ? 40 : -40 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className={`flex items-end gap-3 ${isRight ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* ── Pixel character ────────────────────────────────────────────── */}
      <div className="flex-shrink-0 relative">
        <PixelCharacter />
      </div>

      {/* ── Speech bubble ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={lineIdx}
          initial={{ opacity: 0, scale: 0.88, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ duration: 0.22 }}
          className="relative max-w-[220px]"
        >
          {/* Bubble body */}
          <div
            className="relative px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium"
            style={{
              background: 'linear-gradient(135deg,rgba(15,10,30,0.97),rgba(30,15,60,0.95))',
              border: '1.5px solid rgba(168,85,247,0.6)',
              boxShadow: '0 0 14px rgba(168,85,247,0.25), inset 0 0 8px rgba(168,85,247,0.06)',
              color: '#f3e8ff',
              minHeight: 44,
            }}
          >
            {displayed}
            {typing && (
              <span
                className="inline-block w-[2px] h-[0.85em] ml-0.5 align-middle bg-purple-400 rounded-full"
                style={{ animation: 'dialogueCursor 0.75s ease-in-out infinite' }}
              />
            )}

            {/* Gold corner ornament */}
            <span
              className="absolute top-1 left-1 text-[8px] leading-none select-none"
              style={{ color: '#fbbf24', opacity: 0.7 }}
              aria-hidden="true"
            >◆</span>
            <span
              className="absolute bottom-1 right-1 text-[8px] leading-none select-none"
              style={{ color: '#fbbf24', opacity: 0.7 }}
              aria-hidden="true"
            >◆</span>
          </div>

          {/* Bubble tail pointing toward character */}
          <div
            className={`absolute bottom-3 ${isRight ? 'right-[-7px]' : 'left-[-7px]'}`}
            style={{
              width: 0, height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              ...(isRight
                ? { borderLeft: '8px solid rgba(168,85,247,0.6)' }
                : { borderRight: '8px solid rgba(168,85,247,0.6)' }),
            }}
          />

          {/* Line dots */}
          <div className={`flex gap-1 mt-1.5 ${isRight ? 'justify-end' : 'justify-start'}`}>
            {lines.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === lineIdx ? 12 : 5,
                  height: 4,
                  background: i === lineIdx ? '#a855f7' : 'rgba(124,58,237,0.3)',
                  boxShadow: i === lineIdx ? '0 0 6px #a855f7' : 'none',
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dismiss button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-0 right-0 text-[10px] text-purple-800
                   hover:text-purple-500 transition-colors leading-none"
        aria-label="Dismiss guide"
      >
        ✕
      </button>
    </motion.div>
  )
}

// ── PixelCharacter — CSS-drawn female adventurer ──────────────────────────────
// Drawn entirely with layered divs + CSS — no external assets needed.
function PixelCharacter() {
  return (
    <div
      className="relative select-none"
      style={{ width: 48, height: 72, animation: 'floatUp 2.5s ease-in-out infinite' }}
      aria-hidden="true"
    >
      {/* Shadow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: 32, height: 6, borderRadius: '50%', background: 'rgba(0,0,0,0.3)' }} />

      {/* ── Boots ── */}
      <Px style={{ left: 10, top: 57, width: 11, height: 10, background: '#78350f', borderRadius: 2 }} />
      <Px style={{ left: 27, top: 57, width: 11, height: 10, background: '#78350f', borderRadius: 2 }} />
      {/* boot highlight */}
      <Px style={{ left: 11, top: 58, width: 4, height: 2, background: '#92400e', borderRadius: 1 }} />
      <Px style={{ left: 28, top: 58, width: 4, height: 2, background: '#92400e', borderRadius: 1 }} />

      {/* ── Leggings ── */}
      <Px style={{ left: 12, top: 46, width: 9, height: 13, background: '#1e1b2e', borderRadius: 2 }} />
      <Px style={{ left: 27, top: 46, width: 9, height: 13, background: '#1e1b2e', borderRadius: 2 }} />

      {/* ── Tunic ── */}
      <Px style={{ left: 8, top: 29, width: 32, height: 20, background: '#6d28d9', borderRadius: 3 }} />
      {/* tunic shading */}
      <Px style={{ left: 8, top: 29, width: 5, height: 20, background: '#4c1d95', borderRadius: '3px 0 0 3px' }} />
      <Px style={{ left: 35, top: 29, width: 5, height: 20, background: '#4c1d95', borderRadius: '0 3px 3px 0' }} />
      {/* gold trim */}
      <Px style={{ left: 8, top: 44, width: 32, height: 5, background: '#fbbf24', borderRadius: '0 0 2px 2px', opacity: 0.7 }} />
      {/* belt buckle */}
      <Px style={{ left: 20, top: 44, width: 8, height: 5, background: '#f59e0b', borderRadius: 1 }} />
      {/* rune emblem */}
      <Px style={{ left: 20, top: 33, width: 8, height: 9, background: '#fbbf24', borderRadius: 1, opacity: 0.6 }} />
      <Px style={{ left: 22, top: 32, width: 4, height: 11, background: '#fff', borderRadius: 1, opacity: 0.2 }} />

      {/* ── Cape ── */}
      <Px style={{ left: 5, top: 27, width: 8, height: 22, background: '#0d9488', borderRadius: '3px 0 3px 3px', opacity: 0.9 }} />
      <Px style={{ left: 6, top: 28, width: 4, height: 18, background: '#14b8a6', borderRadius: 2, opacity: 0.6 }} />

      {/* ── Arms ── */}
      {/* left arm */}
      <Px style={{ left: 2, top: 30, width: 8, height: 16, background: '#6d28d9', borderRadius: 2 }} />
      <Px style={{ left: 2, top: 44, width: 8, height: 6, background: '#fcd5b0', borderRadius: 2 }} />
      {/* right arm */}
      <Px style={{ left: 38, top: 30, width: 8, height: 16, background: '#6d28d9', borderRadius: 2 }} />
      <Px style={{ left: 38, top: 44, width: 8, height: 6, background: '#fcd5b0', borderRadius: 2 }} />

      {/* ── Sword (right side) ── */}
      {/* hilt */}
      <Px style={{ left: 44, top: 36, width: 5, height: 8, background: '#78350f', borderRadius: 1 }} />
      {/* guard */}
      <Px style={{ left: 42, top: 43, width: 9, height: 3, background: '#fbbf24', borderRadius: 1 }} />
      {/* blade */}
      <Px style={{ left: 46, top: 18, width: 3, height: 20, background: '#c0e0ff', borderRadius: 1 }} />
      <Px style={{ left: 46, top: 18, width: 3, height: 20, background: '#67e8f9', borderRadius: 1, opacity: 0.6,
        boxShadow: '0 0 6px #67e8f9, 0 0 12px #38bdf8' }} />
      {/* blade tip glow */}
      <Px style={{ left: 45, top: 15, width: 5, height: 5, borderRadius: '50%',
        background: '#67e8f9', boxShadow: '0 0 8px #67e8f9', opacity: 0.8 }} />

      {/* ── Head ── */}
      <Px style={{ left: 13, top: 14, width: 22, height: 18, background: '#fcd5b0', borderRadius: 4 }} />
      {/* jaw shadow */}
      <Px style={{ left: 15, top: 28, width: 18, height: 4, background: '#e8b48a', borderRadius: '0 0 4px 4px' }} />
      {/* neck */}
      <Px style={{ left: 19, top: 27, width: 10, height: 5, background: '#fcd5b0', borderRadius: 1 }} />

      {/* ── Eyes ── */}
      <Px style={{ left: 16, top: 19, width: 6, height: 5, background: '#fff', borderRadius: 1 }} />
      <Px style={{ left: 17, top: 20, width: 4, height: 4, background: '#2d6bbf', borderRadius: 1 }} />
      <Px style={{ left: 18, top: 20, width: 2, height: 2, background: '#0f0a1e', borderRadius: '50%' }} />
      <Px style={{ left: 26, top: 19, width: 6, height: 5, background: '#fff', borderRadius: 1 }} />
      <Px style={{ left: 27, top: 20, width: 4, height: 4, background: '#2d6bbf', borderRadius: 1 }} />
      <Px style={{ left: 28, top: 20, width: 2, height: 2, background: '#0f0a1e', borderRadius: '50%' }} />
      {/* eye shine */}
      <Px style={{ left: 17, top: 19, width: 2, height: 2, background: '#fff', borderRadius: '50%', opacity: 0.7 }} />
      <Px style={{ left: 27, top: 19, width: 2, height: 2, background: '#fff', borderRadius: '50%', opacity: 0.7 }} />

      {/* ── Nose + mouth ── */}
      <Px style={{ left: 22, top: 24, width: 4, height: 2, background: '#e8b48a', borderRadius: 1 }} />
      <Px style={{ left: 19, top: 27, width: 10, height: 2, background: '#c4855a', borderRadius: 2 }} />
      {/* smile corners */}
      <Px style={{ left: 18, top: 26, width: 2, height: 2, background: '#c4855a', borderRadius: '50%' }} />
      <Px style={{ left: 28, top: 26, width: 2, height: 2, background: '#c4855a', borderRadius: '50%' }} />

      {/* ── Hair ── */}
      {/* top */}
      <Px style={{ left: 11, top: 10, width: 26, height: 8, background: '#8b3a10', borderRadius: '4px 4px 0 0' }} />
      {/* highlight streak */}
      <Px style={{ left: 14, top: 11, width: 10, height: 4, background: '#b84a18', borderRadius: 2, opacity: 0.7 }} />
      {/* left long strand */}
      <Px style={{ left: 9, top: 14, width: 6, height: 28, background: '#8b3a10', borderRadius: '0 0 3px 3px' }} />
      <Px style={{ left: 10, top: 15, width: 3, height: 24, background: '#b84a18', borderRadius: 2, opacity: 0.5 }} />
      {/* right strand */}
      <Px style={{ left: 33, top: 14, width: 6, height: 22, background: '#8b3a10', borderRadius: '0 0 3px 3px' }} />
      {/* bangs */}
      <Px style={{ left: 13, top: 14, width: 22, height: 7, background: '#8b3a10', borderRadius: '0 0 2px 2px' }} />
      {/* hair clip */}
      <Px style={{ left: 9, top: 28, width: 5, height: 5, background: '#fbbf24', borderRadius: 1, opacity: 0.9 }} />
      {/* braid detail */}
      <Px style={{ left: 9, top: 33, width: 3, height: 3, background: '#5a2508', borderRadius: 1, opacity: 0.8 }} />
      <Px style={{ left: 9, top: 38, width: 3, height: 3, background: '#b84a18', borderRadius: 1, opacity: 0.6 }} />

      {/* ── Sparkle particles around sword ── */}
      <Px style={{ left: 48, top: 12, width: 3, height: 3, borderRadius: '50%',
        background: '#67e8f9', boxShadow: '0 0 4px #67e8f9', opacity: 0.7,
        animation: 'floatUp 1.8s ease-in-out 0.2s infinite' }} />
      <Px style={{ left: 43, top: 8, width: 2, height: 2, borderRadius: '50%',
        background: '#a855f7', boxShadow: '0 0 4px #a855f7', opacity: 0.6,
        animation: 'floatUp 2.2s ease-in-out 0.7s infinite' }} />
    </div>
  )
}

// Tiny helper for positioned div pixels
function Px({ style }: { style: React.CSSProperties }) {
  return <div className="absolute" style={style} />
}
