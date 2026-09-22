import Link from 'next/link'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from '@/components/icons'
import { getStats } from '@/lib/data'
import { moveStat } from '../actions'
import { FormStatus, LinkButton, PageHeader } from '../_components/ui'

export default async function AdminStatsPage({ searchParams }: PageProps<'/admin/stats'>) {
  const [stats, { created }] = await Promise.all([getStats(), searchParams])

  return (
    <>
      <PageHeader
        title="By the numbers"
        description="The stat block beside your About text. Four reads best — they fill a 2×2 grid."
        action={
          <LinkButton href="/admin/stats/new" variant="primary">
            <PlusIcon size={16} />
            Add stat
          </LinkButton>
        }
      />

      {created === '1' && (
        <div className="mb-4">
          <FormStatus state={{ ok: true, message: 'Stat added.' }} />
        </div>
      )}

      {stats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-display font-semibold">No stats yet</p>
          <p className="mt-1 text-sm text-muted">
            Add a number and what it measures — the card stays hidden until you do.
          </p>
        </div>
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/70">
          {stats.map((s, i) => (
            <li key={s.id} className="flex items-center gap-4 p-3 sm:p-4">
              <div className="flex flex-col">
                <form action={moveStat}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="dir" value="-1" />
                  <button disabled={i === 0} aria-label={`Move ${s.label} up`} className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-25">
                    <ArrowUpIcon size={14} />
                  </button>
                </form>
                <form action={moveStat}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="dir" value="1" />
                  <button disabled={i === stats.length - 1} aria-label={`Move ${s.label} down`} className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-25">
                    <ArrowDownIcon size={14} />
                  </button>
                </form>
              </div>

              <span className="w-24 shrink-0 font-display text-2xl font-bold tabular-nums text-accent">{s.value}</span>

              <div className="min-w-0 flex-1">
                <Link href={`/admin/stats/${s.id}`} className="block truncate font-medium hover:text-accent">
                  {s.label}
                </Link>
              </div>

              <Link
                href={`/admin/stats/${s.id}`}
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
