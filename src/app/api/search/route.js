import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Lightweight search proxy — returns products grouped by category & brand.
 * Called client-side from the SearchInput dropdown.
 * Caps at 20 products to keep the dropdown fast.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [], categories: [], brands: [] });
  }

  try {
    const res = await fetch(
      `${API_BASE}/products/store?title=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ products: [], categories: [], brands: [] });
    }

    const data = await res.json();
    const allProducts = data.products || [];

    // Take top 20 for the dropdown
    const products = allProducts.slice(0, 20).map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      image: p.image?.[0] || null,
      price: p.isCombination
        ? p.variants?.[0]?.price
        : p.prices?.price,
      originalPrice: p.isCombination
        ? p.variants?.[0]?.originalPrice
        : p.prices?.originalPrice,
      category: p.category
        ? { _id: p.category._id, name: p.category.name }
        : null,
      brand: p.brand
        ? { _id: p.brand._id, name: p.brand.name }
        : null,
      stock: p.stock,
    }));

    // Extract unique categories
    const catMap = new Map();
    products.forEach((p) => {
      if (p.category?._id && !catMap.has(p.category._id)) {
        catMap.set(p.category._id, p.category);
      }
    });

    // Extract unique brands
    const brandMap = new Map();
    products.forEach((p) => {
      if (p.brand?._id && !brandMap.has(p.brand._id)) {
        brandMap.set(p.brand._id, p.brand);
      }
    });

    return NextResponse.json({
      products,
      categories: Array.from(catMap.values()),
      brands: Array.from(brandMap.values()),
      totalCount: allProducts.length,
    });
  } catch {
    return NextResponse.json({ products: [], categories: [], brands: [] });
  }
}
