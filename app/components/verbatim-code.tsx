"use client";

import type React from "react";
import { useState } from "react";

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
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      const COPY_RESET_MS = 2000; // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), COPY_RESET_MS);
    } catch (_err) {
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-md bg-neutral-100 p-4 pt-8 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
        <code>{code}</code>
      </pre>
      <button
        aria-label="Copy code to clipboard"
        className={`absolute top-2 right-2 rounded-md border px-2 py-1 text-xs ${
          isCopied
            ? "border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-300"
            : "border-neutral-300 bg-neutral-200 text-neutral-700 transition-opacity group-hover:opacity-100 md:opacity-0 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
        }`}
        onClick={handleCopy}
        type="button"
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
