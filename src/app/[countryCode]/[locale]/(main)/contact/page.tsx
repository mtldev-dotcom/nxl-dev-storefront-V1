import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { ContactForm } from "@/components/ContactForm"
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Contact' })

    return {
        title: t('title'),
        description: t('description'),
    }
}

export async function generateStaticParams() {
    try {
        const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
            regions.flatMap((r) =>
                r.countries
                    ? r.countries
                        .map((c) => c.iso_2)
                        .filter(
                            (value): value is string =>
                                typeof value === "string" && Boolean(value)
                        )
                    : []
            )
        )

        const staticParams = countryCodes.map((countryCode) => ({
            countryCode,
        }))

        return staticParams
    } catch (error) {
        console.error('Failed to fetch regions, using fallback countries:', error)
        // Fallback to common countries if backend is not available
        return [
            { countryCode: 'us' },
            { countryCode: 'ca' },
            { countryCode: 'gb' },
            { countryCode: 'fr' },
        ]
    }
}

export default async function ContactPage({
    params
}: {
    params: Promise<{ countryCode: string; locale: string }>
}) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Contact' })

    // Prepare contact form translations for the client component
    const contactFormTranslations = {
        formSuccessTitle: t('formSuccessTitle'),
        formSuccessMessage: t('formSuccessMessage'),
        formSendAnother: t('formSendAnother'),
        formName: t('formName'),
        formNamePlaceholder: t('formNamePlaceholder'),
        formEmail: t('formEmail'),
        formEmailPlaceholder: t('formEmailPlaceholder'),
        formSubject: t('formSubject'),
        formSubjectPlaceholder: t('formSubjectPlaceholder'),
        formMessage: t('formMessage'),
        formMessagePlaceholder: t('formMessagePlaceholder'),
        formSending: t('formSending'),
        formSend: t('formSend'),
        formRequired: t('formRequired')
    }

    return (
        <>
            {/* Contact Page Hero Section */}
            <div className="relative overflow-hidden">
                {/* Hero Image */}
                <Image
                    src="/images/content/next-level-contact-hero.png"
                    width={2880}
                    height={1500}
                    alt={t('heroImageAlt')}
                    className="md:h-[70vh] md:object-cover w-full"
                    priority
                />

                {/* Animated Gold Lines */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0">
                        <div className="gold-line-1"></div>
                        <div className="gold-line-2"></div>
                        <div className="gold-line-3"></div>
                        <div className="gold-line-4"></div>
                        <div className="gold-line-5"></div>
                    </div>
                </div>

                {/* Dark Overlay for Better Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>

                {/* Hero Text Overlay */}
                <div className="absolute inset-0 flex items-center pt-20 md:pt-24 lg:pt-28">
                    <Layout className="relative z-20">
                        <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
                            <div className="px-4 md:pl-8 lg:pl-16">
                                {/* Contact Hero Title */}
                                <h1 className="text-white text-lg md:text-4xl lg:text-5xl xl:text-6xl font-cinzel font-normal leading-tight md:leading-tight lg:leading-tight mb-6 md:mb-8 hero-text-shadow">
                                    <span className="block opacity-0 animate-slide-in-delay-1">
                                        {t('heroTitle').includes('Next X Level') || t('heroTitle').includes('Next Level') ? (
                                            t('heroTitle').split(/(\bNext\s+X?\s*Level\b)/i).map((part, index) => {
                                                if (part.match(/\bNext\s+X?\s*Level\b/i)) {
                                                    const hasX = part.includes('X')
                                                    if (hasX) {
                                                        return part.split('X').map((subPart, subIndex) => (
                                                            <span key={`${index}-${subIndex}`}>
                                                                {subPart}
                                                                {subIndex === 0 && <span className="text-nxl-gold animate-glow">X</span>}
                                                            </span>
                                                        ))
                                                    } else {
                                                        return <span key={index} className="text-nxl-gold">{part}</span>
                                                    }
                                                }
                                                return part
                                            })
                                        ) : (
                                            t('heroTitle')
                                        )}
                                    </span>
                                </h1>

                                {/* Contact Hero Subtitle */}
                                {/* <p className="text-white text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-md md:max-w-lg lg:max-w-xl leading-relaxed hero-text-shadow opacity-0 animate-slide-in-delay-4">
                                    {t('heroSubtitle')}
                                </p> */}

                                {/* Contact CTA Button */}
                                {/* <div className="opacity-0 animate-slide-in-delay-5">
                                    <LocalizedLink
                                        href="#contact-info"
                                        className="group relative inline-block bg-white text-black font-semibold text-sm md:text-base lg:text-lg px-8 md:px-12 lg:px-16 py-3 md:py-4 lg:py-5 transition-all duration-500 tracking-widest uppercase border-2 border-white hover:border-nxl-gold overflow-hidden btn-enhanced"
                                    >
                                        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                            {t('heroButton')}
                                        </span>
                                        <div className="absolute inset-0 bg-nxl-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                    </LocalizedLink>
                                </div> */}

                                {/* Decorative elements */}
                                <div className="absolute -top-4 -left-4 w-24 h-24 border border-nxl-gold/30 animate-pulse-slow opacity-0 animate-fade-in-delay-6"></div>
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-white/20 animate-pulse-slow opacity-0 animate-fade-in-delay-7"></div>
                            </div>
                        </LayoutColumn>
                    </Layout>
                </div>

                {/* Brand Emblem */}
                <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 opacity-0 animate-fade-in-delay-8">
                    <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-nxl-gold rounded-sm flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <span className="text-nxl-gold font-cinzel font-bold text-xl md:text-2xl animate-glow">X</span>
                        </div>
                        <div className="absolute -inset-2 border border-white/30 rounded-sm animate-pulse-slow"></div>
                    </div>
                </div>
            </div>

            <div id="contact-info" className="pt-8 md:pt-26 pb-26 md:pb-36">
                <Layout>
                    <LayoutColumn start={1} end={13}>
                        <h3 className="font-cinzel font-normal text-md text-center max-lg:mb-6 md:text-2xl">
                            {t('mainHeadline')}
                        </h3>
                        <div className="md:text-md lg:mt-18 text-center">
                            <p className="mb-5 text-center lg:mb-9">
                                {t('introParagraph1')}
                            </p>
                            <p>
                                {t('introParagraph2')}
                            </p>
                        </div>
                    </LayoutColumn>
                </Layout>

                {/* Contact Form */}
                <Layout className="mt-26 lg:mt-36">
                    <LayoutColumn start={1} end={13}>
                        <div className="max-w-4xl mx-auto">
                            <h4 className="font-cinzel font-normal text-md lg:text-lg mb-8 text-center">{t('formTitle')}</h4>
                            <ContactForm
                                translations={contactFormTranslations}
                                locale={locale}
                            />
                        </div>
                    </LayoutColumn>
                </Layout>

                {/* Contact Information */}
                <Layout className="mt-26 lg:mt-36">
                    <LayoutColumn start={1} end={{ base: 13, lg: 6 }}>
                        <div className="mb-16 lg:mb-0">
                            <h4 className="font-cinzel font-normal text-md lg:text-lg mb-6">{t('customerServiceTitle')}</h4>
                            <div className="space-y-4 md:text-md">
                                <p>
                                    <strong>{t('email')}:</strong> hello@nextxlevel.ca
                                </p>
                                <p>
                                    <strong>{t('phone')}:</strong> +1 (416) 555-0123
                                </p>
                                <p>
                                    <strong>{t('hours')}:</strong> {t('hoursValue')}
                                </p>
                            </div>
                        </div>
                    </LayoutColumn>
                    <LayoutColumn start={{ base: 1, lg: 7 }} end={13}>
                        <div>
                            <h4 className="font-cinzel font-normal text-md lg:text-lg mb-6">{t('followUsTitle')}</h4>
                            <div className="space-y-4 md:text-md">
                                <p>
                                    <strong>{t('instagram')}:</strong> @nextxlevel
                                </p>
                                <p>
                                    <strong>{t('tiktok')}:</strong> @nextxlevel
                                </p>
                                <p>
                                    <strong>{t('linkedin')}:</strong> Next <span className="text-nxl-gold">X</span> Level Co.
                                </p>
                            </div>
                        </div>
                    </LayoutColumn>
                </Layout>

                {/* Headquarters */}
                <Layout className="mt-26 lg:mt-36">
                    <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
                        <h4 className="font-cinzel font-normal text-md lg:text-lg mb-6">{t('headquartersTitle')}</h4>
                        <div className="md:text-md">
                            <p className="mb-5">
                                <strong>Next <span className="text-nxl-gold">X</span> Level Co.</strong><br />
                                {t('address')}<br />
                                {t('cityProvince')}<br />
                                {t('country')}
                            </p>
                            <p>
                                {t('headquartersDescription')}
                            </p>
                        </div>
                    </LayoutColumn>
                </Layout>

                {/* Brand Promise */}
                <Layout className="mt-26 lg:mt-36">
                    <LayoutColumn>
                        <div className="text-center max-w-4xl mx-auto">
                            <h3 className="font-cinzel font-normal text-md md:text-2xl mb-8 md:mb-16">
                                {t('brandPromiseHeadline')}
                            </h3>
                            <p className="md:text-md mb-8 md:mb-12">
                                {t('brandPromiseDescription')}
                            </p>
                            <LocalizedLink
                                href="/store"
                                className="inline-block bg-black text-white font-semibold text-sm md:text-base lg:text-lg px-8 md:px-12 lg:px-16 py-3 md:py-4 lg:py-5 hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 tracking-widest uppercase"
                            >
                                {t('shopButton')}
                            </LocalizedLink>
                        </div>
                    </LayoutColumn>
                </Layout>
            </div>
        </>
    )
} 