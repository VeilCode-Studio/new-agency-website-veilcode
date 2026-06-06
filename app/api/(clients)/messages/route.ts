import { NextRequest, NextResponse } from "next/server";
import { createClientInquiry } from "@/lib/inquiries/service";

export async function POST(req: NextRequest) {
    try {
        const { name, email, company, service, budget, timeline, message, goals } = await req.json();

        await createClientInquiry({
            name,
            email,
            service,
            message,
            budget,
            timeline,
            company,
            goals
        });

        return NextResponse.json({
            success: true,
            message: "Check your email for more details!"
        }, { status: 201 });
    } catch (error) {
        console.error("Something went wrong: -route: api/messages", error);
        return NextResponse.json({
            success: false,
            message: (error as Error).message || "Something went wrong!"
        }, { status: 500 });
    }
}
