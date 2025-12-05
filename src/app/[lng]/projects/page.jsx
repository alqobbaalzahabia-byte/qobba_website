import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'
import { HiArrowLongDown } from "react-icons/hi2";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useTranslation } from '../../i18n/index'
import Link from 'next/link'

export default async function ProjectsPage({ params }) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  const displayedProjects = projects ? projects.slice(0, 8) : [];

  return (
    <div className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative">
      <main className="pt-[50px] pb-16">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">

          <section className="relative mb-8">
            <h1 className="font-bold text-[#FAB000] text-[32px] sm:text-[40px]">
              {t('projects.title')}
            </h1>
          </section>

          <section className="relative mt-8">
            {error ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-red-500 text-lg">{t('projects.error')}</p>
              </div>
            ) : projects?.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 text-lg">{t('projects.noProjects')}</p>
              </div>
            ) : (
              <>
                <div className="pb-20 projects-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                 
                  {displayedProjects.map((project) => (
                 <Link href={`/${lng}/contact`} key={project.id}>
                    <div
                      key={project.id}
                      className="w-full bg-white rounded-2xl overflow-hidden transition-transform hover:scale-105 cursor-pointer border border-gray-200 p-3"
                      style={{
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden rounded-t-2xl">
                        <Image
                          src={project.image}
                          alt={project.title?.[lng] || t('projects.projectName')}
                          width={300}
                          height={220}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4 flex flex-col items-center justify-center text-center">
                        <h3 className="font-bold text-[#676767] text-[16px] sm:text-[18px] mb-2 leading-tight">
                          {project.title?.[lng] || t('projects.projectName')}
                        </h3>
                        
                        <p className="text-[#999999] text-[14px] font-medium">
                          {project.description?.[lng] ||t('projects.latestWork')}
                        </p>
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>

                {projects.length > 8 && (
                  <div className="flex justify-center mt-8">
                      <Button
                        variant="ghost"
                        className="cursor-pointer border border-solid border-gray-400 px-4 sm:px-[100px] py-2 h-auto flex items-center justify-center gap-2 rounded-lg hover:bg-transparent"
                      >
                        <span className="font-medium text-gray-500 text-lg">
                          {t('projects.showMore')}
                        </span>
                        <HiArrowLongDown className="text-gray-500 text-lg" />
                      </Button>
                  </div>
                )}
              </>
            )}

          </section>
        </div>
      </main>
    </div>
  );
}