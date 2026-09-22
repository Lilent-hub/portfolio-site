import { notFound } from 'next/navigation'
import { getSkillById } from '@/lib/data'
import { PageHeader } from '../../_components/ui'
import { SkillForm } from '../SkillForm'

export default async function EditSkillPage({ params }: PageProps<'/admin/skills/[id]'>) {
  const { id } = await params
  const skill = await getSkillById(id)
  if (!skill) notFound()

  return (
    <>
      <PageHeader title={skill.name} />
      <SkillForm skill={skill} />
    </>
  )
}
