import { NextResponse } from "next/server";
import { getChatbotEnabled } from "@/lib/chatbot/settings.server";

export const dynamic = "force-dynamic";

export async function GET() {
  const enabled = await getChatbotEnabled();

  return NextResponse.json(
    { enabled },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
