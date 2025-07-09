import { Metadata } from "next"
import { notFound } from "next/navigation"

import { sdk } from "@lib/config"
import { getRegion, listRegions } from "@lib/data/regions"
import {
  getProductByHandle,
  getProductFashionDataByHandle,
} from "@lib/data/products"
import ProductTemplate from "@modules/products/templates"

// Inline type for materials prop, matching ProductTemplate
type ProductMaterial = {
  id: string
  name: string
  colors: {
    id: string
    name: string
    hex_code: string
  }[]
}
type ProductTemplateMaterials = ProductMaterial[]

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then(
      (regions) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )

    if (!countryCodes) {
      return []
    }

    const { products } = await sdk.store.product.list(
      { fields: "handle" },
      { next: { tags: ["products"] } }
    )

    const staticParams = countryCodes
      ?.map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((product) => product.handle)

    return staticParams
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

// Helper to fetch product and region once
async function fetchProductAndRegion(handle: string, countryCode: string) {
  const region = await getRegion(countryCode)
  if (!region) return { product: null, region: null }
  const product = await getProductByHandle(handle, region.id)
  return { product, region }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = await params
  const { product } = await fetchProductAndRegion(handle, countryCode)
  if (!product) notFound()
  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  // Debug: log the full params object
  console.log('ProductPage Debug: Params', params)

  const { handle, countryCode } = await params
  // Debug: log the extracted handle and countryCode
  console.log('ProductPage Debug: Extracted', { handle, countryCode })

  const { product: pricedProduct, region } = await fetchProductAndRegion(handle, countryCode)
  // Debug: log the region lookup result
  console.log('ProductPage Debug: Region lookup', { countryCode, region })

  if (!region) {
    console.log('ProductPage Debug: Region not found', { countryCode, handle })
    notFound()
  }

  // Debug: log the API call params and result
  console.log('ProductPage Debug: API call', { handle, regionId: region.id, pricedProduct })

  if (!pricedProduct) {
    console.log('ProductPage Debug: Product not found', { handle, regionId: region.id })
    notFound()
  }

  // Fetch fashion data separately (can fail without breaking the page)
  let materials: ProductTemplateMaterials = []
  try {
    const result = await getProductFashionDataByHandle(handle)
    materials = result.materials
  } catch (e) {
    console.warn('ProductPage Debug: Fashion data fetch failed', e)
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      materials={materials}
      region={region}
      countryCode={countryCode}
    />
  )
}
