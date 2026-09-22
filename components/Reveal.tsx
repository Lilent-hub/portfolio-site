'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Fades + rises its children into view the first time they scroll into the
 * viewport. Pure CSS transition driven by one IntersectionObserver; honours
 * prefers-reduced-motion via globals.css.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  id,
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) show()
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    )
    // Content must never stay hidden, whatever the observer does.
    const failsafe = setTimeout(() => show(), 4000)
    function show() {
      el!.classList.add('is-visible')
      io.disconnect()
      clearTimeout(failsafe)
    }
    // Already on screen (hash navigation, restored scroll) → no need to wait.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) show()
    else io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(failsafe)
    }
  }, [])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} id={id} className={`reveal ${className}`} style={{ '--delay': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}
