import { createClient } from '@/lib/supabase-server'
import ServicesList from '@/app/[lng]/dashboard/services/components/ServicesList'
import { useTranslation } from '@/app/i18n/index'

export default async function ServicesPage({ params }) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  const supabase = await createClient()

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('services.title')}</h1>
      </div>

      {/* Services List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <ServicesList services={services} error={error} lng={lng} />
      </div>
    </div>
  )
}

