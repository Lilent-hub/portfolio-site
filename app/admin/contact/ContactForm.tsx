'use client'

import { useActionState } from 'react'
import type { Contact } from '@/lib/types'
import { updateContact } from '../actions'
import { Card, Field, FormStatus, SubmitButton } from '../_components/ui'

export function ContactForm({ contact }: { contact: Contact }) {
  const [state, action] = useActionState(updateContact, null)
  const e = state?.errors ?? {}

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={contact.id} />
      <Card className="flex flex-col gap-5">
        <Field label="Email" name="email" error={e.email}>
          <input id="email" name="email" type="email" defaultValue={contact.email ?? ''} className="field" aria-invalid={!!e.email} />
        </Field>
        <Field label="GitHub URL" name="github_url" hint="Leave blank to hide the GitHub button.">
          <input id="github_url" name="github_url" defaultValue={contact.github_url ?? ''} className="field" placeholder="https://github.com/…" />
        </Field>
        <Field label="LinkedIn URL" name="linkedin_url">
          <input id="linkedin_url" name="linkedin_url" defaultValue={contact.linkedin_url ?? ''} className="field" placeholder="https://www.linkedin.com/in/…" />
        </Field>
      </Card>
      <div className="flex items-center gap-4">
        <SubmitButton>Save contact</SubmitButton>
        <FormStatus state={state} />
      </div>
    </form>
  )
}
