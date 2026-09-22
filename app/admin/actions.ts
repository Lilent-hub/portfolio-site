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
  // The browser uploads the image itself and sends back only the URL
  const avatarUrl = (formData.get('avatar_url') as string) || null

  await supabase
    .from('profile')
    .update({
      name: formData.get('name'),
      headline: formData.get('headline'),
      bio: formData.get('bio'),
      skills,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
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
  const imageUrl = (formData.get('image_url') as string) || null

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
  const imageUrl = (formData.get('image_url') as string) || null

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
