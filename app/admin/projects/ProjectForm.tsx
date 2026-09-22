'use client'

import { useActionState, useState } from 'react'
import { ExternalIcon, TrashIcon } from '@/components/icons'
import { slugify } from '@/lib/slug'
import type { ProjectWithImages } from '@/lib/types'
import { deleteProject, saveProject } from '../actions'
import { GalleryManager } from '../_components/GalleryManager'
import { ImageUploadField } from '../_components/ImageUploadField'
import { Card, ConfirmSubmit, Field, FormStatus, SubmitButton } from '../_components/ui'

export function ProjectForm({ project, created }: { project: ProjectWithImages | null; created?: boolean }) {
  const [state, action] = useActionState(saveProject, created ? { ok: true, message: 'Project created.' } : null)
  const e = state?.errors ?? {}
  const [title, setTitle] = useState(project?.title ?? '')
  const [slug, setSlug] = useState(project?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!project)

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-6">
        {project && <input type="hidden" name="id" value={project.id} />}

        <Card className="flex flex-col gap-5">
          <h2 className="font-display text-base font-semibold">Basics</h2>
          <Field label="Title" name="title" error={e.title}>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(ev) => {
                setTitle(ev.target.value)
                if (!slugTouched) setSlug(slugify(ev.target.value))
              }}
              className="field"
              aria-invalid={!!e.title}
              required
            />
          </Field>
          <Field label="Slug" name="slug" error={e.slug} hint={`Public URL: /projects/${slug || '…'}`}>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(ev) => {
                setSlugTouched(true)
                setSlug(slugify(ev.target.value))
              }}
              className="field font-mono text-xs"
              aria-invalid={!!e.slug}
            />
          </Field>
          <Field label="Description" name="description">
            <textarea
              id="description"
              name="description"
              defaultValue={project?.description ?? ''}
              rows={6}
              className="field resize-y"
            />
          </Field>
          <Field label="Tags" name="tags" hint="Comma-separated, e.g. Google Sheets, Salesforce, Data Management">
            <input id="tags" name="tags" defaultValue={project?.tags.join(', ') ?? ''} className="field" />
          </Field>
          <Field label="External link" name="link_url" hint="Optional — shows an “Open project” button on the project page.">
            <input id="link_url" name="link_url" defaultValue={project?.link_url ?? ''} className="field" placeholder="https://" />
          </Field>
        </Card>

        <Card className="flex flex-col gap-5">
          <h2 className="font-display text-base font-semibold">Images</h2>
          <ImageUploadField
            name="image_url"
            label="Card thumbnail"
            currentUrl={project?.image_url}
            shape="wide"
            hint="Shown on the home page card. Falls back to the first screenshot if empty."
          />
          <GalleryManager
            name="images"
            initial={project?.images.map((i) => ({ url: i.url, caption: i.caption ?? '' })) ?? []}
          />
        </Card>

        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton>{project ? 'Save changes' : 'Create project'}</SubmitButton>
          {project && (
            <a
              href={`/projects/${project.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
            >
              View page
              <ExternalIcon size={14} />
            </a>
          )}
          <FormStatus state={state} />
        </div>
      </form>

      {project && (
        <form action={deleteProject} className="flex items-center justify-between rounded-2xl border border-danger/20 p-4">
          <input type="hidden" name="id" value={project.id} />
          <div>
            <p className="text-sm font-medium">Delete this project</p>
            <p className="text-xs text-muted">Removes the page and its screenshots from the site. Can’t be undone.</p>
          </div>
          <ConfirmSubmit message={`Delete “${project.title}”? This can’t be undone.`}>
            <TrashIcon size={14} />
            Delete
          </ConfirmSubmit>
        </form>
      )}
    </div>
  )
}
