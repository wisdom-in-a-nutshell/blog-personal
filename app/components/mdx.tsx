import "katex/dist/katex.min.css";
import { slugify } from "app/lib/slugify";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import React, { type ReactElement, type ReactNode } from "react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { highlight } from "sugar-high";
import {
  DailyEpisodeLengthChart,
  EpisodeLengthHistogram,
  MonthlyEpisodeLengthChart,
  NearDailyEpisodeLengthChart,
  OtherEpisodeLengthChart,
  WeeklyEpisodeLengthChart,
} from "./blog/how-long-top-podcasts-run/charts";
import { PublishCadenceChart } from "./blog/top-podcast-cadence/chart";
import { CaptionComponent } from "./caption";
import { ImageGrid } from "./image-grid";
import { TweetComponent } from "./tweet";
import { VerbatimCode } from "./verbatim-code";
import { YouTubeComponent } from "./youtube";

function CustomLink(props) {
  const href = props.href;
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return <a {...props} />;
  }
  return <a rel="noopener noreferrer" target="_blank" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  const codeText =
    typeof children === "string" ? children : String(children ?? "");
  const highlighted = highlight(codeText);
  return (
    <code {...props}>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: sugar-high returns sanitized HTML */}
      <span dangerouslySetInnerHTML={{ __html: highlighted }} />
    </code>
  );
}

function Table({ data }) {
  const headers = data.headers.map((header: string) => (
    <th key={header}>{header}</th>
  ));
  const rows = data.rows.map((row: string[]) => {
    const rowKey = row.join("|");
    return (
      <tr key={rowKey}>
        {row.map((cell) => (
          <td key={`${rowKey}:${cell}`}>{cell}</td>
        ))}
      </tr>
    );
  });
  return (
    <table>
      <thead>
        <tr className="text-left">{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function Strikethrough(props) {
  return <del {...props} />;
}

function Callout(props) {
  return (
    <div className="mb-8 flex items-center rounded bg-[#F7F7F7] p-1 px-4 py-3 text-neutral-900 text-sm dark:bg-[#181818] dark:text-neutral-100">
      <div className="mr-4 flex w-4 items-center">{props.emoji}</div>
      <div className="callout w-full leading-relaxed">{props.children}</div>
    </div>
  );
}

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join("");
  }

  if (React.isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return getNodeText(element.props.children ?? "");
  }

  return "";
}

function createHeading(level) {
  const Heading = ({ children }) => {
    const text = getNodeText(children);
    const slug = slugify(text);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };
  Heading.displayName = `Heading${level}`;
  return Heading;
}

const H1 = 1;
const H2 = 2;
const H3 = 3;
const H4 = 4;
const H5 = 5;
const H6 = 6;

const components = {
  h1: createHeading(H1),
  h2: createHeading(H2),
  h3: createHeading(H3),
  h4: createHeading(H4),
  h5: createHeading(H5),
  h6: createHeading(H6),
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
};

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
  );
}
