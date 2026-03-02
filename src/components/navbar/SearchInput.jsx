"use client";

import { Input } from "@components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState("");

  // Sync input with URL query param
  useEffect(() => {
    const query = searchParams.get("query");
    setSearchText(query ? decodeURIComponent(query) : "");
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchText.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchText.trim())}`, { scroll: true });
    } else {
      router.push(`/search`, { scroll: true });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // If input is fully cleared and we're on a search page with a query, remove the query filter
    if (value === "" && searchParams.get("query")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("query");
      const qs = params.toString();
      router.push(`/search${qs ? `?${qs}` : ""}`, { scroll: false });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="relative pr-12 md:pr-14 bg-white overflow-hidden shadow-sm rounded-md w-full"
      >
        <label className="flex items-center py-0.5">
          <Input
            onChange={handleChange}
            value={searchText}
            className="form-input w-full pl-5 appearance-none transition ease-in-out text-sm text-gray-700 font-sans rounded-md h-9 duration-200 bg-white focus:ring-0 outline-none border-none focus:outline-none"
            placeholder="Buscar productos (ej. croqueta, royal)"
          />
        </label>
        <button
          aria-label="Search"
          type="submit"
          className="outline-none text-xl text-gray-400 absolute top-0 right-0 end-0 w-12 md:w-14 h-full flex items-center justify-center transition duration-200 ease-in-out hover:text-heading focus:outline-none"
        >
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </form>
    </>
  );
};

export default SearchInput;
