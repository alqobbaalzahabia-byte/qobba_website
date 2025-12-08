'use client'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { IoIosArrowDown } from "react-icons/io"
import { FaCheck } from "react-icons/fa"
import { languages as supportedLanguages } from '@/app/i18n/settings'
import ArabicFlag from '@/../public/assets/arabic-flag.svg'

export default function LanguageSwitcher({ lng }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
  ]

  const currentLanguage = languages.find(lang => lang.code === lng) || languages[0]

  const switchLanguage = (newLng) => {
    const segments = pathname.split('/').filter(Boolean)
    const pathWithoutLang = segments.filter(seg => !supportedLanguages.includes(seg)).join('/')
    const newPath = `/${newLng}${pathWithoutLang ? '/' + pathWithoutLang : ''}`
    router.push(newPath)
    setIsLanguageDropdownOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
        className="h-[45px] w-full bg-white rounded-xl flex items-center justify-between gap-1 hover:opacity-90 transition-opacity cursor-pointer"
      >
        <div className="inline-flex items-center justify-center gap-2 lg:px-3">
          <IoIosArrowDown 
            className={`text-lg text-gray-400 transition-transform duration-200 ${
              isLanguageDropdownOpen ? 'rotate-180' : ''
            }`} 
          />
          <div className="font-medium text-[#7f7f7f] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
            {currentLanguage.label}
          </div>
          {lng === 'ar' && (
            <Image
              className="w-5 h-5"
              alt="Arabic"
              src={ArabicFlag}
              width={20}
              height={20}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      </button>

      {isLanguageDropdownOpen && (
        <div className="absolute top-full mt-2 right-0 w-full md:w-[140px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                lang.code === lng 
                  ? 'bg-[#FAB000]/10 text-[#FAB000] font-bold' 
                  : 'text-[#7f7f7f]'
              }`}
            >
              <div className="flex items-center gap-2">
                {lang.code === 'ar' && (
                  <Image
                    className="w-5 h-5"
                    alt="Arabic"
                    src={ArabicFlag}
                    width={20}
                    height={20}
                  />
                )}
                <div className="font-medium text-base text-start">
                  {lang.label}
                </div>
              </div>
              {lang.code === lng && <FaCheck />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

