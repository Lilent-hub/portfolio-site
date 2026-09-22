import { createClient } from '@/lib/supabase/server'
import type { Contact, Credential, Profile, Project } from '@/lib/types'
import {
  updateProfile,
  updateContact,
  addProject,
  deleteProject,
  addCredential,
  deleteCredential,
  logout,
} from './actions'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profile').select('*').single<Profile>()
  const { data: contact } = await supabase.from('contact').select('*').single<Contact>()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order')
    .returns<Project[]>()
  const { data: credentials } = await supabase
    .from('credentials')
    .select('*')
    .order('sort_order')
    .returns<Credential[]>()

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-gray-600">Signed in as {user?.email}</p>
        </div>
        <form action={logout}>
          <button className="text-sm underline">Sign out</button>
        </form>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 font-medium">Profile & Skills</h2>
        <form action={updateProfile} encType="multipart/form-data" className="flex flex-col gap-3">
          <input type="hidden" name="id" value={profile?.id} />
          <div className="flex items-center gap-4">
            {profile?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt="Current profile picture"
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <label className="flex flex-col gap-1 text-sm">
              Profile picture
              <input name="avatar" type="file" accept="image/*" className="text-sm" />
            </label>
          </div>
          <input name="name" defaultValue={profile?.name} placeholder="Name" className="border rounded px-3 py-2" />
          <input name="headline" defaultValue={profile?.headline ?? ''} placeholder="Headline" className="border rounded px-3 py-2" />
          <textarea name="bio" defaultValue={profile?.bio ?? ''} placeholder="Bio" rows={4} className="border rounded px-3 py-2" />
          <input
            name="skills"
            defaultValue={profile?.skills?.join(', ')}
            placeholder="Skills, comma-separated"
            className="border rounded px-3 py-2"
          />
          <button className="self-start rounded bg-black px-4 py-2 text-white">Save</button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-medium">Contact</h2>
        <form action={updateContact} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={contact?.id} />
          <input name="email" defaultValue={contact?.email ?? ''} placeholder="Email" className="border rounded px-3 py-2" />
          <input
            name="linkedin_url"
            defaultValue={contact?.linkedin_url ?? ''}
            placeholder="LinkedIn URL"
            className="border rounded px-3 py-2"
          />
          <button className="self-start rounded bg-black px-4 py-2 text-white">Save</button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-medium">Projects</h2>
        <form action={addProject} encType="multipart/form-data" className="mb-6 flex flex-col gap-2 border p-4 rounded">
          <input name="title" placeholder="Title" required className="border rounded px-3 py-2" />
          <textarea name="description" placeholder="Description" className="border rounded px-3 py-2" />
          <input name="link_url" placeholder="Link (optional)" className="border rounded px-3 py-2" />
          <input name="sort_order" type="number" placeholder="Order (lower = first)" className="border rounded px-3 py-2" />
          <input name="image" type="file" accept="image/*" className="text-sm" />
          <button className="self-start rounded bg-black px-4 py-2 text-white">Add project</button>
        </form>
        <ul className="flex flex-col gap-2">
          {projects?.map((p) => (
            <li key={p.id} className="flex items-center justify-between border-b pb-2">
              <span>{p.title}</span>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-sm text-red-600 underline">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-medium">Credentials</h2>
        <form action={addCredential} encType="multipart/form-data" className="mb-6 flex flex-col gap-2 border p-4 rounded">
          <input name="title" placeholder="Title" required className="border rounded px-3 py-2" />
          <input name="issuer" placeholder="Issuer" className="border rounded px-3 py-2" />
          <input name="date" type="date" className="border rounded px-3 py-2" />
          <input name="verify_url" placeholder="Verify link (optional)" className="border rounded px-3 py-2" />
          <input name="sort_order" type="number" placeholder="Order (lower = first)" className="border rounded px-3 py-2" />
          <input name="image" type="file" accept="image/*,application/pdf" className="text-sm" />
          <button className="self-start rounded bg-black px-4 py-2 text-white">Add credential</button>
        </form>
        <ul className="flex flex-col gap-2">
          {credentials?.map((c) => (
            <li key={c.id} className="flex items-center justify-between border-b pb-2">
              <span>{c.title}</span>
              <form action={deleteCredential}>
                <input type="hidden" name="id" value={c.id} />
                <button className="text-sm text-red-600 underline">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
