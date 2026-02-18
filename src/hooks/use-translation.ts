import { useHezeerFlow } from '@/store/use-hezeer-flow';
import { translations, Language } from '@/lib/i18n';

export function useTranslation() {
  const language = useHezeerFlow((state) => state.language);
  const t = translations[language];

  return {
    t,
    language,
    setLanguage: useHezeerFlow((state) => state.setLanguage),
  };
}
