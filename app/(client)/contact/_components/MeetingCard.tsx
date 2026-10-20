import { MEETING_TYPES } from "@/constants";
export function MeetingCard({
  meeting,
  selected,
  onSelect,
}: {
  meeting: (typeof MEETING_TYPES)[number];
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-pressed={selected}
      onClick={onSelect}
      type="button"
      className={`w-full text-left rounded-xl p-6 border cursor-pointer
        outline-none transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-200
        focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
        focus-visible:ring-offset-page
        ${
          selected
            ? `${meeting.bg} ${meeting.border} ${meeting.hoverShadow}`
            : `bg-surface border-line hover:bg-surface-hi ${meeting.hoverBorder} ${meeting.hoverShadow}`
        }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`text-xl leading-none ${meeting.accent}`}
            aria-hidden
          >
            {meeting.icon}
          </span>
          <span className="font-display text-[16px] font-bold tracking-tight text-ink">
            {meeting.title}
          </span>
        </div>
        {/* Duration badge */}
        <span
          className={`shrink-0 font-mono text-[10px] tracking-widest uppercase
          px-2.5 py-1 rounded border ${meeting.bg} ${meeting.border} ${meeting.accent}`}
        >
          {meeting.dur}
        </span>
      </div>

      <p className="font-sans text-sm text-ink-muted leading-relaxed">
        {meeting.desc}
      </p>

      {/* Selected indicator */}
      {selected && (
        <div
          className={`mt-4 flex items-center gap-2 font-sans text-[13px]
          font-medium ${meeting.accent}`}
        >
          <span className={`size-1.5 rounded-full bg-current`} aria-hidden />
          Selected
        </div>
      )}
    </button>
  );
}
