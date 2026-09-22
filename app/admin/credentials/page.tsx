import Link from 'next/link'
import { ArrowDownIcon, ArrowUpIcon, AwardIcon, PlusIcon } from '@/components/icons'
import { getCredentials } from '@/lib/data'
import { moveCredential } from '../actions'
import { LinkButton, PageHeader } from '../_components/ui'

export default async function AdminCredentialsPage() {
  const credentials = await getCredentials()

  return (
    <>
      <PageHeader
        title="Credentials"
        description="Certificates and training. The section stays hidden on the site until you add one."
        action={
          <LinkButton href="/admin/credentials/new" variant="primary">
            <PlusIcon size={16} />
            New credential
          </LinkButton>
        }
      />

      {credentials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center">
          <AwardIcon size={24} className="mx-auto text-muted" />
          <p className="mt-3 font-display font-semibold">No credentials yet</p>
          <p className="mt-1 text-sm text-muted">Add a certificate with its issuer, date, and a verification link.</p>
        </div>
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/70">
          {credentials.map((c, i) => (
            <li key={c.id} className="flex items-center gap-4 p-3 sm:p-4">
              <div className="flex flex-col">
                <form action={moveCredential}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="-1" />
                  <button disabled={i === 0} aria-label={`Move ${c.title} up`} className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-25">
                    <ArrowUpIcon size={14} />
                  </button>
                </form>
                <form action={moveCredential}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="1" />
                  <button disabled={i === credentials.length - 1} aria-label={`Move ${c.title} down`} className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-25">
                    <ArrowDownIcon size={14} />
                  </button>
                </form>
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/credentials/${c.id}`} className="block truncate font-medium hover:text-accent">
                  {c.title}
                </Link>
                <p className="truncate text-xs text-muted">{[c.issuer, c.date].filter(Boolean).join(' · ')}</p>
              </div>
              <Link
                href={`/admin/credentials/${c.id}`}
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
