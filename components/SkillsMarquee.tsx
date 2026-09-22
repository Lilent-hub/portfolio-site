import type { CSSProperties } from 'react'
import type { Skill } from '@/lib/types'

const COPIES = 3

function monogram(name: string) {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/)
  return ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase() || '•'
}

function Pill({ skill, dup }: { skill: Skill; dup?: boolean }) {
  return (
    <li data-dup={dup ? '' : undefined} className="flex shrink-0 items-center gap-3 rounded-full border border-line bg-surface py-2 pl-2 pr-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-accent/60">
      <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white/[0.92] p-1.5">
        {skill.icon_url ? (
          <img src={skill.icon_url} alt="" className="h-full w-full object-contain" loading="lazy" draggable={false} />
        ) : (
          <span className="font-display text-[11px] font-bold tracking-wide text-bg">{monogram(skill.name)}</span>
        )}
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-text">{skill.name}</span>
    </li>
  )
}

function Row({ skills, reverse }: { skills: Skill[]; reverse?: boolean }) {
  // Duplicate the list so the loop is seamless; the track slides exactly one copy.
  const items = Array.from({ length: COPIES }, () => skills).flat()
  const duration = Math.max(24, skills.length * 5)
  return (
    <div className="marquee" data-reverse={reverse ? '' : undefined}>
      <ul
        className="marquee-track flex w-max gap-3"
        style={{ '--marquee-duration': `${duration}s`, '--marquee-copies': COPIES } as CSSProperties}
      >
        {items.map((s, i) => (
          <Pill key={`${s.id}-${i}`} skill={s} dup={i >= skills.length} />
        ))}
      </ul>
    </div>
  )
}

/**
 * Infinite, pausable logo marquee. Up to 8 tools ride one row; more split
 * across two rows moving in opposite directions. Reduced motion → static wrap.
 */
export function SkillsMarquee({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null

  const twoRows = skills.length > 8
  const rowA = twoRows ? skills.filter((_, i) => i % 2 === 0) : skills
  const rowB = twoRows ? skills.filter((_, i) => i % 2 === 1) : []

  return (
    <div className="flex flex-col gap-4">
      {/* Screen readers get one plain list; the moving rows are presentational. */}
      <ul className="sr-only">
        {skills.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
      <div aria-hidden className="flex flex-col gap-4">
        <Row skills={rowA} />
        {rowB.length > 0 && <Row skills={rowB} reverse />}
      </div>
    </div>
  )
}
