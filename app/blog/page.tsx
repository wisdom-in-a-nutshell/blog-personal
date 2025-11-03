import { formatDate, getBlogPosts } from "app/lib/posts";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Nextfolio Blog",
};

export default function BlogPosts() {
  const allBlogs = getBlogPosts();

  return (
    <section>
      {/* <h1 className="mb-8 text-2xl font-medium tracking-tight">Our Blog</h1> */}
      <div>
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link
              className="mb-5 flex flex-col space-y-1 transition-opacity duration-200 hover:opacity-80"
              href={`/blog/${post.slug}`}
              key={post.slug}
            >
              <div className="flex w-full items-start justify-between gap-4">
                <h2 className="min-w-0 flex-1 text-black dark:text-white">
                  {post.metadata.title}
                </h2>
                <p className="whitespace-nowrap text-neutral-600 text-sm tabular-nums dark:text-neutral-400">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
