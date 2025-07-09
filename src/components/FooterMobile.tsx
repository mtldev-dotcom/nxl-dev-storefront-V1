"use client"

import * as React from "react"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Icon } from "@/components/Icon"
import { NewsletterForm } from "@/components/NewsletterForm"

// Mobile collapsible footer section
const CollapsibleFooterSection: React.FC<{
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
        <div className="border-b border-grayscale-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-4 text-left font-semibold text-sm"
                aria-expanded={isOpen}
                aria-controls={`footer-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
                <span>{title}</span>
                <Icon
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    className="w-4 h-4 transition-transform duration-200"
                />
            </button>
            <div
                id={`footer-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'
                    }`}
            >
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

// Mobile-optimized footer component
export const FooterMobile: React.FC<{
    translations: {
        navigationTitle: string;
        supportTitle: string;
        followUsTitle: string;
        legalTitle: string;
        home: string;
        about: string;
        shop: string;
        contact: string;
        faq: string;
        help: string;
        delivery: string;
        returns: string;
        instagram: string;
        tiktok: string;
        pinterest: string;
        facebook: string;
        privacyPolicy: string;
        cookiePolicy: string;
        termsOfUse: string;
    };
    newsletterTranslations: {
        title: string;
        description: string;
        thankYou: string;
        emailPlaceholder: string;
        subscribe: string;
        privacyText: string;
        privacyLink: string;
        consentText: string;
    };
    locale: string;
}> = ({ translations: t, newsletterTranslations, locale }) => {
    return (
        <div className="bg-grayscale-50 py-8">
            <div className="px-4">
                {/* Brand Section */}
                <div className="mb-8 text-center">
                    <h1 className="font-cinzel font-normal text-xl mb-3 leading-none">
                        Next <span className="text-nxl-gold">X</span> Level Co.
                    </h1>
                    <p className="text-sm text-grayscale-600 mb-4 max-w-sm mx-auto">
                        Premium Canadian apparel that elevates your style from chalet to cocktail hour.
                    </p>
                    <p className="text-xs text-grayscale-500">
                        &copy; {new Date().getFullYear()}, Next <span className="text-nxl-gold">X</span> Level
                    </p>
                </div>

                {/* Newsletter Section */}
                <div className="mb-8">
                    <NewsletterForm
                        className=""
                        translations={newsletterTranslations}
                        locale={locale}
                    />
                </div>

                {/* Collapsible Navigation Sections */}
                <div className="space-y-0">
                    {/* Navigation Links */}
                    <CollapsibleFooterSection title={t.navigationTitle} defaultOpen={true}>
                        <LocalizedLink
                            href="/"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.home}
                        </LocalizedLink>
                        <LocalizedLink
                            href="/about"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.about}
                        </LocalizedLink>
                        <LocalizedLink
                            href="/store"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.shop}
                        </LocalizedLink>
                        <LocalizedLink
                            href="/contact"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.contact}
                        </LocalizedLink>
                    </CollapsibleFooterSection>

                    {/* Support Links */}
                    <CollapsibleFooterSection title={t.supportTitle}>
                        <LocalizedLink
                            href="/"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.faq}
                        </LocalizedLink>
                        <LocalizedLink
                            href="/"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.help}
                        </LocalizedLink>
                        <LocalizedLink
                            href="/"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.delivery}
                        </LocalizedLink>
                        <LocalizedLink
                            href="/"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.returns}
                        </LocalizedLink>
                    </CollapsibleFooterSection>

                    {/* Social Media Links */}
                    <CollapsibleFooterSection title={t.followUsTitle}>
                        <a
                            href="https://www.instagram.com/nextxlevel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            <Icon name="instagram" className="w-5 h-5 shrink-0" />
                            <span>{t.instagram}</span>
                        </a>
                        <a
                            href="https://tiktok.com/@nextxlevel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            <Icon name="tiktok" className="w-5 h-5 shrink-0" />
                            <span>{t.tiktok}</span>
                        </a>
                        <a
                            href="https://pinterest.com/nextxlevel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            <Icon name="pinterest" className="w-5 h-5 shrink-0" />
                            <span>{t.pinterest}</span>
                        </a>
                        <a
                            href="https://facebook.com/nextxlevel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            <Icon name="facebook" className="w-5 h-5 shrink-0" />
                            <span>{t.facebook}</span>
                        </a>
                    </CollapsibleFooterSection>

                    {/* Legal Links */}
                    <CollapsibleFooterSection title={t.legalTitle}>
                        <LocalizedLink
                            href="/privacy-policy"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.privacyPolicy}
                        </LocalizedLink>
                        <LocalizedLink
                            href="/cookie-policy"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.cookiePolicy}
                        </LocalizedLink>
                        <LocalizedLink
                            href="/terms-of-use"
                            className="block py-3 text-sm hover:text-nxl-gold transition-colors active:text-nxl-gold touch-manipulation"
                        >
                            {t.termsOfUse}
                        </LocalizedLink>
                    </CollapsibleFooterSection>
                </div>
            </div>
        </div>
    )
} 