'use client'

import { useId, useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon, TrashIcon, UploadIcon } from '@/components/icons'
import { uploadToStorage } from '@/lib/supabase/upload'

export type GalleryItem = { url: string; caption: string }

/**
 * Multi-image gallery editor: upload many, caption each, reorder, remove.
 * Serialises the whole list as JSON in a hidden input so the server action
 * can replace the project's images in one go.
 */
export function GalleryManager({ name, initial }: { name: string; initial: GalleryItem[] }) {
  const id = useId()
  const [items, setItems] = useState<GalleryItem[]>(initial)
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState('')

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return
    setError('')
    setUploading(files.length)
    const results = await Promise.allSettled(files.map((f) => uploadToStorage(f, 'projects')))
    const added: GalleryItem[] = []
    const failed: string[] = []
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') added.push({ url: r.value, caption: '' })
      else failed.push(files[i].name)
    })
    setItems((prev) => [...prev, ...added])
    if (failed.length) setError(`Failed to upload: ${failed.join(', ')}`)
    setUploading(0)
  }

  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function update(i: number, caption: string) {
    setItems((prev) => prev.map((it, k) => (k === i ? { ...it, caption } : it)))
  }

  function remove(i: number) {
    setItems((prev) => prev.filter((_, k) => k !== i))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Screenshots</span>
        <span className="text-xs text-muted">{items.length} image{items.length === 1 ? '' : 's'}</span>
      </div>

      {items.length > 0 && (
        <ol className="flex flex-col gap-3">
          {items.map((it, i) => (
            <li key={it.url} className="flex gap-3 rounded-xl border border-line bg-bg/40 p-3">
              <img src={it.url} alt="" className="h-20 w-32 shrink-0 rounded-lg border border-line object-cover object-top" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <textarea
                  value={it.caption}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder="Caption — what does this screenshot show?"
                  rows={2}
                  className="field resize-y text-xs"
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-30"
                  >
                    <ArrowUpIcon size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                    className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-text disabled:opacity-30"
                  >
                    <ArrowDownIcon size={14} />
                  </button>
                  <span className="ml-1 text-xs tabular-nums text-muted">#{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted hover:bg-danger/10 hover:text-danger"
                  >
                    <TrashIcon size={13} />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <label
        htmlFor={id}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-bg/40 px-4 py-6 text-center text-sm text-muted transition-colors hover:border-accent/60 hover:text-text ${
          uploading ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        <UploadIcon size={20} />
        {uploading ? `Uploading ${uploading} file${uploading === 1 ? '' : 's'}…` : 'Add screenshots — you can select several at once'}
      </label>
      <input id={id} type="file" accept="image/*" multiple onChange={handleFiles} className="sr-only" />
      {error && <p className="text-xs text-danger">{error}</p>}
      <input type="hidden" name={name} value={JSON.stringify(items)} />
    </div>
  )
}
