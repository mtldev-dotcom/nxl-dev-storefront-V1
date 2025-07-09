import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';

// Generate static params for all supported locales and common country codes
export function generateStaticParams() {
    const supportedCountries = ['us', 'ca', 'gb', 'fr', 'de'];
    const params = [];

    // Generate combinations of country codes and locales
    for (const countryCode of supportedCountries) {
        for (const locale of routing.locales) {
            params.push({ countryCode, locale });
        }
    }

    return params;
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ countryCode: string; locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Providing all messages to the client side
    // is the easiest way to get started
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
        </NextIntlClientProvider>
    );
} 