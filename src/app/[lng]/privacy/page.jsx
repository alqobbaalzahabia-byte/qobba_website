'use client'

import { use, useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { supabase } from '@/lib/supabase'

export default function PrivacyPage({ params }) {
  const { lng } = use(params)
  const { t } = useTranslation(lng, 'common')
  const [privacy, setPrivacy] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrivacy() {
      try {
        const { data, error } = await supabase
          .from('privacy')
          .select('*')
          
        if (error) {
          console.error('Error fetching privacy:', error)
        } else {
          setPrivacy(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrivacy()
  }, [])

  return (
    <div className="privacy-page bg-[#fdfef9] overflow-hidden w-full relative min-h-screen pb-[120px]">
      <main className="pt-[50px] pb-16">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">
          <section className="relative mb-8">
            <h1 className="font-bold text-[#FAB000] text-[32px] sm:text-[40px] mb-8">
              {t('privacy.title')}
            </h1>
          </section>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FAB000]/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#FAB000] rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          ) : privacy.length > 0 && (
            <div className="space-y-8">
              {privacy.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8"
                >
                  <h2 className="text-2xl font-semibold text-[#585858] mb-4">
                    {item.title?.[lng] || item.title?.en || ''}
                  </h2>
                  <div
                    className="text-[#585858] text-lg leading-7 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: item.content?.[lng] || item.content?.en || ''
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

