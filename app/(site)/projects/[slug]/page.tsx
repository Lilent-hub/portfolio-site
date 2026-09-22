import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, ExternalIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { getAdjacentProjects, getProjectBySlug } from '@/lib/data'

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description?.slice(0, 160),
    openGraph: project.image_url ? { images: [project.image_url] } : undefined,
  }
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const { prev, next } = await getAdjacentProjects(slug)
  const hero = project.images[0] ?? (project.image_url ? { id: 'thumb', url: project.image_url, caption: null } : null)
  const rest = project.images.length > 0 ? project.images.slice(1) : []

  return (
    <main className="pt-16">
      <article className="mx-auto max-w-[1100px] px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <ArrowLeftIcon size={16} />
          All projects
        </Link>

        <header className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="flex flex-col gap-5">
            {project.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium tracking-wide text-accent"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <h1 className="rise font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-tight">
              {project.title}
            </h1>
            {project.link_url && (
              <a
                href={project.link_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-line-strong px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-accent/60 hover:text-accent"
              >
                Open project
                <ExternalIcon size={14} />
              </a>
            )}
          </div>
          {project.description && (
            <p className="text-base leading-relaxed text-muted sm:text-lg">{project.description}</p>
          )}
        </header>

        {hero && (
          <ViewTransition name={`project-image-${project.slug}`}>
            <figure className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface">
              <img src={hero.url} alt={hero.caption ?? project.title} className="w-full" fetchPriority="high" />
              {hero.caption && (
                <figcaption className="border-t border-line px-5 py-4 text-sm leading-relaxed text-muted">
                  {hero.caption}
                </figcaption>
              )}
            </figure>
          </ViewTransition>
        )}

        {rest.length > 0 && (
          <div className="mt-10 flex flex-col gap-10">
            {rest.map((img, i) => (
              <Reveal as="div" key={img.id} delay={Math.min(i, 2) * 60}>
                <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
                  <img src={img.url} alt={img.caption ?? ''} className="w-full" loading="lazy" />
                  {img.caption && (
                    <figcaption className="border-t border-line px-5 py-4 text-sm leading-relaxed text-muted">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        {(prev || next) && (
          <nav className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2" aria-label="More projects">
            {prev && (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex flex-col gap-1 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/50"
              >
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted">
                  <ArrowLeftIcon size={14} />
                  Previous
                </span>
                <span className="font-display font-semibold text-text group-hover:text-accent">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex flex-col gap-1 rounded-2xl border border-line bg-surface p-5 text-right transition-colors hover:border-accent/50 sm:col-start-2"
              >
                <span className="inline-flex items-center justify-end gap-1.5 text-xs uppercase tracking-[0.15em] text-muted">
                  Next
                  <ArrowRightIcon size={14} />
                </span>
                <span className="font-display font-semibold text-text group-hover:text-accent">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </article>
    </main>
  )
}
