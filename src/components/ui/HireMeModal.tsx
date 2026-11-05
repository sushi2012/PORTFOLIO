import { motion } from 'framer-motion'
import { Sparkles, Mail, ExternalLink, X } from 'lucide-react'
import { FantasyBorder } from './FantasyBorder'
import { heroInfo } from '@/data/portfolio'
import { OPEN_PAGE_EVENT } from '@/game/environments/IslandDefinitions'

interface Props {
  onClose: () => void
}

export function HireMeModal({ onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 20 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Hire Me"
      >
        <div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg,rgba(15,10,30,0.98) 0%,rgba(25,12,50,0.97) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <FantasyBorder radius={16} glowColor="#fbbf24" ornamentColor="#fbbf24" animated />

          {/* Glow backdrop orb */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle,rgba(251,191,36,0.14) 0%,transparent 70%)',
            }}
          />

          <div className="relative px-7 py-7">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg transition-colors"
              style={{ color: '#4b5563' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg,#92400e,#b45309,#fbbf24)',
                  border: '2px solid #fbbf2488',
                  boxShadow: '0 0 28px #fbbf2455, 0 0 10px #f59e0b44',
                }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Heading */}
            <h2
              className="text-xl font-bold text-center mb-1"
              style={{
                background: 'linear-gradient(90deg,#fbbf24,#f59e0b,#fde68a,#fbbf24)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              Ready to Build Together?
            </h2>

            <p className="text-xs text-center mb-5" style={{ color: '#9ca3af' }}>
              Open to full-time roles, contract work, and AI consulting.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {['Agentic AI', 'Full-Stack', 'LLM Systems', 'Remote / Hybrid'].map(tag => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: 'rgba(146,64,14,0.3)',
                    border: '1px solid rgba(251,191,36,0.35)',
                    color: '#fde68a',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              {/* Email Me Now → opens Contact page */}
              <motion.button onClick={() => {
                  onClose()
                  // Small delay so modal exit animation plays before page opens
                  setTimeout(() => {
                    window.dispatchEvent(
                      new CustomEvent(OPEN_PAGE_EVENT, { detail: { id: 'contact' } })
                    )
                  }, 180)
                }}
               
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center justify-center gap-2
                           px-5 py-3 rounded-xl text-sm font-bold overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                  border: '1px solid #fde68a88',
                  color: '#0f0a1e',
                  boxShadow: '0 0 24px #fbbf2455, 0 4px 12px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                }}
              >
                {/* Shimmer */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)',
                    backgroundSize: '200% auto',
                    animation: 'shimmer 2s linear infinite',
                  }}
                />
                <Mail className="w-4 h-4 relative" />
                <span className="relative">Email Me Now</span>
              </motion.button>

              <motion.a
                href={heroInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2
                           px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: 'rgba(146,64,14,0.2)',
                  border: '1px solid rgba(251,191,36,0.3)',
                  color: '#fbbf24',
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View LinkedIn Profile
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
