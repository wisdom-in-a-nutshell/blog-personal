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
          me clarify my thoughts, and I've found my writing becomes clearer when I imagine an
          audience. The audience I know best is myself, so I write primarily for my younger self.
        </p>

        <p>
          By writing for myself, I reflect deeply on challenging experiences, investing significant
          "thinking tokens" into understanding them. This process allows me to compress my insights
          into clear, actionable principles that guide my decisions.
        </p>

        <p>
          As Ray Dalio wisely points out, life often presents us with "another one of those"
          situations. Well-crafted principles make navigating these recurring patterns easier and
          free us to focus on new challenges. Though I write for myself first, publishing these
          ideas helps sharpen my thinking through feedback and hopefully helps others avoid similar
          struggles.
        </p>

        <h2>My AI Journey</h2>

        <p>
          Currently, I spend most of my time deeply immersed in AI, interactively coding and
          exploring its capabilities. This focus stems from a journey that began in 2023 and has
          transformed my career and outlook.
        </p>

        <p>
          It started when a friend who was expecting a baby introduced me to ChatGPT. He mentioned
          using it to ask parenting questions and found it surprisingly helpful, despite its
          occasional inaccuracies. This caught my attention because he rarely gets "hypey" about new
          tools.
        </p>

        <p>
          Though I had no formal AI training, I got really curious and started experimenting with
          GPT-3.5. After work every day, I would come back and spend evenings exploring this
          technology. This happened for about 4 months. Althought I was not formally trained in AI,
          I became convinced of its potential and knew this was a turning point. So I told myself
          that I want to be part of this thought not yet quite sure how since I was not trained with
          AI. Anyways, long story short... I quit my job and told myself I will figure it out on the
          way.
        </p>

        <p>
          This leap led to my first AI venture, "Wisdom in a Nutshell." I did all the classic
          startup mistakes, building a solution first and then looking for people having problems.
          It failed after several months, but the experience taught me invaluable lessons.
        </p>

        <p>
          For my current startup, A.I. Podcasting, I reversed the approach. I began by talking
          directly with podcasters, understanding their real challenges, and then building solutions
          tailored to their needs. This problem-first mindset has made all the difference.
        </p>

        <p>
          Today, I consider myself more of an AI tinkerer than a researcher. I enjoy experimenting
          with AI tools to discover practical applications rather than developing the underlying
          technology itself. My passion lies in blending technology with creativity, making complex
          processes accessible to everyone.
        </p>

        <h2>Professional Background</h2>

        <p>
          My educational journey began at IIT Hyderabad, where I earned a degree in Electrical
          Engineering, graduating with Honours. I then pursued a Master's in Telecommunication
          Engineering at TU Munich. I was fortunate to have an inspiring professor who ignited my
          interest in video and multimedia technologies.
        </p>

        <p>
          Professionally, I've spent eight years in the multimedia tech industry, primarily working
          on streaming and video encoding technologies. I started as a software engineer before
          transitioning into product roles. If you ask my colleagues, they would likely say I wasn't
          the best software engineer (which is true). However, they might say that I have the
          ability to think from first principles and (occasionally) generate innovative,
          needle-moving ideas. These ideas, in retrospect, often seem simple and obvious but are
          overlooked in the moment. They were always there, waiting for someone to notice and give
          them some love. I personally loved coming up with those ideas, then convincing people of
          their value, and finally working as a team to drive them to production. In engineering,
          success is only achieved if you complete this entire cycle (ideation {'->'} validation{' '}
          {'->'}
          production).
        </p>

        <h2>Current Focus</h2>

        <p>
          Currently, I'm building A.I. Podcasting with a clear mission: helping podcasters focus on
          storytelling while we handle the technical complexities. Our AI-driven solutions
          streamline workflows, from audio enhancement and editing to distribution and audience
          engagement.
        </p>

        <p>
          I strongly believe AI should enhance human creativity rather than replace it. The tools we
          build aim to reduce technical barriers while preserving creative control in human hands.
          Technology works best when it amplifies our capabilities rather than substituting for
          them.
        </p>

        <p>
          On this blog, I document my journey of learning how best to co-create with AI tools and
          share what I discover along the way. I believe we've passed the inflection point;
          participation in this technological shift is no longer optional.
        </p>

        <p>
          This blog is my voice in that ongoing conversation, exploring how we can thoughtfully
          engage with AI as it transforms our world. Stay tuned.
        </p>

        <h2>Connect With Me</h2>

        <p>
          I regularly write about AI, entrepreneurship, technology, and personal growth. If you'd
          like to connect or share your thoughts, please reach out via{' '}
          <a href={socialLinks.email}>email</a> or find me on{' '}
          <a href={socialLinks.twitter}>Twitter</a>, <a href={socialLinks.linkedin}>LinkedIn</a>, or{' '}
          <a href={socialLinks.github}>GitHub</a>. I welcome conversations that challenge and refine
          my thinking.
        </p>
      </div>
    </section>
  )
}
