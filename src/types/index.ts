export interface GenerateRequest {
  practiceName?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  specialties?: string[];
  topic: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  tone: string;
  targetAudience: string;
  wordCount: number;
  callToAction?: string;
}

export interface PracticeInfoData {
  practiceName?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  specialties: string[];
  defaultTone: string;
  defaultAudience: string;
  websiteUrl?: string;
  phone?: string;
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  metaDescription?: string;
  slug?: string;
  topic?: string;
  primaryKeyword?: string;
  secondaryKeywords: string[];
  tone?: string;
  targetAudience?: string;
  wordCount?: number;
  callToAction?: string;
  localCity?: string;
  localState?: string;
  seoScore?: number;
  actualWordCount?: number;
  status: "DRAFT" | "FINAL" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}
