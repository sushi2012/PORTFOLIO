import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { FantasyBorder } from './FantasyBorder'
import { PAGES, PAGE_LABELS, type PageId } from '@/types/ui'

interface Props {
  page: PageId
  children: React.ReactNode
  onClose: () => void
  onNavigate: (page: PageId) => void
}

export function PageShell({ page, children, onClose, onNavigate }: Props) {
  const currentIdx = PAGES.indexOf(page)
  const prevPage = currentIdx > 0 ? PAGES[currentIdx - 1] : null
  const nextPage = currentIdx < PAGES.length - 1 ? PAGES[currentIdx + 1] : null
  const pageNum = currentIdx + 1
  const totalPages = PAGES.length

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ top: 64 }}>

      {/* ── Backdrop scrim ────────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,6,20,0.96) 0%, rgba(15,10,30,0.97) 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      />

      {/* ── Page chrome ───────────────────────────────────────────────── */}
      <div className="relative flex flex-col h-full">

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-between px-4 sm:px-8 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(124,58,237,0.25)' }}
        >
          {/* Page title + counter */}
          <div className="flex items-center gap-3">
            <PageCounter current={pageNum} total={totalPages} />
            <div>
              <h1 className="text-sm font-bold leading-none" style={{ color: '#e9d5ff' }}>
                {PAGE_LABELS[page]}
              </h1>
              <p className="text-[10px] mt-0.5" style={{ color: '#7c3aed' }}>
                {PAGES.map((p, i) => (
                  <button
                    key={p}
                    onClick={() => onNavigate(p)}
                    className="transition-colors mr-2"
                    style={{
                      color: p === page ? '#a855f7' : '#4c1d95',
                      fontWeight: p === page ? 700 : 400,
                      textDecoration: p === page ? 'none' : 'underline',
                    }}
                  >
                    {i + 1}. {PAGE_LABELS[p]}
                  </button>
                ))}
              </p>
            </div>
          </div>

          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{
              background: 'rgba(76,29,149,0.3)',
              border: '1px solid rgba(124,58,237,0.4)',
              color: '#c4b5fd',
            }}
            aria-label="Close page"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* ── Scrollable content ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>

        {/* ── Bottom pagination bar ────────────────────────────────────── */}
        <div
          className="relative flex items-center justify-between px-4 sm:px-8 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(124,58,237,0.2)' }}
        >
          {/* Prev */}
          <NavArrow
            direction="prev"
            target={prevPage}
            label={prevPage ? PAGE_LABELS[prevPage] : null}
            onClick={() => prevPage && onNavigate(prevPage)}
          />

          {/* Breadcrumb dots */}
          <div className="flex gap-2 items-center">
            {PAGES.map((p, i) => (
              <button
                key={p}
                onClick={() => onNavigate(p)}
                aria-label={`Go to ${PAGE_LABELS[p]}`}
                className="transition-all duration-300"
                style={{
                  width: p === page ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: p === page
                    ? 'linear-gradient(90deg,#7c3aed,#a855f7)'
                    : 'rgba(124,58,237,0.3)',
                  boxShadow: p === page ? '0 0 8px #a855f755' : 'none',
                  outline: 'none',
                }}
              >
                {/* hidden label for SR */}
                <span className="sr-only">{i + 1}</span>
              </button>
            ))}
          </div>

          {/* Next */}
          <NavArrow
            direction="next"
            target={nextPage}
            label={nextPage ? PAGE_LABELS[nextPage] : null}
            onClick={() => nextPage && onNavigate(nextPage)}
          />
        </div>
      </div>

      {/* Subtle side border glow */}
      <FantasyBorder radius={0} glowColor="#7c3aed44" ornamentColor="#4c1d95" animated={false} />
    </div>
  )
}

// ── PageCounter ───────────────────────────────────────────────────────────────
function PageCounter({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex-shrink-0 w-9 h-9 rounded-xl flex flex-col items-center
                 justify-center leading-none"
      style={{
        background: 'linear-gradient(135deg,#4c1d95,#7c3aed)',
        border: '1px solid #a855f766',
        boxShadow: '0 0 10px #a855f744',
      }}
    >
      <span className="text-[10px] font-bold" style={{ color: '#fff' }}>{current}</span>
      <span className="text-[8px]" style={{ color: '#c4b5fd' }}>/ {total}</span>
    </div>
  )
}

// ── NavArrow ──────────────────────────────────────────────────────────────────
function NavArrow({
  direction,
  target,
  label,
  onClick,
}: {
  direction: 'prev' | 'next'
  target: PageId | null
  label: string | null
  onClick: () => void
}) {
  const isPrev = direction === 'prev'

  if (!target) {
    return <div className="w-28" />
  }

  return (
    <motion.button
      whileHover={{ scale: 1.04, x: isPrev ? -2 : 2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
      style={{
        background: 'rgba(76,29,149,0.25)',
        border: '1px solid rgba(124,58,237,0.35)',
        color: '#c4b5fd',
      }}
    >
      {isPrev && <ArrowLeft className="w-3.5 h-3.5" />}
      <span className="max-w-[80px] truncate hidden sm:inline">{label}</span>
      {!isPrev && <ArrowRight className="w-3.5 h-3.5" />}
    </motion.button>
  )
}
