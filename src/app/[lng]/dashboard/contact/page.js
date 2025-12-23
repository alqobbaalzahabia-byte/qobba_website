import { createClient } from '@/lib/supabase-server'
import ContactManagement from '@/app/[lng]/dashboard/contact/components/ContactManagement'

export default async function ContactPage({ params }) {
  const { lng } = await params
  const supabase = await createClient()

  // Fetch contact information
  const { data: contactInfo, error: contactError } = await supabase
    .from('contact_info')
    .select('*')
    .order('key', { ascending: true })

  // Fetch contact messages
  const { data: messages, error: messagesError } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  // Count unread messages
  const unreadCount = messages?.filter(msg => !msg.is_read).length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Management</h1>
        <p className="text-gray-600">Manage contact information and customer messages</p>
        {unreadCount > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-blue-800">
              {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <ContactManagement 
        contactInfo={contactInfo} 
        messages={messages}
        contactError={contactError}
        messagesError={messagesError}
        lng={lng} 
      />
    </div>
  )
}