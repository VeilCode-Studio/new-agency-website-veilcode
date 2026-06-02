import type { Testimonial } from "@/db/schema";

export type DisplayTestimonial = {
  initials: string;
  name: string;
  role: string;
  quote: string;
  avatar: string | null;
};

export function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "VC";
}

export function toDisplayTestimonial(row: Testimonial): DisplayTestimonial {
  return {
    initials: getInitials(row.name),
    name: row.name,
    role: `${row.role}, ${row.company}`,
    quote: row.quote,
    avatar: row.avatar,
  };
}
