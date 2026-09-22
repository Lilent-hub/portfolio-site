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
          .
        </p>
      </Card>

      <div className="flex items-center gap-4">
        <SubmitButton>Save profile</SubmitButton>
        <FormStatus state={state} />
      </div>
    </form>
  )
}
