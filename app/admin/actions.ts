'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/slug'
import { createClient } from '@/lib/supabase/server'
import type { ActionState } from '@/lib/types'

function revalidate(extra: string[] = []) {
  revalidatePath('/', 'layout')
  revalidatePath('/admin', 'layout')
  extra.forEach((p) => revalidatePath(p))
}

const str = (fd: FormData, key: string) => ((fd.get(key) as string) ?? '').trim()
const orNull = (v: string) => (v === '' ? null : v)
const list = (v: string) =>
  v
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)

function normaliseUrl(v: string) {
  if (!v) return null
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}

/* ------------------------------------------------------------------ profile */

export async function updateProfile(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const name = str(fd, 'name')
  if (!name) return { ok: false, message: 'Please fix the highlighted fields.', errors: { name: 'Name is required.' } }

  const supabase = await createClient()
  const { error } = await supabase
    .from('profile')
    .update({
      name,
      headline: orNull(str(fd, 'headline')),
      tagline: orNull(str(fd, 'tagline')),
      bio: orNull(str(fd, 'bio')),
      highlights: str(fd, 'highlights')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      avatar_url: orNull(str(fd, 'avatar_url')),
      updated_at: new Date().toISOString(),
    })
    .eq('id', str(fd, 'id'))

  if (error) return { ok: false, message: error.message }
  revalidate()
  return { ok: true, message: 'Profile saved.' }
}

/* ------------------------------------------------------------------ contact */

export async function updateContact(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, 'email')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Please fix the highlighted fields.', errors: { email: 'That email doesn’t look right.' } }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('contact')
    .update({
      email: orNull(email),
      github_url: normaliseUrl(str(fd, 'github_url')),
      linkedin_url: normaliseUrl(str(fd, 'linkedin_url')),
      updated_at: new Date().toISOString(),
    })
    .eq('id', str(fd, 'id'))

  if (error) return { ok: false, message: error.message }
  revalidate()
  return { ok: true, message: 'Contact saved.' }
}

/* ----------------------------------------------------------------- projects */

type GalleryItem = { url: string; caption: string }

export async function saveProject(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = str(fd, 'id')
  const title = str(fd, 'title')
  const slug = slugify(str(fd, 'slug') || title)
  const errors: Record<string, string> = {}
  if (!title) errors.title = 'Title is required.'
  if (!slug) errors.slug = 'Slug is required.'
  if (Object.keys(errors).length) return { ok: false, message: 'Please fix the highlighted fields.', errors }

  let images: GalleryItem[] = []
  try {
    images = JSON.parse(str(fd, 'images') || '[]')
  } catch {
    return { ok: false, message: 'Gallery data was malformed. Reload and try again.' }
  }

  const supabase = await createClient()
  const payload = {
    title,
    slug,
    description: orNull(str(fd, 'description')),
    tags: list(str(fd, 'tags')),
    image_url: orNull(str(fd, 'image_url')) ?? images[0]?.url ?? null,
    link_url: normaliseUrl(str(fd, 'link_url')),
    updated_at: new Date().toISOString(),
  }

  let projectId = id
  if (id) {
    const { error } = await supabase.from('projects').update(payload).eq('id', id)
    if (error) return { ok: false, message: friendly(error.message) }
  } else {
    const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true })
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...payload, sort_order: (count ?? 0) + 1 })
      .select('id')
      .single<{ id: string }>()
    if (error || !data) return { ok: false, message: friendly(error?.message ?? 'Could not create project.') }
    projectId = data.id
  }

  // Replace the gallery wholesale — simplest way to honour reorder + captions.
  const { error: delErr } = await supabase.from('project_images').delete().eq('project_id', projectId)
  if (delErr) return { ok: false, message: delErr.message }
  if (images.length) {
    const { error: insErr } = await supabase.from('project_images').insert(
      images.map((img, i) => ({
        project_id: projectId,
        url: img.url,
        caption: orNull((img.caption ?? '').trim()),
        sort_order: i + 1,
      }))
    )
    if (insErr) return { ok: false, message: insErr.message }
  }

  revalidate([`/projects/${slug}`])
  if (!id) redirect(`/admin/projects/${projectId}?created=1`)
  return { ok: true, message: 'Project saved.' }
}

export async function deleteProject(fd: FormData) {
  const supabase = await createClient()
  await supabase.from('projects').delete().eq('id', str(fd, 'id'))
  revalidate()
  redirect('/admin/projects')
}

export async function moveProject(fd: FormData) {
  await moveRow('projects', str(fd, 'id'), Number(fd.get('dir')) as -1 | 1)
  revalidate()
}

/* -------------------------------------------------------------- credentials */

export async function saveCredential(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = str(fd, 'id')
  const title = str(fd, 'title')
  if (!title) return { ok: false, message: 'Please fix the highlighted fields.', errors: { title: 'Title is required.' } }

  const supabase = await createClient()
  const payload = {
    title,
    issuer: orNull(str(fd, 'issuer')),
    date: orNull(str(fd, 'date')),
    verify_url: normaliseUrl(str(fd, 'verify_url')),
    image_url: orNull(str(fd, 'image_url')),
    updated_at: new Date().toISOString(),
  }

  if (id) {
    const { error } = await supabase.from('credentials').update(payload).eq('id', id)
    if (error) return { ok: false, message: error.message }
    revalidate()
    return { ok: true, message: 'Credential saved.' }
  }

  const { count } = await supabase.from('credentials').select('*', { count: 'exact', head: true })
  const { data, error } = await supabase
    .from('credentials')
    .insert({ ...payload, sort_order: (count ?? 0) + 1 })
    .select('id')
    .single<{ id: string }>()
  if (error || !data) return { ok: false, message: error?.message ?? 'Could not create credential.' }
  revalidate()
  redirect(`/admin/credentials/${data.id}?created=1`)
}

export async function deleteCredential(fd: FormData) {
  const supabase = await createClient()
  await supabase.from('credentials').delete().eq('id', str(fd, 'id'))
  revalidate()
  redirect('/admin/credentials')
}

export async function moveCredential(fd: FormData) {
  await moveRow('credentials', str(fd, 'id'), Number(fd.get('dir')) as -1 | 1)
  revalidate()
}

/* ------------------------------------------------------------------- skills */

export async function saveSkill(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = str(fd, 'id')
  const name = str(fd, 'name')
  if (!name) return { ok: false, message: 'Please fix the highlighted fields.', errors: { name: 'Name is required.' } }

  const supabase = await createClient()
  const payload = { name, icon_url: orNull(str(fd, 'icon_url')), updated_at: new Date().toISOString() }

  if (id) {
    const { error } = await supabase.from('skills').update(payload).eq('id', id)
    if (error) return { ok: false, message: error.message }
    revalidate()
    return { ok: true, message: 'Skill saved.' }
  }

  const { count } = await supabase.from('skills').select('*', { count: 'exact', head: true })
  const { error } = await supabase.from('skills').insert({ ...payload, sort_order: (count ?? 0) + 1 })
  if (error) return { ok: false, message: error.message }
  revalidate()
  redirect('/admin/skills?created=1')
}

export async function deleteSkill(fd: FormData) {
  const supabase = await createClient()
  await supabase.from('skills').delete().eq('id', str(fd, 'id'))
  revalidate()
  redirect('/admin/skills')
}

export async function moveSkill(fd: FormData) {
  await moveRow('skills', str(fd, 'id'), Number(fd.get('dir')) as -1 | 1)
  revalidate()
}

/* -------------------------------------------------------------------- auth */

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/* ----------------------------------------------------------------- helpers */

/** Swap a row with its neighbour and renumber sort_order 1..n. */
async function moveRow(table: 'projects' | 'credentials' | 'skills', id: string, dir: -1 | 1) {
  const supabase = await createClient()
  const { data } = await supabase
    .from(table)
    .select('id')
    .order('sort_order')
    .order('created_at')
    .returns<{ id: string }[]>()
  const rows = data ?? []
  const i = rows.findIndex((r) => r.id === id)
  const j = i + dir
  if (i === -1 || j < 0 || j >= rows.length) return
  ;[rows[i], rows[j]] = [rows[j], rows[i]]
  await Promise.all(rows.map((r, idx) => supabase.from(table).update({ sort_order: idx + 1 }).eq('id', r.id)))
}

function friendly(msg: string) {
  if (msg.includes('projects_slug_key')) return 'That slug is already used by another project.'
  return msg
}
