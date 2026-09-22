import { getProfile } from '@/lib/data'
import { ProfileForm } from './ProfileForm'
import { PageHeader } from './_components/ui'

export default async function AdminProfilePage() {
  const profile = await getProfile()
  if (!profile) {
    return <p className="text-muted">No profile row found. Create one in Supabase first.</p>
  }
  return (
    <>
      <PageHeader title="Profile" description="Hero, about section, and skills on the home page." />
      <ProfileForm profile={profile} />
    </>
  )
}
