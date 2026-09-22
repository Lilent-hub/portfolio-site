'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Uploads the chosen file directly from the browser to Supabase Storage,
// then hands the public URL to the enclosing form via a hidden input. This
// keeps large images out of the server action body (1 MB Next.js limit,
// 4.5 MB Vercel limit), which would otherwise make the save request fail.
export function ImageUploadField({
  name,
  label,
  accept = 'image/*',
  currentUrl,
}: {
  name: string
  label: string
  accept?: string
  currentUrl?: string | null
}) {
  const [url, setUrl] = useState<string>(currentUrl ?? '')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('uploading')
    setMessage('')
    const supabase = createClient()
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file)

    if (error) {
      setStatus('error')
      setMessage(error.message)
      return
    }

    setUrl(supabase.storage.from('portfolio-media').getPublicUrl(path).data.publicUrl)
    setStatus('done')
  }

  return (
    <div className="flex items-center gap-4">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-16 w-16 rounded-full object-cover" />
      )}
      <label className="flex flex-col gap-1 text-sm">
        {label}
        <input type="file" accept={accept} onChange={handleChange} className="text-sm" />
        {status === 'uploading' && <span className="text-gray-500">Uploading…</span>}
        {status === 'done' && <span className="text-green-700">Uploaded — click Save to apply.</span>}
        {status === 'error' && <span className="text-red-600">Upload failed: {message}</span>}
      </label>
      <input type="hidden" name={name} value={url} />
    </div>
  )
}
