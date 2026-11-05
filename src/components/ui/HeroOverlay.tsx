import { motion } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'
import { heroInfo } from '@/data/portfolio'

const TECH_PILLS: { label: string; color: string }[] = [
  { label: 'FullStack',  color: '#34d399' },
  { label: 'RAG',        color: '#f472b6' },
  { label: 'Agentic AI', color: '#c084fc' },
  { label: 'LLMs',       color: '#fb923c' },
]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.46, ease: 'easeOut' as const, delay },
})

// ── Anime Girl SVG — sitting cross-legged, cute + stylised ───────────────────
function AnimeCharacter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      style={{ animation: 'floatUp 3.8s ease-in-out infinite' }}
      className="flex-shrink-0 select-none"
      aria-hidden="true"
    >
      <svg
        width="120"
        height="200"
        viewBox="15 0 130 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Skin gradient */}
          <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#fde8c8"/>
            <stop offset="100%" stopColor="#f0c090"/>
          </radialGradient>
          {/* Hair gradient — dark with purple sheen */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1a0e30"/>
            <stop offset="50%"  stopColor="#2e1555"/>
            <stop offset="100%" stopColor="#0d0620"/>
          </linearGradient>
          <linearGradient id="hairSheen" x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
          </linearGradient>
          {/* Hoodie gradient */}
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#3b1f6e"/>
            <stop offset="100%" stopColor="#1e0d40"/>
          </linearGradient>
          {/* Eye iris */}
          <radialGradient id="eyeGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#a78bfa"/>
            <stop offset="60%"  stopColor="#7c3aed"/>
            <stop offset="100%" stopColor="#4c1d95"/>
          </radialGradient>
          {/* Glow filter */}
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── SHADOW ── */}
        <ellipse cx="78" cy="196" rx="42" ry="6" fill="rgba(0,0,0,0.25)"/>

        {/* ── BODY SHADOW / depth ── */}
        <ellipse cx="78" cy="150" rx="38" ry="28" fill="rgba(0,0,0,0.12)"/>

        {/* ── LEGS — cross-legged, slimmer ── */}
        {/* Left leg */}
        <path d="M 48 162 Q 32 160 24 173 Q 20 184 34 187 Q 52 191 65 183 Q 70 174 62 163 Z"
          fill="url(#hoodieGrad)"/>
        <path d="M 48 162 Q 36 158 28 169 Q 26 176 32 177" stroke="#5b3a9a" strokeWidth="1" fill="none" opacity="0.4"/>
        {/* Right leg */}
        <path d="M 108 162 Q 124 160 132 173 Q 136 184 122 187 Q 104 191 91 183 Q 86 174 94 163 Z"
          fill="url(#hoodieGrad)"/>
        {/* Left shoe */}
        <path d="M 20 179 Q 15 183 17 190 Q 21 195 33 193 Q 42 191 40 184 Z"
          fill="#1a0e30"/>
        <path d="M 17 185 Q 15 189 20 192" stroke="#a855f7" strokeWidth="1.5" opacity="0.7"/>
        {/* Right shoe */}
        <path d="M 136 179 Q 141 183 139 190 Q 135 195 123 193 Q 114 191 116 184 Z"
          fill="#1a0e30"/>
        <path d="M 139 185 Q 141 189 136 192" stroke="#a855f7" strokeWidth="1.5" opacity="0.7"/>

        {/* ── TORSO — hoodie, slimmer waist ── */}
        <path d="M 50 132 Q 42 136 40 148 Q 38 161 47 167 Q 62 173 78 173 Q 94 173 109 167 Q 118 161 116 148 Q 114 136 106 132 Q 93 126 78 126 Q 63 126 50 132 Z"
          fill="url(#hoodieGrad)"/>
        {/* Hoodie front panel */}
        <path d="M 67 132 Q 65 148 67 167 L 89 167 Q 91 148 89 132 Z"
          fill="#4a2880" opacity="0.5"/>
        {/* Hoodie pocket */}
        <path d="M 62 155 Q 60 164 67 165 L 89 165 Q 96 164 94 155 Q 89 150 78 150 Q 67 150 62 155 Z"
          fill="#3d2068" opacity="0.6"/>
        {/* Hoodie trim */}
        <path d="M 50 132 Q 63 128 78 127 Q 93 128 106 132"
          stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.6"/>
        <line x1="72" y1="134" x2="70" y2="148" stroke="#c084fc" strokeWidth="1" opacity="0.5"/>
        <line x1="84" y1="134" x2="86" y2="148" stroke="#c084fc" strokeWidth="1" opacity="0.5"/>

        {/* ── LEFT ARM — slimmer ── */}
        <path d="M 50 136 Q 39 140 35 151 Q 33 161 42 163 Q 49 165 53 156 Q 55 144 50 136 Z"
          fill="url(#hoodieGrad)"/>
        <ellipse cx="38" cy="165" rx="7" ry="6" fill="url(#skinGrad)"/>

        {/* ── RIGHT ARM — slimmer, raised ── */}
        <path d="M 106 136 Q 117 140 121 151 Q 123 161 114 163 Q 107 165 103 156 Q 101 144 106 136 Z"
          fill="url(#hoodieGrad)"/>
        <ellipse cx="118" cy="122" rx="7" ry="6" fill="url(#skinGrad)"/>
        <path d="M 118 163 Q 119 147 118 134 Q 117 128 118 122"
          fill="none" stroke="#3b1f6e" strokeWidth="9" strokeLinecap="round"/>
        <path d="M 118 163 Q 119 147 118 134 Q 117 128 118 122"
          fill="none" stroke="#4a2880" strokeWidth="7" strokeLinecap="round" opacity="0.5"/>

        {/* ── NECK ── */}
        <path d="M 70 126 Q 70 116 78 114 Q 86 116 86 126 Q 86 130 78 130 Q 70 130 70 126 Z"
          fill="url(#skinGrad)"/>

        {/* ── HEAD ── */}
        {/* Head base — anime proportions: wider at cheeks, pointy chin */}
        <path d="M 78 52 Q 108 52 118 72 Q 126 90 122 108 Q 118 122 108 130 Q 96 138 78 138 Q 60 138 48 130 Q 38 122 34 108 Q 30 90 38 72 Q 48 52 78 52 Z"
          fill="url(#skinGrad)"/>
        {/* Jaw taper */}
        <path d="M 60 128 Q 68 140 78 142 Q 88 140 96 128"
          fill="url(#skinGrad)"/>
        {/* Cheek blush */}
        <ellipse cx="48" cy="106" rx="10" ry="6" fill="#f9a8d4" opacity="0.35"/>
        <ellipse cx="108" cy="106" rx="10" ry="6" fill="#f9a8d4" opacity="0.35"/>

        {/* ── EYES — large anime eyes ── */}
        {/* Eye whites */}
        <path d="M 50 92 Q 52 84 62 83 Q 72 82 74 90 Q 74 98 64 100 Q 54 100 50 92 Z"
          fill="white"/>
        <path d="M 82 92 Q 84 84 94 83 Q 104 82 106 90 Q 106 98 96 100 Q 86 100 82 92 Z"
          fill="white"/>
        {/* Iris */}
        <ellipse cx="62" cy="92" rx="9" ry="10" fill="url(#eyeGrad)"/>
        <ellipse cx="94" cy="92" rx="9" ry="10" fill="url(#eyeGrad)"/>
        {/* Pupil */}
        <ellipse cx="63" cy="93" rx="5" ry="6" fill="#1a0a2e"/>
        <ellipse cx="95" cy="93" rx="5" ry="6" fill="#1a0a2e"/>
        {/* Eye shine — main */}
        <ellipse cx="58" cy="87" rx="3.5" ry="3" fill="white" opacity="0.9"/>
        <ellipse cx="90" cy="87" rx="3.5" ry="3" fill="white" opacity="0.9"/>
        {/* Eye shine — small secondary */}
        <ellipse cx="66" cy="96" rx="1.5" ry="1.5" fill="white" opacity="0.6"/>
        <ellipse cx="98" cy="96" rx="1.5" ry="1.5" fill="white" opacity="0.6"/>
        {/* Upper eyelash */}
        <path d="M 48 90 Q 52 82 62 81 Q 72 80 76 88"
          stroke="#1a0a2e" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 80 88 Q 84 80 94 81 Q 104 82 108 90"
          stroke="#1a0a2e" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Lower lash line */}
        <path d="M 50 95 Q 62 101 74 95" stroke="#1a0a2e" strokeWidth="1.5" fill="none" opacity="0.4"/>
        <path d="M 82 95 Q 94 101 106 95" stroke="#1a0a2e" strokeWidth="1.5" fill="none" opacity="0.4"/>
        {/* Eyebrows — gentle arch */}
        <path d="M 50 80 Q 60 74 72 78" stroke="#1a0a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M 84 78 Q 96 74 106 80" stroke="#1a0a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

        {/* ── NOSE — small cute ── */}
        <path d="M 75 106 Q 78 110 81 106" stroke="#d4855a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>

        {/* ── MOUTH — small smile ── */}
        <path d="M 68 116 Q 78 122 88 116" stroke="#d4855a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M 68 116 Q 66 112 68 110" stroke="#d4855a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
        <path d="M 88 116 Q 90 112 88 110" stroke="#d4855a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>

        {/* ── HAIR ── */}
        {/* Back hair / volume */}
        <path d="M 22 82 Q 18 60 28 44 Q 40 26 62 22 Q 78 18 94 22 Q 116 28 126 46 Q 136 62 132 84 Q 128 100 120 110 L 118 108 Q 124 92 122 76 Q 118 58 106 48 Q 92 38 78 38 Q 64 38 52 46 Q 40 56 36 72 Q 32 88 34 106 L 32 108 Q 22 100 22 82 Z"
          fill="url(#hairGrad)"/>
        {/* Side hair strands flowing down */}
        <path d="M 28 90 Q 20 110 18 132 Q 16 148 22 162 Q 26 170 28 164 Q 24 148 26 130 Q 28 112 34 96 Z"
          fill="url(#hairGrad)"/>
        <path d="M 128 90 Q 136 110 138 132 Q 140 148 134 162 Q 130 170 128 164 Q 132 148 130 130 Q 128 112 122 96 Z"
          fill="url(#hairGrad)"/>
        {/* Top hair / crown */}
        <path d="M 42 72 Q 40 52 52 38 Q 64 24 78 22 Q 92 24 104 38 Q 116 52 114 72 Q 108 58 96 50 Q 88 44 78 43 Q 68 44 60 50 Q 48 58 42 72 Z"
          fill="url(#hairGrad)"/>
        {/* Fringe / bangs — covering forehead */}
        <path d="M 38 76 Q 40 58 50 50 Q 60 42 68 48 Q 64 58 60 70 Q 55 64 50 68 Z"
          fill="url(#hairGrad)"/>
        <path d="M 118 76 Q 116 58 106 50 Q 96 42 88 48 Q 92 58 96 70 Q 101 64 106 68 Z"
          fill="url(#hairGrad)"/>
        {/* Centre fringe pieces hanging down */}
        <path d="M 62 44 Q 58 56 56 70 Q 62 68 66 56 Z" fill="url(#hairGrad)"/>
        <path d="M 72 40 Q 68 54 68 72 Q 74 70 76 54 Z" fill="url(#hairGrad)"/>
        <path d="M 84 40 Q 88 54 88 72 Q 82 70 80 54 Z" fill="url(#hairGrad)"/>
        <path d="M 94 44 Q 98 56 100 70 Q 94 68 90 56 Z" fill="url(#hairGrad)"/>
        {/* Hair sheen highlights */}
        <path d="M 50 42 Q 46 58 44 76" stroke="url(#hairSheen)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5"/>
        <path d="M 68 26 Q 66 38 64 52" stroke="url(#hairSheen)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4"/>

        {/* ── EAR ── */}
        <ellipse cx="35" cy="96" rx="6" ry="8" fill="url(#skinGrad)"/>
        <ellipse cx="121" cy="96" rx="6" ry="8" fill="url(#skinGrad)"/>
        <ellipse cx="35" cy="96" rx="3" ry="5" fill="#f0c090" opacity="0.5"/>
        <ellipse cx="121" cy="96" rx="3" ry="5" fill="#f0c090" opacity="0.5"/>

        {/* ── SPARKLES / MAGIC ── */}
        <g filter="url(#softGlow)">
          <path d="M 10 72 L 12 68 L 14 72 L 12 76 Z" fill="#c084fc" opacity="0.8"/>
          <path d="M 8 72 L 16 72" stroke="#c084fc" strokeWidth="1" opacity="0.6"/>
          <path d="M 12 68 L 12 76" stroke="#c084fc" strokeWidth="1" opacity="0.6"/>
        </g>
        <g filter="url(#softGlow)">
          <path d="M 148 72 L 150 67 L 152 72 L 150 77 Z" fill="#67e8f9" opacity="0.7"/>
          <path d="M 145 72 L 155 72" stroke="#67e8f9" strokeWidth="1" opacity="0.5"/>
          <path d="M 150 67 L 150 77" stroke="#67e8f9" strokeWidth="1" opacity="0.5"/>
        </g>
        <circle cx="22" cy="52" r="2.5" fill="#fbbf24" opacity="0.75" filter="url(#glow)"/>
        <circle cx="148" cy="110" r="2" fill="#f472b6" opacity="0.7" filter="url(#glow)"/>
        <circle cx="8"  cy="110" r="1.5" fill="#a855f7" opacity="0.65" filter="url(#glow)"/>
        <circle cx="155" cy="144" r="2" fill="#67e8f9" opacity="0.6" filter="url(#glow)"/>
      </svg>
    </motion.div>
  )
}

// ── HeroOverlay ───────────────────────────────────────────────────────────────
export function HeroOverlay() {
  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none flex items-start justify-center"
      style={{ paddingTop: 'clamp(14px, 2.5vh, 36px)' }}
      aria-label="Hero introduction"
    >
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="pointer-events-auto flex items-end gap-4 sm:gap-8"
        style={{ maxWidth: 'min(900px, 94vw)', width: '100%', maxHeight: '52vh' }}
      >
        {/* ── LEFT: anime character ─────────────────────────────────── */}
        <div className="hidden sm:flex flex-col items-center flex-shrink-0" style={{ paddingBottom: 4 }}>
          <AnimeCharacter />
        </div>

        {/* ── RIGHT: text ───────────────────────────────────────────── */}
        <div className="flex flex-col items-start text-left flex-1 min-w-0 pb-2">

          <motion.div {...fadeUp(0.22)} className="mb-2">
            {heroInfo.available && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold
                               px-3 py-0.5 rounded-full"
                style={{
                  background: 'rgba(16,185,129,0.18)',
                  border:     '1px solid rgba(16,185,129,0.50)',
                  color:      '#34d399',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ animation: 'heartBeat 2s ease-in-out infinite' }} />
                Available for Opportunities
              </span>
            )}
          </motion.div>

          <motion.div {...fadeUp(0.29)} className="mb-2">
            <h1 className="font-bold leading-tight tracking-tight"
              style={{
                fontSize: 'clamp(1.4rem, 3.8vw, 2.8rem)',
                filter: 'drop-shadow(0 2px 14px rgba(0,0,0,1)) drop-shadow(0 0 24px rgba(0,0,0,0.9))',
              }}>
              <span style={{ color: '#f1f5f9' }}>Hi, I&apos;m </span>
              <span style={{
                background: 'linear-gradient(90deg,#fde68a,#fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{heroInfo.name}!</span>
              <span style={{ color: '#f1f5f9' }}> 👋</span>
            </h1>
            <p className="font-bold mt-1" style={{
              fontSize: 'clamp(0.88rem, 2vw, 1.5rem)',
              filter: 'drop-shadow(0 1px 10px rgba(0,0,0,1))',
              color: '#e2e8f0',
            }}>
              Curious Mind{' '}
              <span style={{
                background: 'linear-gradient(90deg,#a855f7,#c084fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Creative Code</span>{' '}
              Intelligent Solutions
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.36)}
            className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2">
            
              
          
          </motion.div>

          <motion.p {...fadeUp(0.42)}
            className="text-sm sm:text-base leading-relaxed mb-3 max-w-sm"
            style={{ color: '#cbd5e1', filter: 'drop-shadow(0 1px 6px rgba(0,0,0,1))' }}>
            {heroInfo.bio[2]}
          </motion.p>

          <motion.div {...fadeUp(0.50)} className="flex flex-wrap gap-1.5">
            <PillRow pills={TECH_PILLS} baseDelay={0.56} />
          </motion.div>

          <motion.div {...fadeUp(0.85)} className="flex items-center gap-1.5 mt-2.5">
            <MapPin className="w-3 h-3" style={{ color: '#6d28d9' }} />
            <span className="text-[11px]"
              style={{ color: '#475569', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))' }}>
              {heroInfo.location}
            </span>
            <Sparkles className="w-3 h-3" style={{ color: '#fbbf24', opacity: 0.65 }} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

function PillRow({ pills, baseDelay }: { pills: { label: string; color: string }[]; baseDelay: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {pills.map((pill, i) => (
        <motion.span key={pill.label}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: baseDelay + i * 0.05, duration: 0.26, ease: 'easeOut' }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium"
          style={{
            background: 'rgba(8,4,20,0.60)',
            border: `1px solid ${pill.color}50`,
            color: pill.color,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            boxShadow: `0 0 8px ${pill.color}18`,
          }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: pill.color, boxShadow: `0 0 4px ${pill.color}` }} />
          {pill.label}
        </motion.span>
      ))}
    </div>
  )
}
