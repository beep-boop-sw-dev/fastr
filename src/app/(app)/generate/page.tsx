"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGeneration } from "@/hooks/use-generation";
import { scoreSEO } from "@/lib/seo-scorer";
import { SPECIALTIES, TONES, AUDIENCES, POST_LENGTHS } from "@/lib/constants";
import type { GenerateRequest, PracticeInfoData } from "@/types";
import {
  Loader2,
  Sparkles,
  Copy,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
} from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();
  const { content, isGenerating, error, generate, reset } = useGeneration();

  // Practice info (pre-filled from settings)
  const [practiceInfo, setPracticeInfo] = useState<PracticeInfoData | null>(null);
  const [showPracticeFields, setShowPracticeFields] = useState(false);

  // Form state
  const [practiceName, setPracticeName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [tone, setTone] = useState("warm");
  const [targetAudience, setTargetAudience] = useState("potential_clients");
  const [wordCount, setWordCount] = useState(1000);
  const [callToAction, setCallToAction] = useState("");
  const [saving, setSaving] = useState(false);

  // Load practice info
  useEffect(() => {
    fetch("/api/practice")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setPracticeInfo(data);
          setPracticeName(data.practiceName || "");
          setCity(data.city || "");
          setState(data.state || "");
          setNeighborhood(data.neighborhood || "");
          setSpecialties(data.specialties || []);
          setTone(data.defaultTone || "warm");
          setTargetAudience(data.defaultAudience || "potential_clients");
        }
      })
      .catch(() => {});
  }, []);

  // SEO score (computed from generated content)
  const seoScore = useMemo(() => {
    if (!content || !primaryKeyword) return null;
    return scoreSEO(content, primaryKeyword);
  }, [content, primaryKeyword]);

  function handleAddKeyword() {
    const trimmed = newKeyword.trim();
    if (trimmed && !secondaryKeywords.includes(trimmed)) {
      setSecondaryKeywords([...secondaryKeywords, trimmed]);
      setNewKeyword("");
    }
  }

  function handleRemoveKeyword(keyword: string) {
    setSecondaryKeywords(secondaryKeywords.filter((k) => k !== keyword));
  }

  function toggleSpecialty(specialty: string) {
    setSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    );
  }

  async function handleGenerate() {
    if (!topic.trim() || !primaryKeyword.trim()) {
      toast.error("Please enter a topic and primary keyword");
      return;
    }

    const input: GenerateRequest = {
      practiceName: practiceName || undefined,
      city: city || undefined,
      state: state || undefined,
      neighborhood: neighborhood || undefined,
      specialties: specialties.length ? specialties : undefined,
      topic,
      primaryKeyword,
      secondaryKeywords: secondaryKeywords.length ? secondaryKeywords : undefined,
      tone,
      targetAudience,
      wordCount,
      callToAction: callToAction || undefined,
    };

    await generate(input);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);

    // Extract title from content
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;

    // Extract meta description
    const metaMatch = content.match(/^META:\s*(.+)$/m);
    const metaDescription = metaMatch ? metaMatch[1] : undefined;

    const actualWordCount = content.split(/\s+/).filter(Boolean).length;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          metaDescription,
          topic,
          primaryKeyword,
          secondaryKeywords,
          tone,
          targetAudience,
          wordCount,
          callToAction,
          localCity: city || undefined,
          localState: state || undefined,
          seoScore: seoScore?.overall,
          actualWordCount,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const post = await res.json();
      toast.success("Post saved!");
      router.push(`/posts/${post.id}`);
    } catch {
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Create New Post</h1>
        <p className="text-muted-foreground">Share your expertise with the people who need it most.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Practice Info (Collapsible) */}
          <Card>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setShowPracticeFields(!showPracticeFields)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Practice Information</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {practiceInfo?.practiceName
                      ? `Pre-filled from settings: ${practiceInfo.practiceName}`
                      : "Add your practice details for local reach"}
                  </p>
                </div>
                {showPracticeFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
            {showPracticeFields && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="practiceName">Practice Name</Label>
                  <Input
                    id="practiceName"
                    placeholder="e.g., Serenity Counseling Center"
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="e.g., Texas"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Neighborhood (optional)</Label>
                  <Input
                    id="neighborhood"
                    placeholder="e.g., East Side, Downtown"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specialties</Label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map((s) => (
                      <Badge
                        key={s}
                        variant={specialties.includes(s) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleSpecialty(s)}
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Blog Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Blog Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Blog Topic / Title *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., How to Manage Anxiety During the Holidays"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryKeyword">Primary SEO Keyword *</Label>
                <Input
                  id="primaryKeyword"
                  placeholder="e.g., anxiety therapist Austin"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Secondary Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a keyword and press Enter"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddKeyword}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {secondaryKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {secondaryKeywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="gap-1">
                        {kw}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveKeyword(kw)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tone & Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tone & Audience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Writing Tone</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTone(t.value)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        tone === t.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <div className="grid grid-cols-3 gap-2">
                  {AUDIENCES.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => setTargetAudience(a.value)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        targetAudience === a.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="text-sm font-medium">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Post Length</Label>
                <div className="grid grid-cols-3 gap-2">
                  {POST_LENGTHS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setWordCount(l.value)}
                      className={`rounded-lg border p-3 text-center transition-colors ${
                        wordCount === l.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="text-sm font-medium">{l.label}</p>
                      <p className="text-xs text-muted-foreground">{l.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta">Call to Action</Label>
                <Textarea
                  id="cta"
                  placeholder="e.g., Schedule a free 15-minute consultation call today"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim() || !primaryKeyword.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Post
              </>
            )}
          </Button>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          {/* SEO Score */}
          {seoScore && !isGenerating && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">SEO Score</CardTitle>
                  <span
                    className={`text-2xl font-bold ${
                      seoScore.overall >= 80
                        ? "text-green-600"
                        : seoScore.overall >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {seoScore.overall}/100
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {seoScore.checks.map((check) => (
                    <div key={check.name} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{check.name}</span>
                      <span
                        className={
                          check.status === "good"
                            ? "text-green-600"
                            : check.status === "warning"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {check.score}/{check.maxScore}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Content */}
          <Card className="sticky top-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Generated Content</CardTitle>
                {content && !isGenerating && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy to clipboard">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleSave} disabled={saving} title="Save as draft">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={reset} title="Clear and start over">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}
              {!content && !isGenerating && !error && (
                <p className="text-center text-sm text-muted-foreground py-12">
                  Fill in the details and click &quot;Create Post&quot; to get started.
                </p>
              )}
              {(content || isGenerating) && (
                <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary">
                  <ReactMarkdown>{content}</ReactMarkdown>
                  {isGenerating && (
                    <span className="inline-block h-4 w-1 animate-pulse bg-primary" />
                  )}
                </div>
              )}
              {content && !isGenerating && (
                <>
                  <Separator className="my-4" />
                  <p className="text-xs text-muted-foreground">
                    {content.split(/\s+/).filter(Boolean).length} words
                    {seoScore && ` \u2022 SEO Score: ${seoScore.overall}/100`}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
