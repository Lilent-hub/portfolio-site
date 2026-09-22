/**
 * One-time helper: fetch brand logos for the imported skills, upload them to
 * Supabase Storage (portfolio-media/skills/), and set skills.icon_url.
 * Skips skills that already have a logo. Generic skills (Data Entry, …) get
 * none and render as initials until a logo is uploaded in /admin.
 *
 * Usage:  node scripts/seed-skill-logos.mts
 * Needs:  NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BUCKET = 'portfolio-media'

// name in DB → source URL. Simple Icons for most; Wikimedia Commons for the rest.
const SOURCES: Record<string, string> = {
  'Google Docs': 'https://cdn.simpleicons.org/googledocs/4285F4',
  'Google Sheets': 'https://cdn.simpleicons.org/googlesheets/34A853',
  'Google Calendar': 'https://cdn.simpleicons.org/googlecalendar/4285F4',
  Trello: 'https://cdn.simpleicons.org/trello/0052CC',
  Asana: 'https://cdn.simpleicons.org/asana/F06A6A',
  'Salesforce CRM': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
  'Monday.com': 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Monday_logo.svg',
  n8n: 'https://cdn.simpleicons.org/n8n/EA4B71',
  Supabase: 'https://cdn.simpleicons.org/supabase/3FCF8E',
  Vercel: 'https://cdn.simpleicons.org/vercel/000000',
}

function loadEnv() {
  try {
    for (const line of readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    // optional
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

  const { data: skills, error } = await supabase.from('skills').select('id, name, icon_url')
  if (error) throw error

  let done = 0
  for (const s of skills ?? []) {
    const src = SOURCES[s.name]
    if (!src || s.icon_url) continue

    const res = await fetch(src, { headers: { 'User-Agent': 'portfolio-site-seed/1.0' } })
    if (!res.ok) {
      console.warn(`✗ ${s.name}: ${res.status} from ${src}`)
      continue
    }
    const bytes = Buffer.from(await res.arrayBuffer())
    const type = res.headers.get('content-type')?.split(';')[0] ?? 'image/svg+xml'
    const ext = type.includes('svg') ? 'svg' : type.includes('png') ? 'png' : 'img'
    const path = `skills/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${ext}`

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: type, upsert: true, cacheControl: '31536000' })
    if (upErr) throw new Error(`Upload ${path}: ${upErr.message}`)

    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    const { error: dbErr } = await supabase.from('skills').update({ icon_url: publicUrl }).eq('id', s.id)
    if (dbErr) throw dbErr
    console.log(`✓ ${s.name}`)
    done++
  }
  console.log(`Done — ${done} logo(s) set.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
