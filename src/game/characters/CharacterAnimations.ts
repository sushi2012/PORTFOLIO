import Phaser from 'phaser'
import { ANIM_ROWS, ATLAS_W, FRAME_H, FRAME_W, SPRITESHEET_KEY, type AnimKey } from './CharacterSpritesheetGenerator'

// ── Animation frame rates ─────────────────────────────────────────────────────
const FRAME_RATES: Record<AnimKey, number> = {
  idle:     8,
  walk:     10,
  run:      14,
  jump:     10,
  fall:     8,
  land:     12,
  attack:   14,
  interact: 8,
}

// ── registerAnimations ────────────────────────────────────────────────────────
// Call once after the spritesheet texture has been generated.
// Builds a frame array for each animation using pixel offsets into the atlas.

export function registerAnimations(scene: Phaser.Scene): void {
  const texture = scene.textures.get(SPRITESHEET_KEY)

  for (const [key, def] of Object.entries(ANIM_ROWS) as [AnimKey, typeof ANIM_ROWS[AnimKey]][]) {
    // Add individual frames to the texture cache
    for (let f = 0; f < def.count; f++) {
      const frameKey = `${key}_${f}`
      if (!texture.has(frameKey)) {
        texture.add(
          frameKey,
          0,
          f * FRAME_W,
          def.row * FRAME_H,
          FRAME_W,
          FRAME_H,
        )
      }
    }

    const frameKeys = Array.from({ length: def.count }, (_, i) => `${key}_${i}`)

    const animKey = `hero_${key}`

    if (scene.anims.exists(animKey)) continue

    scene.anims.create({
      key: animKey,
      frames: frameKeys.map(k => ({ key: SPRITESHEET_KEY, frame: k })),
      frameRate: FRAME_RATES[key],
      repeat: looping(key) ? -1 : 0,
    })
  }

  // Validate atlas dimensions (debug only)
  const cols = Math.floor(ATLAS_W / FRAME_W)
  console.debug(
    `[CharacterAnimations] Registered ${Object.keys(ANIM_ROWS).length} animations.`,
    `Atlas: ${ATLAS_W}×${FRAME_H * Object.keys(ANIM_ROWS).length}px, ${cols} cols`,
  )
}

function looping(key: AnimKey): boolean {
  return key === 'idle' || key === 'walk' || key === 'run' || key === 'fall'
}

// Helper to get the Phaser animation key from an AnimKey
export function animKey(key: AnimKey): string {
  return `hero_${key}`
}
