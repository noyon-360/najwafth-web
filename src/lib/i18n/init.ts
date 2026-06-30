'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { resources } from './resources'
import type { AppLanguage } from './resources'

const fallbackLanguage: AppLanguage = 'en-GB'

function syncResources() {
  for (const [language, namespaces] of Object.entries(resources)) {
    const translation = namespaces.translation
    i18n.addResourceBundle(language, 'translation', translation, true, true)
  }
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    // Keep the first client render identical to server render.
    // Persisted language is applied after mount by I18nProvider.
    lng: fallbackLanguage,
    fallbackLng: fallbackLanguage,
    interpolation: {
      escapeValue: false,
    },
  })
} else {
  // Keep translations in sync during dev HMR to avoid server/client text drift.
  syncResources()
}

export default i18n
