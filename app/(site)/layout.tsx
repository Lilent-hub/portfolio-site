import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { getContact, getProfile } from '@/lib/data'

function initialsOf(name?: string | null) {
  if (!name) return 'JD'
  const parts = name.replace(/\b\w\.\s*/g, '').trim().split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')
}

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const [profile, contact] = await Promise.all([getProfile(), getContact()])
  return (
    <>
      <Nav email={contact?.email} initials={initialsOf(profile?.name).toUpperCase()} />
      <div className="flex-1">{children}</div>
      <Footer name={profile?.name} />
    </>
  )
}
