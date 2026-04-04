"use client";

import { useEffect, useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { scoreSEO } from "@/lib/seo-scorer";
import type { PostData } from "@/types";
import {
  ArrowLeft,
  Copy,
  Download,
  Save,
  Loader2,
  Eye,
  Pencil,
} from "lucide-react";

export default function PostEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState<PostData["status"]>("DRAFT");

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setMetaDescription(data.metaDescription || "");
        setStatus(data.status);
      })
      .catch(() => router.push("/posts"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const seoScore = useMemo(() => {
    if (!content || !post?.primaryKeyword) return null;
    return scoreSEO(content, post.primaryKeyword, metaDescription);
  }, [content, post?.primaryKeyword, metaDescription]);

  async function handleSave() {
    setSaving(true);
    const actualWordCount = content.split(/\s+/).filter(Boolean).length;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          metaDescription,
          status,
          seoScore: seoScore?.overall,
          actualWordCount,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      toast.success("Post saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function handleCopyHTML() {
    // Simple markdown to basic text copy
    navigator.clipboard.writeText(content);
    toast.success("Markdown copied!");
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/posts")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 p-0 text-xl font-bold shadow-none focus-visible:ring-0 h-auto"
            />
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={status === "FINAL" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() =>
                  setStatus(status === "DRAFT" ? "FINAL" : status === "FINAL" ? "ARCHIVED" : "DRAFT")
                }
              >
                {status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Click to change status
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyHTML}>
            <Copy className="mr-2 h-3 w-3" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-3 w-3" />
            Download
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
            Save
          </Button>
        </div>
      </div>

      {/* Editor + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Editor */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="edit" className="w-full">
              <div className="flex items-center justify-between border-b px-4">
                <TabsList className="border-0 bg-transparent">
                  <TabsTrigger value="edit" className="gap-2">
                    <Pencil className="h-3 w-3" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="h-3 w-3" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <span className="text-xs text-muted-foreground">
                  {content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <TabsContent value="edit" className="m-0">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[600px] resize-none rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0"
                />
              </TabsContent>
              <TabsContent value="preview" className="m-0 p-6">
                <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/90">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* SEO Score */}
          {seoScore && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">SEO Score</CardTitle>
                  <span
                    className={`text-xl font-bold ${
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
              <CardContent className="space-y-2">
                {seoScore.checks.map((check) => (
                  <div key={check.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
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
                    <p className="text-[11px] text-muted-foreground">{check.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Meta Description */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Meta Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Write a compelling 150-160 character description..."
                rows={3}
                className="text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {metaDescription.length}/160 characters
                {metaDescription.length > 160 && (
                  <span className="text-destructive"> (too long)</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Post Details */}
          {post.primaryKeyword && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Generation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Keyword</span>
                  <span>{post.primaryKeyword}</span>
                </div>
                {post.tone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tone</span>
                    <span className="capitalize">{post.tone}</span>
                  </div>
                )}
                {post.localCity && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>{post.localCity}, {post.localState}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
