import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { EnvironmentScene } from './scenes/EnvironmentScene'
import { GameScene } from './scenes/GameScene'
import { IslandScene } from './scenes/IslandScene'
import { RobotScene } from './scenes/RobotScene'

let instance: Phaser.Game | null = null

export function createPhaserGame(parent: HTMLElement): Phaser.Game {
  if (instance) return instance

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#0a0618',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: '100%',
      height: '100%',
    },
    scene: [BootScene, EnvironmentScene, IslandScene, RobotScene, GameScene],
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 620 }, debug: false },
    },
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true,
    },
    audio: { noAudio: true },
  }

  instance = new Phaser.Game(config)
  return instance
}

export function destroyPhaserGame(): void {
  if (instance) { instance.destroy(true); instance = null }
}

export function getPhaserGame(): Phaser.Game | null { return instance }
