'use client'

import React, { useState } from 'react'

/**
 * A component to render a block of text or code verbatim, preserving whitespace
 * and preventing further Markdown/MDX processing within the block.
 * Includes a button to copy the code to the clipboard.
 *
 * @param {object} props - The component props.
 * @param {string} props.code - The string content to render verbatim.
 * @returns {React.ReactElement} The rendered preformatted code block with a copy button.
 */
export function VerbatimCode({ code }: { code: string }): React.ReactElement {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
      // Handle error (e.g., show an error message)
    }
  }

  return (
    <div className="relative group">
      <pre className="text-neutral-800 dark:text-neutral-200 p-4 pt-8 rounded-md bg-neutral-100 dark:bg-neutral-900 overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 px-2 py-1 border rounded-md text-xs
                    ${
                      isCopied
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 group-hover:opacity-100 md:opacity-0 transition-opacity'
                    }`}
        aria-label="Copy code to clipboard"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
