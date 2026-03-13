import type { Dictionary } from '@/types/content';
import { countryToLanguage } from '@/utils/config';

const getDictionary = async (languageCode: string): Promise<Dictionary> => {
    try {
        const supportedLanguages = Object.values(countryToLanguage);

        const lang = supportedLanguages.includes(languageCode) ? languageCode : 'en';

        const dictionary = await import(`@/dictionaries/${lang}.json`);
        return (dictionary.default as Dictionary) || ({} as Dictionary);
    } catch {
        const enDictionary = await import('@/dictionaries/en.json');
        return (enDictionary.default as Dictionary) || ({} as Dictionary);
    }
};

export default getDictionary;
