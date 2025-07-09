"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useCountryCode } from "hooks/country-code"
import clsx from 'clsx'

export const HeaderWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const pathName = usePathname()
  const countryCode = useCountryCode()
  const currentPath = countryCode
    ? pathName.split(`/${countryCode}`)[1]
    : pathName
  const isPageWithHeroImage =
    !currentPath ||
    currentPath === "/" ||
    currentPath === "/about" ||
    currentPath === "/inspiration" ||
    currentPath.startsWith("/collections")
  const isAlwaysSticky =
    currentPath.startsWith("/auth") || currentPath.startsWith("/account")
  const isProductPage = pathName.includes('/products/')

  React.useEffect(() => {
    if (isAlwaysSticky) {
      return
    }

    const headerElement = document.querySelector("#site-header")

    if (!headerElement) {
      return
    }

    const nextElement = headerElement.nextElementSibling
    let triggerPosition = 0

    const updateTriggerPosition = () => {
      if (isPageWithHeroImage) {
        triggerPosition = nextElement
          ? Math.max(nextElement.clientHeight - headerElement.clientHeight, 1)
          : 200
      } else {
        triggerPosition = nextElement
          ? Math.max(
            Number.parseInt(
              window.getComputedStyle(nextElement).paddingTop,
              10
            ) - headerElement.clientHeight,
            1
          )
          : 1
      }
    }

    const handleScroll = () => {
      const position = window.scrollY
      const isSticky = position > triggerPosition

      headerElement.setAttribute("data-sticky", isSticky ? "true" : "false")
      headerElement.setAttribute("data-light", isSticky ? "false" : "true")
    }

    updateTriggerPosition()
    handleScroll()

    window.addEventListener("resize", updateTriggerPosition, {
      passive: true,
    })
    window.addEventListener("orientationchange", updateTriggerPosition, {
      passive: true,
    })
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener("resize", updateTriggerPosition)
      window.removeEventListener("orientationchange", updateTriggerPosition)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pathName, isPageWithHeroImage, isAlwaysSticky])

  // Build className deterministically for SSR/client match using clsx
  const headerClass = clsx(
    "top-0 left-0 w-full transition-colors fixed z-40 group",
    "max-md:bg-grayscale-50",
    "data-[light=true]:md:text-white",
    "data-[sticky=true]:md:bg-white",
    "data-[sticky=true]:md:text-black",
    "data-[sticky=true]:shadow-lg",
    "data-[sticky=true]:bg-white/95",
    "data-[sticky=true]:backdrop-blur",
    "data-[sticky=true]:transition-all",
    "data-[sticky=true]:duration-200",
    isProductPage && "bg-white shadow-md product-header"
  );

  return (
    <div
      id="site-header"
      className={headerClass}
      data-light={isPageWithHeroImage}
      data-sticky={isAlwaysSticky}
    >
      {children}
    </div>
  )
}
