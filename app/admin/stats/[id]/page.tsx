import { notFound } from 'next/navigation'
import { getStatById } from '@/lib/data'
import { PageHeader } from '../../_components/ui'
import { StatForm } from '../StatForm'

export default async function EditStatPage({ params }: PageProps<'/admin/stats/[id]'>) {
  const { id } = await params
  const stat = await getStatById(id)
  if (!stat) notFound()

  return (
    <>
      <PageHeader title={`${stat.value} — ${stat.label}`} />
      <StatForm stat={stat} />
    </>
  )
}
