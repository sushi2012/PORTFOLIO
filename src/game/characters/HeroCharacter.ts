import Phaser from 'phaser'
import { animKey } from './CharacterAnimations'
import { FRAME_H, FRAME_W } from './CharacterSpritesheetGenerator'
import type { InputState } from './InputController'

// ── Character states ──────────────────────────────────────────────────────────
type CharState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'fall'
  | 'land'
  | 'attack'
  | 'interact'

// ── Physics constants ─────────────────────────────────────────────────────────
const WALK_SPEED   = 120
const RUN_SPEED    = 220
const JUMP_FORCE   = -400
const MAX_FALL     = 500
const DECEL        = 0.78  // horizontal deceleration factor (on ground)
const AIR_DECEL    = 0.92  // looser in air

// ── HeroCharacter ─────────────────────────────────────────────────────────────
export class HeroCharacter extends Phaser.Physics.Arcade.Sprite {
  private charState: CharState = 'idle'
  private facingRight = true
  private attackTimer = 0
  private landTimer = 0
  private interactTimer = 0
  private wasOnGround = false
  private jumpBufferTimer = 0   // coyote time + jump buffer
  private coyoteTimer = 0

  // Particle emitter for sword glow trail
  private swordParticles!: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero_lyra', 'idle_0')
    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject)
    scene.physics.add.existing(this as unknown as Phaser.GameObjects.GameObject)

    this.setDepth(20)
    this.setOrigin(0.5, 1)

    // Physics body sized to character silhouette (not full frame)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(FRAME_W * 0.55, FRAME_H * 0.72)
    body.setOffset(FRAME_W * 0.225, FRAME_H * 0.28)
    body.setMaxVelocityY(MAX_FALL)
    body.setCollideWorldBounds(true)

    // Sword glow particle trail
    this.createSwordParticles(scene)

    // Start idle
    this.play(animKey('idle'))
  }

  private createSwordParticles(scene: Phaser.Scene): void {
    try {
      this.swordParticles = scene.add.particles(0, 0, 'hero_lyra', {
        frame: 'idle_0',
        lifespan: 300,
        speed: { min: 10, max: 30 },
        scale: { start: 0.15, end: 0 },
        alpha: { start: 0.6, end: 0 },
        tint: 0x67e8f9,
        blendMode: Phaser.BlendModes.ADD,
        frequency: -1,  // manual emit only
        quantity: 3,
      })
      this.swordParticles.setDepth(19)
    } catch {
      // Particles are non-critical — continue without them
    }
  }

  // ── Public update ─────────────────────────────────────────────────────────
  update(input: InputState, delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body
    const onGround = body.blocked.down

    // ── Coyote time ───────────────────────────────────────────────────────
    if (this.wasOnGround && !onGround) {
      this.coyoteTimer = 120  // ms of coyote time
    }
    if (this.coyoteTimer > 0) this.coyoteTimer -= delta
    this.wasOnGround = onGround

    // ── Jump buffer ───────────────────────────────────────────────────────
    if (input.jump) this.jumpBufferTimer = 150
    if (this.jumpBufferTimer > 0) this.jumpBufferTimer -= delta

    // ── Locked states (attack / land / interact) ──────────────────────────
    if (this.attackTimer > 0) {
      this.attackTimer -= delta
      this.handleHorizontalMovement(input, body, onGround, delta)
      this.updateSwordParticles()
      return
    }
    if (this.landTimer > 0) {
      this.landTimer -= delta
      body.setVelocityX(body.velocity.x * DECEL)
      if (this.landTimer <= 0) this.transitionTo('idle')
      return
    }
    if (this.interactTimer > 0) {
      this.interactTimer -= delta
      body.setVelocityX(0)
      if (this.interactTimer <= 0) this.transitionTo('idle')
      return
    }

    // ── Action triggers ───────────────────────────────────────────────────
    if (input.attack && (onGround || this.charState === 'jump' || this.charState === 'fall')) {
      this.startAttack()
      return
    }
    if (input.interact && onGround) {
      this.startInteract()
      return
    }

    // ── Horizontal movement ───────────────────────────────────────────────
    this.handleHorizontalMovement(input, body, onGround, delta)

    // ── Jump ──────────────────────────────────────────────────────────────
    const canJump = (onGround || this.coyoteTimer > 0) && this.jumpBufferTimer > 0
    if (canJump) {
      body.setVelocityY(JUMP_FORCE)
      this.jumpBufferTimer = 0
      this.coyoteTimer = 0
      this.transitionTo('jump')
      return
    }

    // ── Airborne states ───────────────────────────────────────────────────
    if (!onGround) {
      if (body.velocity.y > 30) {
        this.transitionTo('fall')
      } else if (body.velocity.y < -30) {
        this.transitionTo('jump')
      }
      return
    }

    // ── Ground landing detection ──────────────────────────────────────────
    if (!this.wasOnGround && onGround && (this.charState === 'fall' || this.charState === 'jump')) {
      this.startLand()
      return
    }

    // ── Ground movement states ────────────────────────────────────────────
    const moving = Math.abs(body.velocity.x) > 8
    if (moving) {
      const targetState: CharState = input.run ? 'run' : 'walk'
      this.transitionTo(targetState)
    } else {
      this.transitionTo('idle')
    }

    // Emit sword particles while idle/walking (ambient glow)
    this.updateSwordParticles()
  }

  private handleHorizontalMovement(
    input: InputState,
    body: Phaser.Physics.Arcade.Body,
    onGround: boolean,
    _delta: number,
  ): void {
    const speed = input.run ? RUN_SPEED : WALK_SPEED
    const decel = onGround ? DECEL : AIR_DECEL

    if (input.left) {
      body.setVelocityX(-speed)
      if (!this.flipX) {
        this.setFlipX(true)
        this.facingRight = false
      }
    } else if (input.right) {
      body.setVelocityX(speed)
      if (this.flipX) {
        this.setFlipX(false)
        this.facingRight = true
      }
    } else {
      body.setVelocityX(body.velocity.x * decel)
    }
  }

  private startAttack(): void {
    this.attackTimer = 420  // duration of 6 frames @ 14fps
    this.transitionTo('attack')
  }

  private startLand(): void {
    this.landTimer = 200
    this.transitionTo('land')
  }

  private startInteract(): void {
    this.interactTimer = 625  // 5 frames @ 8fps
    this.transitionTo('interact')
  }

  private transitionTo(next: CharState): void {
    if (this.charState === next) return
    this.charState = next
    const key = animKey(next)
    if (this.anims.currentAnim?.key !== key) {
      this.play(key, true)
    }
  }

  private updateSwordParticles(): void {
    if (!this.swordParticles) return
    // Position particles near the sword tip (offset from sprite)
    const dir = this.facingRight ? 1 : -1
    const px = this.x + dir * 18
    const py = this.y - FRAME_H * 0.55
    this.swordParticles.setPosition(px, py)
    if (this.state === 'attack') {
      this.swordParticles.emitParticle(6)
    } else {
      this.swordParticles.emitParticle(1)
    }
  }

  getState(): CharState { return this.charState }
  isFacingRight(): boolean { return this.facingRight }

  destroy(fromScene?: boolean): void {
    this.swordParticles?.destroy()
    super.destroy(fromScene)
  }
}
