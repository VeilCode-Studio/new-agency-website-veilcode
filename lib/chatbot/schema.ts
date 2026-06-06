import { z, type ZodError } from "zod";

const MESSAGE_MAX_LENGTH = 1200;
const MESSAGE_LIMIT = 12;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .trim()
    .min(1, "Please enter a message.")
    .max(MESSAGE_MAX_LENGTH, "Messages must be 1,200 characters or fewer."),
});

const leadDraftSchema = z
  .object({
    service: z.string().trim().optional(),
    name: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .optional()
      .or(z.literal("")),
    company: z.string().trim().optional(),
    budget: z.string().trim().optional(),
    timeline: z.string().trim().optional(),
    message: z.string().trim().optional(),
    goals: z.array(z.string().trim()).optional(),
  })
  .default({});

export const chatbotRequestSchema = z
  .object({
    conversationId: z.string().trim().optional(),
    messages: z
      .array(messageSchema)
      .min(1, "Please enter a message.")
      .transform((messages) => messages.slice(-MESSAGE_LIMIT)),
    leadDraft: leadDraftSchema,
    leadSubmitted: z.boolean().default(false),
  })
  .superRefine((value, ctx) => {
    const latestUserMessage = [...value.messages]
      .reverse()
      .find((message) => message.role === "user");

    if (!latestUserMessage) {
      ctx.addIssue({
        code: "custom",
        path: ["messages"],
        message: "Please enter a message.",
      });
    }
  });

export type ChatbotRequest = z.infer<typeof chatbotRequestSchema>;
export type ChatMessage = ChatbotRequest["messages"][number];
export type ChatbotLeadDraft = ChatbotRequest["leadDraft"];

export const chatbotModelResponseSchema = z.object({
  reply: z.string().trim().min(1),
  leadDraft: leadDraftSchema,
  readyToSubmit: z.boolean(),
});

export type ChatbotModelResponse = z.infer<typeof chatbotModelResponseSchema>;

export function formatChatbotValidationError(error: ZodError) {
  return error.issues[0]?.message ?? "Invalid chatbot request.";
}
