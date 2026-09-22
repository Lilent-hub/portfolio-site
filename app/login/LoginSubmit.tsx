'use client'

import { useFormStatus } from 'react-dom'

export function LoginSubmit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong disabled:cursor-progress disabled:opacity-60"
    >
      {pending && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />}
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}
