import { I18nextProvider } from '../i18n/client'
import { fallbackLng, languages } from '../i18n/settings'
import { useTranslation } from '../i18n/index'
import ConditionalLayoutHeader from '@/components/layouts/LayoutHeader'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default async function Layout({ children, params }) {
  const { lng } = await params
  const language = languages.indexOf(lng) < 0 ? fallbackLng : lng
  await useTranslation(language)

  return (
    <I18nextProvider lng={language}>
      <ConditionalLayoutHeader lng={lng}>
        {children}
      </ConditionalLayoutHeader>
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={lng === 'ar'}
        pauseOnHover
        theme="light"
      />
    </I18nextProvider>
  )
}

