import { createClient } from '@/lib/supabase-server'
import ServicesList from '@/app/[lng]/dashboard/services/components/ServicesList'

export default async function ServicesPage({ params }) {
  const { lng } = await params
  const supabase = await createClient()

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Services</h1>
        <p className="text-gray-600">Manage and view all your services</p>
      </div>

      {/* Services List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Services</h2>
        <ServicesList services={services} error={error} lng={lng} />
      </div>
    </div>
  )
}

