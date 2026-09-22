'use client'

import { useActionState } from 'react'
import { TrashIcon } from '@/components/icons'
import type { Skill } from '@/lib/types'
import { deleteSkill, saveSkill } from '../actions'
import { ImageUploadField } from '../_components/ImageUploadField'
import { Card, ConfirmSubmit, Field, FormStatus, SubmitButton } from '../_components/ui'

export function SkillForm({ skill }: { skill: Skill | null }) {
  const [state, action] = useActionState(saveSkill, null)
  const e = state?.errors ?? {}

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-6">
        {skill && <input type="hidden" name="id" value={skill.id} />}
        <Card className="flex flex-col gap-5">
          <Field label="Name" name="name" error={e.name}>
            <input
              id="name"
              name="name"
              defaultValue={skill?.name ?? ''}
              className="field"
              aria-invalid={!!e.name}
              placeholder="e.g. Google Sheets"
              required
            />
          </Field>
          <ImageUploadField
            name="icon_url"
            label="Logo"
            accept="image/*,.svg"
            currentUrl={skill?.icon_url}
            shape="circle"
            hint="SVG or PNG with a transparent background works best. Leave empty to show initials."
          />
        </Card>
        <div className="flex items-center gap-4">
          <SubmitButton>{skill ? 'Save changes' : 'Add skill'}</SubmitButton>
          <FormStatus state={state} />
        </div>
      </form>

      {skill && (
        <form action={deleteSkill} className="flex items-center justify-between rounded-2xl border border-danger/20 p-4">
          <input type="hidden" name="id" value={skill.id} />
          <div>
            <p className="text-sm font-medium">Remove this skill</p>
            <p className="text-xs text-muted">Takes it out of the logo strip. Can’t be undone.</p>
          </div>
          <ConfirmSubmit message={`Remove “${skill.name}”?`}>
            <TrashIcon size={14} />
            Remove
          </ConfirmSubmit>
        </form>
      )}
    </div>
  )
}
