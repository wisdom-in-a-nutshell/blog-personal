<!-- Generated from cursor rule 'blog-creation' -->

> Guidelines for creating and formatting blog posts using MDX in the personal blog

# Blog Post Creation Guide

This rule provides a comprehensive guide for creating, structuring, and formatting blog posts for the personal blog using MDX.

## Overview

Blog posts are written in MDX format, which allows you to combine Markdown with JSX components. This format enables rich content creation with custom components like tweets, YouTube videos, image grids, and mathematical expressions.

## File Structure and Location

All blog posts should be stored in the `content/` directory at the root of the project:

```
content/
├── my-first-post.mdx
├── another-post.mdx
└── technical-deep-dive.mdx
```

The filename will be used as the URL slug for the post. For example, `my-first-post.mdx` will be accessible at `/blog/my-first-post`.

## Frontmatter Requirements

Every blog post must include frontmatter at the beginning of the file. Frontmatter is metadata enclosed between triple dashes (`---`):

```mdx
---
title: 'Your Post Title'
publishedAt: 'CURRENT_DATE'
summary: 'A brief description of your post (used for SEO and previews).'
tags: 'Tag1, Tag2, Tag3'
image: '/optional-image-path.png'
hidden: false
---

Post content starts here...
```

### Required Fields

- **title**: The title of your blog post
- **publishedAt**: The publication date in `YYYY-MM-DD` format. Always use the current date when creating a new post.
- **summary**: A brief description (under 160 characters for SEO)
- **tags**: Comma-separated list of relevant tags

### Optional Fields

- **image**: Path to a custom OG image for social media sharing. If not provided, a default OG image will be generated.
- **hidden**: Controls listing visibility. Default is `false` for all posts. Set to `true` only when you intentionally want a private draft.

## Content Formatting

### Title Handling - CRITICAL

**The blog automatically generates the H1 title from your frontmatter.** Never add the title as an H1 heading in your content.

✅ **Correct approach:**

```mdx
---
title: 'My Blog Post Title'
---

## First Section Heading
Content starts here...
```

❌ **Incorrect approach:**

```mdx
---
title: 'My Blog Post Title'
---

# My Blog Post Title

## First Section Heading
Content starts here...
```

**Always start your content with H2 headings (##), never H1 (#).**

### Basic Markdown

Standard Markdown syntax works as expected:

```mdx
## Heading 2
### Heading 3

**Bold text** and *italic text*

- Bullet point
- Another bullet point

1. Numbered item
2. Another numbered item

[Link text](../../../../https:/example.com)

![Alt text](../../../../path/to/image.jpg)
```

### Tables

For proper table formatting that works consistently across the blog, use HTML table syntax with the centered wrapper:

```mdx
<div className="flex justify-center">
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th className="text-right">Column 2</th>
      <th className="text-right">Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Row 1 Data</td>
      <td className="text-right">100</td>
      <td className="text-right">50%</td>
    </tr>
    <tr>
      <td>Row 2 Data</td>
      <td className="text-right">200</td>
      <td className="text-right">50%</td>
    </tr>
  </tbody>
</table>
</div>
```

**Key points:**

- Use `<div className="flex justify-center">` to center the table
- Use `className="text-right"` for right-aligned numerical columns
- Escape HTML characters like `<` as `&lt;` when needed
- Standard Markdown table syntax may not render consistently, so prefer HTML tables

### Code Blocks

Use triple backticks with language specifier for syntax highlighting:

````mdx
```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
````

### Custom Components

The blog includes several custom components you can use in your MDX:

#### Tweet Embedding

```mdx
<StaticTweet id="1234567890123456789" />
```

#### YouTube Videos

```mdx
<YouTube videoId="dQw4w9WgXcQ" />
```

#### Image Grid

```mdx
<ImageGrid>
  ![Image 1](../../../../image1.jpg)
  ![Image 2](../../../../image2.jpg)
  ![Image 3](../../../../image3.jpg)
</ImageGrid>
```

#### Captions

```mdx
<Caption>This is a caption for the image/media above</Caption>
```

#### Mathematical Expressions

The blog supports KaTeX for mathematical expressions:

```mdx
Inline math: $E=mc^2$

Display math:
$$
\frac{d}{dx}e^x = e^x
$$
```

### Callouts

Use the Callout component for highlighting important information:

```mdx
<Callout emoji="💡">
  This is a tip or piece of information you want to highlight.
</Callout>
```

### Charts and Data Visualizations

Use the shared shadcn/Recharts wrappers for any chart embeds so styling, accessibility, and client-side code stay consistent.

#### When to Use shadcn Chart Components

**Use shadcn chart primitives when you need:**

- Standard chart types (bar, line, area) with built-in styling
- Consistent theming (light/dark mode support via `--chart-*` CSS variables)
- Tooltips with automatic color indicators
- Legends with consistent styling
- Quick implementations that don't require custom positioning or advanced features

**shadcn provides:**

- `ChartContainer` - theming and CSS variable management
- `ChartTooltip` / `ChartTooltipContent` - styled tooltips with color indicators
- `ChartLegend` / `ChartLegendContent` - styled legends
- Theme configuration via `ChartConfig` type

#### When to Use Custom Recharts Implementation

**Use custom Recharts code when you need:**

- Advanced label positioning or custom rendering
- Special interactions or animations not covered by shadcn
- Complex data transformations or custom visualizations
- Features that require trigonometry calculations or custom SVG rendering

**Best Practice:** Start with shadcn primitives for the container, tooltips, and theming, then add custom Recharts code for specific advanced features. The custom code works seamlessly with shadcn's `ChartContainer` and theme system.

#### Implementation Pattern

- Prefer server-rendered posts with a single client component for the chart. Export your visualization as a reusable component under `app/components/blog/` or `app/components/charts/` (e.g., `top-podcast-cadence/chart.tsx`) and register it inside `app/components/mdx.tsx`.
- Keep datasets deterministic by precomputing JSON in your CLI or script and importing it into the chart component. Do **not** fetch data inside MDX.
- Embed charts with the registered tag, e.g. `<PublishCadenceChart />`. Avoid inline chart definitions inside the MDX file.
- Base charts on shadcn `ChartContainer` for theming, even when using custom Recharts code for specific features.

## Implementation Steps

1. Create a new `.mdx` file in the `content/` directory with a descriptive filename (using kebab-case)
2. Add the required frontmatter at the top of the file
3. Write your content using Markdown and custom components (start with H2 headings, not H1)
4. Test the post by running the development server (`pnpm dev`) and navigating to `/blog/your-post-slug`

## Real-World Examples

For reference, examine these existing blog posts:

- [Getting Started Guide](../../../../../../content/getting-started.mdx) - Basic post structure and formatting
- [MDX Examples](../../../../../../content/custom-mdx-examples.mdx) - Demonstrates custom components

## Common Pitfalls

### Metadata Issues

- **Missing Required Fields**: Ensure all required frontmatter fields are present
- **Date Format**: The `publishedAt` field must use `YYYY-MM-DD` format (use current date for new posts)
- **Quotes**: Wrap values containing special characters in quotes

### Content Issues

- **Title Redundancy**: NEVER add H1 headings - the title from frontmatter is automatically displayed
- **Wrong Heading Levels**: Always start content with H2 (##), never H1 (#)
- **Broken Images**: Ensure image paths are correct and images exist in the public directory
- **Component Errors**: Check that all custom components are properly imported and used
- **Syntax Errors**: Ensure all MDX syntax is valid and properly closed
- **Large Media**: Compress images before adding them to keep page load times fast

## Publishing Workflow

1. Write your post in the `content/` directory
2. Default visibility is public (`hidden: false`). Only use `hidden: true` for private drafts.
3. Ensure `publishedAt` is current on publish day.
4. Commit and push to deploy.

By following these guidelines, you'll create consistent and well-formatted blog posts that take full advantage of the blog's capabilities.
