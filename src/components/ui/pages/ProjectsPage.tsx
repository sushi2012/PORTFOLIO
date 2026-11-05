import { motion } from 'framer-motion'
import { Code2, ExternalLink, Sparkles, Star } from 'lucide-react'
import { projects } from '@/data/portfolio'

// ── Per-project icon ──────────────────────────────────────────────────────────
function ProjectIcon({ index }: { index: number }) {
  const icons = [
    <svg key="ai" viewBox="0 0 64 64" width="64" height="64" fill="none">
      <circle cx="32" cy="32" r="30" fill="rgba(109,40,217,0.20)" stroke="rgba(167,85,247,0.55)" strokeWidth="1.5"/>
      <rect x="18" y="32" width="28" height="20" rx="6" fill="#4c1d95" stroke="#a855f7" strokeWidth="1"/>
      <rect x="20" y="16" width="24" height="18" rx="6" fill="#6d28d9" stroke="#c084fc" strokeWidth="1"/>
      <circle cx="26" cy="24" r="3" fill="#67e8f9"/>
      <circle cx="38" cy="24" r="3" fill="#67e8f9"/>
      <circle cx="27" cy="24" r="1.2" fill="#fff"/>
      <circle cx="39" cy="24" r="1.2" fill="#fff"/>
      <path d="M26 30 Q32 34 38 30" stroke="#a855f7" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="32" y1="16" x2="32" y2="10" stroke="#c084fc" strokeWidth="1.5"/>
      <circle cx="32" cy="9" r="3" fill="#a855f7"/>
      <rect x="9" y="34" width="9" height="14" rx="4" fill="#4c1d95" stroke="#7c3aed" strokeWidth="0.8"/>
      <rect x="46" y="34" width="9" height="14" rx="4" fill="#4c1d95" stroke="#7c3aed" strokeWidth="0.8"/>
      <rect x="25" y="37" width="14" height="9" rx="3" fill="rgba(103,232,249,0.2)" stroke="#67e8f9" strokeWidth="0.8"/>
    </svg>,

    <svg key="doc" viewBox="0 0 64 64" width="64" height="64" fill="none">
      <circle cx="32" cy="32" r="30" fill="rgba(56,189,248,0.14)" stroke="rgba(56,189,248,0.50)" strokeWidth="1.5"/>
      <rect x="14" y="10" width="26" height="36" rx="4" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1.2"/>
      <rect x="19" y="18" width="16" height="2.5" rx="1" fill="#38bdf8" opacity="0.75"/>
      <rect x="19" y="24" width="16" height="2.5" rx="1" fill="#38bdf8" opacity="0.55"/>
      <rect x="19" y="30" width="11" height="2.5" rx="1" fill="#38bdf8" opacity="0.40"/>
      <rect x="19" y="36" width="13" height="2.5" rx="1" fill="#38bdf8" opacity="0.30"/>
      <circle cx="44" cy="44" r="12" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5"/>
      <circle cx="42" cy="42" r="6" fill="none" stroke="#7dd3fc" strokeWidth="1.8"/>
      <line x1="47" y1="47" x2="52" y2="52" stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="44" cy="44" r="12" fill="none" stroke="#67e8f9" strokeWidth="0.5" opacity="0.35"/>
    </svg>,

    // AI Medical Receptionist — stethoscope + cross + heartbeat
    <svg key="medical" viewBox="0 0 64 64" width="64" height="64" fill="none">
      <circle cx="32" cy="32" r="30" fill="rgba(52,211,153,0.10)" stroke="rgba(52,211,153,0.50)" strokeWidth="1.5"/>
      {/* Medical cross */}
      <rect x="27" y="10" width="10" height="32" rx="4" fill="#0d9488" opacity="0.90"/>
      <rect x="13" y="24" width="38" height="10" rx="4" fill="#0d9488" opacity="0.90"/>
      {/* Cross inner highlight */}
      <rect x="29" y="10" width="4" height="32" rx="2" fill="#2dd4bf" opacity="0.30"/>
      <rect x="13" y="26" width="38" height="4"  rx="2" fill="#2dd4bf" opacity="0.30"/>
      {/* Heartbeat / ECG line across bottom */}
      <polyline
        points="8,52 16,52 20,43 25,60 29,49 33,52 38,52 43,45 47,52 56,52"
        stroke="#34d399" strokeWidth="2.2" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Pulse peak glow */}
      <circle cx="25" cy="60" r="2.2" fill="#34d399" opacity="0.75"/>
      <circle cx="25" cy="60" r="4"   fill="#34d399" opacity="0.18"/>
    </svg>,

    <svg key="cloud" viewBox="0 0 64 64" width="64" height="64" fill="none">
      <circle cx="32" cy="32" r="30" fill="rgba(192,132,252,0.11)" stroke="rgba(192,132,252,0.50)" strokeWidth="1.5"/>
      <path d="M22 38 Q14 38 14 30 Q14 22 22 22 Q22 14 32 14 Q42 14 42 22 Q50 22 50 30 Q50 38 42 38 Z"
        fill="#2e1065" stroke="#c084fc" strokeWidth="1.3"/>
      <path d="M22 38 Q14 38 14 30 Q14 22 22 22 Q22 14 32 14 Q42 14 42 22 Q50 22 50 30 Q50 38 42 38 Z"
        fill="rgba(192,132,252,0.14)"/>
      <line x1="32" y1="52" x2="32" y2="34" stroke="#a855f7" strokeWidth="2.2" strokeLinecap="round"/>
      <polyline points="24,42 32,34 40,42" stroke="#a855f7" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="22" cy="50" r="2.5" fill="#c084fc" opacity="0.6"/>
      <circle cx="32" cy="54" r="2.5" fill="#a855f7" opacity="0.5"/>
      <circle cx="42" cy="50" r="2.5" fill="#c084fc" opacity="0.6"/>
    </svg>,
  ]
  return icons[index % icons.length]
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ proj, index }: { proj: typeof projects[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.10, duration: 0.45, ease: 'easeOut' }}
      className="relative flex flex-col gap-3 p-4 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg,rgba(15,8,35,0.94) 0%,rgba(26,12,58,0.90) 100%)',
        border: '1px solid rgba(124,58,237,0.32)',
        transition: 'border-color 0.22s, box-shadow 0.22s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(167,85,247,0.80)'
        e.currentTarget.style.boxShadow   = '0 0 36px rgba(124,58,237,0.20), inset 0 0 24px rgba(109,40,217,0.06)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.32)'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        <ProjectIcon index={index} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Title + number */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold leading-snug flex items-center gap-2"
            style={{ color: '#f1f5f9' }}>
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#a855f7' }} />
            {proj.title}
          </h3>
          <span
            className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded"
            style={{
              background: 'rgba(76,29,149,0.50)',
              color: '#c4b5fd',
              border: '1px solid rgba(124,58,237,0.40)',
              minWidth: 28,
              textAlign: 'center',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: '#94a3b8' }}>
          {proj.description}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {proj.tech.map(t => (
            <span key={t}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(76,29,149,0.28)',
                border:     '1px solid rgba(124,58,237,0.38)',
                color:      '#c4b5fd',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#a855f7' }} />
              {t}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-auto">
          {proj.github && (
            <a
              href={proj.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold
                         px-4 py-2 rounded-xl transition-all duration-150"
              style={{
                background: 'rgba(30,15,60,0.80)',
                border:     '1px solid rgba(124,58,237,0.50)',
                color:      '#e9d5ff',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background    = 'rgba(76,29,149,0.60)'
                e.currentTarget.style.borderColor   = 'rgba(167,85,247,0.80)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background    = 'rgba(30,15,60,0.80)'
                e.currentTarget.style.borderColor   = 'rgba(124,58,237,0.50)'
              }}
            >
              <Code2 className="w-3.5 h-3.5" /> Code
            </a>
          )}
          {proj.link && (
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold
                         px-4 py-2 rounded-xl transition-all duration-150"
              style={{
                background: 'linear-gradient(135deg,rgba(124,58,237,0.70),rgba(109,40,217,0.70))',
                border:     '1px solid rgba(167,85,247,0.60)',
                color:      '#fff',
                boxShadow:  '0 0 10px rgba(124,58,237,0.28)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg,#7c3aed,#a855f7)'
                e.currentTarget.style.boxShadow  = '0 0 20px rgba(124,58,237,0.55)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg,rgba(124,58,237,0.70),rgba(109,40,217,0.70))'
                e.currentTarget.style.boxShadow  = '0 0 10px rgba(124,58,237,0.28)'
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// ── ProjectsPage ──────────────────────────────────────────────────────────────
export function ProjectsPage() {
  return (
    <div className="flex flex-col h-full" style={{ minHeight: '100%' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.40, ease: 'easeOut' }}
        className="flex-shrink-0 pb-5"
      >
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
          style={{
            background: 'rgba(76,29,149,0.35)',
            border: '1px solid rgba(124,58,237,0.50)',
            color: '#c4b5fd',
          }}
        >
          <Star className="w-3 h-3" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
          <span className="text-xs font-semibold">My Work</span>
        </div>

        <h1 className="font-extrabold leading-none mb-2"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
          <span style={{ color: '#f1f5f9' }}>Proj</span>
          <span style={{
            background: 'linear-gradient(90deg,#a855f7,#c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}>ects</span>
        </h1>

        <p className="text-s flex items-center gap-2" style={{ color: '#64748b' }}>
          Building intelligent solutions, one project at a time
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
        </p>
      </motion.div>

      {/* Divider */}
      <div
        className="flex-shrink-0 mb-5"
        style={{
          height: 1,
          background: 'linear-gradient(90deg,rgba(124,58,237,0.50),rgba(167,85,247,0.20),transparent)',
        }}
      />

      {/* Single row — all 4 projects side by side, natural height, equal gaps */}
      <div className="flex-1 min-h-0 flex flex-col justify-start pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((proj, i) => (
            <ProjectCard key={proj.id} proj={proj} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom hint — pinned above the page bottom nav */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48, duration: 0.35, ease: 'easeOut' }}
        className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl mb-2"
        style={{
          background: 'linear-gradient(135deg,rgba(76,29,149,0.20),rgba(30,15,60,0.32))',
          border: '1px solid rgba(124,58,237,0.26)',
        }}
      >
        <span className="text-base flex-shrink-0">🤖</span>
        <p className="text-xs font-medium" style={{ color: '#c4b5fd' }}>
          Click any project to explore the live demo!{' '}
          <span style={{ color: '#f472b6' }}>♥</span>
        </p>
      </motion.div>
    </div>
  )
}
