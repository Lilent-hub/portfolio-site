'use client'

import { useId, useState } from 'react'
import { UploadIcon, XIcon } from '@/components/icons'
import { uploadToStorage } from '@/lib/supabase/upload'

/**
 * Single-file upload. Sends the file straight to Supabase Storage from the
 * browser and hands the public URL to the enclosing form via a hidden input.
 */
export function ImageUploadField({
  name,
  label,
  accept = 'image/*',
  currentUrl,
  shape = 'square',
  hint,
}: {
  name: string
  label: string
  accept?: string
  currentUrl?: string | null
  shape?: 'square' | 'circle' | 'wide'
  hint?: string
}) {
  const id = useId()
  const [url, setUrl] = useState<string>(currentUrl ?? '')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('uploading')
    setMessage('')
    try {
      setUrl(await uploadToStorage(file))
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const isPdf = url.toLowerCase().endsWith('.pdf')
  const previewClass = {
    square: 'h-20 w-20 rounded-lg',
    circle: 'h-20 w-20 rounded-full',
    wide: 'h-24 w-40 rounded-lg',
  }[shape]

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-line-strong bg-bg/40 p-3">
        <div className={`grid shrink-0 place-items-center overflow-hidden border border-line bg-surface-2 ${previewClass}`}>
          {url && !isPdf ? (
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : url && isPdf ? (
            <span className="text-xs font-semibold text-muted">PDF</span>
          ) : (
            <UploadIcon size={20} className="text-muted" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-text hover:border-line-strong"
            >
              <UploadIcon size={14} />
              {url ? 'Replace' : 'Choose file'}
            </label>
            {url && (
              <button
                type="button"
                onClick={() => {
                  setUrl('')
                  setStatus('idle')
                }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted hover:text-danger"
              >
                <XIcon size={12} />
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-muted">
            {status === 'uploading' && 'Uploading…'}
            {status === 'done' && <span className="text-success">Uploaded — save the form to apply.</span>}
            {status === 'error' && <span className="text-danger">Upload failed: {message}</span>}
            {status === 'idle' && (hint ?? 'PNG, JPG or WebP.')}
          </p>
        </div>
        <input id={id} type="file" accept={accept} onChange={handleChange} className="sr-only" />
        <input type="hidden" name={name} value={url} />
      </div>
    </div>
  )
}
