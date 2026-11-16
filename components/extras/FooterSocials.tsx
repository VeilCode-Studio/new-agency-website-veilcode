import React from 'react'
import { SOCIALS } from '@/constants'
import { XIcon } from '@/components/icons/XIcon'
import { InstagramIcon } from '@/components/icons/InstagramIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { GitHubIcon } from '@/components/icons/GithubIcon'

const ICON_SIZE = 20

const ICONS: Record<(typeof SOCIALS)[number]['label'], React.ReactNode> = {
    'Twitter / X': <XIcon size={ICON_SIZE} />,
    Instagram: <InstagramIcon size={ICON_SIZE} />,
    LinkedIn: <LinkedInIcon size={ICON_SIZE} />,
    GitHub: <GitHubIcon size={ICON_SIZE} />,
}

const FooterSocials = () => {
    return (
        <div className="flex gap-2.5">
            {SOCIALS.map((s) => {
                return (
                    <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="size-11 flex items-center justify-center rounded-md
                        border border-line-hi bg-surface text-ink
                        hover:border-brand hover:bg-brand-dim hover:text-brand
                        focus-visible:border-brand focus-visible:bg-brand-dim focus-visible:text-brand
                        focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4
                        transition-colors duration-200 no-underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {ICONS[s.label]}
                    </a>
                )
            })}
        </div>
    )
}

export default FooterSocials
