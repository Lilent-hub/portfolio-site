'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon } from './icons'

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — nothing to do.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
        copied
          ? 'border-success/40 text-success'
          : 'border-line text-muted hover:border-line-strong hover:text-text'
      }`}
      aria-live="polite"
    >
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      {copied ? 'Copied' : label}
    </button>
  )
}
