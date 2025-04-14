'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'

/**
 * Props for the SubscribeModal component.
 * @interface SubscribeModalProps
 * @property {boolean} isOpen - Whether the modal is currently open.
 * @property {() => void} onClose - Function to call when the modal should be closed.
 */
interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * A modal dialog component for users to subscribe via email.
 * Uses the native <dialog> element for better accessibility.
 * Renders a form with an email input and a submit button.
 *
 * @param {SubscribeModalProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered modal component.
 */
export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps): JSX.Element | null {
  const [email, setEmail] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Effect to control the modal's open/close state via the <dialog> element's API
  useEffect(() => {
    const dialogNode = dialogRef.current
    if (dialogNode) {
      if (isOpen) {
        // Prevent scrolling on the body when the modal is open
        document.body.style.overflow = 'hidden'
        dialogNode.showModal() // Use showModal() to open as a modal dialog
      } else {
        // Restore scrolling when the modal is closed
        document.body.style.overflow = ''
        dialogNode.close() // Use close() to close the dialog
      }
    }

    // Cleanup function to restore scrolling if component unmounts while open
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Effect to handle closing the dialog via the Escape key or clicking the backdrop
  useEffect(() => {
    const dialogNode = dialogRef.current

    const handleCancel = (event: Event) => {
      event.preventDefault() // Prevent default dialog cancel behavior if needed
      onClose()
    }

    const handleClick = (event: MouseEvent) => {
      if (dialogNode && event.target === dialogNode) {
        onClose()
      }
    }

    if (dialogNode) {
      dialogNode.addEventListener('cancel', handleCancel)
      dialogNode.addEventListener('click', handleClick)
    }

    // Cleanup listeners
    return () => {
      if (dialogNode) {
        dialogNode.removeEventListener('cancel', handleCancel)
        dialogNode.removeEventListener('click', handleClick)
      }
    }
  }, [onClose])

  /**
   * Handles the form submission.
   * Logs the email to the console for now.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Subscribing email:', email)
    // Add actual subscription logic here later
    setEmail('') // Clear input
    onClose() // Close modal on submission
  }

  // We render the dialog structure conditionally based on isOpen only
  // to ensure the ref is available when useEffect runs.
  if (!isOpen && !dialogRef.current) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="subscribe-modal-title"
      className="p-0 max-w-md w-[calc(100%-2rem)] bg-white dark:bg-neutral-900 rounded-lg shadow-xl backdrop:bg-black/30 dark:backdrop:bg-black/50 backdrop:backdrop-blur-sm transition-opacity duration-300 ease-in-out open:opacity-100 open:pointer-events-auto opacity-0 pointer-events-none"
    >
      {/* Modal Content - We add padding here instead of the dialog element */}
      <div className="relative p-6">
        <button
          type="button" // Explicitly set type to prevent form submission
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            aria-hidden="true" // Hide decorative SVG from screen readers
          >
            <title>Close</title> {/* Add title for accessibility */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <h2
          id="subscribe-modal-title"
          className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-3"
        >
          Subscribe for Updates
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5">
          Get notified when I publish new posts. No spam, unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <label htmlFor="email-input" className="sr-only">
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black rounded-md font-medium text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </dialog>
  )
}
