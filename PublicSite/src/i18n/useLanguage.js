import { useContext } from 'react'
import { LanguageContext } from './languageContext'

export function useLanguage () {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage doit être utilisé dans LanguageProvider')
  }
  return context
}