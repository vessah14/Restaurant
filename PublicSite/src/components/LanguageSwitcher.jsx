import { useLanguage } from '../i18n/useLanguage'

export default function LanguageSwitcher ({ dark = false }) {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
      className={`
        flex
        items-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-semibold
        duration-300
        transition-all
        hover:scale-105
        ${
          dark
            ? 'border-white/30 text-white hover:bg-white/10'
            : 'border-black/20 text-black hover:bg-black/5'
        }
      `}
    >
      <span className={`flex h-5 w-7 items-center justify-center rounded-sm ${lang === 'fr' ? 'bg-[#C4A060] text-black' : 'opacity-60'}`}>
        FR
      </span>
      <span className="text-[#C4A060]">/</span>
      <span className={`flex h-5 w-7 items-center justify-center rounded-sm ${lang === 'en' ? 'bg-[#C4A060] text-black' : 'opacity-60'}`}>
        EN
      </span>
    </button>
  )
}