import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'
import { HiArrowLongDown } from "react-icons/hi2";
import { useTranslation } from '../../i18n/index'

export default async function ServicesPage({ params }) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  const supabase = await createClient();

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  
  const displayedServices = services ? services.slice(0, 8) : [];

  return (
    <div className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative">
      <main className="pt-[50px] pb-16">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">

          <section className="relative mb-8">
            <h1 className="font-bold text-[#572b0a] text-[32px] sm:text-[40px]">
              {t('services.title')}
            </h1>
          </section>

          <section className="relative mt-8">
            {error ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-red-500 text-lg">{t('services.error')}</p>
              </div>
            ) : services?.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 text-lg">{t('services.noServices')}</p>
              </div>
            ) : (
              <>
                <div className="pb-20 services-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                  {displayedServices.map((service) => (
                    <div
                      key={service.id}
                      className="w-full bg-white rounded-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer border border-[#e8e8e8] hover:shadow-lg"
                    >
                      <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden">
                        {service.image && (
                          <Image
                            src={service.image}
                            alt={service.title?.[lng] || t('services.serviceName')}
                            width={300}
                            height={220}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="p-4 flex flex-col items-center justify-center text-center">
                        <h3 className="font-bold text-[#572b0a] text-[16px] sm:text-[20px] mb-2 leading-tight">
                          {service.title?.[lng] || service.title}
                        </h3>
                        
                        <p className="text-[#666666] text-[12px] sm:text-[14px] leading-[16px]">
                          {service.description?.[lng] || service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {services.length > 8 && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="ghost"
                      className="cursor-pointer border border-solid border-gray-400 px-4 sm:px-[100px] py-2 h-auto flex items-center justify-center gap-2 rounded-lg hover:bg-transparent"
                    >
                      <span className="font-medium text-gray-500 text-lg">
                        {t('services.showMore')}
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