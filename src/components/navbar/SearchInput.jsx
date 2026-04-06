"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import SearchDropdown from "@components/navbar/SearchDropdown";

// ─── Debounce hook ──────────────────────────────────────────────────────────

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Search icon (inline SVG — no extra dependency) ─────────────────────────

const MagnifyingGlass = ({ className = "h-5 w-5 text-gray-400" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);

const SpinnerIcon = () => (
  <div className="w-5 h-5 border-2 border-kachabazar-400 border-t-transparent rounded-full animate-spin" />
);

// ─── Component ──────────────────────────────────────────────────────────────

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const debouncedQuery = useDebounce(searchText, 300);

  // Sync input with URL query param (when navigating to /search?query=...)
  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchText(decodeURIComponent(query));
      setIsOpen(false);
    }
  }, [searchParams]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setActiveIndex(-1);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setIsLoading(false);
        setIsOpen(true);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setResults(null);
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate to full search results page
  const goToSearch = useCallback(
    (query) => {
      setIsOpen(false);
      if (query?.trim()) {
        router.push(`/search?query=${encodeURIComponent(query.trim())}`, {
          scroll: true,
        });
      } else {
        router.push(`/search`, { scroll: true });
      }
    },
    [router]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    goToSearch(searchText);
    inputRef.current?.blur();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.length >= 2) {
      setIsLoading(true);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setResults(null);
    }

    // If cleared while on search page, remove query filter
    if (value === "" && searchParams.get("query")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("query");
      const qs = params.toString();
      router.push(`/search${qs ? `?${qs}` : ""}`, { scroll: false });
    }
  };

  const handleFocus = () => {
    if (searchText.length >= 2 && results?.products?.length > 0) {
      setIsOpen(true);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || !results?.products?.length) {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    const maxIndex = Math.min(results.products.length, 8) - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case "Enter":
        if (activeIndex >= 0 && results.products[activeIndex]) {
          e.preventDefault();
          setIsOpen(false);
          router.push(`/product/${results.products[activeIndex].slug}`);
          inputRef.current?.blur();
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Full-width dropdown on mobile (with side margins)
  useEffect(() => {
    if (!isOpen) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && window.innerWidth < 640) {
      const margin = 12;
      setDropdownStyle({
        left: -rect.left + margin,
        width: `calc(100vw - ${margin * 2}px)`,
      });
    } else {
      setDropdownStyle({});
    }
  }, [isOpen]);

  const handleSelectItem = useCallback(() => {
    setIsOpen(false);
    setSearchText("");
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white overflow-hidden shadow-sm rounded-lg w-full border border-transparent focus-within:border-kachabazar-300 focus-within:shadow-md transition-all duration-200"
      >
        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="flex-1 h-10 pl-3 pr-3 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
          placeholder="Buscar productos, marcas..."
          autoComplete="off"
          maxLength={100}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        {/* Clear button */}
        {searchText && (
          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setResults(null);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Submit button */}
        <button
          type="submit"
          aria-label="Buscar"
          className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-kachabazar-500 hover:bg-kachabazar-600 transition-colors"
        >
          <MagnifyingGlass className="h-5 w-5 text-white" />
        </button>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <SearchDropdown
          results={results}
          isLoading={isLoading}
          query={debouncedQuery}
          onSelect={handleSelectItem}
          activeIndex={activeIndex}
          style={dropdownStyle}
        />
      )}
    </div>
  );
};

export default SearchInput;
