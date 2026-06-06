import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildChatbotInquiryInput, isLeadReadyForSubmission } from "@/lib/chatbot/lead";
import { getVeilCodeChatbotContext } from "@/lib/chatbot/context";
import {
  chatbotModelResponseSchema,
  chatbotRequestSchema,
  formatChatbotValidationError,
} from "@/lib/chatbot/schema";
import { buildGuidedChatbotFallback } from "@/lib/chatbot/guidance";
import { createClientInquiry } from "@/lib/inquiries/service";

export const runtime = "nodejs";

const CHATBOT_RESPONSE_FORMAT = {
  type: "json_schema" as const,
  name: "veilcode_chatbot_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["reply", "leadDraft", "readyToSubmit"],
    properties: {
      reply: { type: "string" },
      readyToSubmit: { type: "boolean" },
      leadDraft: {
        type: "object",
        additionalProperties: false,
        required: [
          "service",
          "name",
          "email",
          "company",
          "budget",
          "timeline",
          "message",
          "goals",
        ],
        properties: {
          service: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          company: { type: "string" },
          budget: { type: "string" },
          timeline: { type: "string" },
          message: { type: "string" },
          goals: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
  },
};

function getSystemPrompt() {
  return `
You are VeilCode Studio's lead qualification assistant.

Use only the approved VeilCode context below. If the visitor asks for something outside it, answer briefly and route them to a discovery call or the /start project brief.

Your job:
- Answer concise questions about VeilCode services, process, pricing ranges, and relevant examples.
- Qualify project leads naturally.
- Keep a running leadDraft by preserving any fields already provided.
- Ask one useful follow-up question at a time.
- When a visitor describes a desired tool, workflow, or business outcome, map it to the closest VeilCode service and continue the discovery.
- Treat competitor analysis, market intelligence, reporting, dashboards, and monitoring tools as valid project needs. Route automated tools to AI Automation, with Data Analytics as a supporting capability when needed.
- After service fit is clear, lead the visitor toward the next scoping detail: primary outcome, users, data sources, desired outputs, timeline, or budget.
- Set readyToSubmit true only when leadDraft has name, valid email, service, and a project message with enough context.
- Never say an inquiry has been submitted. The server decides submission after your response.

Approved context:
${getVeilCodeChatbotContext()}
`.trim();
}

export async function POST(req: NextRequest) {
  const parsed = chatbotRequestSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      {
        reply: formatChatbotValidationError(parsed.error),
        leadDraft: {},
        readyToSubmit: false,
        submitted: false,
        submissionMessage: null,
      },
      { status: 400 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        reply:
          "The assistant is not configured yet. Please use the project form and we will respond within one business day.",
        leadDraft: parsed.data.leadDraft,
        readyToSubmit: false,
        submitted: false,
        submissionMessage: null,
      },
      { status: 503 },
    );
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      input: [
        { role: "system", content: getSystemPrompt() },
        {
          role: "user",
          content: `Current lead draft: ${JSON.stringify(parsed.data.leadDraft)}`,
        },
        ...parsed.data.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      text: { format: CHATBOT_RESPONSE_FORMAT },
      max_output_tokens: 900,
    });

    const outputText = response.output_text;
    const modelPayload = chatbotModelResponseSchema.parse(JSON.parse(outputText));
    const readyToSubmit = isLeadReadyForSubmission(modelPayload.leadDraft);
    let submitted = false;
    let submissionMessage: string | null = null;

    if (readyToSubmit && !parsed.data.leadSubmitted) {
      await createClientInquiry(buildChatbotInquiryInput(modelPayload.leadDraft));
      submitted = true;
      submissionMessage =
        "Your brief has been sent. We'll respond within one business day.";
    }

    return NextResponse.json({
      reply: submitted ? submissionMessage : modelPayload.reply,
      leadDraft: modelPayload.leadDraft,
      readyToSubmit,
      submitted,
      submissionMessage,
    });
  } catch (error) {
    console.error("[api/chatbot/messages] POST error:", error);
    const fallback = buildGuidedChatbotFallback(
      parsed.data.messages,
      parsed.data.leadDraft,
    );

    return NextResponse.json({
      reply: fallback.reply,
      leadDraft: fallback.leadDraft,
      readyToSubmit: isLeadReadyForSubmission(fallback.leadDraft),
      submitted: false,
      submissionMessage: null,
    });
  }
}
