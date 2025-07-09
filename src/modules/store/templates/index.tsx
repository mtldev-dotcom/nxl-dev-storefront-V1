import Image from "next/image"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { getTranslations } from 'next-intl/server'

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const StoreTemplate = async ({
  sortBy,
  collection,
  category,
  type,
  page,
  countryCode,
  locale,
}: {
  sortBy?: SortOptions
  collection?: string[]
  category?: string[]
  type?: string[]
  page?: string
  countryCode: string
  locale?: string
}) => {
  // Get translations for Store page
  const t = await getTranslations({ locale: locale || 'en', namespace: 'Store' })

  return (
    <>
      {/* Store Page Hero Section */}
      <div className="relative overflow-hidden">
        {/* Hero Image */}
        <Image
          src="/images/content/next-level-store2.png"
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
                {/* Store Hero Title */}
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

                {/* Store Hero Subtitle */}
                {/* <p className="text-white text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-md md:max-w-lg lg:max-w-xl leading-relaxed hero-text-shadow opacity-0 animate-slide-in-delay-4">
                  {t('heroSubtitle')}
                </p> */}

                {/* Store CTA Button */}
                {/* <div className="opacity-0 animate-slide-in-delay-5">
                  <LocalizedLink
                    href="#products"
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

      {/* Coming Soon Section */}
      <div id="products" className="py-16 md:py-24 lg:py-32">
        <Layout>
          <LayoutColumn>
            <div className="text-center max-w-4xl mx-auto px-4">
              {/* Coming Soon Icon/Visual */}
              <div className="mb-8 md:mb-12">
                <div className="relative inline-block">
                  <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-nxl-gold rounded-sm flex items-center justify-center bg-grayscale-50 mx-auto mb-6">
                    <span className="text-nxl-gold font-cinzel font-bold text-3xl md:text-4xl animate-pulse">X</span>
                  </div>
                  <div className="absolute -inset-3 border border-grayscale-200 rounded-sm animate-pulse"></div>
                </div>
              </div>

              {/* Coming Soon Title */}
              <h1 className="text-lg md:text-3xl lg:text-4xl font-cinzel font-normal mb-6 md:mb-8 text-grayscale-900 leading-tight">
                {t('comingSoonTitle')}
              </h1>

              {/* Coming Soon Message */}
              <p className="text-lg md:text-xl text-grayscale-600 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto">
                {t('comingSoonMessage')}
              </p>

              {/* Under Construction Badge */}
              <div className="inline-flex items-center gap-3 bg-grayscale-100 border border-grayscale-200 rounded-full px-6 py-3 mb-8 md:mb-12">
                <div className="w-2 h-2 bg-nxl-gold rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-grayscale-700 uppercase tracking-wider">
                  {t('underConstructionTitle')}
                </span>
              </div>

              {/* Under Construction Message */}
              <p className="text-base md:text-lg text-grayscale-500 mb-12 md:mb-16 leading-relaxed">
                {t('underConstructionMessage')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Newsletter Signup Button */}
                <LocalizedLink
                  href="/contact"
                  className="group relative inline-block bg-nxl-gold text-black font-semibold text-sm md:text-base px-8 md:px-12 py-3 md:py-4 transition-all duration-300 hover:bg-black hover:text-white border-2 border-nxl-gold hover:border-black tracking-wider uppercase"
                >
                  {t('notifyMeButton')}
                </LocalizedLink>

                {/* Back to Home Button */}
                <LocalizedLink
                  href="/"
                  className="group relative inline-block bg-transparent text-grayscale-700 font-semibold text-sm md:text-base px-8 md:px-12 py-3 md:py-4 transition-all duration-300 hover:text-nxl-gold border-2 border-grayscale-300 hover:border-nxl-gold tracking-wider uppercase"
                >
                  {t('backToHomeButton')}
                </LocalizedLink>
              </div>

              {/* Decorative Elements */}
              <div className="mt-16 md:mt-20 relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-nxl-gold to-transparent"></div>
                <div className="flex justify-center space-x-8 mt-20">
                  <div className="w-12 h-12 border border-grayscale-200 rounded-sm flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-nxl-gold rounded-full"></div>
                  </div>
                  <div className="w-12 h-12 border border-grayscale-200 rounded-sm flex items-center justify-center animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <div className="w-3 h-3 bg-nxl-gold rounded-full"></div>
                  </div>
                  <div className="w-12 h-12 border border-grayscale-200 rounded-sm flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                    <div className="w-3 h-3 bg-nxl-gold rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}

export default StoreTemplate
