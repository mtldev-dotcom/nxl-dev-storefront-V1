import { Metadata } from "next"
import { headers } from "next/headers"
import { getBaseURL } from "@lib/util/env"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: {
  children: React.ReactNode;
  params: Promise<{ countryCode: string; locale: string }>;
}) {
  const { locale, countryCode } = await props.params

  // Get the current path from headers
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const currentPath = pathname.split(`/${countryCode}`)[1] || pathname

  return (
    <>
      <Header locale={locale} />
      {props.children}
      <Footer locale={locale} currentPath={currentPath} />
    </>
  )
}
