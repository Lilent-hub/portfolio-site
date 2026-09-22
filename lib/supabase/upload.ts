import { createClient } from '@/lib/supabase/client'

const BUCKET = 'portfolio-media'

/**
 * Uploads straight from the browser to Supabase Storage and returns the public
 * URL. Bypasses the server action body limit (1 MB Next.js / 4.5 MB Vercel).
 */
export async function uploadToStorage(file: File, folder = 'uploads') {
  const supabase = createClient()
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
  })
  if (error) throw new Error(error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
