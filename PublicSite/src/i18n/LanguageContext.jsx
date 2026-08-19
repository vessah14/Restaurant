import { useState, useEffect } from 'react'
import { translations } from './translations'
import { LanguageContext } from './languageContext'

const LANGUAGE_KEY = 'lesdeuxcolombes_lang'

export function LanguageProvider ({ children }) {
  const [lang, setLang] = useState(() => {
    // Par défaut : français
    const saved = localStorage.getItem(LANGUAGE_KEY)
    return saved === 'en' ? 'en' : 'fr'
  })

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => {
    setLang(prev => (prev === 'fr' ? 'en' : 'fr'))
  }

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}