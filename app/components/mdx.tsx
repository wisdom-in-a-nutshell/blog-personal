import 'katex/dist/katex.min.css'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import React, { type ReactElement, type ReactNode } from 'react'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { highlight } from 'sugar-high'
import { slugify } from 'app/lib/slugify'
import { PublishCadenceChart } from './blog/top-podcast-cadence/chart'
import {
  DailyEpisodeLengthChart,
  EpisodeLengthHistogram,
  MonthlyEpisodeLengthChart,
  NearDailyEpisodeLengthChart,
  OtherEpisodeLengthChart,
  WeeklyEpisodeLengthChart,
} from './blog/how-long-top-podcasts-run/charts'
import { CaptionComponent } from './caption'
import { ImageGrid } from './image-grid'
import { TweetComponent } from './tweet'
import { VerbatimCode } from './verbatim-code'
import { YouTubeComponent } from './youtube'

function CustomLink(props) {
  let href = props.href
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }
  if (href.startsWith('#')) {
    return <a {...props} />
  }
  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }) {
  let codeHTML = children ? highlight(children) : ''
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function Table({ data }) {
  let headers = data.headers.map((header, index) => <th key={index}>{header}</th>)
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))
  return (
    <table>
      <thead>
        <tr className="text-left">{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function Strikethrough(props) {
  return <del {...props} />
}

function Callout(props) {
  return (
    <div className="px-4 py-3 bg-[#F7F7F7] dark:bg-[#181818] rounded p-1 text-sm flex items-center text-neutral-900 dark:text-neutral-100 mb-8">
      <div className="flex items-center w-4 mr-4">{props.emoji}</div>
      <div className="w-full callout leading-relaxed">{props.children}</div>
    </div>
  )
}

function getNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join('')
  }

  if (React.isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>
    return getNodeText(element.props.children ?? '')
  }

  return ''
}

function createHeading(level) {
  const Heading = ({ children }) => {
    const text = getNodeText(children)
    const slug = slugify(text)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }
  Heading.displayName = `Heading${level}`
  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  ImageGrid,
  a: CustomLink,
  StaticTweet: TweetComponent,
  Caption: CaptionComponent,
  YouTube: YouTubeComponent,
  code: Code,
  Table,
  del: Strikethrough,
  Callout,
  VerbatimCode,
  PublishCadenceChart,
  EpisodeLengthHistogram,
  DailyEpisodeLengthChart,
  NearDailyEpisodeLengthChart,
  WeeklyEpisodeLengthChart,
  MonthlyEpisodeLengthChart,
  OtherEpisodeLengthChart,
}

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]],
          rehypePlugins: [rehypeKatex],
        },
      }}
    />
  )
}
