"use client";

import { useState, useCallback } from "react";
import type { GenerateRequest } from "@/types";

interface GenerationState {
  content: string;
  isGenerating: boolean;
  error: string | null;
  tokens: number | null;
}

export function useGeneration() {
  const [state, setState] = useState<GenerationState>({
    content: "",
    isGenerating: false,
    error: null,
    tokens: null,
  });

  const generate = useCallback(async (input: GenerateRequest) => {
    setState({ content: "", isGenerating: true, error: null, tokens: null });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6);
          try {
            const data = JSON.parse(json);
            if (data.text) {
              setState((prev) => ({ ...prev, content: prev.content + data.text }));
            }
            if (data.done) {
              setState((prev) => ({ ...prev, isGenerating: false, tokens: data.tokens }));
            }
            if (data.error) {
              setState((prev) => ({ ...prev, isGenerating: false, error: data.error }));
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: err instanceof Error ? err.message : "Generation failed",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ content: "", isGenerating: false, error: null, tokens: null });
  }, []);

  return { ...state, generate, reset };
}
