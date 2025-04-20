import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("API Route Error: OPENAI_API_KEY environment variable is not set.");
      return NextResponse.json({ error: 'Server configuration error: API key missing' }, { status: 500 });
    }

    console.log(`API Route: Performing web search for: ${query}`);

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", 
        tools: [{ type: "web_search_preview", search_context_size: "high" }],
        input: query,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error(`API Route Error: OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`, errorData);
      return NextResponse.json({ error: `OpenAI API failed with status: ${openaiResponse.status}` }, { status: openaiResponse.status });
    }

    const responseData = await openaiResponse.json();
    console.log("API Route: OpenAI API response:", responseData);

    const messageItem = responseData.output?.find((item: any) => item.type === 'message' && item.content?.[0]?.type === 'output_text');
    const textFromMessage = messageItem?.content?.[0]?.text;

    if (textFromMessage) {
      return NextResponse.json({ result: textFromMessage });
    } else {
      console.error("API Route Error: Could not extract text from OpenAI response.", responseData);
      return NextResponse.json({ error: 'Failed to process OpenAI response' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("API Route Error: Internal Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 