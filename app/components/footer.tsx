'use client'

import { metaData, socialLinks } from 'app/config'
import { useState } from 'react'
import { FaGithub, FaInstagram, FaLinkedinIn, FaRss, FaXTwitter } from 'react-icons/fa6'
import { TbMailFilled } from 'react-icons/tb'
import { SubscribeModal } from './subscribe-modal'

const YEAR = new Date().getFullYear()

function SocialLink({ href, icon: Icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Icon />
    </a>
  )
}

function SocialLinks() {
  return (
    <div className="flex gap-3.5 float-right transition-opacity duration-300 hover:opacity-90">
      <SocialLink href={socialLinks.twitter} icon={FaXTwitter} />
      <SocialLink href={socialLinks.github} icon={FaGithub} />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />
      <SocialLink href={socialLinks.email} icon={TbMailFilled} />
      <a href="/rss.xml" target="_self">
        <FaRss />
      </a>
    </div>
  )
}

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <small className="block lg:mt-24 mt-16 text-[#1C1C1C] dark:text-[#D4D4D4]">
        <div className="flex justify-between items-center">
          <div>
            <time>© {YEAR}</time>{' '}
            <a
              className="no-underline"
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              {metaData.title}
            </a>
          </div>

          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 align-middle relative"
            >
              Subscribe
            </button>
            <span className="text-neutral-400 dark:text-neutral-600" aria-hidden="true">
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

      <SubscribeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
