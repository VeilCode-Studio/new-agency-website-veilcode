import React from "react";

export function TeamCard({ member }: { member: TeamMember; index: number }) {
  return (
    <article
      className="group relative rounded-xl bg-surface border border-line
        overflow-hidden transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300
        hover:bg-surface-hi hover:border-line-hi
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
    >
      {/* Top bar — accent colour on hover */}
      <div
        aria-hidden
        className={`h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-500
          bg-linear-to-r from-current to-transparent ${member.accentClass}`}
      />

      <div className="p-8">
        {/* Avatar + socials row */}
        <div className="flex items-start justify-between mb-6">
          {/* Avatar */}
          <div
            className={`size-16 rounded-xl border flex items-center justify-center
              bg-linear-to-br font-display font-bold text-xl tracking-tight
              transition-transform duration-300 group-hover:scale-105
              ${member.accentClass} ${member.avatarBg}`}
          >
            {member.initials}
          </div>

          {/* Social links */}
        </div>

        {/* Name + role */}
        <h3 className="font-display text-xl font-bold tracking-tight text-ink mb-1">
          {member.name}
        </h3>
        <p
          className={`font-mono text-[11px] tracking-widest uppercase mb-4 ${member.accentClass}`}
        >
          {member.role}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-line mb-5" />

        {/* Bio */}
        <p className="font-sans text-sm text-ink-muted leading-relaxed mb-6">
          {member.bio}
        </p>

        {/* Skill tags */}
        <ul
          className="flex flex-wrap gap-2 list-none p-0 m-0"
          aria-label="Skills"
        >
          {member.skills.map((skill) => (
            <li
              key={skill}
              className="font-mono text-[10px] tracking-wide uppercase
                px-2.5 py-1 rounded border border-line bg-surface-hi text-ink-faint"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
