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
 * Handles form submission by calling the /api/subscribe endpoint.
 *
 * @param {SubscribeModalProps} props - The props for the component.
 * @returns {React.ReactElement | null} The rendered modal component.
 */
export function SubscribeModal({
  isOpen,
  onClose,
}: SubscribeModalProps): React.ReactElement | null {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Effect to control the modal's open/close state via the <dialog> element's API
  useEffect(() => {
    const dialogNode = dialogRef.current
    if (dialogNode) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        dialogNode.showModal()
        // Reset state when modal opens
        setEmail('')
        setIsLoading(false)
        setMessage(null)
      } else {
        document.body.style.overflow = ''
        // Delay closing slightly to allow animation if needed
        setTimeout(() => dialogNode.close(), 100) // Adjust timing if you add transitions
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Effect to handle closing the dialog via the Escape key or clicking the backdrop
  useEffect(() => {
    const dialogNode = dialogRef.current
    const handleCancel = (event: Event) => {
      event.preventDefault()
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
    return () => {
      if (dialogNode) {
        dialogNode.removeEventListener('cancel', handleCancel)
        dialogNode.removeEventListener('click', handleClick)
      }
    }
  }, [onClose])

  /**
   * Handles the form submission by sending the email to the API endpoint.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Use error message from API response if available
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      // Success
      setMessage({
        type: 'success',
        text: data.message || 'Successfully subscribed!',
      })
      setEmail('') // Clear input on success
      // Optionally close modal after a short delay on success
      // setTimeout(onClose, 2000);
    } catch (error) {
      console.error('Subscription error:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An unknown error occurred.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Conditional rendering for ref availability
  if (!isOpen && !dialogRef.current) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="subscribe-modal-title"
      className="p-0 max-w-md w-[calc(100%-2rem)] bg-white dark:bg-neutral-900 rounded-lg shadow-xl backdrop:bg-black/30 dark:backdrop:bg-black/50 backdrop:backdrop-blur-sm transition-opacity duration-300 ease-in-out open:opacity-100 open:pointer-events-auto opacity-0 pointer-events-none"
    >
      <div className="relative p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          disabled={isLoading} // Disable close button while loading
          className="absolute top-3 right-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <title>Close</title>
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
          Get notified when I publish new posts.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <label htmlFor="email-input" className="sr-only">
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={e => {
              setMessage(null)
              setEmail(e.target.value)
            }}
            placeholder="your.email@example.com"
            required
            disabled={isLoading}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black rounded-md font-medium text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>Loading</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>

        {/* Display Success/Error Messages */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
            role={message.type === 'error' ? 'alert' : 'status'} // Set appropriate ARIA role
          >
            {message.text}
          </p>
        )}
      </div>
    </dialog>
  )
}
