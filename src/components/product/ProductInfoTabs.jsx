"use client";

import { useState, useRef, useLayoutEffect } from "react";
import NutritionSection from "@components/product/NutritionSection";
import IndicationsSection from "@components/product/IndicationsSection";
import TechnicalSpecsSection from "@components/product/TechnicalSpecsSection";
import QuickBenefits from "@components/product/QuickBenefits";
import PetCompatibilityChips from "@components/product/PetCompatibilityChips";
import ConsumptionGuideCard from "@components/product/ConsumptionGuideCard";

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ProductInfoTabs = ({ product, showingTranslateValue, reviewsPanel, descriptionPanel, effectivePackageInfo }) => {
  // Set de índices abiertos — reviews (0) siempre abierto por defecto
  const [openSet, setOpenSet] = useState(() => new Set([0]));
  const scrollYRef = useRef(null);
  const productType = product?.productType;

  // Restaurar scroll tras cada re-render causado por toggle
  useLayoutEffect(() => {
    if (scrollYRef.current !== null) {
      window.scrollTo(0, scrollYRef.current);
      scrollYRef.current = null;
    }
  });

  const toggle = (i) => {
    scrollYRef.current = window.scrollY;
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const sections = [];

  // Reviews (siempre primero)
  sections.push({ label: "Opiniones de clientes", content: reviewsPanel });

  // Descripción
  sections.push({ label: "Descripción", content: descriptionPanel });

  // Beneficios
  const hasBenefits =
    (product?.benefits && showingTranslateValue(product.benefits)) ||
    (product?.features && showingTranslateValue(product.features));
  if (hasBenefits) {
    sections.push({
      label: "Beneficios",
      content: (
        <div className="pb-4">
          <QuickBenefits
            benefits={product.benefits}
            features={product.features}
            showingTranslateValue={showingTranslateValue}
          />
        </div>
      ),
    });
  }

  // Nutrición (solo food)
  if (productType === "food") {
    const hasNutrition =
      product?.nutritionTable?.guaranteedAnalysis?.length > 0 ||
      (product?.ingredients && showingTranslateValue(product.ingredients)) ||
      (product?.feedingGuide && showingTranslateValue(product.feedingGuide));
    if (hasNutrition) {
      sections.push({
        label: "Nutrición",
        content: (
          <div className="pb-4">
            <NutritionSection
              nutritionTable={product.nutritionTable}
              ingredients={product.ingredients}
              feedingGuide={product.feedingGuide}
              showingTranslateValue={showingTranslateValue}
            />
          </div>
        ),
      });
    }
  }

  // Indicaciones (solo medicine)
  if (productType === "medicine") {
    const hasIndications =
      (product?.indications && showingTranslateValue(product.indications)) ||
      (product?.warnings && showingTranslateValue(product.warnings)) ||
      (product?.dosage && showingTranslateValue(product.dosage));
    if (hasIndications) {
      sections.push({
        label: "Indicaciones",
        content: (
          <div className="pb-4">
            <IndicationsSection
              indications={product.indications}
              warnings={product.warnings}
              dosage={product.dosage}
              showingTranslateValue={showingTranslateValue}
            />
          </div>
        ),
      });
    }
  }

  // Especificaciones (solo accessory)
  if (productType === "accessory" && product?.technicalSpecs?.length > 0) {
    sections.push({
      label: "Especificaciones",
      content: (
        <div className="pb-4">
          <TechnicalSpecsSection
            technicalSpecs={product.technicalSpecs}
            showingTranslateValue={showingTranslateValue}
          />
        </div>
      ),
    });
  }

  // Guía de consumo (solo food, si hay datos)
  if (productType === "food" && product?.consumptionGuide?.length > 0) {
    sections.push({
      label: "Guía de consumo",
      content: (
        <div className="pb-4">
          <ConsumptionGuideCard
            consumptionGuide={product.consumptionGuide}
            packageInfo={product.packageInfo}
            effectivePackageInfo={effectivePackageInfo}
            nutritionTable={product.nutritionTable}
            petCompatibility={product.petCompatibility}
            productId={product._id}
          />
        </div>
      ),
    });
  }

  // Compatibilidad
  const hasPetCompat =
    product?.petCompatibility?.petType?.length > 0 ||
    product?.petCompatibility?.ageRange?.length > 0 ||
    product?.petCompatibility?.size?.length > 0;
  if (hasPetCompat) {
    sections.push({
      label: "Compatibilidad",
      content: (
        <div className="pb-4">
          <PetCompatibilityChips
            petCompatibility={product.petCompatibility}
            recommendedFor={product.recommendedFor}
            showingTranslateValue={showingTranslateValue}
          />
        </div>
      ),
    });
  }

  return (
    <div className="divide-y divide-gray-200 border-t border-gray-200">
      {sections.map((section, i) => {
        const isOpen = openSet.has(i);
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left hover:bg-gray-50/60 transition-colors duration-200"
              aria-expanded={isOpen}
            >
              <span className={`text-sm font-semibold transition-colors duration-200 ${isOpen ? "text-kachabazar-600" : "text-gray-800"}`}>
                {section.label}
              </span>
              <ChevronIcon open={isOpen} />
            </button>
            {/* grid-template-rows trick: anima al tamaño real sin saltos de layout */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                {section.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductInfoTabs;


