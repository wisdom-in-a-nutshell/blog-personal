import fs from "node:fs";
import path from "node:path";
import { extractHeadings, type Heading } from "./headings";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  tags: string;
  image?: string;
  hidden?: boolean;
};

export type BlogPost = {
  metadata: Metadata;
  slug: string;
  content: string;
  headings: Heading[];
};

const FRONTMATTER_REGEX = /---\s*([\s\S]*?)\s*---/;
const QUOTE_WRAP = /^['"](.*)['"]$/;

function createEmptyMetadata(): Metadata {
  return {
    title: "",
    publishedAt: "",
    summary: "",
    tags: "",
  };
}

function parseFrontmatter(
  fileContent: string
): { metadata: Metadata; content: string } {
  const match = FRONTMATTER_REGEX.exec(fileContent);
  if (!match) {
    return {
      metadata: createEmptyMetadata(),
      content: fileContent.trim(),
    };
  }
  const frontMatterBlock = match[1];
  const content = fileContent.replace(FRONTMATTER_REGEX, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata = createEmptyMetadata();

  const QUOTE_WRAP_REGEX = QUOTE_WRAP;
  for (const line of frontMatterLines) {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(QUOTE_WRAP_REGEX, "$1");

    const trimmedKey = key.trim();

    switch (trimmedKey) {
      case "hidden":
        metadata.hidden = value === "true";
        break;
      case "image":
        metadata.image = value;
        break;
      case "title":
      case "publishedAt":
      case "summary":
      case "tags":
        metadata[trimmedKey] = value;
        break;
      default:
        break;
    }
  }

  return { metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string): BlogPost[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));
    const headings = extractHeadings(content);

    return {
      metadata,
      slug,
      content,
      headings,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "content")).filter(
    (post) => !post.metadata.hidden
  );
}

export function getAllBlogPosts() {
  return getMDXData(path.join(process.cwd(), "content"));
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  const normalized = date.includes("T") ? date : `${date}T00:00:00`;
  const targetDate = new Date(normalized);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
