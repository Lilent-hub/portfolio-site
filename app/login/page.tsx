import Link from 'next/link'
import { ArrowLeftIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { login } from './actions'
import { LoginSubmit } from './LoginSubmit'

export const metadata = { title: 'Sign in', robots: { index: false, follow: false } }

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { error } = await searchParams

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <div className="hero-glow absolute inset-0 -z-10" aria-hidden />

      <div className="rise w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
          <ArrowLeftIcon size={16} />
          Back to site
        </Link>
        <div className="rounded-2xl border border-line bg-surface/80 p-7 backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <Logo size={40} />
            <div>
              <h1 className="font-display text-lg font-semibold tracking-tight">Sign in to admin</h1>
              <p className="text-xs text-muted">Edit the portfolio content.</p>
            </div>
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
              Invalid email or password.
            </p>
          )}

          <form action={login} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Email
              <input name="email" type="email" autoComplete="email" required className="field" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Password
              <input name="password" type="password" autoComplete="current-password" required className="field" />
            </label>
            <LoginSubmit />
          </form>
        </div>
      </div>
    </main>
  )
}
