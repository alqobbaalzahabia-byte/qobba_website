import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import Button from '@/components/ui/Button'
import mainLogo from '@/../public/assets/main-logo.svg'
import SkeletonCard from "@/components/ui/SkeletonCard";
import { HiArrowLongDown } from "react-icons/hi2";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useTranslation } from '../../i18n/index'
import Link from "next/link";

export default async function ClientsPage({ params }) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  const displayedClients = clients ? clients.slice(0, 15) : [];

  return (
    <div className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative">
      <main className="pt-[50px] pb-16">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">

          {/* header */}
          <section className="relative mb-8">
            <div className="flex items-center gap-4 mb-8">

              {/* back button */}
              <Link href={`/${lng}`}>
                <Button
                  variant="ghost"
                  className="cursor-pointer h-auto flex items-center justify-center gap-2 rounded-lg hover:bg-transparent border border-solid border-gray-200 px-3 py-1"
                >
                  <FaLongArrowAltRight className="text-medium" />
                  <span className="font-medium text-[18px]">
                    {t('clients.back')}
                  </span>
                </Button>
              </Link>

            </div>

            <h1 className="font-bold text-[#172436] text-[32px] sm:text-[40px]">
              {t('clients.title')}
            </h1>
          </section>

          {/* clients grid */}
          <section className="relative mt-8">
            {error ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-red-500 text-lg">{t('clients.error')}</p>
              </div>
            ) : clients?.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 text-lg">{t('clients.noClients')}</p>
              </div>
            ) : (
              <>
                <div className="pb-20 clients-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
                  {displayedClients.map((client) => (
                    <div
                      key={client.id}
                      className="w-full h-full rounded-2xl flex flex-col items-center justify-center p-4 transition-transform hover:scale-105 cursor-pointer"
                      style={{
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4DA 100%)',
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Image
                        src={client.image || mainLogo}
                        alt={client.name || t('clients.clientName')}
                        width={205}
                        height={205}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* show more clients */}
                {clients.length > 15 && (
                  <div className="flex justify-center mt-8">
                    <Link href={`/${lng}/clients/all`}>
                      <Button
                        variant="ghost"
                        className="cursor-pointer border border-solid border-gray-400 px-4 sm:px-[100px] py-2 h-auto flex items-center justify-center gap-2 rounded-lg hover:bg-transparent"
                      >
                        <span className="font-medium text-gray-500 text-lg">
                          {t('clients.showMore')}
                        </span>
                        <HiArrowLongDown className="text-gray-500 text-lg" />
                      </Button>
                    </Link>
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
