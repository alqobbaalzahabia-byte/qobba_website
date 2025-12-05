'use client'

import { use, useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { supabase } from '@/lib/supabase'

export default function TermsPage({ params }) {
  const { lng } = use(params)
  const { t } = useTranslation(lng, 'common')
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTerms() {
      try {
        const { data, error } = await supabase
          .from('terms')
          .select('*')
          
        if (error) {
          console.error('Error fetching terms:', error)
        } else {
          setTerms(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTerms()
  }, [])

  return (
    <div className="terms-page bg-[#fdfef9] overflow-hidden w-full relative min-h-screen pb-[120px]">
      <main className="pt-[50px] pb-16">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">
          <section className="relative mb-8">
            <h1 className="font-bold text-[#FAB000] text-[32px] sm:text-[40px] mb-8">
              {t('terms.title')}
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
          ) : terms.length > 0 && (
            <div className="space-y-8">
              {terms.map((term) => (
                <div
                  key={term.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8"
                >
                  <h2 className="text-2xl font-semibold text-[#585858] mb-4">
                    {term.title?.[lng] || term.title?.en || ''}
                  </h2>
                  <div
                    className="text-[#585858] text-lg leading-7 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: term.content?.[lng] || term.content?.en || ''
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

