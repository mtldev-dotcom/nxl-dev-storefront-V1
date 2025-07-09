"use client"

import * as React from "react"
import { LinkProps } from "next/link"
import { useCountryCode } from "hooks/country-code"
import { Link, LinkOwnProps } from "@/components/Link"
import { useParams, usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"

export const NavigationLink = <RouteInferType,>({
    children,
    href,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"a"> &
    LinkProps<RouteInferType> &
    LinkOwnProps & {
        className?: string
    }) => {
    const countryCode = useCountryCode()
    const params = useParams()
    const locale = params.locale as string || 'en'
    const pathname = usePathname()

    // Build the localized href with both country code and locale
    const localizedHref = countryCode ? `/${countryCode}/${locale}${href}` : href

    // Determine if this link is active
    // Remove country code and locale from pathname for comparison
    const cleanPathname = pathname.replace(`/${countryCode}/${locale}`, '') || '/'
    const isActive = cleanPathname === href ||
        (href === '/' && cleanPathname === '/') ||
        (href !== '/' && cleanPathname.startsWith(href))

    // Active state styling
    const activeClasses = isActive
        ? "text-nxl-gold border-b-2 border-nxl-gold pb-1"
        : "hover:text-nxl-gold transition-colors duration-300"

    return (
        <Link
            {...props}
            href={localizedHref}
            className={twMerge(
                "relative inline-block",
                activeClasses,
                className
            )}
        >
            {children}
        </Link>
    )
} 