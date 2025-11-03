import Image from "next/image";
import Link from "next/link";
import GithubCalendar from "./components/github-calendar";
import { socialLinks } from "./config";

/**
 * Homepage component
 *
 * Displays a brief introduction with profile image, a link to the about page,
 * and GitHub contribution calendar
 *
 * @returns {JSX.Element} The rendered homepage
 */
export default function Page() {
  return (
    <section>
      <a href={socialLinks.twitter} target="_blank">
        <Image
          alt="Profile photo"
          className="mx-auto mt-0 mb-10 block rounded-full border border-neutral-200 bg-gray-100 p-1 grayscale hover:grayscale-0 sm:float-right sm:mb-5 sm:ml-5 lg:mt-5 lg:mb-5 dark:border-neutral-700"
          height={160}
          priority
          src="/profile.png"
          width={160}
        />
      </a>
      <h1 className="mb-8 font-medium text-2xl tracking-tight">
        Hello, I'm Adithyan Ilangovan
      </h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          I write lessons I wish I'd known earlier. Writing for my younger self
          helps me compress hard experiences into principles I can actually use.
        </p>
        <p>
          I'm building{" "}
          <a
            className="text-blue-600 hover:underline dark:text-blue-400"
            href="https://aipodcast.ing"
            rel="noopener"
            target="_blank"
          >
            AI Podcasting
          </a>{" "}
          and spending most of my time learning how to co-create with AI tools.
        </p>
        <p>
          <Link
            className="font-medium text-neutral-800 hover:underline dark:text-neutral-200"
            href="/about"
          >
            Read more about me →
          </Link>
        </p>

        <div className="mt-8">
          <h2 className="mb-4 font-medium text-xl">My GitHub Activity</h2>
          <GithubCalendar />
          <p className="mt-4 text-neutral-500 text-sm dark:text-neutral-400">
            Most of my time recently has been spent building AI Podcasting and
            experimenting with AI tools. I'll be gradually open-sourcing my
            projects here.
          </p>
        </div>
      </div>
    </section>
  );
}
