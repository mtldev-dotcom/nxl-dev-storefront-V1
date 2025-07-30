import { Metadata } from "next"
import Image from "next/image"
import { getRegion } from "@lib/data/regions"
import { getProductTypesList } from "@lib/data/product-types"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"
import { EnhancedHero } from "@/components/EnhancedHero"
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Next X Level - Premium Canadian Apparel",
  description:
    "Elevate your style with Next X Level's premium Canadian apparel. Versatile designs that transition from chalet to cocktail hour, crafted with luxury materials at accessible prices.",
}

const ProductTypesSection: React.FC<{ locale: string }> = async ({ locale }) => {
  const productTypes = await getProductTypesList(0, 20, [
    "id",
    "value",
    "metadata",
  ])

  const t = await getTranslations({ locale, namespace: 'HomePage' })

  if (!productTypes) {
    return null
  }

  return (
    <Layout className="mb-26 md:mb-36 max-md:gap-x-2">
      <LayoutColumn>
        <h3 className="font-cinzel font-normal text-md md:text-2xl mb-8 md:mb-15">{t('productsTitle')}</h3>
      </LayoutColumn>
      {productTypes.productTypes.map((productType, index) => (
        <LayoutColumn
          key={productType.id}
          start={index % 2 === 0 ? 1 : 7}
          end={index % 2 === 0 ? 7 : 13}
        >
          <LocalizedLink href={`/store?type=${productType.value}`}>
            {typeof productType.metadata?.image === "object" &&
              productType.metadata.image &&
              "url" in productType.metadata.image &&
              typeof productType.metadata.image.url === "string" && (
                <Image
                  src={productType.metadata.image.url}
                  width={1200}
                  height={900}
                  alt={productType.value}
                  className="mb-2 md:mb-8"
                />
              )}
            <p className="text-xs md:text-md">{productType.value}</p>
          </LocalizedLink>
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { countryCode, locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  const region = await getRegion(countryCode)
  console.log(region)
  console.log("////////////////////////////////")
  // Pass the locale explicitly to getTranslations
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  if (!region) {
    return null
  }

  return (
    <>
      {/* Enhanced Hero Section with Animated Gold Lines */}
      <EnhancedHero locale={locale} />

      <div className="pt-8 pb-26 md:pt-26 md:pb-36">
        {/* Collections Section */}
        <CollectionsSection className="mb-22 md:mb-36" locale={locale} />

        {/* About Section */}
        <Layout>
          <LayoutColumn className="col-span-full">
            <h3 className="font-cinzel font-normal text-md md:text-2xl mb-8 md:mb-16">
              {t('aboutTitle')}
            </h3>
            <Image
              src="/images/content/next-level-hoodie-home-about.jpg"
              width={2496}
              height={1400}
              alt="Next X Level premium apparel lifestyle"
              className="mb-8 md:mb-16 max-md:aspect-[3/2] max-md:object-cover"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
            <h2 className="font-cinzel font-normal text-md md:text-2xl">
              {t('aboutHeadline')}
            </h2>
          </LayoutColumn>
          <LayoutColumn
            start={{ base: 1, md: 8 }}
            end={13}
            className="mt-6 md:mt-19"
          >
            <div className="md:text-md">
              <p className="mb-5 md:mb-9">
                {t('aboutDescription1')}
              </p>
              <p className="mb-5 md:mb-3">
                {t('aboutDescription2')}
              </p>
              <LocalizedLink href="/about" variant="underline">
                {t('readMore')}
              </LocalizedLink>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
