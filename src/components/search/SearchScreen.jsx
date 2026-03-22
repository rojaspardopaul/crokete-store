"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

//internal import
import ProductCard from "@components/product/ProductCard";
import CategoryCarousel from "@components/carousel/CategoryCarousel";
import { Button } from "@components/ui/button";
import useUtilsFunction from "@hooks/useUtilsFunction";

const SearchScreen = ({
  products,
  attributes,
  categories,
  currency,
  pets = [],
  brands = [],
  currentQuery = "",
  currentCategory = "",
  currentPet = "",
  currentBrand = "",
}) => {
  const router = useRouter();
  const [visibleProduct, setVisibleProduct] = useState(18);
  const [mounted, setMounted] = useState(false);
  const [sortedField, setSortedField] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Optimistic local filter state (avoids flash on select)
  const [localCategory, setLocalCategory] = useState(currentCategory);
  const [localPet, setLocalPet] = useState(currentPet);
  const [localBrand, setLocalBrand] = useState(currentBrand);

  const { showingTranslateValue } = useUtilsFunction();

  useEffect(() => setMounted(true), []);

  // Sync local state when server props arrive
  useEffect(() => setLocalCategory(currentCategory), [currentCategory]);
  useEffect(() => setLocalPet(currentPet), [currentPet]);
  useEffect(() => setLocalBrand(currentBrand), [currentBrand]);

  // Close mobile filters on scroll
  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const handleScroll = () => setMobileFiltersOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileFiltersOpen]);

  // Build parent-only category list (first level only)
  const flatCategories = useMemo(() => {
    const source = categories?.[0]?.children ?? (Array.isArray(categories) ? categories : []);
    return source.filter((cat) => cat.status === "show");
  }, [categories]);

  // Sort products
  const productData = useMemo(() => {
    let data = [...(products || [])];
    if (sortedField === "Low") {
      data.sort((a, b) => (a.prices?.price || 0) - (b.prices?.price || 0));
    } else if (sortedField === "High") {
      data.sort((a, b) => (b.prices?.price || 0) - (a.prices?.price || 0));
    }
    return data;
  }, [products, sortedField]);

  // Navigate with filter params
  const applyFilter = useCallback(
    (overrides = {}) => {
      // Update local state immediately for instant UI feedback
      if (overrides.category !== undefined) setLocalCategory(overrides.category);
      if (overrides.pet !== undefined) setLocalPet(overrides.pet);
      if (overrides.brand !== undefined) setLocalBrand(overrides.brand);

      const params = new URLSearchParams();
      const q = overrides.query !== undefined ? overrides.query : currentQuery;
      const cat =
        overrides.category !== undefined ? overrides.category : currentCategory;
      const p = overrides.pet !== undefined ? overrides.pet : currentPet;
      const b = overrides.brand !== undefined ? overrides.brand : currentBrand;

      if (q) params.set("query", q);
      if (cat) params.set("_id", cat);
      if (p) params.set("pet", p);
      if (b) params.set("brand", b);

      const qs = params.toString();
      router.push(`/search${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, currentQuery, currentCategory, currentPet, currentBrand]
  );

  const clearAllFilters = () => {
    setLocalCategory("");
    setLocalPet("");
    setLocalBrand("");
    if (currentQuery) {
      router.push(`/search?query=${encodeURIComponent(currentQuery)}`, {
        scroll: false,
      });
    } else {
      router.push("/search", { scroll: false });
    }
  };

  const hasActiveFilters = localCategory || localPet || localBrand;

  // Get active filter names for display
  const activeCategory = flatCategories.find(
    (c) => c._id === localCategory
  );
  const activePet = pets.find((p) => p._id === localPet);
  const activeBrand = brands.find((b) => b._id === localBrand);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      {/* ===== FILTER BAR (sticky below navbar) ===== */}
      <div className="sticky top-14 sm:top-20 lg:top-[162px] z-[15] bg-crokete-cream-50 dark:bg-zinc-900 py-1.5">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
          {/* Desktop: horizontal layout */}
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            {/* Category filter */}
            <FilterDropdown
              label="Categoría"
              options={flatCategories.map((cat) => ({
                id: cat._id,
                name: showingTranslateValue(cat.name),
              }))}
              value={localCategory}
              onChange={(val) => applyFilter({ category: val })}
            />

            {/* Pet filter */}
            <FilterDropdown
              label="Mascota"
              options={(pets || []).map((p) => ({
                id: p._id,
                name: showingTranslateValue(p.name),
              }))}
              value={localPet}
              onChange={(val) => applyFilter({ pet: val })}
            />

            {/* Brand filter */}
            <FilterDropdown
              label="Marca"
              options={(brands || []).map((b) => ({
                id: b._id,
                name: showingTranslateValue(b.name),
              }))}
              value={localBrand}
              onChange={(val) => applyFilter({ brand: val })}
            />

            {/* Sort */}
            <div className="ml-auto">
              <select
                onChange={(e) => setSortedField(e.target.value)}
                value={sortedField}
                className="h-9 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              >
                <option value="" hidden>
                  Ordenar
                </option>
                <option value="Low">Menor a Mayor</option>
                <option value="High">Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Mobile: compact layout */}
          <div className="sm:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex-1 flex items-center justify-center gap-2 h-9 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filtros
                {hasActiveFilters && (
                  <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {[currentCategory, currentPet, currentBrand].filter(
                      Boolean
                    ).length}
                  </span>
                )}
              </button>

              <select
                onChange={(e) => setSortedField(e.target.value)}
                value={sortedField}
                className="h-9 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white cursor-pointer focus:ring-0 outline-none flex-1"
              >
                <option value="" hidden>
                  Ordenar
                </option>
                <option value="Low">Menor precio</option>
                <option value="High">Mayor precio</option>
              </select>
            </div>

            {/* Mobile filter panel */}
            {mobileFiltersOpen && (
              <div className="mt-2 space-y-2">
                <FilterDropdown
                  label="Categoría"
                  options={flatCategories.map((cat) => ({
                    id: cat._id,
                    name: showingTranslateValue(cat.name),
                  }))}
                  value={localCategory}
                  onChange={(val) => applyFilter({ category: val })}
                  fullWidth
                />

                <FilterDropdown
                  label="Mascota"
                  options={(pets || []).map((p) => ({
                    id: p._id,
                    name: showingTranslateValue(p.name),
                  }))}
                  value={localPet}
                  onChange={(val) => applyFilter({ pet: val })}
                  fullWidth
                />

                <FilterDropdown
                  label="Marca"
                  options={(brands || []).map((b) => ({
                    id: b._id,
                    name: showingTranslateValue(b.name),
                  }))}
                  value={localBrand}
                  onChange={(val) => applyFilter({ brand: val })}
                  fullWidth
                />
              </div>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="text-xs text-gray-500">Filtros:</span>

            {activeCategory && (
              <FilterChip
                label={showingTranslateValue(activeCategory.name)}
                onRemove={() => applyFilter({ category: "" })}
              />
            )}
            {activePet && (
              <FilterChip
                label={showingTranslateValue(activePet.name)}
                onRemove={() => applyFilter({ pet: "" })}
              />
            )}
            {activeBrand && (
              <FilterChip
                label={showingTranslateValue(activeBrand.name)}
                onRemove={() => applyFilter({ brand: "" })}
              />
            )}

            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors ml-1"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      <div className="pb-6 lg:pb-8">
        {/* Search info header */}
        {currentQuery && (
          <div className="mb-3">
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              Resultados para:{" "}
              <span className="text-emerald-600">
                &ldquo;{decodeURIComponent(currentQuery)}&rdquo;
              </span>
            </h1>
          </div>
        )}

        {/* Results */}
        {productData?.length === 0 ? (
          <div className="mx-auto p-5 my-5">
            <Image
              className="my-4 mx-auto"
              src="/no-result.svg"
              alt="no-result"
              width={400}
              height={380}
            />
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium text-gray-600">
              Lo sentimos, no encontramos productos con estos filtros
            </h2>
            {hasActiveFilters && (
              <div className="text-center mt-4">
                <button
                  onClick={clearAllFilters}
                  className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                >
                  Limpiar filtros y volver a buscar
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-bold">{productData.length}</span>{" "}
                productos encontrados
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5">
              {productData?.slice(0, visibleProduct).map((product, i) => (
                <ProductCard
                  key={i + 1}
                  product={product}
                  attributes={attributes}
                  currency={currency}
                />
              ))}
            </div>

            {productData?.length > visibleProduct && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setVisibleProduct((pre) => pre + 10)}
                  variant="create"
                  className="w-auto mx-auto md:text-sm leading-5 flex items-center transition ease-in-out duration-300 font-medium text-center justify-center px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3"
                >
                  Cargar Más
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ===== FILTER DROPDOWN COMPONENT =====
const FilterDropdown = ({ label, options, value, onChange, fullWidth }) => {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`h-9 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
        value
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "text-gray-600"
      } ${fullWidth ? "w-full" : ""}`}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
};

// ===== FILTER CHIP COMPONENT =====
const FilterChip = ({ label, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
        aria-label={`Quitar filtro: ${label}`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
};

export default dynamic(() => Promise.resolve(SearchScreen), { ssr: false });
