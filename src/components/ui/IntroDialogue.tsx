import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FantasyBorder } from './FantasyBorder'
import { heroInfo } from '@/data/portfolio'

// ── Dialogue pages ─────────────────────────────────────────────────────────────
const PAGES = [
  {
    speaker: heroInfo.name,
    text: `Hi, I'm ${heroInfo.name}! 👋`,
    sub: null as string | null,
  },
  {
    speaker: heroInfo.name,
    text: heroInfo.title,
    sub: null,
  },
  {
    speaker: heroInfo.name,
    text: heroInfo.bio[2],
    sub: null,
  },
  {
    speaker: heroInfo.name,
    text: "Let's explore my portfolio! ✨",
    sub: '[ Press Space / click to navigate · Use ← → to move · Z to attack ]',
  },
]

const CHAR_SPEED = 28  // ms per character

interface Props {
  onClose: () => void
}

export function IntroDialogue({ onClose }: Props) {
  const [page, setPage] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentPage = PAGES[page]

  // ── Type-writer effect ────────────────────────────────────────────────────
  useEffect(() => {
    setDisplayed('')
    setTyping(true)
    let idx = 0
    const full = currentPage.text

    function tick() {
      idx++
      setDisplayed(full.slice(0, idx))
      if (idx < full.length) {
        timerRef.current = setTimeout(tick, CHAR_SPEED)
      } else {
        setTyping(false)
      }
    }
    timerRef.current = setTimeout(tick, CHAR_SPEED)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [page, currentPage.text])

  // ── Keyboard: Space / Enter advances; Escape closes ───────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        advance()
      }
      if (e.code === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function advance() {
    if (typing) {
      // Skip to full text immediately
      if (timerRef.current) clearTimeout(timerRef.current)
      setDisplayed(currentPage.text)
      setTyping(false)
      return
    }
    if (page < PAGES.length - 1) {
      setPage(p => p + 1)
    } else {
      onClose()
    }
  }

  const isLast = page === PAGES.length - 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.94 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-2xl mx-auto px-2"
      role="dialog"
      aria-modal="true"
      aria-label="Introduction dialogue"
    >
      {/* ── Main box ─────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg,rgba(15,10,30,0.97) 0%,rgba(25,12,50,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <FantasyBorder radius={16} glowColor="#a855f7" ornamentColor="#fbbf24" animated />

        {/* Inner texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg, transparent, transparent 2px, rgba(168,85,247,1) 2px, rgba(168,85,247,1) 3px
            )`,
          }}
        />

        <div className="relative px-8 pt-6 pb-5">

          {/* ── Speaker name tag ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'linear-gradient(90deg,#4c1d95,#6d28d9)',
                border: '1px solid #a855f766',
                color: '#e9d5ff',
                boxShadow: '0 0 8px #a855f744',
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-sm"
                style={{ background: '#2e1065' }}
                aria-hidden="true"
              >
                {heroInfo.avatarEmoji}
              </span>
              {currentPage.speaker}
            </div>

            {/* Page dots */}
            <div className="flex gap-1 ml-auto">
              {PAGES.map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: i === page ? '#a855f7' : '#3b0764',
                    boxShadow: i === page ? '0 0 6px #a855f7' : 'none',
                    transform: i === page ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Dialogue text ────────────────────────────────────────────── */}
          <div className="min-h-[64px] flex items-start">
            <AnimatePresence mode="wait">
              <motion.p
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-base leading-relaxed font-medium"
                style={{ color: '#f3e8ff' }}
              >
                {displayed}
                {typing && (
                  <span
                    className="inline-block w-[2px] h-[1em] ml-[1px] align-middle bg-purple-400"
                    style={{ animation: 'dialogueCursor 0.8s ease-in-out infinite' }}
                    aria-hidden="true"
                  />
                )}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* ── Sub-text (controls hint on last page) ───────────────────── */}
          <AnimatePresence>
            {!typing && currentPage.sub && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-[11px] font-mono"
                style={{ color: '#7c3aed' }}
              >
                {currentPage.sub}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── Action row ───────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-4">
            {/* Skip */}
            <button
              onClick={onClose}
              className="text-[11px] text-purple-600 hover:text-purple-400 transition-colors"
            >
              Skip intro
            </button>

            {/* Advance / Let's Go button */}
            <AnimatePresence mode="wait">
              {!typing && (
                <motion.button
                  key={`btn-${page}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={advance}
                  className="relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold overflow-hidden"
                  style={
                    isLast
                      ? {
                          background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                          border: '1px solid #c084fc',
                          color: '#fff',
                          boxShadow: '0 0 20px #a855f766, 0 0 8px #7c3aed55',
                        }
                      : {
                          background: 'linear-gradient(135deg,rgba(76,29,149,0.7),rgba(109,40,217,0.7))',
                          border: '1px solid #7c3aed88',
                          color: '#e9d5ff',
                          boxShadow: '0 0 10px #a855f744',
                        }
                  }
                >
                  {/* Shimmer on last page */}
                  {isLast && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%)',
                        backgroundSize: '200% auto',
                        animation: 'shimmer 2s linear infinite',
                      }}
                    />
                  )}
                  <span className="relative">
                    {isLast ? "Let's explore! ✨" : 'Continue'}
                  </span>
                  <span className="relative text-xs opacity-60">
                    {isLast ? '' : '▶'}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Keyboard hint ────────────────────────────────────────────────── */}
      <p className="text-center text-[10px] text-purple-700 mt-2">
        Space / Enter to advance · Esc to skip
      </p>
    </motion.div>
  )
}
