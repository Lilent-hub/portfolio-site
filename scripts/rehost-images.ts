/**
 * One-time import helper: any image URL in the database that still points at
 * the reference GitHub Pages site is downloaded, uploaded to Supabase Storage
 * (bucket `portfolio-media`, folder `imported/`), and the row is updated to
 * the new public URL. Safe to re-run; already-rehosted rows are skipped.
 *
 * Usage:  npm run rehost-images
 * Needs:  NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SOURCE_PREFIX = 'https://lilent-hub.github.io/johndignadice.github.io/'
const BUCKET = 'portfolio-media'

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    // .env.local is optional if the vars are already in the environment.
  }
}

async function main() {
  loadEnv()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const rehosted = new Map<string, string>()
  async function rehost(src: string): Promise<string> {
    if (!src.startsWith(SOURCE_PREFIX)) return src
    const cached = rehosted.get(src)
    if (cached) return cached

    const res = await fetch(src)
    if (!res.ok) throw new Error(`Fetch ${src} → ${res.status}`)
    const bytes = Buffer.from(await res.arrayBuffer())
    const fileName = decodeURIComponent(src.slice(SOURCE_PREFIX.length).replace(/^images\//, ''))
      .replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `imported/${fileName}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: res.headers.get('content-type') ?? 'image/png',
      upsert: true,
      cacheControl: '31536000',
    })
    if (error) throw new Error(`Upload ${path}: ${error.message}`)
    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    rehosted.set(src, publicUrl)
    console.log(`✓ ${fileName}`)
    return publicUrl
  }

  // profile.avatar_url
  const { data: profile } = await supabase.from('profile').select('id, avatar_url').single()
  if (profile?.avatar_url?.startsWith(SOURCE_PREFIX)) {
    await supabase.from('profile').update({ avatar_url: await rehost(profile.avatar_url) }).eq('id', profile.id)
  }

  // projects.image_url
  const { data: projects } = await supabase.from('projects').select('id, image_url')
  for (const p of projects ?? []) {
    if (p.image_url?.startsWith(SOURCE_PREFIX)) {
      await supabase.from('projects').update({ image_url: await rehost(p.image_url) }).eq('id', p.id)
    }
  }

  // project_images.url
  const { data: images } = await supabase.from('project_images').select('id, url')
  for (const img of images ?? []) {
    if (img.url.startsWith(SOURCE_PREFIX)) {
      await supabase.from('project_images').update({ url: await rehost(img.url) }).eq('id', img.id)
    }
  }

  console.log(`Done — ${rehosted.size} file(s) rehosted.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
