"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * PageLoading — Global route-change indicator for Next.js App Router.
 *
 * Shows:
 *  1. A thin animated progress bar at the very top of the viewport
 *  2. A cute animated paw-print icon in the center
 *
 * Detection: listens to click events on <a> elements. If the href points
 * to the same origin but a different path, it considers that a navigation
 * and shows the loader. The loader hides when pathname/searchParams change
 * (meaning Next.js finished rendering the new page).
 */
const PageLoading = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const currentUrl = useRef("");

  // Track current URL so we know when it really changes
  useEffect(() => {
    currentUrl.current = pathname + (searchParams?.toString() || "");
  }, [pathname, searchParams]);

  // When pathname or searchParams change → navigation finished → hide loader
  useEffect(() => {
    setLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  // Intercept clicks on <a> tags to detect client-side navigation
  const handleClick = useCallback(
    (e) => {
      const anchor = e.target.closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      // External links
      const target = anchor.getAttribute("target");
      if (target === "_blank") return;

      // Build the full URL to compare
      let url;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      // Only same-origin navigations
      if (url.origin !== window.location.origin) return;

      const nextUrl = url.pathname + url.search;
      if (nextUrl === currentUrl.current) return;

      // This is a real client-side navigation — show loading
      setLoading(true);

      // Safety timeout: hide after 8s even if something goes wrong
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setLoading(false), 8000);
    },
    []
  );

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleClick]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!loading) return null;

  return (
    <>
      {/* Shimmer bar — fixed top, non-blocking */}
      <div className="page-loading-bar" role="progressbar" aria-label="Cargando" />

      {/* Small paw badge — bottom-right, non-blocking */}
      <div className="page-loading-badge" aria-hidden="true">
        <svg
          className="page-loading-paw-icon"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="32" cy="42" rx="12" ry="10" fill="currentColor" />
          <ellipse cx="18" cy="28" rx="6" ry="7" fill="currentColor" />
          <ellipse cx="30" cy="22" rx="5.5" ry="7" fill="currentColor" />
          <ellipse cx="38" cy="22" rx="5.5" ry="7" fill="currentColor" />
          <ellipse cx="48" cy="28" rx="6" ry="7" fill="currentColor" />
        </svg>
      </div>
    </>
  );
};

export default PageLoading;
