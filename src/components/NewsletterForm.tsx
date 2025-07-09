"use client"

import * as React from "react"
import { Button } from "@/components/Button"
import { Form, InputField } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"
import { useTranslations } from 'next-intl'
import { z } from "zod"

const newsletterFormSchema = z.object({
  email: z.string().min(3).email(),
})

interface NewsletterTranslations {
  title: string
  description: string
  thankYou: string
  emailPlaceholder: string
  subscribe: string
  privacyText: string
  privacyLink: string
  consentText: string
}

export const NewsletterForm: React.FC<{
  className?: string;
  translations?: NewsletterTranslations;
  locale?: string;
}> = ({
  className,
  translations: propTranslations,
  locale,
}) => {
    const [isSubmitted, setIsSubmitted] = React.useState(false)

    // Try to use passed translations first, fallback to useTranslations hook
    let t: (key: string) => string

    if (propTranslations) {
      t = (key: string) => propTranslations[key as keyof NewsletterTranslations] || key
    } else {
      try {
        t = useTranslations('Newsletter')
      } catch (error) {
        // Fallback translations based on locale
        t = (key: string) => {
          const fallbacks: { [key: string]: string } = {
            'title': locale === 'fr' ? 'Rejoignez notre newsletter' : 'Join our newsletter',
            'description': locale === 'fr' ? 'Nous vous enverrons aussi nos coupons de réduction!' : 'We will also send you our discount coupons!',
            'thankYou': locale === 'fr' ? 'Merci de vous être abonné à notre newsletter!' : 'Thank you for subscribing to our newsletter!',
            'emailPlaceholder': locale === 'fr' ? 'Votre courriel' : 'Your email',
            'subscribe': locale === 'fr' ? 'S\'abonner' : 'Subscribe',
            'privacyText': locale === 'fr' ? 'En vous abonnant, vous acceptez notre' : 'By subscribing you agree to with our',
            'privacyLink': locale === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy',
            'consentText': locale === 'fr' ? 'et consentez à recevoir des mises à jour de notre entreprise.' : 'and provide consent to receive updates from our company.'
          }
          return fallbacks[key] || key
        }
      }
    }

    return (
      <div className={className}>
        <h2 className="text-md md:text-lg mb-2 md:mb-1">{t('title')}</h2>
        {isSubmitted ? (
          <p className="max-md:text-xs">
            {t('thankYou')}
          </p>
        ) : (
          <>
            <p className="max-md:text-xs mb-4">
              {t('description')}
            </p>
            <Form
              onSubmit={() => {
                setIsSubmitted(true)
              }}
              schema={newsletterFormSchema}
            >
              <div className="flex gap-2">
                <InputField
                  inputProps={{
                    uiSize: "sm",
                    className: "rounded-xs",
                    autoComplete: "email",
                  }}
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="mb-4 flex-1"
                />
                <Button type="submit" size="sm" className="h-9 text-xs">
                  {t('subscribe')}
                </Button>
              </div>
            </Form>
            <p className="text-xs text-grayscale-500">
              {t('privacyText')}{" "}
              <LocalizedLink
                href="/privacy-policy"
                variant="underline"
                className="!pb-0"
              >
                {t('privacyLink')}
              </LocalizedLink>{" "}
              {t('consentText')}
            </p>
          </>
        )}
      </div>
    )
  }
