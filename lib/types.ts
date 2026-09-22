export type Profile = {
  id: string
  name: string
  headline: string | null
  tagline: string | null
  bio: string | null
  highlights: string[]
  competencies: string[]
  skills_lede: string | null
  projects_lede: string | null
  contact_heading: string | null
  contact_lede: string | null
  avatar_url: string | null
  resume_url: string | null
  updated_at: string
}

export type Stat = {
  id: string
  value: string
  label: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type Skill = {
  id: string
  name: string
  icon_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  slug: string
  title: string
  description: string | null
  tags: string[]
  image_url: string | null
  link_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type ProjectImage = {
  id: string
  project_id: string
  url: string
  caption: string | null
  sort_order: number
}

export type ProjectWithImages = Project & { images: ProjectImage[] }

export type Credential = {
  id: string
  title: string
  issuer: string | null
  date: string | null
  image_url: string | null
  verify_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type Contact = {
  id: string
  email: string | null
  github_url: string | null
  linkedin_url: string | null
  updated_at: string
}

/** Shape every admin server action returns to `useActionState`. */
export type ActionState = {
  ok: boolean
  message: string
  errors?: Record<string, string>
} | null
