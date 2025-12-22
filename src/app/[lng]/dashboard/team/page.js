import { createClient } from '@/lib/supabase-server'
import TeamList from '@/app/[lng]/dashboard/team/components/TeamList'

export default async function TeamPage({ params }) {
  const { lng } = await params
  const supabase = await createClient()

  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .order('id', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
        <p className="text-gray-600">Manage and view all your team members</p>
      </div>

      {/* Team List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Team Members</h2>
        <TeamList team={team} error={error} lng={lng} />
      </div>
    </div>
  )
}