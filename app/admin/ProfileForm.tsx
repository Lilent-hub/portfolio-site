'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import type { Profile } from '@/lib/types'
import { updateProfile } from './actions'
import { ImageUploadField } from './_components/ImageUploadField'
import { Card, Field, FormStatus, SubmitButton } from './_components/ui'

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateProfile, null)
  const e = state?.errors ?? {}

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={profile.id} />

      <Card className="flex flex-col gap-5">
        <h2 className="font-display text-base font-semibold">Hero</h2>
        <ImageUploadField
          name="avatar_url"
          label="Photo"
          currentUrl={profile.avatar_url}
          shape="circle"
          hint="Square photo works best — it's shown in a circle."
        />
        <Field label="Name" name="name" error={e.name}>
          <input id="name" name="name" defaultValue={profile.name} className="field" aria-invalid={!!e.name} required />
        </Field>
        <Field label="Headline" name="headline" hint="Shown as a badge above your name, e.g. “Virtual Assistant (Admin & CRM Support)”.">
          <input id="headline" name="headline" defaultValue={profile.headline ?? ''} className="field" />
        </Field>
        <Field label="Tagline" name="tagline" hint="One sentence under your name.">
          <input id="tagline" name="tagline" defaultValue={profile.tagline ?? ''} className="field" />
        </Field>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="font-display text-base font-semibold">About</h2>
        <Field label="Bio" name="bio" hint="Separate paragraphs with a blank line.">
          <textarea id="bio" name="bio" defaultValue={profile.bio ?? ''} rows={8} className="field resize-y" />
        </Field>
        <Field label="Highlights" name="highlights" hint="One per line. Shown in the hero and the “What you can count on” card.">
          <textarea
            id="highlights"
            name="highlights"
            defaultValue={profile.highlights?.join('\n') ?? ''}
            rows={4}
            className="field resize-y"
          />
        </Field>
        <p className="text-xs text-muted">
          Tools &amp; logos live under{' '}
          <Link href="/admin/skills" className="text-accent hover:underline">
            Skills
          </Link>
          ; the stat block under{' '}
          <Link href="/admin/stats" className="text-accent hover:underline">
            By the numbers
          </Link>
          .
        </p>
      </Card>

      <Card className="flex flex-col gap-5">
        <div>
          <h2 className="font-display text-base font-semibold">Section text</h2>
          <p className="mt-1 text-xs text-muted">
            The supporting lines under each section heading on the home page.
          </p>
        </div>
        <Field label="Skills section intro" name="skills_lede">
          <textarea id="skills_lede" name="skills_lede" defaultValue={profile.skills_lede ?? ''} rows={2} className="field resize-y" />
        </Field>
        <Field label="Competencies" name="competencies" hint="Comma-separated. Shown as an “Also:” line under the tool strip.">
          <input id="competencies" name="competencies" defaultValue={profile.competencies?.join(', ') ?? ''} className="field" />
        </Field>
        <Field label="Projects section intro" name="projects_lede">
          <textarea id="projects_lede" name="projects_lede" defaultValue={profile.projects_lede ?? ''} rows={2} className="field resize-y" />
        </Field>
        <Field label="Contact heading" name="contact_heading">
          <input id="contact_heading" name="contact_heading" defaultValue={profile.contact_heading ?? ''} className="field" />
        </Field>
        <Field label="Contact intro" name="contact_lede">
          <textarea id="contact_lede" name="contact_lede" defaultValue={profile.contact_lede ?? ''} rows={2} className="field resize-y" />
        </Field>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="font-display text-base font-semibold">Search &amp; sharing</h2>
        <p className="text-sm text-muted">
          Your browser tab, Google result, and link previews are built from the fields above:
        </p>
        <p className="rounded-lg border border-line bg-bg/60 p-3 text-sm">
          <span className="block font-medium text-accent">
            {profile.name}
            {profile.headline ? ` — ${profile.headline}` : ''}
          </span>
          <span className="block text-muted">{profile.tagline ?? 'No tagline set.'}</span>
        </p>
        <p className="text-xs text-muted">Save to update it everywhere.</p>
      </Card>

      <div className="flex items-center gap-4">
        <SubmitButton>Save profile</SubmitButton>
        <FormStatus state={state} />
      </div>
    </form>
  )
}
