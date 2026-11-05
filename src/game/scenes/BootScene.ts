import Phaser from 'phaser'
import { SCENE_KEYS } from '@/types/game'

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: SCENE_KEYS.BOOT }) }

  preload(): void {
    const { width: W, height: H } = this.scale
    const barBg = this.add.graphics()
    barBg.fillStyle(0x1a0a3e, 1)
    barBg.fillRoundedRect(W / 2 - 160, H / 2 - 12, 320, 24, 12)
    const bar = this.add.graphics()
    this.add.text(W / 2, H / 2 + 40, 'Entering the realm…', {
      fontFamily: 'system-ui', fontSize: '14px', color: '#a855f7',
    }).setOrigin(0.5)
    this.load.on('progress', (v: number) => {
      bar.clear()
      bar.fillStyle(0xa855f7, 1)
      bar.fillRoundedRect(W / 2 - 156, H / 2 - 8, 308 * v, 16, 8)
    })
  }

  create(): void {
    this.time.delayedCall(400, () => {
      this.scene.launch(SCENE_KEYS.ENVIRONMENT)
      this.scene.launch(SCENE_KEYS.ISLAND)
      this.scene.launch(SCENE_KEYS.ROBOT)
      this.scene.start(SCENE_KEYS.GAME)
    })
  }
}
