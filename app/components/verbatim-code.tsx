/**
 * A component to render a block of text or code verbatim, preserving whitespace
 * and preventing further Markdown/MDX processing within the block.
 *
 * @param {object} props - The component props.
 * @param {string} props.code - The string content to render verbatim.
 * @returns {JSX.Element} The rendered preformatted code block.
 */
export function VerbatimCode({ code }: { code: string }): JSX.Element {
  return (
    <pre className="text-neutral-800 dark:text-neutral-200">
      <code>{code}</code>
    </pre>
  )
}
