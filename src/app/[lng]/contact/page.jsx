import { createClient } from '@/lib/supabase-server'
import ContactPageClient from './ContactPageClient'

export default async function ContactPage({ params }) {
  const { lng } = await params
  const supabase = await createClient();

  const { data: contactInfo, error } = await supabase
    .from('contact_info')
    .select('*');

  const contactData = contactInfo?.reduce((acc, item) => {
    acc[item.key] = {
      value: item.value,
      label: item.label
    };
    return acc;
  }, {}) || {};

  return <ContactPageClient lng={lng} contactData={contactData} />;
}