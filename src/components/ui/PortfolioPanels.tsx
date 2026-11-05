import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ExternalLink, GitBranch, Zap, Briefcase, User,
  Mail, MapPin, CheckCircle, Send,
} from 'lucide-react'
import { FantasyBorder } from './FantasyBorder'
import {
  heroInfo,
  projects,
  skillCategories,
  experience
} from '@/data/portfolio'

// ── Shared panel wrapper ──────────────────────────────────────────────────────

export function PanelWrap({
  children,
  className = '',
  maxW = 'max-w-2xl',
}: {
  children: React.ReactNode
  className?: string
  maxW?: string
}) {
  return (
    <div className={`relative rounded-2xl overflow-hidden ${maxW} w-full ${className}`}
      style={{
        background: 'linear-gradient(160deg,rgba(15,10,30,0.95) 0%,rgba(22,12,45,0.93) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <FantasyBorder radius={16} glowColor="#7c3aed" ornamentColor="#fbbf24" animated />
      <div className="relative p-5 sm:p-6">{children}</div>
    </div>
  )
}

function PanelTitle({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <h2 className="flex items-center gap-2 text-base font-bold mb-4"
      style={{ color: '#e9d5ff' }}
    >
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg,#4c1d95,#7c3aed)',
          boxShadow: '0 0 8px #a855f744',
        }}
      >
        {icon}
      </span>
      {children}
    </h2>
  )
}

// ── stagger helper ────────────────────────────────────────────────────────────
// Framer Motion requires ease to be a named string or typed tuple in Variants.
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.32,
      ease: 'easeOut' as const,
    },
  }),
}

// ════════════════════════════════════════════════════════════════════════════════
// ── ProjectsPanel ──────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
export function ProjectsPanel() {
  return (
    <PanelWrap maxW="max-w-2xl">
      <PanelTitle icon={<GitBranch className="w-3.5 h-3.5 text-purple-300" />}>
        Quests Completed
      </PanelTitle>

      <div className="grid sm:grid-cols-2 gap-3">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={item}
            className="group relative rounded-xl p-4 transition-colors duration-200"
            style={{
              background: 'rgba(76,29,149,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid rgba(168,85,247,0.7)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(168,85,247,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid rgba(124,58,237,0.3)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Title */}
            <h3 className="text-sm font-semibold mb-1.5" style={{ color: '#fde68a' }}>
              {proj.title}
            </h3>

            {/* Description */}
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#94a3b8' }}>
              {proj.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {proj.tech.map(t => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: 'rgba(109,40,217,0.35)',
                    border: '1px solid rgba(139,92,246,0.4)',
                    color: '#c4b5fd',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-3">
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] transition-colors duration-150"
                  style={{ color: '#7c3aed' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#7c3aed')}
                >
                  <GitBranch className="w-3 h-3" /> Code
                </a>
              )}
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] transition-colors duration-150"
                  style={{ color: '#92400e' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#92400e')}
                >
                  <ExternalLink className="w-3 h-3" /> Live
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </PanelWrap>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// ── SkillsPanel ────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
export function SkillsPanel() {
  return (
    <PanelWrap maxW="max-w-2xl">
      <PanelTitle icon={<Zap className="w-3.5 h-3.5 text-purple-300" />}>
        Skill Tree
      </PanelTitle>

      <div className="grid sm:grid-cols-2 gap-4">
        {skillCategories.map((cat, ci) => (
          <motion.div
            key={cat.category}
            custom={ci}
            initial="hidden"
            animate="visible"
            variants={item}
          >
            {/* Category header */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">{cat.icon}</span>
              <span className="text-xs font-semibold" style={{ color: '#fde68a' }}>
                {cat.category}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-1.5">
              {cat.skills.map((sk, si) => (
                <motion.div
                  key={sk.name}
                  custom={ci * 5 + si}
                  initial="hidden"
                  animate="visible"
                  variants={item}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px]" style={{ color: '#c4b5fd' }}>{sk.name}</span>
                    <SkillPips level={sk.level} />
                  </div>
                  <SkillBar level={sk.level} delay={ci * 0.1 + si * 0.05} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </PanelWrap>
  )
}

function SkillPips({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: i < level ? '#a855f7' : 'rgba(124,58,237,0.2)',
            boxShadow: i < level ? '0 0 4px #a855f788' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function SkillBar({ level, delay }: { level: number; delay: number }) {
  return (
    <div
      className="h-1 rounded-full overflow-hidden"
      style={{ background: 'rgba(124,58,237,0.2)' }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(level / 5) * 100}%` }}
        transition={{ delay: 0.3 + delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-full rounded-full"
        style={{
          background: 'linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)',
          boxShadow: '0 0 6px #a855f766',
        }}
      />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// ── ExperiencePanel ────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
export function ExperiencePanel() {
  return (
    <PanelWrap maxW="max-w-xl">
      <PanelTitle icon={<Briefcase className="w-3.5 h-3.5 text-purple-300" />}>
        Adventure Log
      </PanelTitle>

      <div className="relative flex flex-col gap-0">
        {/* Timeline line */}
        <div
          className="absolute left-[19px] top-3 bottom-3 w-px"
          style={{ background: 'linear-gradient(to bottom,#7c3aed,#4c1d9500)' }}
        />

        {experience.map((exp, i) => (
          <motion.div
            key={exp.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={item}
            className="relative flex gap-4 pb-5 last:pb-0"
          >
            {/* Timeline dot */}
            <div
              className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
              style={{
                background: exp.current
                  ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                  : 'linear-gradient(135deg,#1e1b2e,#2d1b5e)',
                border: `2px solid ${exp.current ? '#a855f7' : '#3b0764'}`,
                boxShadow: exp.current ? '0 0 12px #a855f755' : 'none',
              }}
            >
              <Briefcase className="w-4 h-4" style={{ color: exp.current ? '#e9d5ff' : '#6d28d9' }} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex flex-wrap items-baseline gap-1.5 mb-1">
                <span className="text-sm font-bold" style={{ color: '#fde68a' }}>
                  {exp.role}
                </span>
                {exp.current && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                    style={{
                      background: 'rgba(16,185,129,0.2)',
                      border: '1px solid rgba(16,185,129,0.5)',
                      color: '#34d399',
                    }}
                  >
                    Current
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium" style={{ color: '#a855f7' }}>
                  {exp.company}
                </span>
                <span className="text-[10px]" style={{ color: '#4b5563' }}>·</span>
                <span className="text-[10px]" style={{ color: '#6b7280' }}>
                  {exp.period}
                </span>
              </div>

              <ul className="flex flex-col gap-1">
                {exp.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-1.5">
                    <CheckCircle
                      className="w-3 h-3 flex-shrink-0 mt-0.5"
                      style={{ color: '#7c3aed' }}
                    />
                    <span className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </PanelWrap>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// ── AboutPanel ─────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
export function AboutPanel() {
  return (
    <PanelWrap maxW="max-w-lg">
      <PanelTitle icon={<User className="w-3.5 h-3.5 text-purple-300" />}>
        The Adventurer
      </PanelTitle>

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl select-none"
          style={{
            background: 'linear-gradient(135deg,#2e1065,#4c1d95,#6d28d9)',
            border: '2px solid #a855f766',
            boxShadow: '0 0 16px #a855f744',
            animation: 'floatUp 3s ease-in-out infinite',
          }}
        >
          {heroInfo.avatarEmoji}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-bold" style={{ color: '#fde68a' }}>
            {heroInfo.name}
          </p>
          <p className="text-xs mb-2" style={{ color: '#a855f7' }}>
            {heroInfo.title}
          </p>

          {heroInfo.available && (
            <div
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3"
              style={{
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.4)',
                color: '#34d399',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ animation: 'heartBeat 2s ease-in-out infinite' }}
              />
              Available for opportunities
            </div>
          )}

          <p className="text-xs leading-relaxed mb-3" style={{ color: '#94a3b8' }}>
            {heroInfo.bio[2]}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-[11px]" style={{ color: '#6b7280' }}>
              <MapPin className="w-3 h-3" /> {heroInfo.location}
            </div>
            <a
              href={heroInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] transition-colors"
              style={{ color: '#7c3aed' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
              onMouseLeave={e => (e.currentTarget.style.color = '#7c3aed')}
            >
              GitHub ↗
            </a>
            <a
              href={heroInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] transition-colors"
              style={{ color: '#7c3aed' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
              onMouseLeave={e => (e.currentTarget.style.color = '#7c3aed')}
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </PanelWrap>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// ── ContactPanel — powered by EmailJS ─────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
//
// ── SETUP (one-time, ~5 minutes) ─────────────────────────────────────────────
// 1. Create a free account at https://www.emailjs.com
// 2. Dashboard → Email Services → Add New Service (Gmail / Outlook / etc.)
//    Copy your Service ID  →  paste below as EMAILJS_SERVICE_ID
// 3. Dashboard → Email Templates → Create New Template
//    Use these template variables:
//      {{from_name}}   {{from_email}}   {{message}}   {{to_name}}
//    Copy your Template ID  →  paste below as EMAILJS_TEMPLATE_ID
// 4. Dashboard → Account → Public Key
//    Copy it  →  paste below as EMAILJS_PUBLIC_KEY
// ─────────────────────────────────────────────────────────────────────────────

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

export function ContactPanel() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<SendStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    setErrorMsg('')

    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        { publicKey: EMAILJS_PUBLIC_KEY },
      )
      setStatus('success')
      formRef.current?.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  // Auto-reset success/error after 5 s
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const t = setTimeout(() => setStatus('idle'), 5000)
      return () => clearTimeout(t)
    }
  }, [status])

  return (
    <PanelWrap maxW="max-w-md">
      <PanelTitle icon={<Mail className="w-3.5 h-3.5 text-purple-300" />}>
        Let&apos;s Connect
      </PanelTitle>

      {/* ── Success state ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="flex flex-col items-center gap-3 py-8 text-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '2px solid rgba(52,211,153,0.5)',
                boxShadow: '0 0 20px rgba(52,211,153,0.25)',
              }}
            >
              ✨
            </div>
            <p className="text-base font-bold" style={{ color: '#34d399' }}>
              Message sent!
            </p>
            <p className="text-xs" style={{ color: '#6b7280' }}>
              I&apos;ll get back to you soon. Thanks for reaching out!
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
            aria-label="Contact form"
          >
            {/* Name — maps to {{from_name}} in your EmailJS template */}
            <ContactField
              label="Your Name"
              name="from_name"
              type="text"
              placeholder="Your name…"
              required
              disabled={status === 'sending'}
            />

            {/* Email — maps to {{from_email}} */}
            <ContactField
              label="Your Email"
              name="from_email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={status === 'sending'}
            />

            {/* Subject */}
            <ContactField
              label="Subject"
              name="subject"
              type="text"
              placeholder="What's this about?"
              required
              disabled={status === 'sending'}
            />

            {/* Message — maps to {{message}} */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium" style={{ color: '#c4b5fd' }}>
                Message
              </label>
              <textarea
                name="message"
                placeholder="Tell me about your project or idea…"
                rows={4}
                required
                disabled={status === 'sending'}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none
                           focus:outline-none transition-all duration-200 disabled:opacity-50"
                style={{
                  background: 'rgba(76,29,149,0.18)',
                  border: '1px solid rgba(124,58,237,0.4)',
                  color: '#e9d5ff',
                }}
                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(168,85,247,0.8)' }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(124,58,237,0.4)' }}
              />
            </div>

            {/* Hidden field — recipient name for template */}
            <input type="hidden" name="to_name" value={heroInfo.name} />

            {/* Error message */}
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  color: '#fca5a5',
                }}
              >
                ⚠ {errorMsg || 'Failed to send. Please try again or email directly.'}
              </motion.p>
            )}

            {/* Submit button */}
            <motion.button
              whileHover={status !== 'sending' ? { scale: 1.03, y: -1 } : {}}
              whileTap={status !== 'sending' ? { scale: 0.97 } : {}}
              type="submit"
              disabled={status === 'sending'}
              className="relative flex items-center justify-center gap-2 px-5 py-2.5
                         rounded-xl text-sm font-semibold mt-1 overflow-hidden
                         disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                border: '1px solid #c084fc',
                color: '#fff',
                boxShadow: '0 0 20px #a855f755',
              }}
            >
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',
                  backgroundSize: '200% auto',
                  animation: status !== 'sending' ? 'shimmer 2.5s linear infinite' : 'none',
                }} />
              {status === 'sending' ? (
                <span className="relative flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Sending…
                </span>
              ) : (
                <span className="relative flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  Send Message
                </span>
              )}
            </motion.button>

            {/* Direct email fallback */}
            <p className="text-center text-[10px]" style={{ color: '#4b5563' }}>
              Or email directly:{' '}
              <a
                href={`mailto:${heroInfo.email}`}
                className="transition-colors"
                style={{ color: '#7c3aed' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
                onMouseLeave={e => (e.currentTarget.style.color = '#7c3aed')}
              >
                {heroInfo.email}
              </a>
            </p>
            
          </motion.form>
        )}
      </AnimatePresence>
    </PanelWrap>
  )
}

// ── ContactField ───────────────────────────────────────────────────────────────
function ContactField({
  label, name, type, placeholder, required, disabled,
}: {
  label: string; name: string; type: string
  placeholder: string; required?: boolean; disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: '#c4b5fd' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'rgba(76,29,149,0.18)',
          border: '1px solid rgba(124,58,237,0.4)',
          color: '#e9d5ff',
        }}
        onFocus={e => { e.currentTarget.style.border = '1px solid rgba(168,85,247,0.8)' }}
        onBlur={e => { e.currentTarget.style.border = '1px solid rgba(124,58,237,0.4)' }}
      />
    </div>
  )
}

// ── Field removed — ContactField is used directly ─────────────────────────────
