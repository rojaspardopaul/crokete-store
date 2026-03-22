"use client";

import { useState } from "react";

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
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

const FaqAccordion = ({ faq }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="group">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left hover:bg-gray-50/80 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base font-medium text-gray-800 leading-snug pr-2">
          {faq.question}
        </span>
        <span className="flex-shrink-0">
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? "500px" : "0",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;
