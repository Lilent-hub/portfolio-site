import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/data'
import { PageHeader } from '../../_components/ui'
import { ProjectForm } from '../ProjectForm'

export default async function EditProjectPage({ params, searchParams }: PageProps<'/admin/projects/[id]'>) {
  const [{ id }, { created }] = await Promise.all([params, searchParams])
  const project = await getProjectById(id)
  if (!project) notFound()

  return (
    <>
      <PageHeader title={project.title} description="Edit the case study shown on the public site." />
      <ProjectForm project={project} created={created === '1'} />
    </>
  )
}
