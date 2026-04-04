import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface GenerateOptions {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export async function streamBlogGeneration({ systemPrompt, userPrompt, maxTokens = 4096 }: GenerateOptions) {
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return stream;
}
