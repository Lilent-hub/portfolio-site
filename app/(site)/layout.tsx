import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { getContact, getProfile } from '@/lib/data'

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const [profile, contact] = await Promise.all([getProfile(), getContact()])
  return (
    <>
      <Nav email={contact?.email} />
      <div className="flex-1">{children}</div>
      <Footer name={profile?.name} />
    </>
  )
}
