'use client'

import { useActionState } from 'react'
import { TrashIcon } from '@/components/icons'
import type { Stat } from '@/lib/types'
import { deleteStat, saveStat } from '../actions'
import { Card, ConfirmSubmit, Field, FormStatus, SubmitButton } from '../_components/ui'

export function StatForm({ stat }: { stat: Stat | null }) {
  const [state, action] = useActionState(saveStat, null)
  const e = state?.errors ?? {}

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-6">
        {stat && <input type="hidden" name="id" value={stat.id} />}
        <Card className="flex flex-col gap-5">
          <Field label="Number" name="value" error={e.value} hint="Short and punchy — “35”, “20,000+”, “100+”.">
            <input
              id="value"
              name="value"
              defaultValue={stat?.value ?? ''}
              className="field font-display text-lg"
              aria-invalid={!!e.value}
              required
            />
          </Field>
          <Field label="Label" name="label" error={e.label} hint="What the number measures.">
            <input
              id="label"
              name="label"
              defaultValue={stat?.label ?? ''}
              className="field"
              aria-invalid={!!e.label}
              placeholder="e.g. Trailhead badges earned"
              required
            />
          </Field>
        </Card>
        <div className="flex items-center gap-4">
          <SubmitButton>{stat ? 'Save changes' : 'Add stat'}</SubmitButton>
          <FormStatus state={state} />
        </div>
      </form>

      {stat && (
        <form action={deleteStat} className="flex items-center justify-between rounded-2xl border border-danger/20 p-4">
          <input type="hidden" name="id" value={stat.id} />
          <div>
            <p className="text-sm font-medium">Remove this stat</p>
            <p className="text-xs text-muted">Can’t be undone.</p>
          </div>
          <ConfirmSubmit message={`Remove “${stat.label}”?`}>
            <TrashIcon size={14} />
            Remove
          </ConfirmSubmit>
        </form>
      )}
    </div>
  )
}
