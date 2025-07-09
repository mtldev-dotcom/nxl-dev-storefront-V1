"use client"

import * as React from "react"
import Image from "next/image"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { useTranslations } from 'next-intl'

interface EnhancedHeroProps {
    locale: string
    // Page-specific props
    imageSrc?: string
    title?: string
    subtitle?: string
    buttonText?: string
    buttonHref?: string
    showButton?: boolean
    showBrandEmblem?: boolean
    // Translation namespace for dynamic content
    translationNamespace?: string
    titleKey?: string
    subtitleKey?: string
    buttonKey?: string
    imageAltKey?: string
    // Custom height
    height?: string
}

export const EnhancedHero: React.FC<EnhancedHeroProps> = ({
    locale,
    imageSrc = "/images/content/next-level-hoodie-hero.png",
    title,
    subtitle,
    buttonText,
    buttonHref = "/store",
    showButton = true,
    showBrandEmblem = true,
    translationNamespace = "HomePage",
    titleKey = "heroTitle",
    subtitleKey = "heroSubtitle",
    buttonKey = "heroButton",
    imageAltKey = "heroImageAlt",
    height = "md:h-screen"
}) => {
    const t = useTranslations(translationNamespace)

    // Use props or fallback to translations
    const displayTitle = title || t(titleKey)
    const displaySubtitle = subtitle || t(subtitleKey)
    const displayButtonText = buttonText || t(buttonKey)
    const displayImageAlt = t(imageAltKey)

    return (
        <div className="relative overflow-hidden">
            {/* Main Hero Image */}
            <Image
                src={imageSrc}
                width={2880}
                height={1500}
                alt={displayImageAlt}
                className={`${height} md:object-cover w-full`}
                priority
            />

            {/* Animated Gold Lines */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Diagonal lines moving across the image */}
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
                            {/* Animated Main Headline */}
                            <h1 className="text-white text-lg md:text-4xl lg:text-5xl xl:text-6xl font-cinzel font-normal leading-tight md:leading-tight lg:leading-tight mb-6 md:mb-8 hero-text-shadow">
                                {/* Handle special formatting for home page */}
                                {translationNamespace === 'HomePage' ? (
                                    locale === 'fr' ? (
                                        <>
                                            <span className="block opacity-0 animate-slide-in-delay-1">ÉLEVEZ VOTRE STYLE ET</span>
                                            <span className="block opacity-0 animate-slide-in-delay-2">VOTRE MODE DE VIE AU</span>
                                            <span className="block opacity-0 animate-slide-in-delay-3">
                                                <span className="italic">NIVEAU <span className="text-nxl-gold animate-glow">X</span> SUPÉRIEUR</span>.
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="block opacity-0 animate-slide-in-delay-1">TAKE YOUR STYLE &</span>
                                            <span className="block opacity-0 animate-slide-in-delay-2">YOUR LIFESTYLE TO</span>
                                            <span className="block opacity-0 animate-slide-in-delay-3">
                                                THE <span className="italic">NEXT <span className="text-nxl-gold animate-glow">X</span> LEVEL</span>.
                                            </span>
                                        </>
                                    )
                                ) : (
                                    <span className="block opacity-0 animate-slide-in-delay-1">
                                        {displayTitle.includes('Next X Level') || displayTitle.includes('Next Level') ? (
                                            displayTitle.split(/(\bNext\s+X?\s*Level\b)/i).map((part, index) => {
                                                if (part.match(/\bNext\s+X?\s*Level\b/i)) {
                                                    const hasX = part.includes('X')
                                                    if (hasX) {
                                                        return part.split('X').map((subPart, subIndex) => (
                                                            <React.Fragment key={`${index}-${subIndex}`}>
                                                                {subPart}
                                                                {subIndex === 0 && <span className="text-nxl-gold animate-glow">X</span>}
                                                            </React.Fragment>
                                                        ))
                                                    } else {
                                                        return <span key={index} className="text-nxl-gold">{part}</span>
                                                    }
                                                }
                                                return part
                                            })
                                        ) : (
                                            displayTitle
                                        )}
                                    </span>
                                )}
                            </h1>

                            {/* Subtitle */}
                            {/* {displaySubtitle && (
                                <p className="text-white text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-md md:max-w-lg lg:max-w-xl leading-relaxed hero-text-shadow opacity-0 animate-slide-in-delay-4">
                                    {displaySubtitle}
                                </p>
                            )} */}

                            {/* Enhanced CTA Button */}
                            {showButton && (
                                <div className="opacity-0 animate-slide-in-delay-5">
                                    <LocalizedLink
                                        href={buttonHref}
                                        className="group relative inline-block bg-white text-black font-semibold text-sm md:text-base lg:text-lg px-8 md:px-12 lg:px-16 py-3 md:py-4 lg:py-5 transition-all duration-500 tracking-widest uppercase border-2 border-white hover:border-nxl-gold overflow-hidden btn-enhanced"
                                    >
                                        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                            {displayButtonText}
                                        </span>
                                        {/* Button hover effect */}
                                        <div className="absolute inset-0 bg-nxl-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                    </LocalizedLink>
                                </div>
                            )}

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 border border-nxl-gold/30 animate-pulse-slow opacity-0 animate-fade-in-delay-6"></div>
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-white/20 animate-pulse-slow opacity-0 animate-fade-in-delay-7"></div>
                        </div>
                    </LayoutColumn>
                </Layout>
            </div>

            {/* Brand Logo/Emblem in Corner */}
            {showBrandEmblem && (
                <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 opacity-0 animate-fade-in-delay-8">
                    <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-nxl-gold rounded-sm flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <span className="text-nxl-gold font-cinzel font-bold text-xl md:text-2xl animate-glow">X</span>
                        </div>
                        <div className="absolute -inset-2 border border-white/30 rounded-sm animate-pulse-slow"></div>
                    </div>
                </div>
            )}
        </div>
    )
} 