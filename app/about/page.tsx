import type { Metadata } from 'next'
import Image from 'next/image'
import { socialLinks } from '../config'

/**
 * Metadata for the About page
 *
 * Defines SEO-related information including title, description, and OpenGraph data
 */
export const metadata: Metadata = {
  title: 'About',
  description: 'About Adithyan Ilangovan, founder of A.I. Podcasting and AI enthusiast.',
  openGraph: {
    title: 'About | Adithyan',
    description: 'About Adithyan Ilangovan, founder of A.I. Podcasting and AI enthusiast.',
  },
}

/**
 * About page component
 *
 * Displays detailed information about the author including background,
 * professional experience, and personal interests
 *
 * @returns {JSX.Element} The rendered About page
 */
export default function AboutPage() {
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
      <h1 className="mb-8 text-2xl font-medium tracking-tight">About Me</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          I write lessons I wish I'd known earlier. This blog helps me think clearly about hard
          problems and compress insights into principles I can actually use. I write for my younger
          self, but publishing sharpens my thinking and hopefully helps others skip some struggles.
        </p>

        <h2>My AI Journey</h2>

        <p>
          In 2023, a friend expecting a baby told me about ChatGPT. He was using it for parenting
          questions and found it surprisingly helpful. This caught my attention because he never gets
          excited about new tools.
        </p>

        <p>
          I had zero AI training but spent 4 months experimenting with GPT-3.5 after work every day.
          Quickly realized this was the turning point I'd been waiting for. Quit my job to figure out
          how to be part of it.
        </p>

        <p>
          My first AI startup, "Wisdom in a Nutshell," failed after several months. Classic mistake:
          built a solution first, then looked for problems. For my current startup, A.I. Podcasting,
          I flipped it. Talked to podcasters first, understood their real challenges, then built what
          they actually needed.
        </p>

        <p>
          Today I'm an AI tinkerer, not a researcher. I experiment with tools to find practical
          applications rather than develop the underlying tech. I love blending technology with
          creativity to make complex processes simple.
        </p>


        <p>
          I'm building <a href="https://aipodcast.ing" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">AI Podcasting</a> to help creators focus on storytelling while we handle the technical stuff. We streamline everything from audio enhancement to distribution.
        </p>

        <p>
          This blog documents my journey learning to co-create with AI tools. We've passed the inflection point—participation isn't optional anymore.
        </p>

        <h2>Connect With Me</h2>

        <p>
          I regularly write about AI, entrepreneurship, technology, and personal growth. If you'd
          like to connect or share your thoughts, reach out via{' '}
          <a href={socialLinks.email}>email</a> or find me on{' '}
          <a href={socialLinks.twitter}>Twitter</a>, <a href={socialLinks.linkedin}>LinkedIn</a>, or{' '}
          <a href={socialLinks.github}>GitHub</a>. I welcome conversations that challenge and refine
          my thinking.
        </p>
      </div>
    </section>
  )
}
