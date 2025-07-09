"use client"

import * as React from "react"
import { LinkProps } from "next/link"
import { useCountryCode } from "hooks/country-code"
import { Link, LinkOwnProps } from "@/components/Link"
import { ButtonLink, ButtonOwnProps } from "@/components/Button"
import { useParams } from "next/navigation"

export const LocalizedLink = <RouteInferType,>({
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"a"> &
  LinkProps<RouteInferType> &
  LinkOwnProps) => {
  const countryCode = useCountryCode()
  const params = useParams()
  const locale = params.locale as string || 'en'

  // Build the localized href with both country code and locale
  const localizedHref = countryCode ? `/${countryCode}/${locale}${href}` : href

  return (
    <Link {...props} href={localizedHref}>
      {children}
    </Link>
  )
}

export const LocalizedButtonLink = <RouteInferType,>({
  children,
  href,
  ...props
}: ButtonOwnProps &
  Omit<LinkProps<RouteInferType>, "passHref"> & {
    className?: string
    children?: React.ReactNode
  }) => {
  const countryCode = useCountryCode()
  const params = useParams()
  const locale = params.locale as string || 'en'

  // Build the localized href with both country code and locale
  const localizedHref = countryCode ? `/${countryCode}/${locale}${href}` : href

  return (
    <ButtonLink {...props} href={localizedHref}>
      {children}
    </ButtonLink>
  )
}
