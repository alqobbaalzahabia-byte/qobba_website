import { createClient } from '@/lib/supabase-server'
import { useTranslation } from '@/app/i18n/index'
import { FaFolder, FaTools, FaUsers } from 'react-icons/fa'

export default async function DashboardPage({ params }) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  const supabase = await createClient()

  // Fetch counts
  const [projects, services, teams, clients] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
  ])

  const totals = {
    projects: projects.count || 0,
    services: services.count || 0,
    teams: teams.count || 0,
    clients: clients.count || 0
  }

  const statsConfig = [
    {
      title: t('dashboard.totalProjects'),
      value: totals.projects,
      icon: FaFolder
    },
    {
      title: t('dashboard.totalTeams'),
      value: totals.teams,
      icon: FaUsers
    },
    {
      title: t('dashboard.totalServices'),
      value: totals.services,
      icon: FaTools
    },
    {
      title: t('dashboard.totalClients'),
      value: totals.clients,
      icon: FaUsers
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-600">{t('dashboard.welcome')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {statsConfig.map((item, index) => {
          const IconComponent = item.icon
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.value.toLocaleString()}
                  </p>
                </div>
                <div className="text-3xl text-gray-600">
                  <IconComponent />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.recentActivity')}</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-[#FAB000] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('dashboard.newUserRegistered')}</p>
              <p className="text-sm text-gray-600">{t('dashboard.hoursAgo', { count: 2 })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-[#FAB000] rounded-full flex items-center justify-center text-white font-bold">
              B
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('dashboard.projectCompleted')}</p>
              <p className="text-sm text-gray-600">{t('dashboard.hoursAgo', { count: 5 })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FAB000] rounded-full flex items-center justify-center text-white font-bold">
              C
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('dashboard.paymentReceived')}</p>
              <p className="text-sm text-gray-600">{t('dashboard.dayAgo')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

