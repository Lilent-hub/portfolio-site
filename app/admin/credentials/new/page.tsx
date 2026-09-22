import { PageHeader } from '../../_components/ui'
import { CredentialForm } from '../CredentialForm'

export default function NewCredentialPage() {
  return (
    <>
      <PageHeader title="New credential" />
      <CredentialForm credential={null} />
    </>
  )
}
