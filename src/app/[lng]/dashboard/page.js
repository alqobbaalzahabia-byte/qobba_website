import { createClient } from '@/lib/supabase-server'

export default async function DashboardPage({ params }) {
  const { lng } = await params
  const supabase = await createClient()

  // Fetch counts from Supabase
  const [projectsResult, servicesResult, blogsResult, clientsResult] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true })
  ])

  const totalProjects = projectsResult.count || 0
  const totalServices = servicesResult.count || 0
  const totalBlogs = blogsResult.count || 0
  const totalClients = clientsResult.count || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjects.toLocaleString()}</p>
            </div>
            <div className="text-3xl">📁</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{totalBlogs.toLocaleString()}</p>
            </div>
            <div className="text-3xl">📰</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{totalServices.toLocaleString()}</p>
            </div>
            <div className="text-3xl">🛠️</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{totalClients.toLocaleString()}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-[#FAB000] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">New user registered</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-[#FAB000] rounded-full flex items-center justify-center text-white font-bold">
              B
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Project completed</p>
              <p className="text-sm text-gray-600">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FAB000] rounded-full flex items-center justify-center text-white font-bold">
              C
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Payment received</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

