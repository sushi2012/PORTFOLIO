// ── Shared game types ───────────────────────────────────────────────────────

export interface GameConfig {
  width: number
  height: number
  parent: HTMLElement
}

export const SCENE_KEYS = {
  BOOT:        'BootScene',
  ENVIRONMENT: 'EnvironmentScene',
  ISLAND:      'IslandScene',
  ROBOT:       'RobotScene',
  GAME:        'GameScene',
} as const

export type SceneKey = typeof SCENE_KEYS[keyof typeof SCENE_KEYS]

export interface ParallaxLayer {
  gameObject: Phaser.GameObjects.Graphics | Phaser.GameObjects.Container
  scrollFactor: number
  depth: number
}

export interface PortfolioProject {
  id: string
  title: string
  description: string
  tech: string[]
  link?: string
  github?: string
  image?: string
}
