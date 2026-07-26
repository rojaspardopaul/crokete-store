"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ImageZoomLens from "@components/product/ImageZoomLens";

const PLACEHOLDER_IMG =
  "/placeholder.png";

// ─── Lightbox Fullscreen Popup ──────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [lbRef, lbApi] = useEmblaCarousel({
    loop: true,
    startIndex,
    duration: 30,
  });
  const [currentIdx, setCurrentIdx] = useState(startIndex);

  useEffect(() => {
    if (!lbApi) return;
    const onSelect = () => setCurrentIdx(lbApi.selectedScrollSnap());
    lbApi.on("select", onSelect);
    return () => lbApi.off("select", onSelect);
  }, [lbApi]);

  // Keyboard navigation + close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") lbApi?.scrollNext();
      if (e.key === "ArrowLeft") lbApi?.scrollPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbApi, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Cerrar"
      >
        <X size={28} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 text-white/70 text-sm font-medium">
        {currentIdx + 1} / {images.length}
      </div>

      {/* Carousel area — stop click propagation so clicking content doesn't close */}
      <div
        className="w-full max-w-3xl mx-auto px-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={() => lbApi?.scrollPrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white p-1.5 lg:p-2.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/25 shadow-lg backdrop-blur-sm transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 lg:w-8 lg:h-8" strokeWidth={2.5} />
          </button>
        )}

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={() => lbApi?.scrollNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white p-1.5 lg:p-2.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/25 shadow-lg backdrop-blur-sm transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 lg:w-8 lg:h-8" strokeWidth={2.5} />
          </button>
        )}

        <div className="overflow-hidden" ref={lbRef}>
          <div className="flex">
            {images.map((img, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] min-w-0 flex items-center justify-center"
              >
                <Image
                  src={img}
                  alt={`Imagen ${i + 1}`}
                  width={900}
                  height={900}
                  className="max-h-[80vh] w-auto h-auto object-contain select-none"
                  draggable={false}
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="mt-4 flex gap-2 justify-center px-4 overflow-x-auto max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => lbApi?.scrollTo(i)}
              className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                currentIdx === i
                  ? "border-white ring-1 ring-white/50"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={img}
                alt={`Miniatura ${i + 1}`}
                width={48}
                height={48}
                className="object-cover w-12 h-12"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Product Gallery ────────────────────────────────────────────────────
const ProductGallery = ({
  images = [],
  selectedImage,
  onImageChange,
  size = "lg",
  enableZoom = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomState, setZoomState] = useState({
    active: false,
    bgX: 0,
    bgY: 0,
    rect: null,
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Single Embla instance — one ref, one carousel
  const [mainRef, mainApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    containScroll: false,
    duration: 30,
  });

  const onMainSelect = useCallback(() => {
    if (!mainApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    if (images[index] && onImageChange) {
      onImageChange(images[index]);
    }
  }, [mainApi, images, onImageChange]);

  const onThumbClick = useCallback(
    (index) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi]
  );

  useEffect(() => {
    if (!mainApi) return;
    mainApi.on("select", onMainSelect);
    onMainSelect();
    return () => mainApi.off("select", onMainSelect);
  }, [mainApi, onMainSelect]);

  useEffect(() => {
    if (!mainApi || !selectedImage) return;
    const idx = images.indexOf(selectedImage);
    if (idx >= 0 && idx !== mainApi.selectedScrollSnap()) {
      mainApi.scrollTo(idx);
    }
  }, [selectedImage, images, mainApi]);

  const handleZoomChange = useCallback((state) => {
    setZoomState(state);
  }, []);

  const mainSize = size === "lg" ? { w: 500, h: 500 } : { w: 420, h: 420 };
  const thumbSize = size === "lg" ? 72 : 56;
  const hasMultipleImages = images.length > 1;
  const zoomFactor = 2.5;
  const currentImage = images[selectedIndex] || "";

  // Zoom panel position (fixed, to the right of the image)
  const zoomPanelStyle = {};
  if (zoomState.active && zoomState.rect) {
    const r = zoomState.rect;
    zoomPanelStyle.position = "fixed";
    zoomPanelStyle.top = r.top;
    zoomPanelStyle.left = r.right + 16;
    zoomPanelStyle.width = r.width;
    zoomPanelStyle.height = r.height;
    zoomPanelStyle.zIndex = 9999;
  }

  // ─── Thumbnails ─────────────────────────────────────────────
  const renderThumbnails = () => {
    if (!hasMultipleImages) return null;
    return (
      <>
        {/* Desktop: vertical strip on the left */}
        <div className="hidden lg:block flex-shrink-0 w-[76px]">
          <div className="overflow-y-auto max-h-[500px]">
            <div className="flex flex-col gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => onThumbClick(i)}
                  onMouseEnter={() => onThumbClick(i)}
                  className={`product-gallery__thumb flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    selectedIndex === i
                      ? "border-kachabazar-500 ring-2 ring-kachabazar-300"
                      : "border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${i + 1}`}
                    width={thumbSize}
                    height={thumbSize}
                    className="object-cover"
                    style={{ width: thumbSize, height: thumbSize }}
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: horizontal strip below (rendered after main image via order) */}
        <div className="lg:hidden mt-3 order-3">
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onThumbClick(i)}
                className={`product-gallery__thumb flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  selectedIndex === i
                    ? "border-kachabazar-500 ring-2 ring-kachabazar-300 scale-105"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  width={56}
                  height={56}
                  className="object-cover"
                  style={{ width: 56, height: 56 }}
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  // ─── Main Image Slides (single Embla ref) ──────────────────
  const renderSlides = () => (
    <div
      className="overflow-hidden rounded-lg"
      ref={hasMultipleImages ? mainRef : undefined}
    >
      <div className={`flex ${hasMultipleImages ? "" : "justify-center"}`}>
        {images.length > 0 ? (
          images.map((img, i) => (
            <div
              key={i}
              className="product-gallery__slide flex-[0_0_100%] min-w-0"
            >
              {enableZoom && size === "lg" ? (
                <ImageZoomLens
                  src={img}
                  alt={`Producto imagen ${i + 1}`}
                  width={mainSize.w}
                  height={mainSize.h}
                  zoomFactor={zoomFactor}
                  onZoomChange={handleZoomChange}
                  onClick={() => setLightboxOpen(true)}
                />
              ) : (
                <Image
                  src={img}
                  alt={`Producto imagen ${i + 1}`}
                  width={mainSize.w}
                  height={mainSize.h}
                  priority={i === 0}
                  className={`aspect-square w-full rounded-lg bg-gray-100 object-cover ${
                    size === "lg" ? "cursor-pointer" : ""
                  }`}
                  draggable={false}
                  onClick={
                    size === "lg" ? () => setLightboxOpen(true) : undefined
                  }
                />
              )}
            </div>
          ))
        ) : (
          <div className="product-gallery__slide flex-[0_0_100%] min-w-0">
            <Image
              src={PLACEHOLDER_IMG}
              alt="Producto sin imagen"
              width={mainSize.w}
              height={mainSize.h}
              className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );

  // === DETAIL PAGE LAYOUT (lg) ===
  if (size === "lg") {
    return (
      <div className="product-gallery product-gallery--lg">
        {/* Flex row: on lg thumbs on left + main image; on mobile stacked */}
        <div className="lg:flex gap-3">
          {renderThumbnails()}

          <div className="flex-1 min-w-0 order-2">
            {renderSlides()}

            {/* Click to expand text */}
            {images.length > 0 && (
              <button
                onClick={() => setLightboxOpen(true)}
                className="mt-2 flex items-center gap-1.5 text-sm text-kachabazar-500 hover:text-kachabazar-600 transition-colors cursor-pointer"
              >
                <ZoomIn size={16} />
                <span className="hidden lg:inline">
                  Click sobre la imagen para ampliar
                </span>
                <span className="lg:hidden">
                  Toca la imagen para ampliar
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Zoom Panel — rendered with fixed position, outside all overflow containers */}
        {enableZoom && zoomState.active && zoomState.rect && (
          <div
            className="zoom-panel rounded-lg border border-gray-200 shadow-2xl overflow-hidden bg-white pointer-events-none"
            style={{
              ...zoomPanelStyle,
              backgroundImage: `url(${currentImage})`,
              backgroundSize: `${zoomFactor * 100}% ${zoomFactor * 100}%`,
              backgroundPosition: `${zoomState.bgX}% ${zoomState.bgY}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}

        {/* Lightbox */}
        {lightboxOpen && images.length > 0 && (
          <Lightbox
            images={images}
            startIndex={selectedIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    );
  }

  // === MODAL LAYOUT (md) ===
  return (
    <div className="product-gallery product-gallery--md">
      {renderSlides()}
      {hasMultipleImages && (
        <div className="mt-3">
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onThumbClick(i)}
                className={`product-gallery__thumb flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  selectedIndex === i
                    ? "border-kachabazar-500 ring-2 ring-kachabazar-300 scale-105"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  width={thumbSize}
                  height={thumbSize}
                  className="object-cover"
                  style={{ width: thumbSize, height: thumbSize }}
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
