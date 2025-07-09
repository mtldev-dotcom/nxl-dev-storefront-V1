import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // Since we have a custom URL structure /[countryCode]/[locale]/..., 
    // we need to handle locale detection differently

    let locale: typeof routing.locales[number] = routing.defaultLocale;

    // Try to get the locale from requestLocale first
    if (requestLocale) {
        const requested = await requestLocale;
        if (requested && hasLocale(routing.locales, requested)) {
            locale = requested as typeof routing.locales[number];
        }
    }

    try {
        return {
            locale,
            messages: (await import(`../../messages/${locale}.json`)).default
        };
    } catch (error) {
        // Fallback to default locale if message file is not found
        console.warn(`Failed to load messages for locale ${locale}, falling back to ${routing.defaultLocale}`);
        return {
            locale: routing.defaultLocale,
            messages: (await import(`../../messages/${routing.defaultLocale}.json`)).default
        };
    }
}); 