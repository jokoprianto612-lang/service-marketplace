// ─────────────────────────────────────────────
// Language Selector Component
// ─────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useI18n, languageOptions } from '../../context/I18nContext';

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languageOptions.find(l => l.code === locale) || languageOptions[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('settings.language')}
      >
        <Globe className="h-5 w-5" aria-hidden="true" />
        <span className="hidden lg:block text-sm font-medium">{currentLang.flag} {currentLang.nativeName}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-xl shadow-lg overflow-hidden z-50" role="listbox">
          {languageOptions.map(lang => (
            <li key={lang.code} role="option" aria-selected={locale === lang.code}>
              <button
                onClick={() => {
                  setLocale(lang.code);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors',
                  locale === lang.code
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.nativeName}</span>
                {locale === lang.code && <Check className="ml-auto h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}