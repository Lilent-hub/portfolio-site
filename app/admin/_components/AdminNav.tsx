'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AtIcon, AwardIcon, LayersIcon, SparkIcon, UserIcon } from '@/components/icons'

const ITEMS = [
  { href: '/admin', label: 'Profile', icon: UserIcon, exact: true },
  { href: '/admin/skills', label: 'Skills', icon: SparkIcon },
  { href: '/admin/projects', label: 'Projects', icon: LayersIcon },
  { href: '/admin/credentials', label: 'Credentials', icon: AwardIcon },
  { href: '/admin/contact', label: 'Contact', icon: AtIcon },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin sections" className="overflow-x-auto px-3 pb-3 md:pb-0">
      <ul className="flex gap-1 md:flex-col">
        {ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-accent/12 text-accent' : 'text-muted hover:bg-surface hover:text-text'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
