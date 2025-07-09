import { Metadata } from "next"
import { StoreRegion } from "@medusajs/types"
import { Layout, LayoutColumn } from "@/components/Layout"
import { listRegions } from "@lib/data/regions"
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'CookiePolicy' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export async function generateStaticParams() {
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
}

export default async function CookiePolicyPage({
  params
}: {
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'CookiePolicy' })

  return (
    <Layout className="pt-30 pb-20 md:pt-47 md:pb-32">
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <h1 className="text-lg md:text-2xl mb-16 md:mb-25">
          {t('pageTitle')}
        </h1>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 10, xl: 9 }}
        className="article"
      >
        <p>
          {t('intro')}
        </p>
        <h2>{t('section1Title')}</h2>
        <p>
          {t('section1Content')}
        </p>
        <h2>{t('section2Title')}</h2>
        <p>{t('section2Content')}</p>
        <ul>
          <li>
            {t('section2Essential')}
          </li>
          <li>
            {t('section2Analytics')}
          </li>
          <li>
            {t('section2Functionality')}
          </li>
          <li>
            {t('section2Advertising')}
          </li>
        </ul>
        <h2>{t('section3Title')}</h2>
        <p>
          {t('section3Content')}
        </p>
        <h2>{t('section4Title')}</h2>
        <p>
          {t('section4Content')}
        </p>
        <p>
          {t('section4Additional')}
        </p>
        <h2>{t('section5Title')}</h2>
        <p>
          {t('section5Content')}
        </p>
        <h2>{t('section6Title')}</h2>
        <p>
          {t('section6Content')}
        </p>
        <p>
          {t('contactEmail')}
          <br />
          {t('contactAddress')}
        </p>
      </LayoutColumn>
    </Layout>
  )
}
