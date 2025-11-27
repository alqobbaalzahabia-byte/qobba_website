'use client'

import { useEffect, useState, useContext } from 'react'
import { I18nextProvider as I18nextProviderOriginal, useTranslation as useTranslationOriginal } from 'react-i18next'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { fallbackLng, languages } from './settings'

let i18nInstance = null

async function initI18next(lng) {
  if (!i18nInstance) {
    i18nInstance = createInstance()
    await i18nInstance
      .use(initReactI18next)
      .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`)))
      .init({
        lng,
        fallbackLng,
        supportedLngs: languages,
        defaultNS: 'common',
        fallbackNS: 'common',
        interpolation: {
          escapeValue: false
        },
        react: {
          useSuspense: false
        }
      })
  }
  
  if (i18nInstance.language !== lng) {
    await i18nInstance.changeLanguage(lng)
  }
  
  return i18nInstance
}

export function I18nextProvider({ lng, children }) {
  const [i18n, setI18n] = useState(null)
  const [ready, setReady] = useState(false)
  
  useEffect(() => {
    let mounted = true
    
    initI18next(lng).then((instance) => {
      if (mounted) {
        setI18n(instance)
        setReady(true)
      }
    })
    
    return () => {
      mounted = false
    }
  }, [lng])

  if (!i18n || !ready) {
    return null
  }

  return (
    <I18nextProviderOriginal i18n={i18n}>
      {children}
    </I18nextProviderOriginal>
  )
}

export function useTranslation(lng, ns = 'common') {
  // Use the context from I18nextProvider
  const { i18n: contextI18n, t: contextT } = useTranslationOriginal(ns)
  
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (contextI18n?.isInitialized) {
      if (contextI18n.language !== lng) {
        contextI18n.changeLanguage(lng).then(() => {
          setReady(true)
        })
      } else {
        setReady(true)
      }
    } else {
      // Fallback: initialize directly if context not available
      initI18next(lng).then(() => {
        setReady(true)
      })
    }
  }, [lng, ns, contextI18n])

  if (!ready || !contextI18n) {
    return {
      t: (key) => key,
      i18n: contextI18n,
      ready: false
    }
  }

  return {
    t: contextI18n.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: contextI18n,
    ready
  }
}

