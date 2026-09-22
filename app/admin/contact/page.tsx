import { getContact } from '@/lib/data'
import { PageHeader } from '../_components/ui'
import { ContactForm } from './ContactForm'

export default async function AdminContactPage() {
  const contact = await getContact()
  if (!contact) {
    return <p className="text-muted">No contact row found. Create one in Supabase first.</p>
  }
  return (
    <>
      <PageHeader title="Contact" description="Email and social links used in the nav, hero, and contact card." />
      <ContactForm contact={contact} />
    </>
  )
}
