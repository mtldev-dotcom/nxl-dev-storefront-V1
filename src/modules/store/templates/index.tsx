import Image from "next/image"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { getTranslations } from 'next-intl/server'

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import PaginatedProducts from "./paginated-products"
import { listCategories } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
// Remove all product type logic
// import { getProductTypesList } from "@lib/data/product-types"

const StoreTemplate = async ({
  sortBy,
  collection,
  category,
  // type, // removed
  page,
  countryCode,
  locale,
}: {
  sortBy?: SortOptions
  collection?: string[]
  category?: string[]
  // type?: string[] // removed
  page?: string
  countryCode: string
  locale?: string
}) => {
  // Get translations for Store page
  const t = await getTranslations({ locale: locale || 'en', namespace: 'Store' })

  // Fetch data for filters - wrapped in try-catch for graceful degradation
  let categories: Record<string, string> = {}
  let collections: Record<string, string> = {}
  // let productTypes: Record<string, string> = {} // removed

  try {
    // Fetch categories for filtering
    const categoriesData = await listCategories()
    categories = categoriesData.reduce((acc, cat) => {
      acc[cat.handle] = cat.name
      return acc
    }, {} as Record<string, string>)
  } catch (error) {
    console.warn('Failed to fetch categories:', error)
  }

  try {
    // Fetch collections for filtering
    const collectionsData = await getCollectionsList(0, 50)
    collections = collectionsData.collections.reduce((acc, coll) => {
      acc[coll.handle] = coll.title
      return acc
    }, {} as Record<string, string>)
  } catch (error) {
    console.warn('Failed to fetch collections:', error)
  }

  // Removed product type fetching logic

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

      {/* Product Listing Section with Enhanced Filtering */}
      <div id="products" className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        {/* Enhanced section header with breadcrumb and stats */}
        <Layout className="mb-8 md:mb-12">
          <LayoutColumn>
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-cinzel font-normal mb-4 text-grayscale-900 leading-tight">
                {t('ourCollection')}
              </h1>
              <p className="text-base md:text-lg text-grayscale-600 max-w-2xl mx-auto leading-relaxed">
                {t('collectionDescription')}
              </p>
            </div>
          </LayoutColumn>
        </Layout>

        {/* Enhanced Search Bar Section */}
        {/* Removed SearchBar component */}

        {/* Enhanced Refinement List with better visual design */}
        <div className="bg-white border-y border-grayscale-200 py-6 mb-8 sticky top-0 z-30 shadow-sm">
          <RefinementList
            sortBy={sortBy}
            collections={Object.keys(collections).length > 0 ? collections : undefined}
            collection={collection}
            categories={Object.keys(categories).length > 0 ? categories : undefined}
            category={category}
            // types={Object.keys(productTypes).length > 0 ? productTypes : undefined} // removed
            // type={type} // removed
            title={t('shopTitle')}
          />
        </div>

        {/* Enhanced Products Grid Section */}
        <Layout>
          <LayoutColumn>
            {/* 
              Enhanced PaginatedProducts with all filter parameters:
              - Handles infinite scroll with improved performance
              - Uses skeleton loading states
              - Supports all filtering options (collection, category, type, sorting)
              - Responsive grid layout with proper spacing
            */}
            <PaginatedProducts
              sortBy={sortBy}
              page={page ? parseInt(page) : 1}
              collectionId={collection}
              categoryId={category}
              // typeId={type} // removed
              countryCode={countryCode}
            />
          </LayoutColumn>
        </Layout>

        {/* Enhanced Empty State with Call-to-Action */}
        {/* This will be shown by PaginatedProducts when no products are found */}
      </div>

      {/* Additional sections for enhanced UX */}
      <div className="py-16 md:py-20 bg-grayscale-50">
        <Layout>
          <LayoutColumn>
            <div className="text-center">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-cinzel font-normal mb-6 text-grayscale-900">
                {t('whyChooseTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12">
                {/* Feature 1: Quality */}
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-nxl-gold/10 rounded-full flex items-center justify-center group-hover:bg-nxl-gold/20 transition-colors duration-300">
                    <div className="w-8 h-8 bg-nxl-gold rounded-sm"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-grayscale-900">
                    {t('whyChooseQualityTitle')}
                  </h3>
                  <p className="text-grayscale-600 leading-relaxed">
                    {t('whyChooseQualityDesc')}
                  </p>
                </div>

                {/* Feature 2: Design */}
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-nxl-gold/10 rounded-full flex items-center justify-center group-hover:bg-nxl-gold/20 transition-colors duration-300">
                    <div className="w-8 h-8 bg-nxl-gold rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-grayscale-900">
                    {t('whyChooseDesignTitle')}
                  </h3>
                  <p className="text-grayscale-600 leading-relaxed">
                    {t('whyChooseDesignDesc')}
                  </p>
                </div>

                {/* Feature 3: Service */}
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-nxl-gold/10 rounded-full flex items-center justify-center group-hover:bg-nxl-gold/20 transition-colors duration-300">
                    <div className="w-8 h-8 bg-nxl-gold rounded-lg"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-grayscale-900">
                    {t('whyChooseServiceTitle')}
                  </h3>
                  <p className="text-grayscale-600 leading-relaxed">
                    {t('whyChooseServiceDesc')}
                  </p>
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
