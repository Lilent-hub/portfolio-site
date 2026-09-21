'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function revalidate() {
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const skills = (formData.get('skills') as string)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  await supabase
    .from('profile')
    .update({
      name: formData.get('name'),
      headline: formData.get('headline'),
      bio: formData.get('bio'),
      skills,
      updated_at: new Date().toISOString(),
    })
    .eq('id', formData.get('id'))

  revalidate()
}

export async function updateContact(formData: FormData) {
  const supabase = await createClient()

  await supabase
    .from('contact')
    .update({
      email: formData.get('email'),
      linkedin_url: formData.get('linkedin_url'),
      updated_at: new Date().toISOString(),
    })
    .eq('id', formData.get('id'))

  revalidate()
}

export async function addProject(formData: FormData) {
  const supabase = await createClient()
  const imageUrl = await uploadIfPresent(supabase, formData.get('image') as File)

  await supabase.from('projects').insert({
    title: formData.get('title'),
    description: formData.get('description'),
    link_url: formData.get('link_url') || null,
    image_url: imageUrl,
    sort_order: Number(formData.get('sort_order')) || 0,
  })

  revalidate()
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('projects').delete().eq('id', formData.get('id'))
  revalidate()
}

export async function addCredential(formData: FormData) {
  const supabase = await createClient()
  const imageUrl = await uploadIfPresent(supabase, formData.get('image') as File)

  await supabase.from('credentials').insert({
    title: formData.get('title'),
    issuer: formData.get('issuer'),
    date: formData.get('date') || null,
    verify_url: formData.get('verify_url') || null,
    image_url: imageUrl,
    sort_order: Number(formData.get('sort_order')) || 0,
  })

  revalidate()
}

export async function deleteCredential(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('credentials').delete().eq('id', formData.get('id'))
  revalidate()
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

async function uploadIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null
) {
  if (!file || file.size === 0) return null
  const path = `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('portfolio-media').upload(path, file)
  if (error) return null
  return supabase.storage.from('portfolio-media').getPublicUrl(path).data.publicUrl
}
