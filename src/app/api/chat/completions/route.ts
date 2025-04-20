import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { model, messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model,
      messages,
    });

    return NextResponse.json(completion);
  } catch (error: any) {
    console.error("Error in /chat/completions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
