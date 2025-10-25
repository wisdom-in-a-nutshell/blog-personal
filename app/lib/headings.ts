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

    const match = line.match(/^(#{2,6})\s+(.*)$/);
    if (!match) {
      continue;
    }

    const [, hashes, headingBody] = match;
    const depth = hashes.length;
    let text = headingBody
      .replace(/\s*{#.*}$/, "")
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
