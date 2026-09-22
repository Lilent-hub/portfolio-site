import Link from 'next/link'
import { ArrowLeftIcon } from '@/components/icons'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1100px] flex-col items-center justify-center gap-5 px-5 pt-16 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">404</span>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">That page doesn&apos;t exist</h1>
      <p className="max-w-md text-muted">The link may be outdated, or the project was renamed in the admin.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-3 text-sm font-semibold transition-colors hover:border-accent/60 hover:text-accent"
      >
        <ArrowLeftIcon size={16} />
        Back home
      </Link>
    </main>
  )
}
