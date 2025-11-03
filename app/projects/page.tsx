import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "./project-data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Nextfolio Projects",
};

export default function Projects() {
  return (
    <section>
      <h1 className="mb-8 font-medium text-2xl tracking-tight">Projects</h1>
      <div>
        {projects.map((project) => (
          <Link
            className="mb-5 flex flex-col space-y-1 transition-opacity duration-200 hover:opacity-80"
            href={project.url}
            key={project.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex w-full flex-col items-start justify-between space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
              <h2 className="text-black dark:text-white">{project.title}</h2>
              <p className="text-neutral-600 tracking-tight dark:text-neutral-400">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
