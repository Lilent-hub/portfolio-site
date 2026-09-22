import type { CSSProperties } from 'react'
import { CopyButton } from '@/components/CopyButton'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ExternalIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from '@/components/icons'
import { ProjectCard } from '@/components/ProjectCard'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { getContact, getCredentials, getProfile, getProjects } from '@/lib/data'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function Home() {
  const [profile, projects, credentials, contact] = await Promise.all([
    getProfile(),
    getProjects(),
    getCredentials(),
    getContact(),
  ])

  const paragraphs = (profile?.bio ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const highlights = profile?.highlights ?? []
  const skills = profile?.skills ?? []

  return (
    <main>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div className="hero-glow absolute inset-0 -z-10" aria-hidden />

        <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 md:grid-cols-[1.25fr_1fr] md:gap-16 md:pb-28 md:pt-28">
          <div className="flex flex-col gap-6">
            {profile?.headline && (
              <p className="rise inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium tracking-wide text-accent" style={delay(0)}>
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {profile.headline}
              </p>
            )}
            <h1
              className="rise font-display text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-text"
              style={delay(80)}
            >
              {profile?.name}
            </h1>
            {profile?.tagline && (
              <p className="rise max-w-xl text-lg leading-relaxed text-muted sm:text-xl" style={delay(160)}>
                {profile.tagline}
              </p>
            )}
            <div className="rise flex flex-wrap items-center gap-3 pt-2" style={delay(240)}>
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-bg shadow-[var(--shadow-glow)] transition-[transform,background-color] hover:-translate-y-px hover:bg-accent-strong"
                >
                  <MailIcon size={16} />
                  Email me
                </a>
              )}
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/60 hover:text-accent"
              >
                View projects
                <ArrowRightIcon size={16} />
              </a>
            </div>
            {highlights.length > 0 && (
              <ul className="rise mt-2 grid gap-2 text-sm text-muted sm:grid-cols-2" style={delay(320)}>
                {highlights.slice(0, 4).map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <CheckIcon size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {profile?.avatar_url && (
            <div className="rise relative mx-auto w-[min(72vw,320px)] md:w-full md:max-w-[360px]" style={delay(120)}>
              <div className="absolute -inset-6 -z-10 rounded-full bg-accent/15 blur-3xl" aria-hidden />
              <div className="ring-pulse aspect-square overflow-hidden rounded-full border-2 border-accent/70 p-1.5">
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="h-full w-full rounded-full object-cover"
                  fetchPriority="high"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <Reveal as="section" id="about" className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading eyebrow="01 — About" title="About me" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div className="flex flex-col gap-5 text-base leading-relaxed text-muted sm:text-lg">
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-text' : undefined}>
                {p}
              </p>
            ))}
          </div>
          {highlights.length > 0 && (
            <aside className="relative rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <div className="absolute -top-px left-6 h-px w-16 bg-accent" aria-hidden />
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.15em] text-muted">
                What you can count on
              </h3>
              <ul className="flex flex-col gap-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-text">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                      <CheckIcon size={12} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </Reveal>

      {/* -------------------------------------------------------------- Skills */}
      {skills.length > 0 && (
        <section id="skills" className="border-y border-line bg-surface/40">
          <Reveal className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 md:py-28">
            <SectionHeading
              eyebrow="02 — Skills"
              title="Tools & expertise"
              lede="The stack I work in every day, from CRM and calendars to data cleanup."
            />
            <ul className="flex flex-wrap gap-2.5">
              {skills.map((s, i) => (
                <li
                  key={s}
                  className="reveal is-visible rounded-full border border-line bg-bg/60 px-4 py-2 text-sm font-medium text-text transition-[border-color,color,transform] hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                  style={delay(i * 30)}
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------------ Projects */}
      <Reveal as="section" id="projects" className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading
          eyebrow="03 — Projects"
          title="Selected work"
          lede="Systems I built to keep records clean, tasks moving, and schedules on track."
        />
        {projects.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 70}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
            Projects are on the way.
          </p>
        )}
      </Reveal>

      {/* --------------------------------------------------------- Credentials */}
      {credentials.length > 0 && (
        <section id="credentials" className="border-y border-line bg-surface/40">
          <Reveal className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 md:py-28">
            <SectionHeading eyebrow="04 — Credentials" title="Certificates & training" />
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {credentials.map((c) => (
                <li key={c.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {c.image_url && !c.image_url.toLowerCase().endsWith('.pdf') && (
                      <img src={c.image_url} alt="" className="h-12 w-12 rounded-lg border border-line object-cover" loading="lazy" />
                    )}
                    <div>
                      <p className="font-medium text-text">{c.title}</p>
                      <p className="text-sm text-muted tabular-nums">
                        {[c.issuer, formatDate(c.date)].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>
                  {(c.verify_url || c.image_url) && (
                    <a
                      href={c.verify_url ?? c.image_url ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                    >
                      {c.verify_url ? 'Verify' : 'View'}
                      <ExternalIcon size={14} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------------- Contact */}
      <Reveal as="section" id="contact" className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 md:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="hero-glow absolute inset-0 -z-0 opacity-70" aria-hidden />
          <div className="relative flex flex-col items-center gap-6">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {credentials.length > 0 ? '05' : '04'} — Contact
            </span>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Let&apos;s work together
            </h2>
            <p className="max-w-lg text-muted sm:text-lg">
              Need dependable admin or CRM support? Send a note and I&apos;ll reply within a business day.
            </p>

            {contact?.email && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-bg shadow-[var(--shadow-glow)] transition-[transform,background-color] hover:-translate-y-px hover:bg-accent-strong"
                >
                  <MailIcon size={16} />
                  {contact.email}
                </a>
                <CopyButton value={contact.email} label="Copy email" />
              </div>
            )}

            {(contact?.github_url || contact?.linkedin_url) && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {contact.github_url && (
                  <a
                    href={contact.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm text-text transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <GithubIcon size={16} />
                    GitHub
                    <ArrowUpRightIcon size={14} className="text-muted" />
                  </a>
                )}
                {contact.linkedin_url && (
                  <a
                    href={contact.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm text-text transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <LinkedinIcon size={16} />
                    LinkedIn
                    <ArrowUpRightIcon size={14} className="text-muted" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </main>
  )
}
