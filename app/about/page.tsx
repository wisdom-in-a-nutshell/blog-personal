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
          This is my personal blog where I document lessons I wish I'd known earlier. Writing helps
          me clarify my thoughts. I've found my writing becomes clearer when I imagine an audience.
          The audience I know best is myself, so I write primarily for my younger self.
        </p>

        <p>
          By writing for myself, I reflect deeply on challenging experiences. This means investing
          significant "thinking tokens" into understanding them. The process helps me compress
          insights into clear, actionable principles that guide my decisions.
        </p>

        <p>
          As Ray Dalio points out, life often presents us with "another one of those" situations.
          Well-crafted principles make navigating these recurring patterns easier. They free us to
          focus on new challenges. I write for myself first, but publishing these ideas helps
          sharpen my thinking through feedback. Hopefully it helps others avoid similar struggles
          too.
        </p>

        <h2>What I'm Focused On Now</h2>

        <p>
          Right now, I'm most deeply immersed in AI. I spend most of my days interactively coding
          and exploring what's possible with this technology. This wasn't always my focus, but a
          specific journey led me here.
        </p>

        <h2>My AI Journey</h2>

        <p>
          It all started in 2023 when a friend who was expecting a baby introduced me to ChatGPT. He
          mentioned using it to ask parenting questions. He found it surprisingly helpful, despite
          occasional inaccuracies. This caught my attention because he rarely gets "hypey" about new
          tools.
        </p>

        <p>
          I had no formal AI training, but got really curious. I started experimenting with GPT-3.5
          after work every day. This continued for about 4 months. I quickly became convinced of its
          potential and knew this was a turning point. So I told myself I wanted to be part of this
          revolution, though not yet sure how since I wasn't trained in AI. Long story short... I
          quit my job and decided to figure it out along the way.
        </p>

        <p>
          This leap led to my first AI venture, "Wisdom in a Nutshell." I made all the classic
          startup mistakes. I built a solution first, then looked for people having problems. It
          failed after several months, but taught me invaluable lessons.
        </p>

        <p>
          For my current startup, A.I. Podcasting, I reversed the approach. I started by talking
          directly with podcasters and understanding their real challenges. Then I built solutions
          tailored to their specific needs. This problem-first mindset made all the difference.
        </p>

        <p>
          Today, I consider myself more an AI tinkerer than a researcher. I enjoy experimenting with
          AI tools to discover practical applications. I'm less interested in developing the
          underlying technology itself. My passion lies in blending technology with creativity and
          making complex processes accessible to everyone.
        </p>

        <h2>Professional Background</h2>

        <p>
          My educational journey began at IIT Hyderabad with a degree in Electrical Engineering
          (with Honours). I then earned a Master's in Telecommunication Engineering at TU Munich. I
          was lucky to have an inspiring professor who sparked my interest in video and multimedia
          technologies.
        </p>

        <p>
          Professionally, I've spent eight years in the multimedia tech industry, mostly working on
          streaming and video encoding technologies. I started as a software engineer before moving
          into product roles. If you ask my colleagues, they'd likely say I wasn't the best software
          engineer (which is true). However, they might mention my ability to think from first
          principles and occasionally generate innovative, needle-moving ideas. These ideas, looking
          back, often seem simple and obvious but were overlooked at the time. They were always
          there, waiting for someone to notice and give them some love. I personally loved coming up
          with those ideas, convincing people of their value, and working as a team to drive them to
          production. In engineering, success only happens when you complete this entire cycle
          (ideation {'->'} validation {'->'}
          production).
        </p>

        <h2>Current Focus</h2>

        <p>
          Currently, I'm building A.I. Podcasting with a clear mission: helping podcasters focus on
          storytelling while we handle the technical stuff. Our AI-driven solutions streamline
          workflows from audio enhancement and editing to distribution and audience engagement.
        </p>

        <p>
          I strongly believe AI should enhance human creativity, not replace it. The tools we build
          aim to reduce technical barriers while keeping creative control in human hands. Technology
          works best when it amplifies our capabilities rather than substituting for them.
        </p>

        <p>
          On this blog, I document my journey of learning how to co-create with AI tools and share
          what I discover along the way. I believe we've passed the inflection point. Participation
          in this technological shift is no longer optional.
        </p>

        <p>
          This blog is my voice in that ongoing conversation. I'm exploring how we can thoughtfully
          engage with AI as it transforms our world. Stay tuned.
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
