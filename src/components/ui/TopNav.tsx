import { motion } from 'framer-motion'
import {
  Home, User, Zap, FolderOpen, Mail,
} from 'lucide-react'
import type { PanelId } from '@/types/ui'

// ── Center nav items (no Hire Me here — it moves to the right button) ────────
const NAV_ITEMS: { id: PanelId; label: string; icon: React.ReactNode }[] = [
  { id: 'home',      label: 'Home',     icon: <Home       className="w-3.5 h-3.5" /> },
  { id: 'about',     label: 'About',    icon: <User       className="w-3.5 h-3.5" /> },
  { id: 'projects',  label: 'Projects', icon: <FolderOpen className="w-3.5 h-3.5" /> },
  { id: 'skills-xp', label: 'Skills',   icon: <Zap        className="w-3.5 h-3.5" /> },
  { id: 'contact',   label: 'Contact',  icon: <Mail       className="w-3.5 h-3.5" /> },
]

interface Props {
  active:   PanelId
  onSelect: (id: PanelId) => void
}

export function TopNav({ active, onSelect }: Props) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4, ease: 'easeOut' }}
      className="flex items-center gap-1 px-1.5 py-1 rounded-full"
      style={{
        background: 'rgba(20,10,45,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(124,58,237,0.28)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
      }}
      aria-label="Portfolio navigation"
    >
      {NAV_ITEMS.map((item, i) => {
        const isActive = active === item.id
        return (
          <motion.button
            key={String(item.id)}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.04, duration: 0.26 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                       text-xs font-medium transition-all duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            style={
              isActive
                ? {
                    background: 'linear-gradient(135deg,#6d28d9,#7c3aed)',
                    color: '#fff',
                    boxShadow: '0 0 12px rgba(124,58,237,0.50)',
                  }
                : {
                    background: 'transparent',
                    color: '#9ca3af',
                  }
            }
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </motion.button>
        )
      })}
    </motion.nav>
  )
}
