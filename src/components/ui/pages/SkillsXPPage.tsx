import { motion } from 'framer-motion'
import { CheckCircle, Briefcase } from 'lucide-react'
import { CharacterGuide } from '@/components/ui/CharacterGuide'
import { rise } from '@/components/ui/motionHelpers'
import { skillCategories, experience } from '@/data/portfolio'

export function SkillsXPPage() {
  return (
    <div className="flex flex-col gap-8">

      {/* ── Page heading ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#fde68a' }}>
          Skills & Experience
        </h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Technologies mastered · battles won
        </p>
      </div>

      {/* ── Two-column content ───────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* ── SKILLS ────────────────────────────────────────────────────── */}
        <div>
          <motion.h2 {...rise(0)}
            className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
            style={{ color: '#7c3aed' }}
          >
            <span className="text-base">⚡</span> Skill Tree
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {skillCategories.map((cat, ci) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + ci * 0.08, duration: 0.4, ease: 'easeOut' }}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(76,29,149,0.18)',
                  border: '1px solid rgba(124,58,237,0.28)',
                }}
              >
                {/* Category header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs font-bold" style={{ color: '#fde68a' }}>
                    {cat.category}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {cat.skills.map((sk, si) => (
                    <motion.div
                      key={sk.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + ci * 0.08 + si * 0.04 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px]" style={{ color: '#c4b5fd' }}>
                          {sk.name}
                        </span>
                        <SkillPips level={sk.level} />
                      </div>
                      <SkillBar level={sk.level} delay={0.3 + ci * 0.08 + si * 0.04} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── EXPERIENCE ─────────────────────────────────────────────────── */}
        <div>
          <motion.h2 {...rise(0.05)}
            className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
            style={{ color: '#7c3aed' }}
          >
            <span className="text-base">📜</span> Adventure Log
          </motion.h2>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-5 top-2 bottom-2 w-px"
              style={{ background: 'linear-gradient(to bottom,#7c3aed,rgba(76,29,149,0))' }}
            />

            <div className="flex flex-col gap-2">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
                  className="relative flex gap-4"
                >
                  {/* Timeline dot */}
                  <div
                    className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full
                               flex items-center justify-center mt-1"
                    style={{
                      background: exp.current
                        ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                        : 'linear-gradient(135deg,#1e1b2e,#2d1b5e)',
                      border: `2px solid ${exp.current ? '#a855f7' : '#3b0764'}`,
                      boxShadow: exp.current ? '0 0 14px #a855f766' : 'none',
                    }}
                  >
                    <Briefcase className="w-4 h-4"
                      style={{ color: exp.current ? '#e9d5ff' : '#6d28d9' }} />
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-2xl p-4 mb-3"
                    style={{
                      background: exp.current
                        ? 'rgba(76,29,149,0.28)'
                        : 'rgba(30,27,46,0.5)',
                      border: `1px solid ${exp.current
                        ? 'rgba(168,85,247,0.4)'
                        : 'rgba(76,29,149,0.25)'}`,
                    }}
                  >
                    {/* Role + badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
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

                    {/* Company + period */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-xs font-medium" style={{ color: '#a855f7' }}>
                        {exp.company}
                      </span>
                      <span style={{ color: '#374151' }}>·</span>
                      <span className="text-[10px]" style={{ color: '#6b7280' }}>
                        {exp.period}
                      </span>
                    </div>

                    {/* Bullets */}
                    <ul className="flex flex-col gap-1.5">
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
          </div>
        </div>
      </div>

      {/* ── Character guide ──────────────────────────────────────────────── */}
      <motion.div {...rise(0.6)} className="flex justify-end pr-2">
        <CharacterGuide page="skills-xp" side="right" />
      </motion.div>
    </div>
  )
}

// ── SkillPips ─────────────────────────────────────────────────────────────────
function SkillPips({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: i < level ? '#a855f7' : 'rgba(124,58,237,0.18)',
            boxShadow: i < level ? '0 0 5px #a855f7aa' : 'none',
            transition: 'all 0.2s',
          }}
        />
      ))}
    </div>
  )
}

// ── SkillBar ──────────────────────────────────────────────────────────────────
function SkillBar({ level, delay }: { level: number; delay: number }) {
  return (
    <div
      className="h-1.5 rounded-full overflow-hidden"
      style={{ background: 'rgba(124,58,237,0.18)' }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(level / 5) * 100}%` }}
        transition={{ delay, duration: 0.7, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{
          background: 'linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)',
          boxShadow: '0 0 6px #a855f766',
        }}
      />
    </div>
  )
}
