"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { metaData } from "../config";
import { SubscribeModal } from "./subscribe-modal";
import { ThemeSwitch } from "./theme-switch";

// Primary: Blog only
const primaryNavItems = {
  "/blog": { name: "Blog" },
  // About moved to secondary
};

// Secondary: About, Projects, Photos
const secondaryNavItems = {
  "/about": { name: "About" }, // Added About to secondary
  "/projects": { name: "Projects" },
  "/photos": { name: "Photos" },
};

export function Navbar(): React.ReactElement {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="mb-12 py-5 lg:mb-16">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <div className="flex items-center">
          <Link className="font-semibold text-3xl tracking-tight" href="/">
            {metaData.title}
          </Link>
        </div>
        <div className="mt-6 flex flex-row items-center gap-4 md:mt-0 md:ml-auto">
          {/* Render About, Blog directly */}
          {Object.entries(primaryNavItems).map(([path, { name }]) => (
            <Link
              className="relative flex align-middle transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
              href={path}
              key={path}
            >
              {name}
            </Link>
          ))}
          {/* Subscribe Button */}
          <button
            aria-label="Subscribe to newsletter"
            className="relative flex align-middle transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
            onClick={() => setIsSubscribeModalOpen(true)}
            type="button"
          >
            Subscribe
          </button>
          {/* Dropdown Trigger - Reverted to "More" text and arrow */}
          <div className="relative" ref={dropdownRef}>
            <button
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="More navigation options" // Updated aria-label
              className="relative flex items-center gap-1 align-middle transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              // Restored original styling for text link with gap
              type="button"
            >
              More
              {/* Down Arrow SVG */}
              <svg
                aria-hidden="true"
                className={`h-3 w-3 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor" // Back to stroke 2 for arrow
                strokeWidth={2}
                // Adjusted size for arrow, added rotation transform
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Toggle more links</title>
                <path
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div
                className="absolute right-0 z-10 mt-2 w-36 origin-top-right scale-100 transform rounded-md bg-white opacity-100 shadow-lg ring-1 ring-black ring-opacity-5 transition duration-100 ease-out focus:outline-none dark:bg-neutral-800 dark:ring-neutral-700"
                role="menu"
              >
                <div className="py-1">
                  {/* Render Projects and Photos links */}
                  {Object.entries(secondaryNavItems).map(([path, { name }]) => (
                    <Link
                      className="block px-4 py-2 text-neutral-700 text-sm transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                      href={path}
                      key={path}
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ThemeSwitch />
        </div>
      </div>

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </nav>
  );
}
