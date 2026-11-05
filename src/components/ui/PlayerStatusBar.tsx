import { motion } from 'framer-motion'
import { FantasyBorder } from './FantasyBorder'
import { heroInfo } from '@/data/portfolio'

// ── PlayerStatusBar ───────────────────────────────────────────────────────────
// Top-left HUD element: avatar + name + level + health hearts.

const TOTAL_HEARTS = 5

export function PlayerStatusBar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(15,10,30,0.92) 0%, rgba(30,15,60,0.88) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        minWidth: 220,
      }}
    >
      <FantasyBorder radius={16} glowColor="#a855f7" ornamentColor="#fbbf24" animated />

      {/* ── Avatar ─────────────────────────────────────────────────────── */}
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl select-none"
          style={{
            background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
            border: '2px solid #fbbf24aa',
            boxShadow: '0 0 12px #a855f755, inset 0 0 8px #a855f722',
            animation: 'floatUp 3s ease-in-out infinite',
          }}
        >
          {heroInfo.avatarEmoji}
        </div>
        {/* Level badge */}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            border: '1.5px solid #0f0a1e',
            color: '#0f0a1e',
            boxShadow: '0 0 6px #fbbf2488',
          }}
        >
          {heroInfo.level}
        </div>
      </div>

      {/* ── Name + hearts ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 min-w-0">
        {/* Level only — no name text */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-bold leading-none" style={{ color: '#fbbf24' }}>
            Lv.{heroInfo.level}
          </span>
          <span className="text-[10px] text-purple-400/70 font-medium leading-none hidden sm:inline">
            {heroInfo.title}
          </span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-0.5 mt-0.5">
          {Array.from({ length: TOTAL_HEARTS }).map((_, i) => (
            <Heart key={i} filled delay={i * 0.08} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Heart ──────────────────────────────────────────────────────────────────────
function Heart({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6 + delay, duration: 0.3, type: 'spring', stiffness: 300 }}
      style={{ animation: filled ? `heartBeat 2.4s ease-in-out ${delay}s infinite` : undefined }}
    >
      <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
        {filled ? (
          <>
            <path
              d="M7 12 C7 12 1 8 1 4.5 C1 2.5 2.5 1 4.5 1 C5.6 1 6.5 1.6 7 2.3 C7.5 1.6 8.4 1 9.5 1 C11.5 1 13 2.5 13 4.5 C13 8 7 12 7 12Z"
              fill="#ef4444"
              stroke="#7f1d1d"
              strokeWidth="0.5"
            />
            {/* Highlight */}
            <ellipse cx="4.5" cy="3.5" rx="1.5" ry="1" fill="white" opacity="0.35" transform="rotate(-20 4.5 3.5)" />
          </>
        ) : (
          <path
            d="M7 12 C7 12 1 8 1 4.5 C1 2.5 2.5 1 4.5 1 C5.6 1 6.5 1.6 7 2.3 C7.5 1.6 8.4 1 9.5 1 C11.5 1 13 2.5 13 4.5 C13 8 7 12 7 12Z"
            fill="none"
            stroke="#7f1d1d"
            strokeWidth="1"
            opacity="0.4"
          />
        )}
      </svg>
    </motion.div>
  )
}
