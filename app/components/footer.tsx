"use client";

import { metaData, socialLinks } from "app/config";
import { useState } from "react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaRss,
  FaXTwitter,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { SubscribeModal } from "./subscribe-modal";

const YEAR = new Date().getFullYear();

function SocialLink({ href, icon: Icon }) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      <Icon />
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="float-right flex gap-3.5 transition-opacity duration-300 hover:opacity-90">
      <SocialLink href={socialLinks.twitter} icon={FaXTwitter} />
      <SocialLink href={socialLinks.github} icon={FaGithub} />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />
      <SocialLink href={socialLinks.email} icon={TbMailFilled} />
      <a href="/rss.xml" target="_self">
        <FaRss />
      </a>
    </div>
  );
}

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <small className="mt-16 block text-[#1C1C1C] lg:mt-24 dark:text-[#D4D4D4]">
        <div className="flex items-center justify-between">
          <div>
            <time>© {YEAR}</time>{" "}
            <a
              className="no-underline"
              href={socialLinks.twitter}
              rel="noopener noreferrer"
              target="_blank"
            >
              {metaData.title}
            </a>
          </div>

          <div className="flex items-center gap-3.5">
            <button
              className="relative align-middle transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              Subscribe
            </button>
            <span
              aria-hidden="true"
              className="text-neutral-400 dark:text-neutral-600"
            >
              |
            </span>
            <SocialLinks />
          </div>
        </div>
        <style jsx>{`
          @media screen and (max-width: 480px) {
            article {
              padding-top: 2rem;
              padding-bottom: 4rem;
            }
          }
        `}</style>
      </small>

      <SubscribeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
