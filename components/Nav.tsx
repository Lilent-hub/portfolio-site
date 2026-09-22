'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MenuIcon, XIcon } from './icons'

const LINKS = [
  { href: '/#about', id: 'about', label: 'About' },
  { href: '/#skills', id: 'skills', label: 'Skills' },
  { href: '/#projects', id: 'projects', label: 'Projects' },
  { href: '/#contact', id: 'contact', label: 'Contact' },
]

export function Nav({ email, initials = 'JD' }: { email?: string | null; initials?: string }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const current = pathname === '/' ? active : null

  // Close the mobile drawer whenever the route changes (derived-state pattern).
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (pathname !== '/') return
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5] }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? 'border-b border-line bg-bg/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <Link
          href="/"
          className="group flex items-center gap-3 font-display text-sm font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-line-strong bg-surface text-accent transition-colors group-hover:border-accent/60">
            {initials}
          </span>
          <span className="hidden text-text sm:inline">Portfolio</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <Link
                href={l.href}
                className={`relative rounded-md px-3 py-2 text-sm transition-colors hover:text-text ${
                  current === l.id ? 'text-text' : 'text-muted'
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-3 -bottom-px h-px bg-accent transition-opacity ${
                    current === l.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg transition-[transform,background-color] hover:-translate-y-px hover:bg-accent-strong active:translate-y-0 md:inline-flex"
            >
              Let&apos;s talk
            </a>
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-text md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden ${open ? 'block' : 'hidden'} border-t border-line bg-bg/95 backdrop-blur-xl`}
      >
        <ul className="mx-auto flex max-w-[1100px] flex-col px-5 py-3">
          {LINKS.map((l, i) => (
            <li key={l.id} className="rise" style={{ '--delay': `${i * 40}ms` } as React.CSSProperties}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 font-display text-lg text-text hover:bg-surface"
              >
                {l.label}
              </Link>
            </li>
          ))}
          {email && (
            <li className="pt-2">
              <a
                href={`mailto:${email}`}
                className="flex justify-center rounded-lg bg-accent px-4 py-3 font-semibold text-bg"
              >
                Let&apos;s talk
              </a>
            </li>
          )}
        </ul>
      </div>
    </header>
  )
}
