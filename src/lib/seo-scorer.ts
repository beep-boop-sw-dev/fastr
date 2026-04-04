export interface SEOScore {
  overall: number;
  checks: SEOCheck[];
}

export interface SEOCheck {
  name: string;
  score: number;
  maxScore: number;
  message: string;
  status: "good" | "warning" | "error";
}

export function scoreSEO(content: string, primaryKeyword: string, metaDescription?: string): SEOScore {
  const checks: SEOCheck[] = [];
  const lowerContent = content.toLowerCase();
  const lowerKeyword = primaryKeyword.toLowerCase();
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Keyword in title (H1)
  const h1Match = content.match(/^#\s+(.+)$/m);
  const hasKeywordInTitle = h1Match ? h1Match[1].toLowerCase().includes(lowerKeyword) : false;
  checks.push({
    name: "Keyword in title",
    score: hasKeywordInTitle ? 15 : 0,
    maxScore: 15,
    message: hasKeywordInTitle ? "Primary keyword found in title" : "Add primary keyword to your title",
    status: hasKeywordInTitle ? "good" : "error",
  });

  // 2. Keyword density (1-2% ideal)
  const keywordRegex = new RegExp(lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const keywordCount = (content.match(keywordRegex) || []).length;
  const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
  const densityGood = density >= 0.5 && density <= 3;
  const densityOk = density > 0 && density < 0.5;
  checks.push({
    name: "Keyword density",
    score: densityGood ? 15 : densityOk ? 8 : 0,
    maxScore: 15,
    message: densityGood
      ? `Keyword density: ${density.toFixed(1)}% (ideal)`
      : density === 0
        ? "Keyword not found in content"
        : `Keyword density: ${density.toFixed(1)}% (aim for 1-2%)`,
    status: densityGood ? "good" : densityOk ? "warning" : "error",
  });

  // 3. Keyword in first paragraph
  const firstParagraph = content.split("\n\n").find(p => p.trim() && !p.startsWith("#") && !p.startsWith("META:"));
  const keywordInFirstPara = firstParagraph ? firstParagraph.toLowerCase().includes(lowerKeyword) : false;
  checks.push({
    name: "Keyword in introduction",
    score: keywordInFirstPara ? 10 : 0,
    maxScore: 10,
    message: keywordInFirstPara ? "Keyword appears in first paragraph" : "Add keyword to your first paragraph",
    status: keywordInFirstPara ? "good" : "warning",
  });

  // 4. H2 headings present
  const h2s = content.match(/^##\s+.+$/gm) || [];
  const h2Count = h2s.length;
  const h2Good = h2Count >= 3;
  checks.push({
    name: "Subheadings (H2)",
    score: h2Good ? 10 : h2Count > 0 ? 5 : 0,
    maxScore: 10,
    message: h2Good ? `${h2Count} subheadings found` : `Only ${h2Count} subheadings (aim for 3-5)`,
    status: h2Good ? "good" : h2Count > 0 ? "warning" : "error",
  });

  // 5. Keyword in H2s
  const h2sWithKeyword = h2s.filter(h => h.toLowerCase().includes(lowerKeyword));
  const keywordInH2 = h2sWithKeyword.length > 0;
  checks.push({
    name: "Keyword in subheadings",
    score: keywordInH2 ? 10 : 0,
    maxScore: 10,
    message: keywordInH2 ? `Keyword found in ${h2sWithKeyword.length} subheading(s)` : "Add keyword to at least one subheading",
    status: keywordInH2 ? "good" : "warning",
  });

  // 6. Meta description
  const metaLine = content.match(/^META:\s*(.+)$/m);
  const meta = metaDescription || (metaLine ? metaLine[1] : "");
  const metaLength = meta.length;
  const metaGood = metaLength >= 120 && metaLength <= 160;
  const metaHasKeyword = meta.toLowerCase().includes(lowerKeyword);
  checks.push({
    name: "Meta description",
    score: (metaGood ? 10 : metaLength > 0 ? 5 : 0) + (metaHasKeyword ? 5 : 0),
    maxScore: 15,
    message: !meta
      ? "Missing meta description"
      : `${metaLength} chars${metaGood ? " (ideal)" : " (aim for 120-160)"}${metaHasKeyword ? ", includes keyword" : ", add keyword"}`,
    status: metaGood && metaHasKeyword ? "good" : meta ? "warning" : "error",
  });

  // 7. Content length
  const lengthGood = wordCount >= 500;
  const lengthOk = wordCount >= 300;
  checks.push({
    name: "Content length",
    score: lengthGood ? 15 : lengthOk ? 8 : 0,
    maxScore: 15,
    message: `${wordCount} words${lengthGood ? " (good)" : " (aim for 500+)"}`,
    status: lengthGood ? "good" : lengthOk ? "warning" : "error",
  });

  // 8. Readability: short paragraphs
  const paragraphs = content.split("\n\n").filter(p => p.trim() && !p.startsWith("#") && !p.startsWith("META:"));
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 80);
  const readabilityGood = longParagraphs.length === 0;
  checks.push({
    name: "Readability",
    score: readabilityGood ? 10 : 5,
    maxScore: 10,
    message: readabilityGood ? "Good paragraph length" : `${longParagraphs.length} paragraph(s) are too long`,
    status: readabilityGood ? "good" : "warning",
  });

  const overall = checks.reduce((sum, c) => sum + c.score, 0);

  return { overall, checks };
}
