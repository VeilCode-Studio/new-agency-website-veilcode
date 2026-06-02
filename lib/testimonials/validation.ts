import { z } from "zod";

const trimmedRequiredString = (message: string) => z.string().trim().min(1, message);

const nullableTrimmedString = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null);

export const testimonialInputSchema = z.object({
  name: trimmedRequiredString("Name is required"),
  role: trimmedRequiredString("Role is required"),
  company: trimmedRequiredString("Company is required"),
  quote: trimmedRequiredString("Quote is required"),
  avatar: nullableTrimmedString,
});

export type TestimonialInput = z.infer<typeof testimonialInputSchema>;

export function formatTestimonialValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid testimonial data";
}
