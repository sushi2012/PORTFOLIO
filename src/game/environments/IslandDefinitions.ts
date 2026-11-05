import type { PageId } from '@/types/ui'

export const OPEN_PAGE_EVENT = 'portfolio:openPage'
export const WALK_TO_EVENT   = 'portfolio:walkTo'
export const ROBOT_MOVE_EVENT = 'portfolio:robotMove'

// ── Four islands, sitting LOW (yFrac 0.72–0.78) ──────────────────────────────
// xFrac: 0.12 · 0.37 · 0.63 · 0.88  (evenly spread with breathing room)

export const ISLAND_COLORS = {
  about: { grass: 0x14532d, grassLight: 0x22c55e, rock: 0x1c1917, accent: 0xfbbf24, rune: 0xfde68a },
  skills:   { grass: 0x1e3a5f, grassLight: 0x3b82f6, rock: 0x1e293b, accent: 0x38bdf8, rune: 0xbae6fd },
  projects:    { grass: 0x4c1d95, grassLight: 0xa855f7, rock: 0x1e1b4b, accent: 0xc084fc, rune: 0xe9d5ff },
  contact:  { grass: 0x134e4a, grassLight: 0x0d9488, rock: 0x1a2e2d, accent: 0x2dd4bf, rune: 0x99f6e4 },
}

export type IslandId = PageId

export interface IslandDef {
  id:          IslandId
  xFrac:       number
  yFrac:       number
  widthFrac:   number
  heightFrac:  number
  label:       string
  sublabel:    string
  colors:      typeof ISLAND_COLORS.projects
  signSide:    'left' | 'right'
}

export const ISLAND_DEFS: IslandDef[] = [
  {
    id: 'about',
    xFrac: 0.20, yFrac: 0.76,
    widthFrac: 0.20, heightFrac: 0.12,
    label: 'ABOUT ME', sublabel: 'My Story',
    colors: ISLAND_COLORS.about,
    signSide: 'left',
  },
  {
    id: 'projects',
   
    xFrac: 0.63, yFrac: 0.74,
    widthFrac: 0.20, heightFrac: 0.11,
    label: 'PROJECTS', sublabel: 'Explore My Work',
    colors: ISLAND_COLORS.projects,
    signSide: 'right',
  },
  {
    id: 'skills-xp',
    xFrac: 0.37, yFrac: 0.72,
    widthFrac: 0.20, heightFrac: 0.11,
    label: 'SKILLS & XP', sublabel: 'Technologies · Journey',
    colors: ISLAND_COLORS.skills,
    signSide: 'right',
  },
  
  {
    id: 'contact',
    xFrac: 0.88, yFrac: 0.76,
    widthFrac: 0.18, heightFrac: 0.10,
    label: 'CONTACT', sublabel: "Let's Connect",
    colors: ISLAND_COLORS.contact,
    signSide: 'left',
  },
]

// ── Runtime helpers ───────────────────────────────────────────────────────────
export const islCX      = (i: IslandDef, W: number) => i.xFrac      * W
export const islCY      = (i: IslandDef, H: number) => i.yFrac      * H
export const islW       = (i: IslandDef, W: number) => i.widthFrac  * W
export const islH       = (i: IslandDef, H: number) => i.heightFrac * H
export const islSurface = (i: IslandDef, _W: number, H: number) =>
  islCY(i, H) - islH(i, H) * 0.26

export const islSignX = (i: IslandDef, W: number) => {
  const off = islW(i, W) * 0.26
  return islCX(i, W) + (i.signSide === 'right' ? off : -off)
}
