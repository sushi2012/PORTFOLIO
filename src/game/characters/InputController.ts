import Phaser from 'phaser'

// ── InputController ───────────────────────────────────────────────────────────
// Wraps Phaser cursor keys + WASD + action keys into a clean interface.

export interface InputState {
  left: boolean
  right: boolean
  jump: boolean
  attack: boolean
  interact: boolean
  explore: boolean   // E key — open island page
  run: boolean
}

export class InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd: {
    up: Phaser.Input.Keyboard.Key
    down: Phaser.Input.Keyboard.Key
    left: Phaser.Input.Keyboard.Key
    right: Phaser.Input.Keyboard.Key
  }
  private zKey: Phaser.Input.Keyboard.Key   // attack
  private xKey: Phaser.Input.Keyboard.Key   // interact
  private eKey: Phaser.Input.Keyboard.Key   // explore island
  private shiftKey: Phaser.Input.Keyboard.Key

  constructor(scene: Phaser.Scene) {
    const kb = scene.input.keyboard!
    this.cursors = kb.createCursorKeys()
    this.wasd = {
      up:    kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.zKey     = kb.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.xKey     = kb.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    this.eKey     = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.shiftKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
  }

  get state(): InputState {
    return {
      left:     this.cursors.left.isDown  || this.wasd.left.isDown,
      right:    this.cursors.right.isDown || this.wasd.right.isDown,
      jump:     Phaser.Input.Keyboard.JustDown(this.cursors.up)  ||
                Phaser.Input.Keyboard.JustDown(this.wasd.up)     ||
                Phaser.Input.Keyboard.JustDown(this.cursors.space!),
      attack:   Phaser.Input.Keyboard.JustDown(this.zKey),
      interact: Phaser.Input.Keyboard.JustDown(this.xKey),
      explore:  Phaser.Input.Keyboard.JustDown(this.eKey),
      run:      this.shiftKey.isDown,
    }
  }

  destroy(): void {
    this.cursors.left.destroy()
    this.cursors.right.destroy()
    this.cursors.up.destroy()
    this.cursors.down.destroy()
    this.wasd.up.destroy()
    this.wasd.down.destroy()
    this.wasd.left.destroy()
    this.wasd.right.destroy()
    this.zKey.destroy()
    this.xKey.destroy()
    this.eKey.destroy()
    this.shiftKey.destroy()
  }
}
