import Phaser from 'phaser'

// ── Procedural Female Adventurer Spritesheet Generator ───────────────────────
//
// All artwork is original, drawn frame-by-frame via Phaser.GameObjects.Graphics
// then baked into a RenderTexture atlas.
//
// Frame layout: each frame is FRAME_W × FRAME_H pixels.
// Atlas is laid out as a single row per animation, stacked vertically.
//
// Character design:
//   • Young female adventurer
//   • Long auburn hair with side braid
//   • Purple/violet fantasy tunic + dark leggings
//   • Brown leather boots with buckles
//   • Small teal cape/scarf
//   • Glowing cyan magical sword (right hand)
//   • Belt with pouch

export const FRAME_W = 48
export const FRAME_H = 64

// Animation row definitions — { key, startRow, frameCount }
export const ANIM_ROWS = {
  idle:     { row: 0, count: 6 },
  walk:     { row: 1, count: 8 },
  run:      { row: 2, count: 6 },
  jump:     { row: 3, count: 4 },
  fall:     { row: 4, count: 3 },
  land:     { row: 5, count: 3 },
  attack:   { row: 6, count: 6 },
  interact: { row: 7, count: 5 },
} as const

export type AnimKey = keyof typeof ANIM_ROWS

const TOTAL_ROWS = Object.keys(ANIM_ROWS).length
const MAX_FRAMES_PER_ROW = 8 // enough for any animation

export const SPRITESHEET_KEY = 'hero_lyra'
export const ATLAS_W = FRAME_W * MAX_FRAMES_PER_ROW
export const ATLAS_H = FRAME_H * TOTAL_ROWS

// ── Palette ──────────────────────────────────────────────────────────────────
const P = {
  // Skin tones
  skin:       0xfcd5b0,
  skinShade:  0xe8b48a,
  skinDark:   0xc4855a,
  // Hair – auburn/chestnut
  hair:       0x8b3a10,
  hairHigh:   0xb84a18,
  hairShadow: 0x5a2508,
  // Eyes
  eye:        0x2d6bbf,
  eyeWhite:   0xffffff,
  // Outfit – violet tunic
  tunic:      0x6d28d9,
  tunicLight: 0x8b5cf6,
  tunicDark:  0x4c1d95,
  tunicTrim:  0xfbbf24,
  // Leggings
  legs:       0x1e1b2e,
  legsSh:     0x2d2a40,
  // Cape / scarf – teal
  cape:       0x0d9488,
  capeLight:  0x14b8a6,
  capeDark:   0x0f766e,
  // Boots
  boot:       0x78350f,
  bootLight:  0x92400e,
  bootDark:   0x451a03,
  bootMetal:  0xd1d5db,
  // Belt
  belt:       0x78350f,
  beltBuckle: 0xf59e0b,
  // Sword
  swordBlade: 0xc0e0ff,
  swordGlow:  0x67e8f9,
  swordGlow2: 0x38bdf8,
  swordHilt:  0x92400e,
  swordGuard: 0xfbbf24,
  // Outline
  outline:    0x0f0a1e,
  shadow:     0x1a1040,
}

// ── Drawing helpers ──────────────────────────────────────────────────────────

type GFX = Phaser.GameObjects.Graphics

function px(g: GFX, x: number, y: number, color: number, a = 1): void {
  g.fillStyle(color, a)
  g.fillRect(x, y, 1, 1)
}

function rect(g: GFX, x: number, y: number, w: number, h: number, color: number, a = 1): void {
  g.fillStyle(color, a)
  g.fillRect(x, y, w, h)
}

// Draw a small 4-pointed star shape manually
function star(g: GFX, cx: number, cy: number, outer: number, inner: number, color: number, alpha = 1): void {
  g.fillStyle(color, alpha)
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? outer : inner
    pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r })
  }
  g.fillPoints(pts as Phaser.Math.Vector2[], true, true)
}

// ── Core character drawing ───────────────────────────────────────────────────
// All coordinates are local to the frame (0,0 = top-left of the frame).
// The character is drawn centered horizontally with feet at y=FRAME_H-4.

interface DrawParams {
  // Body offsets for animation squash/stretch
  bodyY?: number       // vertical body shift
  legLY?: number       // left leg Y offset
  legRY?: number       // right leg Y offset
  legLX?: number       // left leg X offset
  legRX?: number       // right leg X offset
  armLAngle?: number   // left arm swing (0 = down)
  armRAngle?: number   // right arm swing
  hairBob?: number     // hair vertical bob
  capeSwing?: number   // cape X offset
  squashY?: number     // body scale Y (1=normal)
  swordAngle?: number  // sword rotation in degrees
  swordX?: number
  swordY?: number
  showSwordGlow?: boolean
  eyeBlink?: boolean
  headTilt?: number    // head X shift
  bodyLean?: number    // body X shift for run
}

function drawCharacter(g: GFX, fx: number, fy: number, p: DrawParams = {}): void {
  const {
    bodyY = 0,
    legLY = 0,
    legRY = 0,
    legLX = 0,
    legRX = 0,
    armLAngle = 0,
    armRAngle = 0,
    hairBob = 0,
    capeSwing = 0,
    swordAngle = -60,
    swordX = 0,
    swordY = 0,
    showSwordGlow = true,
    eyeBlink = false,
    headTilt = 0,
    bodyLean = 0,
  } = p

  // Frame anchor: character feet at fy + FRAME_H - 4
  const cx = fx + FRAME_W / 2   // horizontal center
  const footY = fy + FRAME_H - 4

  // ── Shadow ────────────────────────────────────────────────────────────────
  g.fillStyle(P.shadow, 0.25)
  g.fillEllipse(cx + bodyLean, footY + 2, 22, 5)

  // ── Boots ─────────────────────────────────────────────────────────────────
  const bootTop = footY - 10
  // Left boot
  const lbx = cx - 9 + legLX + bodyLean
  const lby = bootTop + legLY
  rect(g, lbx - 4, lby, 8, 10, P.boot)
  rect(g, lbx - 5, lby + 7, 9, 3, P.bootDark)          // sole
  rect(g, lbx - 3, lby + 1, 4, 2, P.bootLight)          // highlight
  px(g, lbx + 2, lby + 4, P.bootMetal)                  // buckle
  // Right boot
  const rbx = cx + 5 + legRX + bodyLean
  const rby = bootTop + legRY
  rect(g, rbx - 4, rby, 8, 10, P.boot)
  rect(g, rbx - 4, rby + 7, 9, 3, P.bootDark)
  rect(g, rbx - 2, rby + 1, 4, 2, P.bootLight)
  px(g, rbx + 1, rby + 4, P.bootMetal)

  // ── Leggings ──────────────────────────────────────────────────────────────
  const legTop = footY - 22
  // Left leg
  rect(g, lbx - 3, legTop + legLY, 6, 12, P.legs)
  rect(g, lbx - 2, legTop + legLY, 2, 10, P.legsSh)
  // Right leg
  rect(g, rbx - 3, legTop + legRY, 6, 12, P.legs)
  rect(g, rbx + 1, legTop + legRY, 2, 10, P.legsSh)

  // ── Torso / Tunic ─────────────────────────────────────────────────────────
  const torsoY = footY - 40 + bodyY
  const torsoX = cx - 9 + bodyLean
  rect(g, torsoX, torsoY, 18, 18, P.tunic)
  // Tunic shading
  rect(g, torsoX, torsoY, 3, 18, P.tunicDark)
  rect(g, torsoX + 15, torsoY, 3, 18, P.tunicDark)
  rect(g, torsoX + 4, torsoY, 10, 3, P.tunicLight)       // collar highlight
  // Trim / belt area
  rect(g, torsoX, torsoY + 15, 18, 3, P.tunicTrim)       // bottom trim
  // Belt
  rect(g, torsoX, torsoY + 13, 18, 3, P.belt)
  rect(g, torsoX + 7, torsoY + 13, 4, 3, P.beltBuckle)   // buckle
  // Center detail (rune emblem)
  rect(g, torsoX + 7, torsoY + 4, 4, 6, P.tunicTrim)
  rect(g, torsoX + 8, torsoY + 3, 2, 8, P.tunicLight)

  // ── Cape / Scarf (behind torso in Z, but we draw it at the sides) ─────────
  const capeX = torsoX + capeSwing
  // Left side of cape
  rect(g, capeX - 3, torsoY - 2, 5, 14, P.cape)
  rect(g, capeX - 2, torsoY, 2, 12, P.capeLight)
  // Right tail
  rect(g, torsoX + 16 + capeSwing, torsoY + 2, 5, 10, P.cape)
  rect(g, torsoX + 17 + capeSwing, torsoY + 3, 2, 8, P.capeDark)

  // ── Left Arm ──────────────────────────────────────────────────────────────
  const laBaseX = torsoX - 2 + bodyLean
  const laBaseY = torsoY + 2
  const laSwing = Math.round(armLAngle * 4)
  rect(g, laBaseX - 3, laBaseY + laSwing, 5, 10, P.tunic)
  rect(g, laBaseX - 2, laBaseY + laSwing, 2, 9, P.tunicDark)
  // Left hand
  rect(g, laBaseX - 3, laBaseY + laSwing + 10, 5, 4, P.skin)

  // ── Right Arm (sword arm) ─────────────────────────────────────────────────
  const raBaseX = torsoX + 17 + bodyLean
  const raBaseY = torsoY + 2
  const raSwing = Math.round(armRAngle * 4)
  rect(g, raBaseX, raBaseY + raSwing, 5, 10, P.tunic)
  rect(g, raBaseX + 1, raBaseY + raSwing, 2, 9, P.tunicLight)
  // Right hand
  rect(g, raBaseX, raBaseY + raSwing + 10, 5, 4, P.skin)

  // ── Sword ─────────────────────────────────────────────────────────────────
  const sBaseX = raBaseX + 2 + swordX + bodyLean
  const sBaseY = raBaseY + raSwing + 8 + swordY
  const sRad = (swordAngle * Math.PI) / 180
  const bladeLen = 18

  // Glow aura
  if (showSwordGlow) {
    for (let i = 3; i >= 1; i--) {
      g.fillStyle(P.swordGlow, 0.08 * i)
      const gx = sBaseX + Math.cos(sRad) * (bladeLen / 2) - i * 2
      const gy = sBaseY + Math.sin(sRad) * (bladeLen / 2) - i * 2
      g.fillRect(gx, gy, bladeLen * 0.6 + i * 4, bladeLen * 0.4 + i * 4)
    }
  }

  // Hilt
  rect(g, sBaseX - 2, sBaseY - 1, 4, 5, P.swordHilt)
  // Guard
  rect(g, sBaseX - 4, sBaseY + 3, 8, 2, P.swordGuard)
  // Blade (simple line in the angle direction)
  for (let i = 0; i < bladeLen; i++) {
    const bx = Math.round(sBaseX + Math.cos(sRad) * i)
    const by = Math.round(sBaseY + Math.sin(sRad) * i)
    const t = i / bladeLen
    const col = t < 0.3 ? P.swordGlow : t < 0.7 ? P.swordBlade : P.swordGlow2
    g.fillStyle(col, 0.95)
    g.fillRect(bx, by, 2, 2)
    if (showSwordGlow && i % 3 === 0) {
      g.fillStyle(P.swordGlow, 0.3)
      g.fillRect(bx - 1, by - 1, 4, 4)
    }
  }
  // Blade tip glow
  if (showSwordGlow) {
    const tx = Math.round(sBaseX + Math.cos(sRad) * bladeLen)
    const ty = Math.round(sBaseY + Math.sin(sRad) * bladeLen)
    g.fillStyle(P.swordGlow, 0.6)
    g.fillCircle(tx, ty, 3)
    g.fillStyle(0xffffff, 0.4)
    g.fillCircle(tx, ty, 1)
  }

  // ── Head ──────────────────────────────────────────────────────────────────
  const headX = cx - 6 + headTilt + bodyLean
  const headY = torsoY - 14
  // Neck
  rect(g, cx - 2 + bodyLean, torsoY - 4, 4, 6, P.skin)

  // Head base
  rect(g, headX, headY, 13, 12, P.skin)
  // Shading
  rect(g, headX, headY, 2, 12, P.skinShade)
  rect(g, headX + 11, headY, 2, 12, P.skinShade)
  rect(g, headX + 3, headY + 9, 7, 3, P.skinDark)       // jaw shadow

  // Ears
  rect(g, headX - 1, headY + 4, 2, 4, P.skin)
  rect(g, headX + 13, headY + 4, 2, 4, P.skin)

  // Eyes
  if (!eyeBlink) {
    rect(g, headX + 2, headY + 4, 3, 3, P.eyeWhite)
    rect(g, headX + 3, headY + 5, 2, 2, P.eye)
    px(g, headX + 3, headY + 5, P.outline)               // pupil
    rect(g, headX + 8, headY + 4, 3, 3, P.eyeWhite)
    rect(g, headX + 9, headY + 5, 2, 2, P.eye)
    px(g, headX + 9, headY + 5, P.outline)
  } else {
    // Blink – thin line
    rect(g, headX + 2, headY + 5, 3, 1, P.skinDark)
    rect(g, headX + 8, headY + 5, 3, 1, P.skinDark)
  }

  // Nose
  px(g, headX + 6, headY + 7, P.skinDark)

  // Mouth (small smile)
  rect(g, headX + 4, headY + 9, 5, 1, P.skinDark)
  px(g, headX + 4, headY + 8, P.skinDark)
  px(g, headX + 8, headY + 8, P.skinDark)

  // ── Hair (long auburn, behind head for back strands, front for bangs) ────
  const hy = headY - 2 + hairBob
  // Back/top hair
  rect(g, headX - 1, hy, 15, 4, P.hair)                  // top
  rect(g, headX - 2, hy + 2, 4, 20, P.hairHigh)          // left long strand
  rect(g, headX - 1, hy + 2, 2, 22, P.hair)
  rect(g, headX + 11, hy + 2, 4, 18, P.hairHigh)         // right strand
  // Bangs
  rect(g, headX + 1, hy + 2, 11, 5, P.hair)
  rect(g, headX + 2, hy + 3, 4, 3, P.hairHigh)           // bang highlight
  rect(g, headX, hy + 2, 3, 4, P.hair)                   // left bang
  rect(g, headX + 10, hy + 2, 3, 4, P.hair)              // right bang
  // Side braid detail
  rect(g, headX - 2, hy + 12, 3, 8, P.hairShadow)
  px(g, headX - 1, hy + 14, P.hairHigh)
  px(g, headX - 1, hy + 17, P.hairHigh)
  // Hair tie / clip
  rect(g, headX - 2, hy + 10, 3, 3, P.tunicTrim)

  // ── Outline pass (selective key edges) ────────────────────────────────────
  g.lineStyle(1, P.outline, 0.5)
  g.strokeRect(headX + 0.5, headY + 0.5, 12, 11)
  g.strokeRect(torsoX + 0.5, torsoY + 0.5, 17, 17)
}

// ── Animation-specific frame generators ──────────────────────────────────────

function drawIdle(g: GFX, fx: number, fy: number, frame: number): void {
  const t = frame / 6
  const breathe = Math.sin(t * Math.PI * 2) * 0.8
  const bob = Math.sin(t * Math.PI * 2) * 0.5
  drawCharacter(g, fx, fy, {
    bodyY: Math.round(breathe),
    hairBob: Math.round(-bob * 0.5),
    capeSwing: Math.round(bob * 0.5),
    swordAngle: -55 + breathe * 2,
    armRAngle: breathe * 0.3,
    armLAngle: -breathe * 0.2,
    eyeBlink: frame === 4,
  })
}

function drawWalk(g: GFX, fx: number, fy: number, frame: number): void {
  const t = (frame / 8) * Math.PI * 2
  const legSwing = Math.sin(t) * 5
  const armSwing = Math.sin(t) * 3
  const bob = Math.abs(Math.sin(t)) * 1.5
  drawCharacter(g, fx, fy, {
    bodyY: Math.round(-bob),
    legLY: Math.round(legSwing > 0 ? 0 : legSwing),
    legRY: Math.round(legSwing < 0 ? 0 : -legSwing),
    legLX: Math.round(legSwing * 0.5),
    legRX: Math.round(-legSwing * 0.5),
    armLAngle: armSwing,
    armRAngle: -armSwing,
    capeSwing: Math.round(Math.sin(t) * 1.5),
    hairBob: Math.round(-bob * 0.3),
    swordAngle: -50 + armSwing * 3,
  })
}

function drawRun(g: GFX, fx: number, fy: number, frame: number): void {
  const t = (frame / 6) * Math.PI * 2
  const legSwing = Math.sin(t) * 8
  const armSwing = Math.sin(t) * 5
  const bob = Math.abs(Math.sin(t)) * 3
  drawCharacter(g, fx, fy, {
    bodyY: Math.round(-bob),
    bodyLean: 2,
    legLY: Math.round(legSwing > 0 ? -2 : legSwing - 2),
    legRY: Math.round(legSwing < 0 ? -2 : -legSwing - 2),
    legLX: Math.round(legSwing * 0.7),
    legRX: Math.round(-legSwing * 0.7),
    armLAngle: armSwing * 1.2,
    armRAngle: -armSwing * 1.2,
    capeSwing: Math.round(-Math.sin(t) * 4),
    hairBob: Math.round(-bob * 0.5),
    swordAngle: -40 + armSwing * 4,
    headTilt: 1,
  })
}

function drawJump(g: GFX, fx: number, fy: number, frame: number): void {
  // 4 frames: crouch-prepare, launch, peak, apex
  const params: DrawParams[] = [
    { bodyY: 3, legLY: 3, legRY: 3, armLAngle: -2, armRAngle: -2, swordAngle: -30 },
    { bodyY: -4, legLY: -6, legRY: -6, armLAngle: -3, armRAngle: -3, capeSwing: -2, swordAngle: -80, hairBob: -2 },
    { bodyY: -6, legLY: -4, legRY: -4, armLAngle: -2, armRAngle: -2, capeSwing: -3, swordAngle: -90, hairBob: -3 },
    { bodyY: -5, legLY: -3, legRY: -2, armLAngle: -1, armRAngle: -2, capeSwing: -2, swordAngle: -85, hairBob: -2 },
  ]
  drawCharacter(g, fx, fy, params[Math.min(frame, 3)])
}

function drawFall(g: GFX, fx: number, fy: number, frame: number): void {
  const params: DrawParams[] = [
    { bodyY: -3, legLY: 2, legRY: 3, armLAngle: 2, armRAngle: 3, capeSwing: -1, swordAngle: -100, hairBob: 1 },
    { bodyY: -2, legLY: 3, legRY: 4, armLAngle: 3, armRAngle: 3, capeSwing: -2, swordAngle: -105, hairBob: 2 },
    { bodyY: -1, legLY: 4, legRY: 5, armLAngle: 3, armRAngle: 4, capeSwing: -3, swordAngle: -110, hairBob: 3 },
  ]
  drawCharacter(g, fx, fy, params[Math.min(frame, 2)])
}

function drawLand(g: GFX, fx: number, fy: number, frame: number): void {
  const params: DrawParams[] = [
    // Impact squash
    { bodyY: 5, legLY: 4, legRY: 4, legLX: -2, legRX: 2, armLAngle: 2, armRAngle: 2, swordAngle: -30, hairBob: 2 },
    // Recovery
    { bodyY: 2, legLY: 2, legRY: 2, armLAngle: 1, armRAngle: 1, swordAngle: -45, hairBob: 1 },
    // Stand
    { bodyY: 0, swordAngle: -55 },
  ]
  drawCharacter(g, fx, fy, params[Math.min(frame, 2)])
}

function drawAttack(g: GFX, fx: number, fy: number, frame: number): void {
  const swingAngles = [-90, -60, -30, 0, 30, -55]
  const armRSwings = [-3, -2, 0, 2, 3, -1]
  const bodyLeans = [0, 1, 2, 3, 2, 0]
  const glows = [true, true, true, true, true, true]
  const swordXs = [0, 2, 4, 6, 4, 0]
  drawCharacter(g, fx, fy, {
    swordAngle: swingAngles[Math.min(frame, 5)],
    armRAngle: armRSwings[Math.min(frame, 5)],
    bodyLean: bodyLeans[Math.min(frame, 5)],
    showSwordGlow: glows[Math.min(frame, 5)],
    swordX: swordXs[Math.min(frame, 5)],
    swordY: -frame,
    armLAngle: -1,
  })

  // Slash trail on frames 2–4
  if (frame >= 2 && frame <= 4) {
    const trailAlpha = 0.3 - (frame - 2) * 0.1
    const tx = fx + FRAME_W / 2 + 10
    const ty = fy + FRAME_H - 28
    g.fillStyle(P.swordGlow, trailAlpha)
    g.fillTriangle(tx, ty - 12, tx + 14, ty - 2, tx + 4, ty + 8)
    g.fillStyle(0xffffff, trailAlpha * 0.4)
    g.fillTriangle(tx + 2, ty - 8, tx + 12, ty, tx + 4, ty + 4)
  }
}

function drawInteract(g: GFX, fx: number, fy: number, frame: number): void {
  // Reaching out animation (towards right side)
  const reachX = [0, 1, 3, 5, 3]
  const reachY = [0, -1, -2, -3, -2]
  const armSwings = [0, 1, 2, 3, 2]
  drawCharacter(g, fx, fy, {
    armLAngle: armSwings[Math.min(frame, 4)] * 1.5,
    armRAngle: -1,
    swordAngle: -80,
    bodyLean: reachX[Math.min(frame, 4)],
    bodyY: reachY[Math.min(frame, 4)],
    eyeBlink: frame === 2,
    capeSwing: -frame,
  })

  // Sparkle particle on frames 2–4
  if (frame >= 2) {
    const sx = fx + FRAME_W / 2 + 18 - (frame - 2) * 2
    const sy = fy + FRAME_H - 26 - frame * 2
    star(g, sx, sy, 3, 1.5, P.swordGlow, 0.8)
    star(g, sx, sy, 1.5, 0.8, 0xffffff, 0.5)
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateSpritesheet(scene: Phaser.Scene): void {
  // Create a temporary graphics object to draw frames
  const g = scene.add.graphics()

  // Create a RenderTexture for the full atlas
  const rt = scene.add.renderTexture(0, 0, ATLAS_W, ATLAS_H)
  rt.setVisible(false)
  rt.setDepth(-100)

  const drawFns: Record<string, (g: GFX, fx: number, fy: number, frame: number) => void> = {
    idle:     drawIdle,
    walk:     drawWalk,
    run:      drawRun,
    jump:     drawJump,
    fall:     drawFall,
    land:     drawLand,
    attack:   drawAttack,
    interact: drawInteract,
  }

  for (const [key, def] of Object.entries(ANIM_ROWS)) {
    const fn = drawFns[key]
    for (let f = 0; f < def.count; f++) {
      g.clear()
      const fx = f * FRAME_W
      const fy = def.row * FRAME_H
      fn(g, fx, fy, f)
      rt.draw(g, 0, 0)
    }
  }

  // Bake the RenderTexture into a named texture the AnimationManager can use
  rt.saveTexture(SPRITESHEET_KEY)

  // Register the frame layout so anims.generateFrameNumbers works
  scene.textures.get(SPRITESHEET_KEY).add(
    '__BASE',
    0,
    0, 0,
    ATLAS_W,
    ATLAS_H,
  )

  g.destroy()
  // Keep rt alive; texture is now in the cache
}
