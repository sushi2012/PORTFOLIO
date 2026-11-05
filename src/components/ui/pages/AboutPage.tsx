import { motion } from 'framer-motion'
import {
  MapPin, Mail, Sparkles, Star,
  Cpu, Heart, FileText,
} from 'lucide-react'
import { rise } from '@/components/ui/motionHelpers'
import { heroInfo } from '@/data/portfolio'

// ── Replace with your actual Google Drive resume link ─────────────────────────
const RESUME_URL   = 'https://docs.google.com/document/d/1yZ9pL1Bd7pOOSIPyFSgVrNmhB2gP5Gke/edit?usp=drivesdk&ouid=115506447844201140606&rtpof=true&sd=true'

// ── Stat badges (bottom row, matching reference) ──────────────────────────────
const STATS = [
  { icon: <Star  className="w-4 h-4" style={{ color: '#fbbf24' }} />,  label: '2.5+ Years',     sub: 'Experience' },
  { icon: <Cpu   className="w-4 h-4" style={{ color: '#a855f7' }} />,  label: 'AI & GenAI',     sub: 'Enthusiast' },
  { icon: <Heart className="w-4 h-4" style={{ color: '#f472b6' }} />,  label: 'Builder &',      sub: 'Creator' },
]

// ── GitHub icon (Lucide doesn't have it; draw a simple SVG) ───────────────────
function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

// ── LinkedIn icon ─────────────────────────────────────────────────────────────
function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

// ── AboutPage ─────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="flex flex-col h-full" style={{ minHeight: '100%' }}>

      {/* ── "About Me" badge ──────────────────────────────────────────────── */}
      <motion.div {...rise(0)} className="flex-shrink-0 mb-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: 'rgba(76,29,149,0.35)',
            border: '1px solid rgba(124,58,237,0.50)',
            color: '#c4b5fd',
          }}
        >
          <span className="text-sm">🧑‍💻</span>
          <span className="text-xs font-semibold">About Me</span>
        </div>
      </motion.div>

      {/* ── Main two-column layout ────────────────────────────────────────── */}
      <div className="flex gap-8 flex-1 min-h-0">

        {/* ── LEFT column: headline + text + links ─────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">

          {/* Big headline */}
          <div>
            <motion.h1
              {...rise(0.08)}
              className="font-extrabold leading-tight mb-4"
              style={{ fontSize: 'clamp(1.6rem, 3.8vw, 2.8rem)' }}
            >
              <span style={{ color: '#f1f5f9' }}>Turning Ideas{'\n'}into </span>
              <span
                style={{
                  background: 'linear-gradient(90deg,#a855f7,#c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Intelligent
              </span>
              <span style={{ color: '#f1f5f9' }}> Solutions </span>
              <Sparkles
                className="inline w-6 h-6"
                style={{ color: '#fbbf24', verticalAlign: 'middle' }}
              />
            </motion.h1>

            {/* Availability badge */}
            {heroInfo.available && (
              <motion.div {...rise(0.14)} className="mb-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(16,185,129,0.14)',
                    border: '1px solid rgba(16,185,129,0.45)',
                    color: '#34d399',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    style={{ animation: 'heartBeat 2s ease-in-out infinite' }} />
                  Open to opportunities
                </span>
              </motion.div>
            )}

            {/* Bio paragraphs */}
            <motion.p {...rise(0.20)} className="text-sm leading-relaxed mb-3" style={{ color: '#cbd5e1' }}>
              I&apos;m a passionate{' '}
              <strong style={{ color: '#e9d5ff' }}> Software Developer</strong>{' '}
              

              I'm a Software Engineer with 2.5+ years of experience in software development, working across Python, C++, JavaScript, React, and Node.js. I enjoy building practical applications, solving complex problems, and turning ideas into functional software.

              My interests lie at the intersection of **Full-Stack Development and Artificial Intelligence**. I'm particularly passionate about Generative AI and Agentic AI, with hands-on experience building LLM-powered applications using LangChain, LangGraph, RAG, vector databases, and AI agents.

              From developing real-time applications to building intelligent AI assistants, I enjoy exploring new technologies and continuously expanding my skills. I'm driven by curiosity, continuous learning, and the desire to build software that solves real-world problems.
            </motion.p>

            <motion.p {...rise(0.26)} className="text-sm leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
              I love solving complex problems, exploring new technologies and creating
              solutions that make a real impact.
            </motion.p>

            {/* Quick contact row */}
            <motion.div {...rise(0.32)} className="flex flex-wrap gap-4 mb-6">
              <a
                href={`mailto:${heroInfo.email}`}
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: '#7c3aed' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
                onMouseLeave={e => (e.currentTarget.style.color = '#7c3aed')}
              >
                <Mail className="w-3.5 h-3.5" />
                {heroInfo.email}
              </a>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#4b5563' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: '#6d28d9' }} />
                {heroInfo.location}
              </span>
            </motion.div>
          </div>

          {/* ── Stat badges ─────────────────────────────────────────────── */}
          <motion.div {...rise(0.44)} className="flex flex-wrap gap-3 mt-6">
            {STATS.map(stat => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(30,15,60,0.70)',
                  border: '1px solid rgba(124,58,237,0.35)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                {stat.icon}
                <div>
                  <p className="text-xs font-bold leading-none mb-0.5" style={{ color: '#f1f5f9' }}>
                    {stat.label}
                  </p>
                  <p className="text-[10px] leading-none" style={{ color: '#6b7280' }}>
                    {stat.sub}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT column: photo placeholder ──────────────────────── */}
        <motion.div
          {...rise(0.15)}
          className="hidden lg:flex flex-col items-center justify-center flex-shrink-0"
          style={{ width: 'clamp(180px, 26%, 280px)' }}
        >
          {/* Profile photo frame — tilted card like reference */}
          <div className="relative" style={{ animation: 'floatUp 4s ease-in-out infinite' }}>
            {/* Crown decoration */}
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl pointer-events-none"
              style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }}
            >
              👑
            </div>

            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle,rgba(124,58,237,0.28) 0%,transparent 70%)',
                transform: 'scale(1.18)',
              }}
            />

            {/* Photo card — tilted */}
            <div
              className="relative w-52 h-64 rounded-3xl overflow-hidden flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg,#1a0a30,#2e1065,#4c1d95)',
                border: '2px solid rgba(167,85,247,0.65)',
                boxShadow: '0 0 36px rgba(124,58,237,0.45), inset 0 0 24px rgba(109,40,217,0.20)',
                transform: 'rotate(0deg)',
              }}
            >
              {/*  Your photo from /public/photo.jpg */}
              <img
                src="/photo.jpg"
                alt={heroInfo.name}
                className="w-full aspect-[9/16] object-cover"               />

              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,transparent 60%)' }}
              />
            </div>

            {/* "Code · Create · Grow" label */}
            <div
              className="absolute -right-12 top-1/2 -translate-y-1/2 text-right pointer-events-none"
              style={{
                color: '#c084fc',
                filter: 'drop-shadow(0 0 6px rgba(192,132,252,0.5))',
                fontStyle: 'italic',
                lineHeight: 1.7,
              }}
            >
              <p className="text-sm font-semibold">Code</p>
              <p className="text-sm font-semibold">Create</p>
              <p className="text-sm font-semibold">Grow <span style={{ color: '#f472b6' }}>♡</span></p>
            </div>
          </div>

          {/* Social icon row below card */}
          <motion.div {...rise(0.888)} className="flex items-center gap-3 mt-10">
            <SocialIcon href={heroInfo.github}   aria="GitHub"   bg="rgba(30,15,60,0.80)"    border="rgba(124,58,237,0.50)" color="#c4b5fd">
              <GitHubIcon size={18} />
            </SocialIcon>
            <SocialIcon href={heroInfo.linkedin} aria="LinkedIn" bg="rgba(14,43,94,0.75)"    border="rgba(56,189,248,0.50)" color="#bae6fd">
              <LinkedInIcon size={18} />
            </SocialIcon>
            <SocialIcon href={RESUME_URL}         aria="Resume"   bg="rgba(76,29,149,0.55)"   border="rgba(167,85,247,0.55)" color="#fff" gradient="linear-gradient(135deg,rgba(124,58,237,0.65),rgba(109,40,217,0.65))">
              <FileText className="w-4 h-4" />
            </SocialIcon>
            <SocialIcon href={`mailto:${heroInfo.email}`} aria="Email" bg="rgba(5,150,105,0.25)" border="rgba(52,211,153,0.45)" color="#6ee7b7">
              <Mail className="w-4 h-4" />
            </SocialIcon>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// ── SocialIcon ─────────────────────────────────────────────────────────────────
function SocialIcon({
  href, aria, bg, border, color, gradient, children,
}: {
  href: string; aria: string; bg: string; border: string; color: string
  gradient?: string; children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      className="w-10 h-10 rounded-xl flex items-center justify-center
                 transition-all duration-200 flex-shrink-0"
      style={{
        background: gradient ?? bg,
        border: `1px solid ${border}`,
        color,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow   = `0 0 14px ${border.replace('0.50','0.60').replace('0.45','0.60')}`
        e.currentTarget.style.background  = gradient
          ? gradient.replace('rgba(','rgba(').replace('0.65','0.90')
          : bg.replace('0.80','0.95').replace('0.75','0.95').replace('0.25','0.45')
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow  = 'none'
        e.currentTarget.style.background = gradient ?? bg
      }}
    >
      {children}
    </a>
  )
}
