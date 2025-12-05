import { createClient } from '@/lib/supabase-server'
import ProjectsList from '@/app/[lng]/dashboard/projects/components/ProjectsList'

export default async function ProjectsPage({ params }) {
  const { lng } = await params
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">Manage and view all your projects</p>
      </div>

      {/* Projects List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Projects</h2>
        <ProjectsList projects={projects} error={error} lng={lng} />
      </div>
    </div>
  )
}