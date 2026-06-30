'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AppLanguage } from './resources'

type LanguageState = {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
}

const fallbackLanguage: AppLanguage = 'en-GB'

export const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      // Use a stable initial value to avoid hydration mismatches.
      language: fallbackLanguage,
      setLanguage: language => set({ language }),
    }),
    {
      name: 'app-language',
    },
  ),
)
