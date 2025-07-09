"use client"

import * as React from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { Button } from "@/components/Button"
import { routing } from "../i18n/routing"

interface LanguageSwitcherProps {
    className?: string
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    className
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()

    const currentLocale = params.locale as string
    const countryCode = params.countryCode as string

    const switchLanguage = (newLocale: string) => {
        if (newLocale === currentLocale) return

        // Replace the current locale in the pathname with the new one
        const pathSegments = pathname.split('/').filter(Boolean)

        // The structure is: /[countryCode]/[locale]/...rest
        if (pathSegments.length >= 2) {
            pathSegments[1] = newLocale
            const newPathname = '/' + pathSegments.join('/')
            router.push(newPathname)
        } else {
            // Fallback: construct the new path
            const newPath = `/${countryCode}/${newLocale}`
            router.push(newPath)
        }
    }

    const getLanguageLabel = (locale: string) => {
        switch (locale) {
            case 'en':
                return 'EN'
            case 'fr':
                return 'FR'
            default:
                return locale.toUpperCase()
        }
    }

    const getLanguageName = (locale: string) => {
        switch (locale) {
            case 'en':
                return 'English'
            case 'fr':
                return 'Français'
            default:
                return locale
        }
    }

    return (
        <div className={twJoin("flex items-center gap-2", className)}>
            {routing.locales.map((locale) => (
                <Button
                    key={locale}
                    variant={locale === currentLocale ? "solid" : "ghost"}
                    size="sm"
                    onPress={() => switchLanguage(locale)}
                    className={twJoin(
                        "text-xs px-2 py-1 min-w-[32px] transition-colors",
                        locale === currentLocale
                            ? "pointer-events-none md:bg-white md:text-black group-data-[sticky=true]:md:bg-black group-data-[sticky=true]:md:text-white"
                            : "md:text-white group-data-[sticky=true]:md:text-black md:hover:bg-white/10 group-data-[sticky=true]:md:hover:bg-black/10"
                    )}
                    aria-label={`Switch to ${getLanguageName(locale)}`}
                >
                    {getLanguageLabel(locale)}
                </Button>
            ))}
        </div>
    )
} 