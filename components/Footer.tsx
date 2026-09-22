import Link from 'next/link'

export function Footer({ name }: { name?: string | null }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {name ?? 'John Dignadice'}. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/#about" className="transition-colors hover:text-text">
            Back to top
          </Link>
          <Link href="/login" className="transition-colors hover:text-text">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
