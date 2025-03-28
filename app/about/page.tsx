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
          This is my personal blog where I share things I wish I had known earlier. I write
          primarily for myself—to capture valuable lessons and transform my thinking into clear
          principles. As Ray Dalio puts it, life is a lot of "another one of those," and principles
          make navigating these patterns easier. By publishing these ideas, I sharpen my own
          thinking, invite helpful feedback, and hopefully help others avoid similar struggles.
        </p>
        <p>
          I'm the founder of A.I. Podcasting, a bootstrap startup where we enable podcasters to tell
          their stories without getting bogged down by technical processes. We use AI-driven
          solutions to handle the complexities that come after recording, letting creators focus on
          what matters most—their content.
        </p>

        <h2>My AI Journey</h2>
        <p>
          In 2023, a friend who was expecting a baby introduced me to ChatGPT. He told me he was
          using it to ask questions about parenting and found it remarkably helpful despite its
          occasional inaccuracies. This caught my attention because he is not a hype-y guy.
        </p>
        <p>
          Though I had no formal AI training, when I started using GPT-3.5, something clicked. I
          sensed in my gut that this was some sort of inflection point in history. After playing with it
          every day after work for about 2 hours every evening, I became convinced. The
          technology felt transformative in a way that's hard to put into words. A few months later,
          despite having no background in the field, I took a leap of faith and quit my job to
          figure out what this was all about. I like learning by doing.
        </p>
        <p>
          My first venture in AI was a startup called "Best in a Nutshell." I followed the classic
          startup playbook—building a solution first and then looking for problems to solve. It
          failed after 7-8 months, but the experience was invaluable. For A.I. Podcasting, I flipped
          the approach. I started by talking directly with podcasters about their challenges,
          understanding their workflows, and then building solutions based on real needs rather than
          just what the technology could do.
        </p>
        <p>
          I consider myself more of an AI thinker than a researcher. I enjoy experimenting with
          these tools to find practical applications rather than developing the underlying
          technology itself. What drives me is finding ways to blend technology with creativity,
          making complex technical processes more accessible to everyone.
        </p>
        <h2>Professional Background</h2>
        <p>
          I graduated from IIT Hyderabad with a degree in Electrical Engineering, then earned my
          Masters in Telecommunication Engineering. During my masters program, I became fascinated
          with video and multimedia technologies, sparked by an inspiring professor who opened my
          eyes to the field's potential.
        </p>
        <p>
          My career spans eight years in the tech industry, starting as a software engineer before
          transitioning into product roles at various startups. Throughout this journey, colleagues
          knew me for my ability to think from first principles and generate innovative ideas that
          cut through complexity. Before diving into AI, my last position was as a Product Manager
          at Paramount, where I further honed my skills in understanding user needs and translating
          them into meaningful products.
        </p>
        <h2>Current Focus</h2>
        <p>
          Now, I'm building A.I. Podcasting with a clear mission: to help podcasters focus on
          storytelling while we handle the technical complexities. Our AI-driven solutions address
          real problems faced by content creators by reducing friction in their workflow—from audio
          enhancement and editing to distribution and audience engagement.
        </p>
        <p>
          I strongly believe that AI should enhance human creativity rather than replace it. The
          tools we build should reduce technical barriers while preserving creative control in human
          hands. Technology works best when it amplifies our capabilities rather than substituting
          for them.
        </p>
        <p>
          I spend 70-80% of my time coding with AI tools, exploring their capabilities and
          limitations through hands-on experimentation. This blog serves as my voice in this
          journey—a place to document what I learn and hopefully influence how we approach this
          technological revolution as it unfolds.
        </p>
        <h2>Connect With Me</h2>
        <p>
          I write regularly about AI, entrepreneurship, technology, and personal growth. If you have
          thoughts or want to connect, please reach out via <a href={socialLinks.email}>email</a> or
          find me on <a href={socialLinks.twitter}>Twitter</a>,{' '}
          <a href={socialLinks.linkedin}>LinkedIn</a>, or <a href={socialLinks.github}>GitHub</a>. I
          welcome conversations that challenge and refine my thinking.
        </p>
      </div>
    </section>
  )
}
