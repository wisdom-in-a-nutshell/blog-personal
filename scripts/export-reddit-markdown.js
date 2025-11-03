#!/usr/bin/env node
/**
 * Generate a Reddit-friendly markdown export of an MDX post.
 *
 * Usage:
 *   node scripts/export-reddit-markdown.js content/how-long-top-podcasts-run.mdx output.md
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const PERCENT_MULTIPLIER = 100;
const PERCENT_PRECISION = 1;
const TABLE_BREAKPOINT = "\n---";
const FRONTMATTER_END_OFFSET = 4;
const FRONTMATTER_SEARCH_START = 3;

const [inputFile, outputFile] = process.argv.slice(2);

if (!(inputFile && outputFile)) {
  console.error(
    "Usage: node scripts/export-reddit-markdown.js <input.mdx> <output.md>"
  );
  process.exit(1);
}

function loadEpisodeData() {
  const tsPath = path.resolve("data/podcasts/episode-length.ts");
  const tsSource = fs.readFileSync(tsPath, "utf-8");

  const transformed = tsSource
    .replace(/export type[\s\S]*?;\n/g, "")
    .replace(/as const/g, "")
    .replace(
      /export const (\w+)([^=]*)=/g,
      (_, name) => `module.exports.${name} =`
    )
    .replace(/: EpisodeBucketId\[]/g, "")
    .replace(/: EpisodeLengthCounts/g, "")
    .replace(/: Record<[^>]+?>/g, "");

  if (process.env.DEBUG_TRANSFORM === "1") {
    console.log(
      "Transformed episode-length.ts:\n",
      transformed.split("\n").slice(0, 10).join("\n")
    );
  }

  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  const script = new vm.Script(transformed, { filename: tsPath });
  script.runInContext(sandbox);

  const moduleExports = sandbox.module.exports;
  const moduleLengthData = moduleExports.EPISODE_LENGTH_DATA;
  const moduleBucketOrder = moduleExports.EPISODE_BUCKET_ORDER;

  if (!(moduleLengthData && moduleBucketOrder)) {
    throw new Error("Failed to load episode length data");
  }
  return { moduleLengthData, moduleBucketOrder };
}

const bucketLabels = {
  under10: "<10 minutes",
  tenToTwenty: "10–20 minutes",
  twentyToForty: "20–40 minutes",
  fortyToSixty: "40–60 minutes",
  sixtyToNinety: "60–90 minutes",
  ninetyPlus: "90+ minutes",
};

function formatShare(count, total) {
  return total
    ? `${((count / total) * PERCENT_MULTIPLIER).toFixed(PERCENT_PRECISION)}%`
    : "0.0%";
}

function generateEpisodeTable(group, data, order) {
  const counts = data[group];
  const total = order.reduce((sum, id) => sum + (counts[id] ?? 0), 0);
  const header = "|Episode length|Shows|Share|";
  const separator = "|---|---|---|";
  const rows = order.map((id) => {
    const shows = counts[id] ?? 0;
    const share = formatShare(shows, total);
    return `|${bucketLabels[id] ?? id}|${shows}|${share}|`;
  });
  return [header, separator, ...rows].join("\n");
}

function convertHtmlTable(html) {
  const rowRegex = /<tr[\s\S]*?<\/tr>/g;
  const cellRegex = /<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/g;
  const rows = [];
  const stripTags = (value) =>
    value
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

  let rowMatch = rowRegex.exec(html);
  while (rowMatch) {
    const cells = [];
    let cellMatch = cellRegex.exec(rowMatch[0]);
    while (cellMatch) {
      cells.push(stripTags(cellMatch[1]));
      cellMatch = cellRegex.exec(rowMatch[0]);
    }
    if (cells.length) {
      rows.push(cells);
    }
    rowMatch = rowRegex.exec(html);
  }

  if (rows.length === 0) {
    return html;
  }

  const header = rows[0];
  const separator = header.map(() => "---");
  const mdLines = [
    `|${header.join("|")}|`,
    `|${separator.join("|")}|`,
    ...rows.slice(1).map((row) => `|${row.join("|")}|`),
  ].map((line) => line.trim());

  return mdLines.join("\n");
}

function stripFrontmatter(source) {
  if (!source.startsWith("---")) {
    return source;
  }
  const endIndex = source.indexOf(TABLE_BREAKPOINT, FRONTMATTER_SEARCH_START);
  if (endIndex === -1) {
    return source;
  }
  return source.slice(endIndex + FRONTMATTER_END_OFFSET);
}

function cleanHtmlArtifacts(mdContent) {
  return mdContent
    .replace(/<hr[^>]*>/g, "\n---\n")
    .replace(/<\/?.*?div[^>]*>/g, "")
    .replace(/ class(Name)?="[^"]*"/g, "")
    .replace(/<br\s*\/?/g, "\n")
    .replace(/\]\(\/(?!\/)/g, "](https://www.adithyan.io/")
    .replace(/^ +\|/gm, "|")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildRedditMarkdown(input, episodeData, episodeOrder) {
  let content = stripFrontmatter(input);
  content = content.replace(/<EpisodeLengthHistogram \/>/g, "");
  content = content.replace(/<DailyEpisodeLengthChart \/>/g, "");
  content = content.replace(/<NearDailyEpisodeLengthChart \/>/g, "");
  content = content.replace(/<WeeklyEpisodeLengthChart \/>/g, "");
  content = content.replace(/<MonthlyEpisodeLengthChart \/>/g, "");

  content = content.replace(
    /<EpisodeLengthTable group="(.*?)" \/>/g,
    (_, group) => {
      const key = group;
      if (!episodeData[key]) {
        return "";
      }
      const table = generateEpisodeTable(key, episodeData, episodeOrder);
      return `\n${table}\n`;
    }
  );

  content = content.replace(/<table[\s\S]*?<\/table>/g, convertHtmlTable);
  content = cleanHtmlArtifacts(content);

  return content.trim();
}

const sourceMdx = fs.readFileSync(path.resolve(inputFile), "utf-8");
const {
  moduleLengthData: episodeLengthData,
  moduleBucketOrder: episodeBucketOrder,
} = loadEpisodeData();
const redditMarkdown = buildRedditMarkdown(
  sourceMdx,
  episodeLengthData,
  episodeBucketOrder
);
const absoluteOutput = path.resolve(outputFile);
fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
fs.writeFileSync(absoluteOutput, `${redditMarkdown}\n`, "utf-8");
console.log(`Reddit markdown exported to ${absoluteOutput}`);
