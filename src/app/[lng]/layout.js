import { I18nextProvider } from '../i18n/client'
import { fallbackLng, languages } from '../i18n/settings'
import { useTranslation } from '../i18n/index'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
export default async function Layout({ children, params }) {
  const { lng } = await params
  const language = languages.indexOf(lng) < 0 ? fallbackLng : lng
  const { t } = await useTranslation(language)

  return (
    <I18nextProvider lng={language}>
      <div className='wrapper flex flex-col'>
        <Header lng={lng} />
        <div className='content flex-1'>
          {children}
        </div>
        <Footer t={t} lng={lng} />
      </div>


    </I18nextProvider>
  )
}

