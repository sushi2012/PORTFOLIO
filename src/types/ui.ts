// ── Shared UI types ───────────────────────────────────────────────────────────

/** Full-screen overlay pages */
export type PageId = 'projects' | 'skills-xp' | 'about' | 'contact'

/** All navigable destinations */
export type PanelId = 'home' | PageId | 'hire' | null

/** Ordered pages for prev/next navigation */
export const PAGES: PageId[] = ['about', 'projects', 'skills-xp', 'contact']

export const PAGE_LABELS: Record<PageId, string> = {
  'about':     'About Me',
  'projects':  'Projects',
  'skills-xp': 'Skills & Experience',
  'contact':   'Contact',
}
