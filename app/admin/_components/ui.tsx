'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckIcon } from '@/components/icons'
import type { ActionState } from '@/lib/types'

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface/70 p-5 sm:p-6 ${className}`}>{children}</section>
  )
}

export function Field({
  label,
  name,
  hint,
  error,
  children,
}: {
  label: string
  name: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export function SubmitButton({
  children,
  pendingLabel = 'Saving…',
  variant = 'primary',
  className = '',
}: {
  children: ReactNode
  pendingLabel?: string
  variant?: 'primary' | 'ghost' | 'danger'
  className?: string
}) {
  const { pending } = useFormStatus()
  const styles = {
    primary: 'bg-accent text-bg hover:bg-accent-strong',
    ghost: 'border border-line text-text hover:border-line-strong',
    danger: 'border border-danger/40 text-danger hover:bg-danger/10',
  }[variant]
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-[background-color,border-color,opacity] disabled:cursor-progress disabled:opacity-60 ${styles} ${className}`}
    >
      {pending && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {pending ? pendingLabel : children}
    </button>
  )
}

export function LinkButton({
  href,
  children,
  variant = 'ghost',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
}) {
  const styles =
    variant === 'primary'
      ? 'bg-accent text-bg hover:bg-accent-strong'
      : 'border border-line text-text hover:border-line-strong'
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${styles}`}
    >
      {children}
    </Link>
  )
}

/** Inline status line for a form: success fades after a few seconds, errors stay. */
export function FormStatus({ state }: { state: ActionState }) {
  // Success messages auto-dismiss; we remember *which* state object was
  // dismissed so a fresh submission (new object) shows again.
  const [dismissed, setDismissed] = useState<ActionState>(null)

  useEffect(() => {
    if (!state?.ok) return
    const t = setTimeout(() => setDismissed(state), 3500)
    return () => clearTimeout(t)
  }, [state])

  if (!state || dismissed === state) return null
  return (
    <p
      role="status"
      className={`toast-in inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
        state.ok ? 'border-success/40 bg-success/10 text-success' : 'border-danger/40 bg-danger/10 text-danger'
      }`}
    >
      {state.ok && <CheckIcon size={14} />}
      {state.message}
    </p>
  )
}

/** Submit button that asks for confirmation before running its form action. */
export function ConfirmSubmit({
  children,
  message,
  className = '',
}: {
  children: ReactNode
  message: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}
