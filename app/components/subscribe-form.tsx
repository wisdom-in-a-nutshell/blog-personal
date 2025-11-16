"use client";

import { useState } from "react";

/**
 * Inline subscription form component for use in MDX content
 * Allows users to subscribe directly from blog posts
 */
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setMessage({
        type: "success",
        text: data.message || "Successfully subscribed!",
      });
      setEmail("");
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

  return (
    <div className="my-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div>
          <label
            className="mb-2 block font-medium text-neutral-900 text-sm dark:text-neutral-100"
            htmlFor="subscribe-email"
          >
            Email Address
          </label>
          <input
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-neutral-400"
            disabled={isLoading}
            id="subscribe-email"
            onChange={(e) => {
              setMessage(null);
              setEmail(e.target.value);
            }}
            placeholder="your.email@example.com"
            required
            type="email"
            value={email}
          />
        </div>
        <button
          className="flex items-center justify-center rounded-md bg-neutral-800 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-200 dark:text-black dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900 dark:hover:bg-neutral-300"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? (
            <>
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
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
        {message && (
          <p
            className={`text-sm ${
              message.type === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
            role={message.type === "error" ? "alert" : "status"}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
