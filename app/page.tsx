import { createClient } from '@/lib/supabase/server'
import type { Contact, Credential, Profile, Project } from '@/lib/types'

export default async function Home() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profile').select('*').single<Profile>()
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
  const { data: contact } = await supabase.from('contact').select('*').single<Contact>()

  return (
    <main className="mx-auto max-w-3xl px-6">
      <section className="flex min-h-[70vh] flex-col justify-center gap-4">
        {profile?.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="h-32 w-32 rounded-full object-cover"
          />
        )}
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          {profile?.name}
        </h1>
        <p className="text-xl text-gray-600">{profile?.headline}</p>
      </section>

      <section id="about" className="py-16">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          About
        </h2>
        <p className="text-lg leading-relaxed">{profile?.bio}</p>
      </section>

      <section id="skills" className="py-16">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Skills
        </h2>
        <ul className="flex flex-wrap gap-2">
          {profile?.skills?.map((skill: string) => (
            <li key={skill} className="rounded-full border px-3 py-1 text-sm">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section id="projects" className="py-16">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Projects
        </h2>
        <div className="flex flex-col gap-10">
          {projects?.map((project) => (
            <article key={project.id} className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              {project.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full rounded sm:w-48"
                />
              )}
              <div>
                <h3 className="text-lg font-medium">
                  {project.link_url ? (
                    <a href={project.link_url} target="_blank" rel="noreferrer" className="underline">
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="credentials" className="py-16">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Credentials
        </h2>
        <div className="flex flex-col gap-6">
          {credentials?.map((cred) => (
            <div key={cred.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">{cred.title}</p>
                <p className="text-sm text-gray-600">
                  {cred.issuer} {cred.date ? `· ${cred.date}` : ''}
                </p>
              </div>
              {cred.verify_url && (
                <a href={cred.verify_url} target="_blank" rel="noreferrer" className="text-sm underline">
                  Verify
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-16">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Contact
        </h2>
        <div className="flex gap-4">
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className="rounded bg-black px-4 py-2 text-white">
              Email me
            </a>
          )}
          {contact?.linkedin_url && (
            <a
              href={contact.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="rounded border px-4 py-2"
            >
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </main>
  )
}
