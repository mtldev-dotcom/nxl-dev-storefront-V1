import Image from "next/image"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { getTranslations } from 'next-intl/server'

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

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

      {/* Product Listing Section - replaces Coming Soon */}
      <div id="products" className="py-16 md:py-24 lg:py-32">
        <Layout>
          <LayoutColumn>
            {/* Section Title */}
            <h1 className="text-center text-lg md:text-3xl lg:text-4xl font-cinzel font-normal mb-6 md:mb-8 text-grayscale-900 leading-tight">
              {t('allProductsTitle') || 'All Products'}
            </h1>
            {/*
              PaginatedProducts handles:
              - Fetching products from the Medusa backend (with pagination, filters, sorting)
              - Infinite scroll (loads more products as user scrolls)
              - Loading skeletons and empty state
              - Rendering each product using ProductPreview
              You can extend this by adding filter/sort UI and passing the relevant props.
            */}
            <PaginatedProducts
              countryCode={countryCode}
              page={1} // Initial page; infinite scroll will load more
            // You can add sortBy, collection, category, type, etc. as needed
            />
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}

export default StoreTemplate
