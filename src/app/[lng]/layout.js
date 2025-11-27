import { I18nextProvider } from '../i18n/client'
import { fallbackLng, languages } from '../i18n/settings'

export default async function Layout({ children, params }) {
  const { lng } = await params
  const language = languages.indexOf(lng) < 0 ? fallbackLng : lng

  return (
    <I18nextProvider lng={language}>
      {children}
    </I18nextProvider>
  )
}

