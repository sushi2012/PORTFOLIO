import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { X, Sparkles, ArrowLeft, ArrowRight, Mail, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { GameCanvas } from '@/components/GameCanvas'
import { FANTASY_GLOW_KEYFRAME } from '@/components/ui/FantasyBorder'
import { HeroOverlay } from '@/components/ui/HeroOverlay'
import { HireMeModal } from '@/components/ui/HireMeModal'
import { ContactPanel } from '@/components/ui/PortfolioPanels'
import { TopNav } from '@/components/ui/TopNav'
import { AboutPage } from '@/components/ui/pages/AboutPage'
import { ProjectsPage } from '@/components/ui/pages/ProjectsPage'
import { SkillsXPPage } from '@/components/ui/pages/SkillsXPPage'
import { OPEN_PAGE_EVENT } from '@/game/environments/IslandDefinitions'
import { KB_DISABLE_EVENT, KB_ENABLE_EVENT } from '@/game/scenes/GameScene'
import { PAGE_LABELS, PAGES, type PageId, type PanelId } from '@/types/ui'
import { heroInfo } from '@/data/portfolio'

// ── Framer Motion variants ────────────────────────────────────────────────────
const pageVariants: Variants = {
  hidden:  { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: '0%',   transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: '100%', transition: { duration: 0.30, ease: [0.4, 0, 1, 1] } },
}
const overlayVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1,    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.20 } },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function isFullPage(id: string | null): id is PageId {
  return PAGES.includes(id as PageId)
}

function routeId(id: string): PageId | null {
  if (id === 'experience') return 'skills-xp'   // legacy alias
  if (isFullPage(id))      return id as PageId
  return null
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState<PageId | null>(null)
  const [showHire,   setShowHire]   = useState(false)
  // Show the hero overlay by default; hide once user opens a page
  const [showHero,   setShowHero]   = useState(true)

  // Island open events from Phaser (E key or signboard click)
  useEffect(() => {
    function onOpen(e: Event) {
      const { id } = (e as CustomEvent<{ id: string }>).detail
      setShowHire(false)
      const page = routeId(id)
      if (page) { setActivePage(page); setShowHero(false) }
    }
    window.addEventListener(OPEN_PAGE_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_PAGE_EVENT, onOpen)
  }, [])

  // Disable Phaser keyboard when any overlay is open so form fields work
  useEffect(() => {
    const overlayOpen = !!activePage || showHire
    window.dispatchEvent(new Event(overlayOpen ? KB_DISABLE_EVENT : KB_ENABLE_EVENT))
  }, [activePage, showHire])

  // Escape closes everything, restores hero overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return
      setActivePage(null)
      setShowHire(false)
      setShowHero(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function handleNavSelect(id: PanelId) {
    setShowHire(false); setActivePage(null)
    if (id === 'home') { setShowHero(true); return }
    if (id === 'hire') { setShowHire(false); return }
    if (isFullPage(id as string)) {
      setActivePage(id as PageId)
      setShowHero(false)
      return
    }
  }

  const navActive: PanelId = showHire ? 'hire' : activePage ?? 'home'

  const pageIdx  = activePage ? PAGES.indexOf(activePage) : -1
  const prevPage = pageIdx > 0              ? PAGES[pageIdx - 1] : null
  const nextPage = pageIdx < PAGES.length-1 ? PAGES[pageIdx + 1] : null

  return (
    <>
      <style>{FANTASY_GLOW_KEYFRAME}</style>

      {/* ── Root: full-screen, no flex column — game fills everything ── */}
      <div className="relative w-full h-full overflow-hidden bg-[#04020e]">

        {/* ── Phaser game canvas — absolute, full screen ─────────────── */}
        <GameCanvas className="absolute inset-0 z-0" />

        {/* ── Radial vignette — darkens edges, keeps centre bright ────── */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%,transparent 40%,rgba(0,0,0,0.60) 100%)',
          }}
        />

        {/* ── Nav bar ───────────────────────────────────────────────── */}
        <header
          className="absolute top-0 left-0 right-0 z-40 flex items-center px-5 py-3 gap-4"
          style={{
            background: 'rgba(6,3,18,0.78)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: '1px solid rgba(124,58,237,0.18)',
          }}
        >
          {/* ── LEFT: star icon + name ──────────────────────────────── */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
            onClick={() => handleNavSelect('home')}
            className="flex items-center gap-2 flex-shrink-0 group"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg,#4c1d95,#7c3aed)',
                boxShadow: '0 0 12px rgba(124,58,237,0.55)',
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-base font-extrabold tracking-tight hidden sm:inline"
              style={{
                background: 'linear-gradient(90deg,#f1f5f9,#c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {heroInfo.name.split(' ')[0]}
            </span>
          </motion.button>

          {/* ── CENTER: nav pill ────────────────────────────────────── */}
          <div className="flex-1 flex justify-center min-w-0">
            <div className="overflow-x-auto">
              <TopNav active={navActive} onSelect={handleNavSelect} />
            </div>
          </div>

          {/* ── RIGHT: "Let's Connect" button + photo circle ────────── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Let's Connect / Hire Me button */}
            <motion.button
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowHire(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full
                         text-xs font-semibold overflow-hidden hidden sm:flex"
              style={{
                background: 'linear-gradient(135deg,#6d28d9,#a855f7)',
                border: '1px solid rgba(192,132,252,0.55)',
                color: '#fff',
                boxShadow: '0 0 16px rgba(124,58,237,0.40)',
              }}
            >
              {/* Shimmer */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.20),transparent)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 2.4s linear infinite',
                }} />
              <span className="relative">Let&apos;s Connect</span>
              <Sparkles className="w-3.5 h-3.5 relative" />
            </motion.button>

            {/* ── Photo circle — replace emoji with your real photo ─── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.4, type: 'spring', stiffness: 260 }}
              className="relative flex-shrink-0"
              title="Profile photo"
            >
              <div
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center
                           text-xl select-none cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg,#2e1065,#4c1d95,#7c3aed)',
                  border: '2px solid rgba(167,85,247,0.70)',
                  boxShadow: '0 0 14px rgba(124,58,237,0.50)',
                }}
                onClick={() => handleNavSelect('about')}
                aria-label="About me"
              >
                <img src="/photo.jpg" alt="Profile" className="w-full aspect-[9/16] object-cover" />
              </div>
              {/* Online indicator dot */}
              {heroInfo.available && (
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400"
                  style={{
                    border: '1.5px solid #04020e',
                    boxShadow: '0 0 6px rgba(52,211,153,0.8)',
                    animation: 'heartBeat 2s ease-in-out infinite',
                  }}
                />
              )}
            </motion.div>
          </div>
        </header>

        {/* ── Hero overlay — left side, on top of game ───────────────── */}
        <AnimatePresence>
          {showHero && !activePage && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 z-10"
              style={{ top: 56 }}   // below nav bar
            >
              <HeroOverlay />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Control hint ────────────────────────────────────────────── */}
        {!activePage && <ControlHint />}
      </div>

      {/* ── Full-viewport page overlay — slides up from bottom ─────────── */}
      <AnimatePresence mode="wait">
        {activePage && (
          <motion.div
            key={activePage}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex flex-col"
            style={{
              background: 'linear-gradient(160deg,rgba(4,2,14,0.99) 0%,rgba(10,5,28,0.99) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* ── SAME NAV BAR on all pages ─────────────────────────── */}
            <header
              className="flex-shrink-0 flex items-center px-5 py-3 gap-4"
              style={{ borderBottom: '1px solid rgba(124,58,237,0.22)' }}
            >
              {/* Left: logo */}
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => { setActivePage(null); setShowHero(true) }}
                className="flex items-center gap-2 flex-shrink-0"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed)', boxShadow: '0 0 12px rgba(124,58,237,0.55)' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-extrabold tracking-tight hidden sm:inline"
                  style={{
                    background: 'linear-gradient(90deg,#f1f5f9,#c4b5fd)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                  {heroInfo.name.split(' ')[0]}
                </span>
              </motion.button>

              {/* Center: nav (centered on pages) */}
              <div className="flex-1 flex justify-center min-w-0 overflow-x-auto">
                <TopNav active={navActive} onSelect={handleNavSelect} />
              </div>

              {/* Right: Let's Connect + photo + close */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setShowHire(true)}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full
                             text-xs font-semibold overflow-hidden hidden md:flex"
                  style={{
                    background: 'linear-gradient(135deg,#6d28d9,#a855f7)',
                    border: '1px solid rgba(192,132,252,0.55)',
                    color: '#fff',
                    boxShadow: '0 0 14px rgba(124,58,237,0.35)',
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.20),transparent)',
                      backgroundSize: '200% auto', animation: 'shimmer 2.4s linear infinite',
                    }} />
                  <span className="relative">Let&apos;s Connect</span>
                  <Sparkles className="w-3.5 h-3.5 relative" />
                </motion.button>

                {/* Photo circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center
                               text-lg select-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg,#2e1065,#4c1d95,#7c3aed)',
                      border: '2px solid rgba(167,85,247,0.70)',
                      boxShadow: '0 0 12px rgba(124,58,237,0.45)',
                    }}
                    onClick={() => handleNavSelect('about')}
                    aria-label="About me"
                  >
                    <img src="/photo.jpg" alt="Profile" className="w-full h-full object-cover object-top" />
                  </div>
                  {heroInfo.available && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400"
                      style={{ border: '1.5px solid #04020e', animation: 'heartBeat 2s ease-in-out infinite' }} />
                  )}
                </div>

                {/* Close / back to home */}
                <motion.button
                  whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setActivePage(null); setShowHero(true) }}
                  className="w-9 h-9 rounded-full flex items-center justify-center ml-1"
                  style={{
                    background: 'rgba(76,29,149,0.35)',
                    border: '1px solid rgba(124,58,237,0.45)',
                    color: '#c4b5fd',
                  }}
                  aria-label="Back to home"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </header>

            {/* ── Scrollable content ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
              <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-6 sm:py-8 h-full flex flex-col">
                <PageContent page={activePage} />
              </div>
            </div>

            {/* ── Bottom prev / next ────────────────────────────────────── */}
            <div
              className="flex-shrink-0 flex items-center justify-between
                         px-6 sm:px-10 py-4"
              style={{ borderTop: '1px solid rgba(124,58,237,0.18)' }}
            >
              <PageNavBtn
                target={prevPage} direction="prev"
                onClick={() => prevPage && setActivePage(prevPage)}
              />
              <PageNavBtn
                target={nextPage} direction="next"
                onClick={() => nextPage && setActivePage(nextPage)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contact modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {activePage === 'contact' && (
          /* Contact is handled inline inside PageContent, so nothing extra needed */
          null
        )}
      </AnimatePresence>

      {/* ── Hire Me modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showHire && (
          <motion.div
            key="hire-backdrop"
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50"
          >
            <HireMeModal onClose={() => setShowHire(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function PageContent({ page }: { page: PageId }) {
  // flex-1 + h-full lets pages that opt in (like ProjectsPage) fill the viewport
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {page === 'about'     && <AboutPage />}
      {page === 'projects'  && <ProjectsPage />}
      {page === 'skills-xp' && <SkillsXPPage />}
      {page === 'contact'   && <ContactPageFull />}
    </div>
  )
}

// ── ContactPageFull — full-page contact with email form ──────────────────────
function ContactPageFull() {
  return (
    <div className="flex flex-col h-full" style={{ minHeight: '100%' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-shrink-0 pb-5"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
          style={{ background: 'rgba(76,29,149,0.35)', border: '1px solid rgba(124,58,237,0.5)', color: '#c4b5fd' }}>
          <Mail className="w-3 h-3" style={{ color: '#a855f7' }} />
          <span className="text-xs font-semibold">Get In Touch</span>
        </div>

        <h1 className="font-extrabold leading-none mb-2" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
          <span style={{ color: '#f1f5f9' }}>Let&apos;s </span>
          <span style={{
            background: 'linear-gradient(90deg,#a855f7,#c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Connect</span>
          <span style={{ color: '#fbbf24' }}> ✨</span>
        </h1>

        <p className="text-sm" style={{ color: '#64748b' }}>
          Have a project in mind? I&apos;d love to hear from you.
        </p>
      </motion.div>

      {/* Thin divider */}
      <div className="flex-shrink-0 mb-6"
        style={{ height: 1, background: 'linear-gradient(90deg,rgba(124,58,237,0.45),rgba(167,85,247,0.2),transparent)' }} />

      {/* Two-column body */}
      <div className="flex gap-8 flex-1 min-h-0">

        {/* LEFT — contact info cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: 'easeOut' }}
          className="hidden lg:flex flex-col gap-4 flex-shrink-0"
          style={{ width: 'clamp(200px, 30%, 280px)' }}
        >
          {/* Info card */}
          <div className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: 'rgba(76,29,149,0.15)', border: '1px solid rgba(124,58,237,0.28)' }}>
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>
              Contact Info
            </h3>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.30)', border: '1px solid rgba(124,58,237,0.45)' }}>
                <Mail className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#4b5563' }}>Email</p>
                <a href={`mailto:${heroInfo.email}`}
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#c4b5fd' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#c4b5fd')}>
                  {heroInfo.email}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.30)', border: '1px solid rgba(124,58,237,0.45)' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#4b5563' }}>Location</p>
                <p className="text-xs font-medium" style={{ color: '#c4b5fd' }}>{heroInfo.location}</p>
              </div>
            </div>

            

            {/* GitHub */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.30)', border: '1px solid rgba(124,58,237,0.45)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#a855f7' }}>
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#4b5563' }}>GitHub</p>
                <a href={heroInfo.github} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#c4b5fd' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#c4b5fd')}>
                  github.com/sushi2012
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,43,94,0.50)', border: '1px solid rgba(56,189,248,0.45)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#38bdf8' }}>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#4b5563' }}>LinkedIn</p>
                <a href={heroInfo.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#bae6fd' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#bae6fd')}>
                  Sushree Satapathy
                </a>
              </div>
            </div>
          </div>

          {/* "How it works" card */}
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(76,29,149,0.10)', border: '1px solid rgba(124,58,237,0.20)' }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7c3aed' }}>
              How it works
            </h3>
            <ol className="flex flex-col gap-2.5">
              {[
                'Fill in your name & email',
                'Write your message or opportunity',
                'Hit Send — arrives in my inbox instantly',
                'I\'ll reply within 24 hours',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: '#94a3b8' }}>
                  <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center
                                   text-[9px] font-bold mt-0.5"
                    style={{ background: 'rgba(124,58,237,0.40)', color: '#c4b5fd' }}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* RIGHT — email form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
          className="flex-1 min-w-0"
        >
          <ContactPanel />
        </motion.div>
      </div>
    </div>
  )
}  

// ── PageNavBtn ────────────────────────────────────────────────────────────────
function PageNavBtn({ target, direction, onClick }: {
  target: PageId | null; direction: 'prev' | 'next'; onClick: () => void
}) {
  if (!target) return <div className="w-28" />
  return (
    <motion.button
      whileHover={{ scale: 1.04, x: direction === 'prev' ? -2 : 2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
      style={{
        background: 'rgba(76,29,149,0.28)',
        border: '1px solid rgba(124,58,237,0.38)',
        color: '#c4b5fd',
      }}
    >
      {direction === 'prev' && <ArrowLeft className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline max-w-[100px] truncate">{PAGE_LABELS[target]}</span>
      {direction === 'next' && <ArrowRight className="w-3.5 h-3.5" />}
    </motion.button>
  )
}

// ── ControlHint ───────────────────────────────────────────────────────────────
function ControlHint() {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 10000)
    const on = () => setShow(true)
    window.addEventListener('keydown', on)
    window.addEventListener('mousemove', on)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', on)
      window.removeEventListener('mousemove', on)
    }
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
          className="absolute bottom-3 right-4 z-20 pointer-events-none"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono"
            style={{
              background: 'rgba(4,2,14,0.82)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(76,29,149,0.4)',
              color: '#6d28d9',
            }}
          >
            <span>← → Move</span>
            <span style={{ color: '#3b0764' }}>·</span>
            <span>↑ Jump</span>
            <span style={{ color: '#3b0764' }}>·</span>
            <span>E / Click Island</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
