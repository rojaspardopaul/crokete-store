"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * ImageZoomLens – hover indicator on the main image + reports position
 * to parent so the zoom panel can be rendered outside overflow containers.
 *
 * Uses native DOM addEventListener (Pointer Events API) instead of React
 * synthetic events to guarantee events are received even inside Embla
 * Carousel's transformed / overflow-hidden viewport.
 */
const ImageZoomLens = ({
  src,
  alt,
  width = 500,
  height = 500,
  zoomFactor = 2.5,
  onZoomChange,
  onClick,
  className = "",
}) => {
  const containerRef = useRef(null);
  const [hover, setHover] = useState({ active: false, x: 0, y: 0 });

  /* ---- keep latest callbacks in refs so the effect never re-attaches ---- */
  const cbRef = useRef({ onZoomChange, onClick });
  cbRef.current.onZoomChange = onZoomChange;
  cbRef.current.onClick = onClick;

  // Indicator size as fraction of container
  const indicatorW = (1 / zoomFactor) * 100;
  const indicatorH = indicatorW;

  const computeZoom = useCallback(
    (normX, normY) => {
      const clampedX = Math.max(
        indicatorW / 2,
        Math.min(100 - indicatorW / 2, normX * 100)
      );
      const clampedY = Math.max(
        indicatorH / 2,
        Math.min(100 - indicatorH / 2, normY * 100)
      );
      const bgX =
        ((clampedX - indicatorW / 2) / (100 - indicatorW)) * 100;
      const bgY =
        ((clampedY - indicatorH / 2) / (100 - indicatorH)) * 100;
      return { clampedX, clampedY, bgX, bgY };
    },
    [indicatorW, indicatorH]
  );

  /* ---- native DOM pointer-event listeners ---- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const normX = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      const normY = Math.max(
        0,
        Math.min(1, (e.clientY - rect.top) / rect.height)
      );
      setHover({ active: true, x: normX, y: normY });

      const iW = (1 / zoomFactor) * 100;
      const iH = iW;
      const clX = Math.max(iW / 2, Math.min(100 - iW / 2, normX * 100));
      const clY = Math.max(iH / 2, Math.min(100 - iH / 2, normY * 100));
      const bgX = ((clX - iW / 2) / (100 - iW)) * 100;
      const bgY = ((clY - iH / 2) / (100 - iH)) * 100;

      cbRef.current.onZoomChange?.({ active: true, bgX, bgY, rect });
    };

    const onPointerLeave = () => {
      setHover({ active: false, x: 0, y: 0 });
      cbRef.current.onZoomChange?.({
        active: false,
        bgX: 0,
        bgY: 0,
        rect: null,
      });
    };

    const onClickNative = () => {
      cbRef.current.onClick?.();
    };

    el.addEventListener("pointerenter", onPointerMove);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("click", onClickNative);

    return () => {
      el.removeEventListener("pointerenter", onPointerMove);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("click", onClickNative);
    };
  }, [zoomFactor]);

  const { clampedX, clampedY } = hover.active
    ? computeZoom(hover.x, hover.y)
    : { clampedX: 50, clampedY: 50 };

  return (
    <div
      ref={containerRef}
      className={`zoom-lens-container relative rounded-lg bg-gray-100 overflow-hidden cursor-crosshair ${className}`}
      style={{ touchAction: "auto" }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className="aspect-square w-full object-cover rounded-lg"
        draggable={false}
        style={{ pointerEvents: "none" }}
      />

      {/* Hover indicator overlay */}
      {hover.active && (
        <>
          {/* Darken the image */}
          <div className="absolute inset-0 bg-black/25 pointer-events-none rounded-lg" />
          {/* Bright window showing the zoomed area */}
          <div
            className="zoom-indicator pointer-events-none absolute border-2 border-white/80"
            style={{
              width: `${indicatorW}%`,
              height: `${indicatorH}%`,
              left: `${clampedX - indicatorW / 2}%`,
              top: `${clampedY - indicatorH / 2}%`,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "brightness(1.6)",
            }}
          />
        </>
      )}
    </div>
  );
};

export default ImageZoomLens;
