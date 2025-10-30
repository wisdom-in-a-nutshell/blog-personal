import Image from 'next/image'
import Link from 'next/link'
import GithubCalendar from './components/github-calendar'
import { socialLinks } from './config'

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
          src="/profile.png"
          alt="Profile photo"
          className="rounded-full bg-gray-100 block lg:mt-5 mt-0 lg:mb-5 mb-10 mx-auto sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0 border border-neutral-200 dark:border-neutral-700 p-1"
          width={160}
          height={160}
          priority
        />
      </a>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Hello, I'm Adithyan Ilangovan</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          I write lessons I wish I'd known earlier. Writing for my younger self helps me compress hard experiences into principles I can actually use.
        </p>
        <p>
          I'm building <a href="https://aipodcast.ing" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">AI Podcasting</a> and spending most of my time learning how to co-create with AI tools.
        </p>
        <p>
          <Link
            href="/about"
            className="font-medium text-neutral-800 dark:text-neutral-200 hover:underline"
          >
            Read more about me →
          </Link>
        </p>

        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">My GitHub Activity</h2>
          <GithubCalendar />
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Most of my time recently has been spent building AI Podcasting and experimenting with AI tools. I'll be gradually open-sourcing my projects here.
          </p>
        </div>
      </div>
    </section>
  )
}
