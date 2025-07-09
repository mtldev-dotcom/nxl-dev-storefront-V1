"use client"

import * as React from "react"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Drawer } from "@/components/Drawer"
import { LocalizedLink } from "@/components/LocalizedLink"
import { NavigationLink } from "@/components/NavigationLink"
import { RegionSwitcher } from "@/components/RegionSwitcher"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { SearchField } from "@/components/SearchField"
import { useSearchParams, useParams } from "next/navigation"
import { useTranslations } from 'next-intl'

export const HeaderDrawer: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
}> = ({ countryOptions }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const t = useTranslations('Navigation')
  const { locale } = useParams()

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  React.useEffect(() => {
    if (searchQuery) setIsMenuOpen(false)
  }, [searchQuery])

  return (
    <>
      <Button
        variant="ghost"
        className="p-1 md:text-white group-data-[sticky=true]:md:text-black"
        onPress={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" className="w-6 h-6" wrapperClassName="w-6 h-6" />
      </Button>
      <Drawer
        animateFrom="left"
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        className="rounded-none !p-0"
      >
        {({ close }) => (
          <>
            <div className="flex flex-col text-white h-full">
              <div className="flex items-center justify-between pb-6 mb-8 pt-5 w-full border-b border-white px-8">
                <SearchField
                  countryOptions={countryOptions}
                  isInputAlwaysShown
                />
                <button onClick={close} aria-label="Close menu">
                  <Icon name="close" className="w-6" />
                </button>
              </div>
              <div className="text-lg flex flex-col gap-8 font-medium px-8">
                <NavigationLink
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white [&.text-nxl-gold]:!text-nxl-gold border-nxl-gold"
                >
                  {t('home')}
                </NavigationLink>
                <NavigationLink
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white [&.text-nxl-gold]:!text-nxl-gold border-nxl-gold"
                >
                  {t('about')}
                </NavigationLink>
                <NavigationLink
                  href="/store"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white [&.text-nxl-gold]:!text-nxl-gold border-nxl-gold"
                >
                  {t('shop')}
                </NavigationLink>
                <NavigationLink
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white [&.text-nxl-gold]:!text-nxl-gold border-nxl-gold"
                >
                  {t('contact')}
                </NavigationLink>
              </div>
              <div className="mt-auto px-8 mb-8 space-y-6">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                    {t('language')}
                  </span>
                  <div className="flex gap-2">
                    <LanguageSwitcher
                      className="[&>button]:!bg-transparent [&>button]:!text-white [&>button]:border [&>button]:border-white/20 [&>button]:hover:bg-white/10 [&>button[data-pressed=true]]:!bg-nxl-gold [&>button[data-pressed=true]]:!text-black [&>button[data-pressed=true]]:border-nxl-gold [&>button]:min-w-[48px] [&>button]:h-[44px] [&>button]:text-sm [&>button]:font-medium"
                    />
                  </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                    {t('region')}
                  </span>
                  <RegionSwitcher
                    countryOptions={countryOptions}
                    className=""
                    selectButtonClassName="max-md:text-base gap-2 p-1 w-auto"
                    selectIconClassName="text-current w-6 h-6"
                  />
                </div> */}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
