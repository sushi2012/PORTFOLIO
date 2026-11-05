import type { HTMLMotionProps } from 'framer-motion'

// ── rise() ────────────────────────────────────────────────────────────────────
// Returns typed motion props for a fade-up entrance animation.
// The ease value is cast to a literal to satisfy Framer Motion v11 strict types.

type RiseProps = Pick<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'>

export function rise(delay = 0): RiseProps {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.42,
      ease: 'easeOut' as const,
      delay,
    },
  }
}
