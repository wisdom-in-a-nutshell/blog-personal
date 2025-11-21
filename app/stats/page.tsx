import type { Metadata } from "next";
import GithubCalendar from "../components/github-calendar";

/**
 * Metadata for the stats page
 *
 * Provides SEO details for the stats page including title and description
 */
export const metadata: Metadata = {
  title: "Stats",
  description:
    "Useful stats about my work and writing, including GitHub activity for the past year.",
  openGraph: {
    title: "Stats | Adithyan",
    description:
      "Useful stats about my work and writing, including GitHub activity for the past year.",
  },
};

/**
 * Stats page component
 *
 * Highlights key stats about the author, starting with GitHub activity
 *
 * @returns {JSX.Element} The rendered stats page
 */
export default function StatsPage() {
  return (
    <section>
      <h1 className="mb-6 font-medium text-2xl tracking-tight">Stats</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          A single place for useful stats about my work and writing. I&apos;m
          starting with GitHub activity and will add more about the blog as I
          publish and ship.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-medium text-xl">My GitHub Activity</h2>
        <GithubCalendar />
        <p className="mt-4 text-neutral-500 text-sm dark:text-neutral-400">
          Most of my time recently has been spent building AI Podcasting and
          experimenting with AI tools. I&apos;ll be gradually open-sourcing my
          projects here.
        </p>
      </div>
    </section>
  );
}
