export type Profile = {
  id: string
  name: string
  headline: string | null
  bio: string | null
  skills: string[] | null
  resume_url: string | null
  updated_at: string
}

export type Project = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  link_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

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
  linkedin_url: string | null
  updated_at: string
}
