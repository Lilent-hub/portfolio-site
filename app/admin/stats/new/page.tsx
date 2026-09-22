import { PageHeader } from '../../_components/ui'
import { StatForm } from '../StatForm'

export default function NewStatPage() {
  return (
    <>
      <PageHeader title="Add stat" />
      <StatForm stat={null} />
    </>
  )
}
