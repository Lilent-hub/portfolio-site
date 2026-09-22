import { createClient } from '@/lib/supabase/server'
import type {
  Contact,
  Credential,
  Profile,
  Project,
  ProjectImage,
  ProjectWithImages,
  Skill,
} from '@/lib/types'

export async function getSkills() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order')
    .order('created_at')
    .returns<Skill[]>()
  return data ?? []
}

export async function getSkillById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('skills').select('*').eq('id', id).maybeSingle<Skill>()
  return data
}

export async function getProfile() {
  const supabase = await createClient()
  const { data } = await supabase.from('profile').select('*').single<Profile>()
  return data
}

export async function getContact() {
  const supabase = await createClient()
  const { data } = await supabase.from('contact').select('*').single<Contact>()
  return data
}

export async function getProjects() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order')
    .order('created_at')
    .returns<Project[]>()
  return data ?? []
}

export async function getCredentials() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('credentials')
    .select('*')
    .order('sort_order')
    .order('created_at')
    .returns<Credential[]>()
  return data ?? []
}

async function attachImages(project: Project | null): Promise<ProjectWithImages | null> {
  if (!project) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('sort_order')
    .returns<ProjectImage[]>()
  return { ...project, images: data ?? [] }
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<Project>()
  return attachImages(data)
}

export async function getProjectById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle<Project>()
  return attachImages(data)
}

export async function getCredentialById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('credentials')
    .select('*')
    .eq('id', id)
    .maybeSingle<Credential>()
  return data
}

/** Previous/next project in display order, wrapping around. */
export async function getAdjacentProjects(slug: string) {
  const projects = await getProjects()
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1 || projects.length < 2) return { prev: null, next: null }
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  }
}
