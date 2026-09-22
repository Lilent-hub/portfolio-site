import Link from 'next/link'
import { ViewTransition } from 'react'
import type { Project } from '@/lib/types'
import { ArrowUpRightIcon, ImageIcon } from './icons'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-lift)] focus-visible:outline-offset-4"
    >
      <ViewTransition name={`project-image-${project.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt=""
              loading={index < 3 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted">
              <ImageIcon size={28} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
        </div>
      </ViewTransition>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-text">
            {project.title}
          </h3>
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-[color,border-color,transform] group-hover:border-accent group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRightIcon size={16} />
          </span>
        </div>
        {project.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>
        )}
        {project.tags?.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((t) => (
              <li
                key={t}
                className="rounded-md border border-line bg-bg/40 px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}
