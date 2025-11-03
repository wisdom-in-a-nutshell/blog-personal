import { slugify } from "./slugify";

export type Heading = {
  depth: number;
  slug: string;
  text: string;
};

const TRIM_PATTERN = /[*_`~]/g;
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
const IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)/g;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const HEADING_REGEX = /^(#{2,6})\s+(.*)$/;
const ID_SUFFIX_REGEX = /\s*{#.*}$/;

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split("\n");
  let insideFence = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      insideFence = !insideFence;
      continue;
    }

    if (insideFence) {
      continue;
    }

    const match = line.match(HEADING_REGEX);
    if (!match) {
      continue;
    }

    const [, hashes, headingBody] = match;
    const depth = hashes.length;
    const text = headingBody
      .replace(ID_SUFFIX_REGEX, "")
      .replace(IMAGE_PATTERN, "$1")
      .replace(LINK_PATTERN, "$1")
      .replace(HTML_TAG_PATTERN, "")
      .replace(TRIM_PATTERN, "")
      .trim();

    if (!text) {
      continue;
    }

    const slug = slugify(text);
    headings.push({ depth, slug, text });
  }

  return headings;
}
