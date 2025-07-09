"use client";

import Product from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"
import { Layout, LayoutColumn } from "@/components/Layout"

export default function RelatedProductsClient({ products }: { products: HttpTypes.StoreProduct[] }) {
    if (!products.length) return null;
    return (
        <>
            <Layout>
                <LayoutColumn className="mt-26 md:mt-36">
                    <h4 className="text-md md:text-2xl mb-8 md:mb-16">
                        Related products
                    </h4>
                </LayoutColumn>
            </Layout>
            <Layout className="gap-y-10 md:gap-y-16">
                {products.map((product) => (
                    <LayoutColumn key={product.id} className="!col-span-6 md:!col-span-4">
                        <Product product={product} />
                    </LayoutColumn>
                ))}
            </Layout>
        </>
    );
} 