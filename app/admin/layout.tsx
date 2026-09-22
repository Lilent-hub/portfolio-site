import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalIcon, LogoutIcon } from '@/components/icons'
import { createClient } from '@/lib/supabase/server'
import { logout } from './actions'
import { AdminNav } from './_components/AdminNav'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-line bg-surface/60 md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block md:py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-line-strong bg-surface font-display text-sm font-semibold text-accent">
              JD
            </span>
            <span>
              <span className="block font-display text-sm font-semibold">Site admin</span>
              <span className="block max-w-[150px] truncate text-xs text-muted">{user?.email}</span>
            </span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-muted hover:border-line-strong hover:text-text md:hidden"
          >
            View site
            <ExternalIcon size={12} />
          </Link>
        </div>

        <AdminNav />

        <div className="mt-auto hidden flex-col gap-2 border-t border-line p-4 md:flex">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <ExternalIcon size={16} />
            View live site
          </Link>
          <form action={logout}>
            <button className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-text">
              <LogoutIcon size={16} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 sm:px-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  )
}
