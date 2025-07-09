import * as React from "react"
import { listRegions } from "@lib/data/regions"
import { SearchField } from "@/components/SearchField"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { NavigationLink } from "@/components/NavigationLink"
import { HeaderDrawer } from "@/components/HeaderDrawer"
import { RegionSwitcher } from "@/components/RegionSwitcher"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { HeaderWrapper } from "@/components/HeaderWrapper"
import { getTranslations } from 'next-intl/server'

import dynamic from "next/dynamic"

const LoginLink = dynamic(
  () => import("@modules/header/components/LoginLink"),
  { loading: () => <></> }
)

const CartDrawer = dynamic(
  () => import("@/components/CartDrawer").then((mod) => mod.CartDrawer),
  { loading: () => <></> }
)

export const Header: React.FC<{
  locale?: string;
}> = async ({ locale }) => {
  const regions = await listRegions()

  // Use the passed locale or default to 'en'
  const currentLocale = locale || 'en'
  const t = await getTranslations({ locale: currentLocale, namespace: 'Navigation' })

  const countryOptions = regions
    .map((r) => {
      return (r.countries ?? []).map((c) => ({
        country: c.iso_2,
        region: r.id,
        label: c.display_name,
      }))
    })
    .flat()
    .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))

  return (
    <>
      <HeaderWrapper>
        <Layout>
          <LayoutColumn>
            <div className="flex justify-between items-center h-18 md:h-21">
              {/* Logo: always black on product page */}
              <h1 className="font-cinzel font-normal text-md md:text-white group-data-[sticky=true]:md:text-black product-header:text-black transition-colors">
                <LocalizedLink href="/">Next <span className="text-nxl-gold">X</span> LEVEL</LocalizedLink>
              </h1>
              <div className="flex items-center gap-8 max-md:hidden md:text-white group-data-[sticky=true]:md:text-black product-header:text-black transition-colors">
                <NavigationLink href="/" className="md:text-white group-data-[sticky=true]:md:text-black product-header:text-black [&.text-nxl-gold]:!text-nxl-gold">{t('home')}</NavigationLink>
                <NavigationLink href="/about" className="md:text-white group-data-[sticky=true]:md:text-black product-header:text-black [&.text-nxl-gold]:!text-nxl-gold">{t('about')}</NavigationLink>
                <NavigationLink href="/store" className="md:text-white group-data-[sticky=true]:md:text-black product-header:text-black [&.text-nxl-gold]:!text-nxl-gold">{t('shop')}</NavigationLink>
                <NavigationLink href="/contact" className="md:text-white group-data-[sticky=true]:md:text-black product-header:text-black [&.text-nxl-gold]:!text-nxl-gold">{t('contact')}</NavigationLink>
              </div>
              <div className="flex items-center gap-3 lg:gap-6 max-md:hidden product-header:text-black">
                <LanguageSwitcher className="ml-2" />
                <React.Suspense>
                  <SearchField countryOptions={countryOptions} />
                </React.Suspense>
                <LoginLink className="p-1 md:text-white group-data-[sticky=true]:md:text-black product-header:text-black" />
                <CartDrawer />
              </div>
              <div className="flex items-center gap-4 md:hidden product-header:text-black">
                <LoginLink className="p-1 md:text-white group-data-[sticky=true]:md:text-black product-header:text-black" />
                <CartDrawer />
                <React.Suspense>
                  <HeaderDrawer countryOptions={countryOptions} />
                </React.Suspense>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </HeaderWrapper>
    </>
  )
}
