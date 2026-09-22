import { notFound } from 'next/navigation'
import { getCredentialById } from '@/lib/data'
import { PageHeader } from '../../_components/ui'
import { CredentialForm } from '../CredentialForm'

export default async function EditCredentialPage({ params, searchParams }: PageProps<'/admin/credentials/[id]'>) {
  const [{ id }, { created }] = await Promise.all([params, searchParams])
  const credential = await getCredentialById(id)
  if (!credential) notFound()

  return (
    <>
      <PageHeader title={credential.title} />
      <CredentialForm credential={credential} created={created === '1'} />
    </>
  )
}
