import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import { useTranslation } from '../../i18n/index'

export default async function TeamPage({ params }) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  const supabase = await createClient();

  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .order('id', { ascending: true });

  return (
    <div className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative">
      <main className="pt-[50px] pb-16">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">

          <section className="relative mb-8">
            <h1 className="font-bold text-[#572b0a] text-[32px] sm:text-[40px]">
              {t('team.title') || 'Our Team'}
            </h1>
            <p className="text-[#666666] mt-4 text-[14px] sm:text-[16px] max-w-3xl">
              {t('team.description') || 'Meet our dedicated team of professionals committed to delivering excellence'}
            </p>
          </section>

          <section className="relative mt-8">
            {error ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-red-500 text-lg">{t('team.error') || 'Error loading team members'}</p>
              </div>
            ) : team?.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 text-lg">{t('team.no_members') || 'No team members available'}</p>
              </div>
            ) : (
              <div className="pb-20 team-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {team?.map((member) => (
                  <div
                    key={member.id}
                    className="w-full max-w-[280px] bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border border-[#e8e8e8] cursor-pointer"
                  >
                    {member.image && (
                      <div className="relative w-full h-[280px] overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name?.[lng] || member.name || 'Team Member'}
                          width={280}
                          height={280}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-4 text-center bg-white">
                      <h3 className="text-xl font-bold text-[#572b0a] mb-1 transition-colors duration-300">
                        {member.name?.[lng] || member.name}
                      </h3>
                      <p className="text-[14px] text-[#999999] transition-colors duration-300">
                        {member.position?.[lng] || member.position}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}