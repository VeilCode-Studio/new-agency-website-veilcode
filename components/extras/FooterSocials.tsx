import React from 'react'
import { SOCIALS } from '@/constants'

const FooterSocials = () => {
    return (
        <div className="flex gap-2.5">
            {SOCIALS.filter((s) => s.href !== "#").map((s) => {
                return (
                    <a
                        key={s.abbr}
                        href={s.href}
                        aria-label={s.label}
                        className="size-9 flex items-center justify-center rounded-md
                        border border-line text-ink-faint
                        hover:border-line-hi hover:text-ink-muted
                        transition-colors duration-200 no-underline"
                        target="_blank"
                    >
                        <span className="font-mono text-[10px] tracking-wide">{s.abbr}</span>
                    </a>
                )
            })}
        </div>
    )
}

export default FooterSocials