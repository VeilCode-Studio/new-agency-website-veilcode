import { NextRequest, NextResponse } from "next/server";
import { createClientInquiry } from "@/lib/inquiries/service";
import { z } from "zod";

const inquirySchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(320),
    service: z.string().trim().min(1).max(120),
    message: z.string().trim().min(20).max(5000),
    company: z.string().trim().max(160).optional().nullable(),
    budget: z.string().trim().max(80).optional().nullable(),
    timeline: z.string().trim().max(80).optional().nullable(),
    goals: z.array(z.string().trim().max(100)).max(12).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const parsed = inquirySchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({
                success: false,
                message: "Please check the required fields and try again."
            }, { status: 400 });
        }

        const { name, email, company, service, budget, timeline, message, goals } = parsed.data;

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
