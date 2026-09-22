import { PageHeader } from '../../_components/ui'
import { SkillForm } from '../SkillForm'

export default function NewSkillPage() {
  return (
    <>
      <PageHeader title="Add skill" description="It appears at the end of the strip; reorder from the Skills page." />
      <SkillForm skill={null} />
    </>
  )
}
