import { Heading } from "app/lib/headings";

type TableOfContentsProps = {
  headings: Heading[];
};

const INDENT_CLASS: Record<number, string> = {
  2: "pl-0",
  3: "pl-4",
  4: "pl-8",
  5: "pl-12",
  6: "pl-12",
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const items = headings.filter((heading) => heading.depth <= 6);

  if (!items.length) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="mb-8 rounded-md border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <p className="mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
        On this page
      </p>
      <ul className="space-y-2">
        {items.map(({ slug, text, depth }) => (
          <li key={slug} className={INDENT_CLASS[depth] ?? "pl-0"}>
            <a
              href={`#${slug}`}
              className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
