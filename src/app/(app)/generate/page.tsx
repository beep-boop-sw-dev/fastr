"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGeneration } from "@/hooks/use-generation";
import { scoreSEO } from "@/lib/seo-scorer";
import { SPECIALTIES, TONES, AUDIENCES, POST_LENGTHS } from "@/lib/constants";
import type { GenerateRequest, PracticeInfoData } from "@/types";
import {
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  FileText,
  ArrowRight,
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
  const [savedPostId, setSavedPostId] = useState<string | null>(null);

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

  // Auto-save when generation completes
  useEffect(() => {
    if (content && !isGenerating && !savedPostId && !saving) {
      handleSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating]);

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

    // Reset any previous saved state
    setSavedPostId(null);

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

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;
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
      setSavedPostId(post.id);
      toast.success("Post saved!");
    } catch {
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  function handleNewPost() {
    reset();
    setSavedPostId(null);
    setTopic("");
    setPrimaryKeyword("");
    setSecondaryKeywords([]);
    setCallToAction("");
  }

  // --- GENERATING STATE: full-width progress ---
  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Creating Your Post</h1>
          <p className="text-muted-foreground">Writing about: {topic}</p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">Crafting your content...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {content.split(/\s+/).filter(Boolean).length} words written
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- COMPLETED STATE: show saved post card ---
  if (savedPostId && content && !isGenerating) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const postTitle = titleMatch ? titleMatch[1] : topic;
    const postWordCount = content.split(/\s+/).filter(Boolean).length;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Post Created</h1>
          <p className="text-muted-foreground">Your content is ready to review.</p>
        </div>

        <Card
          className="group cursor-pointer transition-colors hover:border-primary/50"
          onClick={() => router.push(`/posts/${savedPostId}`)}
        >
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{postTitle}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <Badge variant="secondary">Draft</Badge>
                <span>{postWordCount} words</span>
                {seoScore && (
                  <span className={
                    seoScore.overall >= 80 ? "text-green-600" :
                    seoScore.overall >= 60 ? "text-yellow-600" : "text-red-600"
                  }>
                    SEO: {seoScore.overall}/100
                  </span>
                )}
                <span>{primaryKeyword}</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleNewPost}>
            <Sparkles className="mr-2 h-4 w-4" />
            Create Another Post
          </Button>
          <Button variant="outline" onClick={() => router.push("/posts")}>
            View All Posts
          </Button>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error && !content) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Create New Post</h1>
          <p className="text-muted-foreground">Share your expertise with the people who need it most.</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
              <Button variant="outline" onClick={handleNewPost}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- DEFAULT: Input Form ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Create New Post</h1>
        <p className="text-muted-foreground">Share your expertise with the people who need it most.</p>
      </div>

      <div className="max-w-2xl space-y-6">
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
          <Sparkles className="mr-2 h-5 w-5" />
          Create Post
        </Button>
      </div>
    </div>
  );
}
