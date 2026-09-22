import Link from 'next/link'
import { ArrowDownIcon, ArrowUpIcon, ImageIcon, PlusIcon } from '@/components/icons'
import { getProjects } from '@/lib/data'
import { moveProject } from '../actions'
import { LinkButton, PageHeader } from '../_components/ui'

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <PageHeader
        title="Projects"
        description="Order here is the order on the home page."
        action={
          <LinkButton href="/admin/projects/new" variant="primary">
            <PlusIcon size={16} />
            New project
          </LinkButton>
        }
      />

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-display font-semibold">No projects yet</p>
          <p className="mt-1 text-sm text-muted">Add your first case study — title, a few tags, and screenshots.</p>
          <div className="mt-5">
            <LinkButton href="/admin/projects/new" variant="primary">
              <PlusIcon size={16} />
              New project
            </LinkButton>
          </div>
        </div>
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/70">
          {projects.map((p, i) => (
            <li key={p.id} className="flex items-center gap-4 p-3 sm:p-4">
              <div className="flex flex-col">
                <form action={moveProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="dir" value="-1" />
                  <button
                    disabled={i === 0}
                    aria-label={`Move ${p.title} up`}
                    className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-25"
                  >
                    <ArrowUpIcon size={14} />
                  </button>
                </form>
                <form action={moveProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="dir" value="1" />
                  <button
                    disabled={i === projects.length - 1}
                    aria-label={`Move ${p.title} down`}
                    className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-25"
                  >
                    <ArrowDownIcon size={14} />
                  </button>
                </form>
              </div>

              <div className="grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface-2">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <ImageIcon size={18} className="text-muted" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link href={`/admin/projects/${p.id}`} className="block truncate font-medium hover:text-accent">
                  {p.title}
                </Link>
                <p className="truncate text-xs text-muted">
                  /projects/{p.slug}
                  {p.tags.length > 0 && ` · ${p.tags.join(', ')}`}
                </p>
              </div>

              <Link
                href={`/admin/projects/${p.id}`}
                className="hidden rounded-md border border-line px-3 py-1.5 text-xs font-medium hover:border-line-strong sm:inline-flex"
              >
                Edit
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
