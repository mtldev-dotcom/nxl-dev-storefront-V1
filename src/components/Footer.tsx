import * as React from "react"
import { twMerge } from "tailwind-merge"
import { Layout, LayoutColumn } from "@/components/Layout"
import { NewsletterForm } from "@/components/NewsletterForm"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Icon } from "@/components/Icon"
import { getTranslations } from 'next-intl/server'

// Static footer section for server component
const FooterSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <div className="mb-8 md:mb-0">
      <h3 className="font-semibold text-sm mb-4 md:mb-6">{title}</h3>
      <div className="space-y-3 md:space-y-2">
        {children}
      </div>
    </div>
  )
}



export const Footer: React.FC<{
  locale?: string;
  currentPath?: string;
}> = async ({ locale, currentPath }) => {
  // Use the passed locale or default to 'en'
  const currentLocale = locale || 'en'

  // Get translations server-side
  const t = await getTranslations({ locale: currentLocale, namespace: 'Footer' })
  const newsletterT = await getTranslations({ locale: currentLocale, namespace: 'Newsletter' })

  // Prepare newsletter translations for the client component
  const newsletterTranslations = {
    title: newsletterT('title'),
    description: newsletterT('description'),
    thankYou: newsletterT('thankYou'),
    emailPlaceholder: newsletterT('emailPlaceholder'),
    subscribe: newsletterT('subscribe'),
    privacyText: newsletterT('privacyText'),
    privacyLink: newsletterT('privacyLink'),
    consentText: newsletterT('consentText')
  }

  const isAuthPage = currentPath === "/register" || currentPath === "/login"

  return (
    <footer
      className={twMerge(
        "bg-grayscale-50 py-12 md:py-16 lg:py-20",
        isAuthPage && "hidden"
      )}
    >
      <Layout>
        <LayoutColumn className="col-span-13">
          <div className="px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16 xl:gap-20">
              {/* Brand and Newsletter Section */}
              <div className="flex flex-col order-2 lg:order-1 lg:flex-1 lg:max-w-md">
                {/* Brand Section */}
                <div className="mb-8 lg:mb-12">
                  <h1 className="font-cinzel font-normal text-xl md:text-2xl mb-3 leading-none">
                    Next <span className="text-nxl-gold">X</span> Level Co.
                  </h1>
                  <p className="text-sm text-grayscale-600 mb-4 max-w-sm">
                    Premium Canadian apparel that elevates your style from chalet to cocktail hour.
                  </p>
                  <p className="text-xs text-grayscale-500">
                    &copy; {new Date().getFullYear()}, Next <span className="text-nxl-gold">X</span> Level
                  </p>
                </div>

                {/* Newsletter Section */}
                <div className="lg:mt-auto">
                  <NewsletterForm
                    className=""
                    translations={newsletterTranslations}
                    locale={currentLocale}
                  />
                </div>
              </div>

              {/* Navigation Sections */}
              <div className="flex-1 order-1 lg:order-2 lg:max-w-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-8 xl:gap-12">
                  {/* Navigation Links */}
                  <FooterSection title={t('navigationTitle')}>
                    <LocalizedLink
                      href="/"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('home')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/about"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('about')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/store"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('shop')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/contact"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('contact')}
                    </LocalizedLink>
                  </FooterSection>

                  {/* Support Links */}
                  <FooterSection title={t('supportTitle')}>
                    <LocalizedLink
                      href="/"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('faq')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('help')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('delivery')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('returns')}
                    </LocalizedLink>
                  </FooterSection>

                  {/* Social Media Links */}
                  <FooterSection title={t('followUsTitle')}>
                    <a
                      href="https://www.instagram.com/nextxlevel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      <Icon name="instagram" className="w-4 h-4 shrink-0" />
                      <span>{t('instagram')}</span>
                    </a>
                    <a
                      href="https://tiktok.com/@nextxlevel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      <Icon name="tiktok" className="w-4 h-4 shrink-0" />
                      <span>{t('tiktok')}</span>
                    </a>
                    <a
                      href="https://pinterest.com/nextxlevel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      <Icon name="pinterest" className="w-4 h-4 shrink-0" />
                      <span>{t('pinterest')}</span>
                    </a>
                    <a
                      href="https://facebook.com/nextxlevel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      <Icon name="facebook" className="w-4 h-4 shrink-0" />
                      <span>{t('facebook')}</span>
                    </a>
                  </FooterSection>

                  {/* Legal Links */}
                  <FooterSection title={t('legalTitle')}>
                    <LocalizedLink
                      href="/privacy-policy"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('privacyPolicy')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/cookie-policy"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('cookiePolicy')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/terms-of-use"
                      className="block py-1.5 text-sm hover:text-nxl-gold transition-colors"
                    >
                      {t('termsOfUse')}
                    </LocalizedLink>
                  </FooterSection>
                </div>
              </div>
            </div>
          </div>
        </LayoutColumn>
      </Layout>
    </footer>
  )
}
