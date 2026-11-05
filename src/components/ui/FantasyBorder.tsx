// ── FantasyBorder ─────────────────────────────────────────────────────────────
// Renders decorative SVG corner ornaments + animated edge glow around any panel.
// Usage: wrap any div with <FantasyBorder> or use as an overlay on top of content.

interface Props {
  className?: string
  /** Glow colour (CSS colour string, default purple) */
  glowColor?: string
  /** Corner ornament colour (hex, default gold) */
  ornamentColor?: string
  /** Whether to pulse the glow */
  animated?: boolean
  /** Border radius in px */
  radius?: number
}

export function FantasyBorder({
  className = '',
  glowColor = '#a855f7',
  ornamentColor = '#fbbf24',
  animated = true,
  radius = 16,
}: Props) {
  const c = ornamentColor

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      {/* Animated glow ring */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: radius,
          border: `1.5px solid ${glowColor}`,
          boxShadow: `0 0 12px 2px ${glowColor}55, inset 0 0 8px 1px ${glowColor}22`,
          animation: animated ? 'fantasyGlow 3s ease-in-out infinite alternate' : undefined,
        }}
      />

      {/* Inner subtle border */}
      <div
        className="absolute inset-[3px]"
        style={{
          borderRadius: radius - 3,
          border: `1px solid ${glowColor}30`,
        }}
      />

      {/* ── Corner ornaments (SVG) ────────────────────────────────────────── */}

      {/* Top-left */}
      <svg
        width="36" height="36"
        viewBox="0 0 36 36"
        className="absolute top-0 left-0"
        style={{ transform: 'translate(-1px,-1px)' }}
      >
        <CornerOrnament color={c} />
      </svg>

      {/* Top-right */}
      <svg
        width="36" height="36"
        viewBox="0 0 36 36"
        className="absolute top-0 right-0"
        style={{ transform: 'translate(1px,-1px) scaleX(-1)' }}
      >
        <CornerOrnament color={c} />
      </svg>

      {/* Bottom-left */}
      <svg
        width="36" height="36"
        viewBox="0 0 36 36"
        className="absolute bottom-0 left-0"
        style={{ transform: 'translate(-1px,1px) scaleY(-1)' }}
      >
        <CornerOrnament color={c} />
      </svg>

      {/* Bottom-right */}
      <svg
        width="36" height="36"
        viewBox="0 0 36 36"
        className="absolute bottom-0 right-0"
        style={{ transform: 'translate(1px,1px) scale(-1,-1)' }}
      >
        <CornerOrnament color={c} />
      </svg>

      {/* ── Mid-edge gems ─────────────────────────────────────────────────── */}
      <MidGem color={c} glowColor={glowColor} position="top" />
      <MidGem color={c} glowColor={glowColor} position="bottom" />
    </div>
  )
}

// ── CornerOrnament ────────────────────────────────────────────────────────────
function CornerOrnament({ color }: { color: string }) {
  return (
    <g>
      {/* L-bracket lines */}
      <path
        d="M2 18 L2 4 Q2 2 4 2 L18 2"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Inner bracket */}
      <path
        d="M6 16 L6 6 Q6 5 7 5 L16 5"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      {/* Corner diamond */}
      <polygon
        points="2,2 6,2 8,4 6,6 2,6 0,4"
        fill={color}
        opacity="0.9"
      />
      {/* Diamond highlight */}
      <polygon
        points="3,3 5,2.5 6,4 5,5.5 3,5 2,4"
        fill="white"
        opacity="0.35"
      />
      {/* Flourish dot */}
      <circle cx="12" cy="2" r="1.5" fill={color} opacity="0.6" />
      <circle cx="2" cy="12" r="1.5" fill={color} opacity="0.6" />
      {/* Tiny star at tip */}
      <polygon
        points="2,0 2.8,1.4 4.4,1.4 3.2,2.4 3.6,4 2,3.2 0.4,4 0.8,2.4 -0.4,1.4 1.2,1.4"
        fill={color}
        opacity="0.85"
        transform="translate(0,0)"
      />
    </g>
  )
}

// ── MidGem ────────────────────────────────────────────────────────────────────
function MidGem({
  color,
  glowColor,
  position,
}: {
  color: string
  glowColor: string
  position: 'top' | 'bottom'
}) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    ...(position === 'top' ? { top: -5 } : { bottom: -5 }),
  }
  return (
    <div style={style}>
      <svg width="18" height="14" viewBox="0 0 18 14">
        <polygon
          points="9,0 17,5 14,14 4,14 1,5"
          fill={color}
          opacity="0.85"
        />
        <polygon
          points="9,2 14,6 12,12 6,12 4,6"
          fill={glowColor}
          opacity="0.45"
        />
        <polygon
          points="9,3 12,6 10,3"
          fill="white"
          opacity="0.4"
        />
      </svg>
    </div>
  )
}

// ── Global keyframe (injected once via a style tag) ───────────────────────────
// We inject this via a <style> element in the component tree root (App.tsx).
export const FANTASY_GLOW_KEYFRAME = `
@keyframes fantasyGlow {
  from { box-shadow: 0 0 8px 1px #a855f755, inset 0 0 6px 1px #a855f722; }
  to   { box-shadow: 0 0 22px 4px #a855f788, inset 0 0 12px 2px #a855f733; }
}
@keyframes dialogueCursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.18); }
  30% { transform: scale(1); }
  45% { transform: scale(1.08); }
}
@keyframes floatUp {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
`
