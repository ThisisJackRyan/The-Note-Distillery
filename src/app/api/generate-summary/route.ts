import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/app/scripts/generateSumary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const summary = await generateSummary(content);
    return NextResponse.json({ summary });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error generating summary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
