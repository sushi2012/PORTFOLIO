import { motion } from 'framer-motion'
import { MapPin, Mail, Code2, Link2, Sparkles } from 'lucide-react'
import { heroInfo } from '@/data/portfolio'

// ── AboutHero ─────────────────────────────────────────────────────────────────
// Glassmorphic transparent strip — the game world glows through it.

export function AboutHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.25 }}
      aria-label="About me"
      className="relative w-full flex-shrink-0 overflow-hidden"
      style={{
        // Glassmorphism: very low opacity so game world shows through
        background: 'linear-gradient(135deg,rgba(15,10,30,0.28) 0%,rgba(30,15,55,0.22) 50%,rgba(15,10,30,0.28) 100%)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        borderBottom: '1px solid rgba(168,85,247,0.30)',
      }}
    >
      {/* ── Animated glow accents (visible through the glass) ─────────── */}
      <div
        className="absolute -left-16 -top-8 w-64 h-32 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse,rgba(124,58,237,0.18) 0%,transparent 65%)',
          animation: 'floatUp 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -right-12 -top-6 w-56 h-28 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse,rgba(168,85,247,0.14) 0%,transparent 65%)',
          animation: 'floatUp 6s ease-in-out 2s infinite',
        }}
      />
      {/* Warm sunset glow from the right */}
      <div
        className="absolute right-1/4 top-0 w-40 h-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse,rgba(245,158,11,0.08) 0%,transparent 70%)',
        }}
      />

      {/* ── Top accent gradient line ───────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg,transparent 5%,rgba(124,58,237,0.6) 25%,rgba(168,85,247,0.8) 50%,rgba(124,58,237,0.6) 75%,transparent 95%)',
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-4 sm:gap-5 px-5 sm:px-8 py-3.5 sm:py-4 max-w-7xl mx-auto w-full">

        {/* ── Avatar — glass orb ──────────────────────────────────────── */}
        <div className="relative flex-shrink-0">
          {/* Glow ring behind avatar */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle,rgba(168,85,247,0.25) 0%,transparent 70%)',
              transform: 'scale(1.4)',
            }}
          />
          <div
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
                       flex items-center justify-center text-3xl select-none"
            style={{
              background: 'linear-gradient(135deg,rgba(46,16,101,0.85),rgba(76,29,149,0.75),rgba(109,40,217,0.7))',
              border: '1.5px solid rgba(168,85,247,0.5)',
              boxShadow: '0 0 20px rgba(168,85,247,0.25), inset 0 0 12px rgba(168,85,247,0.1)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              animation: 'floatUp 3.5s ease-in-out infinite',
            }}
            aria-hidden="true"
          >
            {heroInfo.avatarEmoji}
          </div>
          {/* Sparkle accent */}
          <Sparkles
            className="absolute -top-1 -right-1 w-3.5 h-3.5"
            style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 4px #fbbf24)' }}
          />
        </div>

        {/* ── Name + title + bio ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
            <h1
              className="text-lg sm:text-xl font-bold leading-none tracking-tight"
              style={{
                background: 'linear-gradient(90deg,#fde68a,#fbbf24,#f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
              }}
            >
              {heroInfo.name}
            </h1>

            {heroInfo.available && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold
                           px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: 'rgba(16,185,129,0.12)',
                  border: '1px solid rgba(16,185,129,0.40)',
                  color: '#34d399',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ animation: 'heartBeat 2s ease-in-out infinite' }}
                />
                Available
              </span>
            )}
          </div>

          <p
            className="text-xs sm:text-sm font-medium mb-1 leading-none"
            style={{
              color: '#c4b5fd',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
            }}
          >
            {heroInfo.title}
          </p>

          <p
            className="text-[11px] sm:text-xs leading-snug line-clamp-2 max-w-xl"
            style={{
              color: '#cbd5e1',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
            }}
          >
            {heroInfo.bio[2]}
          </p>
        </div>

        {/* ── Meta + links ─────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col gap-1.5 flex-shrink-0">
          {/* Location */}
          <div
            className="flex items-center gap-1.5 text-[11px]"
            style={{
              color: '#9ca3af',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
            }}
          >
            <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#a855f7' }} />
            <span>{heroInfo.location}</span>
          </div>

          {/* Email */}
          <a
            href={`mailto:${heroInfo.email}`}
            className="flex items-center gap-1.5 text-[11px] transition-colors"
            style={{
              color: '#c4b5fd',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fde68a')}
            onMouseLeave={e => (e.currentTarget.style.color = '#c4b5fd')}
          >
            <Mail className="w-3 h-3 flex-shrink-0" style={{ color: '#a855f7' }} />
            <span className="truncate max-w-[160px]">{heroInfo.email}</span>
          </a>

          {/* Social links row */}
          <div className="flex items-center gap-3">
            <a
              href={heroInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium transition-colors"
              style={{
                color: '#c4b5fd',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fde68a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#c4b5fd')}
            >
              <Code2 className="w-3 h-3" style={{ color: '#a855f7' }} /> GitHub
            </a>
            <a
              href={heroInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium transition-colors"
              style={{
                color: '#c4b5fd',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fde68a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#c4b5fd')}
            >
              <Link2 className="w-3 h-3" style={{ color: '#a855f7' }} /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom gradient fade line ────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.35),rgba(251,191,36,0.15),rgba(168,85,247,0.35),transparent)',
        }}
      />
    </motion.section>
  )
}
