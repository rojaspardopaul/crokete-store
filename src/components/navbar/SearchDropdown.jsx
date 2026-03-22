"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";

// ─── Inline icons ───────────────────────────────────────────────────────────

const TagIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const LayersIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Helpers ────────────────────────────────────────────────────────────────

const getTranslated = (obj) => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj.es || obj.en || Object.values(obj)[0] || "";
};

const formatPrice = (price) => {
  if (price == null) return "";
  return `$${Number(price).toFixed(2)}`;
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const ProductItem = memo(({ product, onSelect }) => {
  const title = getTranslated(product.title);
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onSelect}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-kachabazar-50 transition-colors duration-150 group"
    >
      {/* Image */}
      <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={title}
            fill
            sizes="48px"
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <SearchIcon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-kachabazar-700 transition-colors">
          {title}
        </p>
        {product.category && (
          <p className="text-xs text-gray-400 truncate">
            {getTranslated(product.category.name)}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <span className="text-sm font-semibold text-gray-900">
          {formatPrice(product.price)}
        </span>
        {hasDiscount && (
          <span className="block text-xs text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>
    </Link>
  );
});
ProductItem.displayName = "ProductItem";

// ─── Main Component ─────────────────────────────────────────────────────────

const SearchDropdown = ({
  results,
  isLoading,
  query,
  onSelect,
  activeIndex,
  style,
}) => {
  const { products = [], categories = [], brands = [], totalCount = 0 } = results || {};

  // Nothing to show
  if (!isLoading && !query) return null;

  return (
    <div style={style} className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto overscroll-contain sm:w-[520px] sm:max-w-none sm:left-0 sm:right-auto">
      {/* Loading state */}
      {isLoading && (
        <div className="px-4 py-6 flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-kachabazar-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Buscando...</span>
        </div>
      )}

      {/* No results */}
      {!isLoading && query && products.length === 0 && (
        <div className="px-4 py-8 text-center">
          <SearchIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            No encontramos resultados para{" "}
            <strong className="text-gray-700">&ldquo;{query}&rdquo;</strong>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Prueba con otro término o navega por categorías
          </p>
        </div>
      )}

      {/* Results */}
      {!isLoading && products.length > 0 && (
        <>
          {/* Products header */}
          <div className="px-4 pt-3 pb-1">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <SearchIcon className="w-3.5 h-3.5" />
              Productos
              <span className="text-gray-300 font-normal">
                ({totalCount > 20 ? "20+" : products.length})
              </span>
            </p>
          </div>

          {/* Product list */}
          <div className="py-1">
            {products.slice(0, 8).map((product, index) => (
              <div
                key={product._id}
                className={activeIndex === index ? "bg-kachabazar-50" : ""}
              >
                <ProductItem product={product} onSelect={onSelect} />
              </div>
            ))}
          </div>

          {/* See all results */}
          {totalCount > 8 && (
            <div className="border-t border-gray-100">
              <Link
                href={`/search?query=${encodeURIComponent(query)}`}
                onClick={onSelect}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-kachabazar-600 hover:bg-kachabazar-50 transition-colors"
              >
                Ver todos los resultados ({totalCount})
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Divider */}
          {(categories.length > 0 || brands.length > 0) && (
            <div className="border-t border-gray-100 mx-4" />
          )}

          {/* Categories — quick links */}
          {categories.length > 0 && (
            <div className="px-4 pt-3 pb-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <LayersIcon className="w-3.5 h-3.5" />
                Categorías
              </p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/search?_id=${cat._id}`}
                    onClick={onSelect}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-kachabazar-100 hover:text-kachabazar-700 transition-colors"
                  >
                    {getTranslated(cat.name)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Brands — quick links */}
          {brands.length > 0 && (
            <div className="px-4 pt-2 pb-3">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5" />
                Marcas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {brands.map((brand) => (
                  <Link
                    key={brand._id}
                    href={`/search?brand=${brand._id}`}
                    onClick={onSelect}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-kachabazar-100 hover:text-kachabazar-700 transition-colors"
                  >
                    {getTranslated(brand.name)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchDropdown;
