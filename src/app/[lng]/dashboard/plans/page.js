import { createClient } from '@/lib/supabase-server'
import PlansList from '@/app/[lng]/dashboard/plans/components/PlansList'

export default async function PlansPage({ params }) {
  const { lng } = await params
  const supabase = await createClient()

  const { data: plans, error } = await supabase
    .from('plans')
    .select('*')
    .order('display_order', { ascending: true })
console.log('dataaaa    ',error)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plans Management</h1>
        <p className="text-gray-600">Manage pricing plans and packages</p>
      </div>

      {/* Plans List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <PlansList plans={plans} error={error} lng={lng} />
      </div>
    </div>
  )
}