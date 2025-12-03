"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";

/**
 * GitHub calendar component
 *
 * A client component that displays GitHub contribution activity
 * with enhanced readability and full-width display
 *
 * @returns {JSX.Element | null} The GitHub calendar with proper theme or null during initialization
 */

// Cache configuration
const CACHE_KEY = "github-contributions-timestamp";
const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = SECOND_IN_MS * 60;
const HOUR_IN_MS = MINUTE_IN_MS * 60;
const SIX_HOURS = 6;
const CACHE_DURATION = HOUR_IN_MS * SIX_HOURS; // 6 hours

/**
 * Custom hook for responsive media queries
 *
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Avoid running on server
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
        setMatches(e.matches);
      };

      // Initial check
      updateMatch(media);

      // Listen for changes
      if (media.addEventListener) {
        media.addEventListener("change", updateMatch);
        return () => media.removeEventListener("change", updateMatch);
      }
      // Fallback for older browsers
      media.addListener(updateMatch);
      return () => media.removeListener(updateMatch);
    }
    return;
  }, [query]);

  return matches;
}

export default function GithubCalendar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Responsive design hooks
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 768px)");

  // Adjust sizes based on screen size but keep it compact
  const BLOCK_SIZE_MOBILE = 8;
  const BLOCK_SIZE_TABLET = 9;
  const BLOCK_SIZE_DESKTOP = 10;
  const BLOCK_MARGIN = 2;
  const FONT_SIZE_MOBILE = 11;
  const FONT_SIZE_DESKTOP = 12;

  let blockSize = BLOCK_SIZE_DESKTOP;
  if (isMobile) {
    blockSize = BLOCK_SIZE_MOBILE;
  } else if (isTablet) {
    blockSize = BLOCK_SIZE_TABLET;
  }

  const blockMargin = BLOCK_MARGIN;
  const fontSize = isMobile ? FONT_SIZE_MOBILE : FONT_SIZE_DESKTOP;

  // Check if cached data is fresh or needs refresh
  useEffect(() => {
    const checkCacheStatus = () => {
      try {
        if (typeof window !== "undefined") {
          const timestamp = localStorage.getItem(CACHE_KEY);

          // If we have a cached timestamp and it's still fresh
          if (
            timestamp &&
            Date.now() - Number.parseInt(timestamp, 10) < CACHE_DURATION
          ) {
            // We have fresh cached data, can render immediately
            setLoading(false);
            return true;
          }

          // Either no timestamp or expired
          return false;
        }
        return false;
      } catch (_error) {
        return false;
      }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // If we have fresh cached data, don't show loading state
    const hasFreshCache = checkCacheStatus();
    if (!hasFreshCache) {
      // No fresh cache, show loading state for a short time
      const LOADING_DELAY_MS = 300;
      setTimeout(() => setLoading(false), LOADING_DELAY_MS);
    }
  }, []);

  // Update cache timestamp when calendar renders successfully
  // This acts as a simple freshness indicator
  useEffect(() => {
    // This runs after the component has rendered successfully
    if (mounted && !loading && !error) {
      try {
        localStorage.setItem(CACHE_KEY, Date.now().toString());
      } catch (_error) {
        // Ignore write failures (private mode / storage quota)
      }
    }
  }, [mounted, loading, error]);

  // Error boundary with global error listener
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("GitHub") ||
        event.message.includes("contribution") ||
        event.message.includes("network") ||
        event.message.includes("fetch")
      ) {
        setError(new Error("Failed to load GitHub data"));
        setLoading(false);
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800 text-sm dark:bg-neutral-800 dark:text-red-400">
        Unable to load GitHub activity. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full overflow-visible">
      {loading ? (
        <div className="flex animate-pulse space-x-4">
          <div className="flex-1 space-y-4">
            <div className="h-44 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ) : (
        <div className="pl-1">
          <GitHubCalendar
            blockMargin={blockMargin}
            blockSize={blockSize}
            colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
            fontSize={fontSize}
            hideColorLegend={false}
            hideMonthLabels={false}
            labels={{
              totalCount: "{{count}} contributions in the last year",
            }}
            style={{
              width: "100%",
              maxWidth: "100%",
              color: resolvedTheme === "dark" ? "#e5e5e5" : "#262626", // Better text contrast
              height: "auto", // Allow natural height
              lineHeight: "1.5", // Better text spacing
              marginLeft: "-4px", // Adjust for text alignment
            }}
            username="AdithyanI"
          />
        </div>
      )}
    </div>
  );
}
