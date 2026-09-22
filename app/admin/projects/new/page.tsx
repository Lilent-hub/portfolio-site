import { PageHeader } from '../../_components/ui'
import { ProjectForm } from '../ProjectForm'

export default function NewProjectPage() {
  return (
    <>
      <PageHeader title="New project" description="It appears at the end of the list; reorder from the Projects page." />
      <ProjectForm project={null} />
    </>
  )
}
