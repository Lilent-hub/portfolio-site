'use client'

import { useActionState } from 'react'
import { TrashIcon } from '@/components/icons'
import type { Credential } from '@/lib/types'
import { deleteCredential, saveCredential } from '../actions'
import { ImageUploadField } from '../_components/ImageUploadField'
import { Card, ConfirmSubmit, Field, FormStatus, SubmitButton } from '../_components/ui'

export function CredentialForm({ credential, created }: { credential: Credential | null; created?: boolean }) {
  const [state, action] = useActionState(
    saveCredential,
    created ? { ok: true, message: 'Credential created.' } : null
  )
  const e = state?.errors ?? {}

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-6">
        {credential && <input type="hidden" name="id" value={credential.id} />}
        <Card className="flex flex-col gap-5">
          <Field label="Title" name="title" error={e.title}>
            <input id="title" name="title" defaultValue={credential?.title ?? ''} className="field" aria-invalid={!!e.title} required />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Issuer" name="issuer">
              <input id="issuer" name="issuer" defaultValue={credential?.issuer ?? ''} className="field" />
            </Field>
            <Field label="Date" name="date">
              <input id="date" name="date" type="date" defaultValue={credential?.date ?? ''} className="field" />
            </Field>
          </div>
          <Field label="Verify link" name="verify_url" hint="Optional — link to the issuer's verification page.">
            <input id="verify_url" name="verify_url" defaultValue={credential?.verify_url ?? ''} className="field" placeholder="https://" />
          </Field>
          <ImageUploadField
            name="image_url"
            label="Certificate image or PDF"
            accept="image/*,application/pdf"
            currentUrl={credential?.image_url}
            hint="Optional. Used as a thumbnail, or as the “View” link when there is no verify link."
          />
        </Card>
        <div className="flex items-center gap-4">
          <SubmitButton>{credential ? 'Save changes' : 'Create credential'}</SubmitButton>
          <FormStatus state={state} />
        </div>
      </form>

      {credential && (
        <form action={deleteCredential} className="flex items-center justify-between rounded-2xl border border-danger/20 p-4">
          <input type="hidden" name="id" value={credential.id} />
          <div>
            <p className="text-sm font-medium">Delete this credential</p>
            <p className="text-xs text-muted">Can’t be undone.</p>
          </div>
          <ConfirmSubmit message={`Delete “${credential.title}”?`}>
            <TrashIcon size={14} />
            Delete
          </ConfirmSubmit>
        </form>
      )}
    </div>
  )
}
