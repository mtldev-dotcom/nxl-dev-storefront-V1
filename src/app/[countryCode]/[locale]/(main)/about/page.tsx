import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })

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

export default async function AboutPage({
  params
}: {
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })

  return (
    <>
      {/* About Page Hero Section */}
      <div className="relative overflow-hidden">
        {/* Hero Image */}
        <Image
          src="/images/content/next-level-about-hero.png"
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 flex items-center pt-20 md:pt-24 lg:pt-28">
          <Layout className="relative z-20">
            <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
              <div className="px-4 md:pl-8 lg:pl-16">
                {/* About Hero Title */}
                <h1 className="text-white text-lg md:text-4xl lg:text-5xl xl:text-6xl font-cinzel font-normal leading-tight md:leading-tight lg:leading-tight mb-6 md:mb-8 hero-text-shadow">
                  <span className="block opacity-0 animate-slide-in-delay-1">
                    {t('heroTitle').includes('Next X Level') ? (
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

                {/* About Hero Subtitle */}
                {/* <p className="text-white text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-md md:max-w-lg lg:max-w-xl leading-relaxed hero-text-shadow opacity-0 animate-slide-in-delay-4">
                  {t('heroSubtitle')}
                </p> */}

                {/* About CTA Button */}
                {/* <div className="opacity-0 animate-slide-in-delay-5">
                  <LocalizedLink
                    href="#content"
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

      <div id="content" className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="font-cinzel font-normal text-md max-lg:mb-6 md:text-2xl">
              {t('mainHeadline')}
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                {t('introParagraph1')}
              </p>
              <p>
                {t('introParagraph2')}
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn>
            <Image
              src="/images/content/launch-event2.png"
              width={2496}
              height={1404}
              alt={t('brandImageAlt')}
              className="mt-26 lg:mt-36 mb-8 lg:mb-26"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
            <h3 className="font-cinzel font-normal text-md lg:mb-10 mb-6 md:text-2xl">
              {t('elevateHeadline')}
            </h3>
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, lg: 6 }}>
            <div className="mb-16 lg:mb-26">
              <p className="mb-5 md:mb-9">
                {t('qualityParagraph1')}
              </p>
              <p>
                {t('qualityParagraph2')}
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 2, lg: 1 }} end={{ base: 12, lg: 7 }}>
            <Image
              src="/images/content/nxl-girl-gray-pink-hoodie.png"
              width={1200}
              height={1600}
              alt={t('designImageAlt')}
              className="mb-16 lg:mb-46"
            />
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="mb-6 lg:mb-20 xl:mb-36">
              <p>
                {t('designParagraph')}
              </p>
            </div>
            <div className="md:text-md max-lg:mb-26">
              <p>
                {t('sustainabilityParagraph')}
              </p>
            </div>
          </LayoutColumn>
        </Layout>
        {/* <Image
          src="pascal-nxl.jpg"
          width={2880}
          height={1618}
          alt=""
          className="mb-8 lg:mb-26"
        /> */}
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="font-cinzel font-normal text-md max-lg:mb-6 md:text-2xl">
              {t('customerHeadline')}
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                {t('customerParagraph1')}
              </p>
              <p>
                {t('customerParagraph2')}
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
