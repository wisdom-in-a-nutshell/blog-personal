'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { metaData } from '../config'
import { ThemeSwitch } from './theme-switch'

// Primary: About, Blog
const primaryNavItems = {
  '/about': { name: 'About' },
  '/blog': { name: 'Blog' },
  // Projects removed from primary
}

// Secondary: Projects, Photos
const secondaryNavItems = {
  '/projects': { name: 'Projects' }, // Projects added back to secondary
  '/photos': { name: 'Photos' },
}

export function Navbar(): React.ReactElement {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="lg:mb-16 mb-12 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-semibold tracking-tight">
            {metaData.title}
          </Link>
        </div>
        <div className="flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
          {/* Render About, Blog directly */}
          {Object.entries(primaryNavItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative"
            >
              {name}
            </Link>
          ))}
          {/* Dropdown Trigger - Reverted to "More" text and arrow */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="More navigation options" // Updated aria-label
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              // Restored original styling for text link with gap
              className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center align-middle relative gap-1"
            >
              More
              {/* Down Arrow SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2} // Back to stroke 2 for arrow
                stroke="currentColor"
                // Adjusted size for arrow, added rotation transform
                className={`w-3 h-3 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              >
                <title>Toggle more links</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-neutral-700 focus:outline-none z-10 transition ease-out duration-100 transform opacity-100 scale-100"
              >
                <div className="py-1">
                  {/* Render Projects and Photos links */}
                  {Object.entries(secondaryNavItems).map(([path, { name }]) => (
                    <Link
                      key={path}
                      href={path}
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                      className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
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
    </nav>
  )
}
