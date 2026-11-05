import Phaser from 'phaser'
import {
  ISLAND_DEFS,
  ROBOT_MOVE_EVENT,
  islCX,
  islSurface,
} from '@/game/environments/IslandDefinitions'
import { SCENE_KEYS } from '@/types/game'

// ── RobotScene ────────────────────────────────────────────────────────────────
// Draws a cute robot character that sits near the islands.
// Listens for ROBOT_MOVE_EVENT and smoothly tweens to the target island.
// Depth 21 — above environment (0-18), above IslandScene (15-26), just below hero (29+).

export class RobotScene extends Phaser.Scene {
  private robotGfx!:       Phaser.GameObjects.Graphics
  private shadowGfx!:      Phaser.GameObjects.Graphics
  private glowGfx!:        Phaser.GameObjects.Graphics

  private robotX = 0
  private robotY = 0
  private elapsed = 0
  private isMoving = false
  private bobOffset = 0   // animated vertical bob
  private antennaPulse = 0

  // Which island the robot is currently on / heading to
  private currentIslandIdx = 0

  constructor() { super({ key: SCENE_KEYS.ROBOT }) }

  create(): void {
    const W = this.scale.width, H = this.scale.height

    // Start on center island (index 1 = skills, middle of 4)
    const startIsl = ISLAND_DEFS[1]
    this.robotX = islCX(startIsl, W) - islCX(startIsl, W) * 0.08
    this.robotY = islSurface(startIsl, W, H)
    this.currentIslandIdx = 1

    // Graphics layers
    this.shadowGfx = this.add.graphics().setDepth(20)
    this.glowGfx   = this.add.graphics().setDepth(21)
    this.robotGfx  = this.add.graphics().setDepth(22)

    // Listen for robot move events
    window.addEventListener(ROBOT_MOVE_EVENT, this.onRobotMove)

    this.scale.on('resize', () => this.scene.restart())
  }

  private onRobotMove = (e: Event): void => {
    const { id } = (e as CustomEvent<{ id: string; x: number }>).detail
    const idx = ISLAND_DEFS.findIndex(i => i.id === id)
    if (idx === -1 || idx === this.currentIslandIdx) return
    this.currentIslandIdx = idx
    this.isMoving = true

    const W = this.scale.width, H = this.scale.height
    const target = ISLAND_DEFS[idx]
    const targetX = islCX(target, W)
    const targetY = islSurface(target, W, H)

    // Tween the robot to the new island
    this.tweens.add({
      targets: this,
      robotX: targetX,
      robotY: targetY,
      duration: 700,
      ease: 'Cubic.easeInOut',
      onComplete: () => { this.isMoving = false },
    })
  }

  // ── Draw robot at (this.robotX, this.robotY + bobOffset) ─────────────────
  private drawRobot(x: number, y: number): void {
    const g  = this.robotGfx
    const gl = this.glowGfx
    const s  = this.shadowGfx
    g.clear(); gl.clear(); s.clear()

    const bobY = Math.round(this.bobOffset)

    // ── Shadow ────────────────────────────────────────────────────────────
    s.fillStyle(0x000000, 0.22)
    s.fillEllipse(x, y + 2, 36, 7)

    // ── Antenna glow ──────────────────────────────────────────────────────
    const antGlow = 0.5 + Math.sin(this.antennaPulse) * 0.4
    gl.fillStyle(0xa855f7, antGlow * 0.3)
    gl.fillCircle(x, y - 56 + bobY, 10)
    gl.fillStyle(0xc084fc, antGlow * 0.7)
    gl.fillCircle(x, y - 56 + bobY, 5)
    gl.fillStyle(0xffffff, antGlow * 0.5)
    gl.fillCircle(x - 1, y - 57 + bobY, 2)

    // ── Visor glow ────────────────────────────────────────────────────────
    const visorPulse = 0.6 + Math.sin(this.elapsed * 0.003) * 0.2
    gl.fillStyle(0x67e8f9, visorPulse * 0.25)
    gl.fillRoundedRect(x - 12, y - 40 + bobY, 24, 14, 5)

    // ── BODY ──────────────────────────────────────────────────────────────
    // Main body
    g.fillStyle(0xdde8f5, 1)
    g.fillRoundedRect(x - 14, y - 32 + bobY, 28, 30, 6)
    // Body shading left
    g.fillStyle(0xb8cce8, 0.6)
    g.fillRoundedRect(x - 14, y - 32 + bobY, 7, 30, 6)
    // Body highlight
    g.fillStyle(0xf0f6ff, 0.8)
    g.fillRoundedRect(x - 11, y - 30 + bobY, 8, 12, 3)

    // Chest panel
    g.fillStyle(0x7c3aed, 0.85)
    g.fillRoundedRect(x - 9, y - 26 + bobY, 18, 16, 4)
    // Panel detail lines
    g.lineStyle(1, 0xc084fc, 0.6)
    g.beginPath(); g.moveTo(x - 7, y - 22 + bobY); g.lineTo(x + 7, y - 22 + bobY); g.strokePath()
    g.beginPath(); g.moveTo(x - 7, y - 18 + bobY); g.lineTo(x + 7, y - 18 + bobY); g.strokePath()

    // ── VISOR / HEAD ──────────────────────────────────────────────────────
    // Head dome
    g.fillStyle(0xdde8f5, 1)
    g.fillRoundedRect(x - 16, y - 48 + bobY, 32, 20, 8)
    g.fillStyle(0xb8cce8, 0.5)
    g.fillRoundedRect(x - 16, y - 48 + bobY, 8, 20, 8)
    // Dome highlight
    g.fillStyle(0xf0f6ff, 0.7)
    g.fillRoundedRect(x - 12, y - 46 + bobY, 10, 7, 3)

    // Visor window
    g.fillStyle(0x0e7490, 1)
    g.fillRoundedRect(x - 12, y - 42 + bobY, 24, 14, 4)
    g.fillStyle(0x67e8f9, visorPulse)
    g.fillRoundedRect(x - 11, y - 41 + bobY, 22, 12, 3)

    // Eyes inside visor
    g.fillStyle(0xffffff, 0.95)
    g.fillCircle(x - 5, y - 36 + bobY, 4)
    g.fillCircle(x + 5, y - 36 + bobY, 4)
    // Pupils
    g.fillStyle(0x1e3a5f, 1)
    g.fillCircle(x - 4.5, y - 36 + bobY, 2.5)
    g.fillCircle(x + 5.5, y - 36 + bobY, 2.5)
    // Eye shine
    g.fillStyle(0xffffff, 0.9)
    g.fillCircle(x - 5.5, y - 37.5 + bobY, 1.2)
    g.fillCircle(x + 4.5, y - 37.5 + bobY, 1.2)

    // Happy expression — small curved mouth (changes when moving)
    if (this.isMoving) {
      // Excited — wider smile
      g.lineStyle(1.5, 0x38bdf8, 0.9)
      g.beginPath(); g.arc(x, y - 30 + bobY, 6, 0.2, Math.PI - 0.2); g.strokePath()
    } else {
      // Calm smile
      g.lineStyle(1.5, 0x7dd3fc, 0.8)
      g.beginPath(); g.arc(x, y - 31 + bobY, 4, 0.3, Math.PI - 0.3); g.strokePath()
    }

    // ── ANTENNA ───────────────────────────────────────────────────────────
    g.lineStyle(2, 0x94a3b8, 1)
    g.beginPath(); g.moveTo(x, y - 48 + bobY); g.lineTo(x, y - 54 + bobY); g.strokePath()
    // Antenna gem already drawn in glow layer above

    // ── ARMS ──────────────────────────────────────────────────────────────
    // Left arm
    g.fillStyle(0xb8cce8, 1)
    g.fillRoundedRect(x - 22, y - 30 + bobY, 8, 18, 4)
    g.fillStyle(0xdde8f5, 0.6)
    g.fillRoundedRect(x - 21, y - 28 + bobY, 4, 10, 3)
    // Left hand
    g.fillStyle(0xccd8f0, 1)
    g.fillCircle(x - 18, y - 12 + bobY, 5)

    // Right arm — slightly raised when moving, waving
    const armRaise = this.isMoving ? -8 : 0
    g.fillStyle(0xb8cce8, 1)
    g.fillRoundedRect(x + 14, y - 30 + armRaise + bobY, 8, 18, 4)
    g.fillStyle(0xdde8f5, 0.6)
    g.fillRoundedRect(x + 15, y - 28 + armRaise + bobY, 4, 10, 3)
    // Right hand
    g.fillStyle(0xccd8f0, 1)
    g.fillCircle(x + 18, y - 12 + armRaise + bobY, 5)

    // ── LEGS ──────────────────────────────────────────────────────────────
    // Left leg
    g.fillStyle(0xb8cce8, 1)
    g.fillRoundedRect(x - 11, y - 4 + bobY, 9, 14, 4)
    // Left foot
    g.fillStyle(0x334155, 1)
    g.fillRoundedRect(x - 14, y + 8 + bobY, 14, 6, 3)
    g.lineStyle(1, 0x7c3aed, 0.7)
    g.strokeRoundedRect(x - 14, y + 8 + bobY, 14, 6, 3)

    // Right leg
    g.fillStyle(0xb8cce8, 1)
    g.fillRoundedRect(x + 2, y - 4 + bobY, 9, 14, 4)
    // Right foot
    g.fillStyle(0x334155, 1)
    g.fillRoundedRect(x, y + 8 + bobY, 14, 6, 3)
    g.lineStyle(1, 0x7c3aed, 0.7)
    g.strokeRoundedRect(x, y + 8 + bobY, 14, 6, 3)

    // ── Accent stripe ────────────────────────────────────────────────────
    g.lineStyle(1.5, 0xa855f7, 0.55)
    g.beginPath(); g.moveTo(x - 14, y - 4 + bobY); g.lineTo(x + 14, y - 4 + bobY); g.strokePath()
  }

  update(_t: number, delta: number): void {
    this.elapsed += delta
    this.antennaPulse += delta * 0.004

    // Gentle floating bob (slower when moving)
    const bobSpeed = this.isMoving ? 0.008 : 0.003
    this.bobOffset = Math.sin(this.elapsed * bobSpeed) * (this.isMoving ? 3 : 4)

    this.drawRobot(Math.round(this.robotX), Math.round(this.robotY))
  }

  shutdown(): void {
    window.removeEventListener(ROBOT_MOVE_EVENT, this.onRobotMove)
  }
}
