"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

/**
 * Props for the SubscribeModal component.
 * @property {boolean} isOpen - Whether the modal is currently open.
 * @property {() => void} onClose - Function to call when the modal should be closed.
 */
type SubscribeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

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
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Effect to control the modal's open/close state via the <dialog> element's API
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (dialogNode) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        dialogNode.showModal();
        // Reset state when modal opens
        setEmail("");
        setIsLoading(false);
        setMessage(null);
      } else {
        document.body.style.overflow = "";
        // Delay closing slightly to allow animation if needed
        const CLOSE_DELAY_MS = 100;
        setTimeout(() => dialogNode.close(), CLOSE_DELAY_MS);
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Effect to handle closing the dialog via the Escape key or clicking the backdrop
  useEffect(() => {
    const dialogNode = dialogRef.current;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    const handleClick = (event: MouseEvent) => {
      if (dialogNode && event.target === dialogNode) {
        onClose();
      }
    };
    if (dialogNode) {
      dialogNode.addEventListener("cancel", handleCancel);
      dialogNode.addEventListener("click", handleClick);
    }
    return () => {
      if (dialogNode) {
        dialogNode.removeEventListener("cancel", handleCancel);
        dialogNode.removeEventListener("click", handleClick);
      }
    };
  }, [onClose]);

  /**
   * Handles the form submission by sending the email to the API endpoint.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use error message from API response if available
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Success
      setMessage({
        type: "success",
        text: data.message || "Successfully subscribed!",
      });
      setEmail(""); // Clear input on success
      // Optionally close modal after a short delay on success
      // setTimeout(onClose, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Conditional rendering for ref availability
  if (!(isOpen || dialogRef.current)) {
    return null;
  }

  return (
    <dialog
      aria-labelledby="subscribe-modal-title"
      className="pointer-events-none w-[calc(100%-2rem)] max-w-md rounded-lg bg-white p-0 opacity-0 shadow-xl transition-opacity duration-300 ease-in-out backdrop:bg-black/30 backdrop:backdrop-blur-sm open:pointer-events-auto open:opacity-100 dark:bg-neutral-900 dark:backdrop:bg-black/50"
      ref={dialogRef}
    >
      <div className="relative p-6">
        <button
          aria-label="Close modal"
          className="absolute top-3 right-3 text-neutral-500 transition-colors hover:text-neutral-800 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-neutral-200"
          disabled={isLoading}
          onClick={onClose} // Disable close button while loading
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Close</title>
            <path
              d="M6 18 18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2
          className="mb-3 font-medium text-neutral-900 text-xl dark:text-neutral-100"
          id="subscribe-modal-title"
        >
          Subscribe for Updates
        </h2>
        <p className="mb-5 text-neutral-600 text-sm dark:text-neutral-400">
          Get notified when I publish new posts.
        </p>

        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="email-input">
            Email Address
          </label>
          <input
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-neutral-400"
            disabled={isLoading}
            id="email-input"
            onChange={(e) => {
              setMessage(null);
              setEmail(e.target.value);
            }}
            placeholder="your.email@example.com"
            required
            type="email"
            value={email}
          />
          <button
            className="flex items-center justify-center rounded-md bg-neutral-800 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-200 dark:text-black dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900 dark:hover:bg-neutral-300"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        {/* Display Success/Error Messages */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
            role={message.type === "error" ? "alert" : "status"} // Set appropriate ARIA role
          >
            {message.text}
          </p>
        )}
      </div>
    </dialog>
  );
}
