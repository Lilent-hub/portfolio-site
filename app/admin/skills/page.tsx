import Link from 'next/link'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from '@/components/icons'
import { getSkills } from '@/lib/data'
import { moveSkill } from '../actions'
import { FormStatus, LinkButton, PageHeader } from '../_components/ui'

function monogram(name: string) {
  const w = name.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/)
  return ((w[0]?.[0] ?? '') + (w[1]?.[0] ?? '')).toUpperCase()
}

export default async function AdminSkillsPage({ searchParams }: PageProps<'/admin/skills'>) {
  const [skills, { created }] = await Promise.all([getSkills(), searchParams])

  return (
    <>
      <PageHeader
        title="Skills"
        description="Tools and expertise shown in the moving logo strip. Order here is the order on the site."
        action={
          <LinkButton href="/admin/skills/new" variant="primary">
            <PlusIcon size={16} />
            Add skill
          </LinkButton>
        }
      />

      {created === '1' && (
        <div className="mb-4">
          <FormStatus state={{ ok: true, message: 'Skill added.' }} />
        </div>
      )}

      {skills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-display font-semibold">No skills yet</p>
          <p className="mt-1 text-sm text-muted">Add a tool with its logo and it appears in the strip on the home page.</p>
        </div>
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/70">
          {skills.map((s, i) => (
            <li key={s.id} className="flex items-center gap-4 p-3 sm:p-4">
              <div className="flex flex-col">
                <form action={moveSkill}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="dir" value="-1" />
                  <button disabled={i === 0} aria-label={`Move ${s.name} up`} className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-25">
                    <ArrowUpIcon size={14} />
                  </button>
                </form>
                <form action={moveSkill}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="dir" value="1" />
                  <button disabled={i === skills.length - 1} aria-label={`Move ${s.name} down`} className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-25">
                    <ArrowDownIcon size={14} />
                  </button>
                </form>
              </div>

              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white/[0.92] p-1.5">
                {s.icon_url ? (
                  <img src={s.icon_url} alt="" className="h-full w-full object-contain" />
                ) : (
                  <span className="font-display text-[11px] font-bold text-bg">{monogram(s.name)}</span>
                )}
              </span>

              <div className="min-w-0 flex-1">
                <Link href={`/admin/skills/${s.id}`} className="block truncate font-medium hover:text-accent">
                  {s.name}
                </Link>
                <p className="text-xs text-muted">{s.icon_url ? 'Logo set' : 'No logo — shows initials'}</p>
              </div>

              <Link
                href={`/admin/skills/${s.id}`}
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
