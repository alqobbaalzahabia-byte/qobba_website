import { createClient } from '@/lib/supabase-server'
import LegalManagement from '@/app/[lng]/dashboard/legal/components/LegalManagement'

export default async function LegalPage({ params }) {
  const { lng } = await params
  const supabase = await createClient()

  const { data: terms, error: termsError } = await supabase
    .from('terms')
    .select('*')
    .order('id', { ascending: true })

  const { data: privacy, error: privacyError } = await supabase
    .from('privacy')
    .select('*')
    .order('id', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Management</h1>
        <p className="text-gray-600">Manage Terms & Conditions and Privacy Policy</p>
      </div>

      <LegalManagement 
        terms={terms}
        privacy={privacy}
        termsError={termsError}
        privacyError={privacyError}
        lng={lng} 
      />
    </div>
  )
}