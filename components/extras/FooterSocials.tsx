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
                        aria-label={`${s.abbr} ? ${s.label}`}
                        className="size-11 flex items-center justify-center rounded-md
                        border border-line text-ink-faint
                        hover:border-brand hover:bg-brand-dim hover:text-brand
                        focus-visible:border-brand focus-visible:bg-brand-dim focus-visible:text-brand
                        focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4
                        transition-colors duration-200 no-underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="font-mono text-[10px] tracking-wide">{s.abbr}</span>
                    </a>
                )
            })}
        </div>
    )
}

export default FooterSocials
