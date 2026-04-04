"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Sparkles, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { PostData } from "@/types";

export default function PostsPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);
    params.set("limit", "50");

    fetch(`/api/posts?${params}`)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .finally(() => setLoading(false));
  }, [filter]);

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this post?")) return;

    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link href="/generate" className={buttonVariants()}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[null, "DRAFT", "FINAL", "ARCHIVED"].map((status) => (
          <Button
            key={status || "all"}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status || "All"}
          </Button>
        ))}
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-2 text-sm font-medium">No posts found</p>
            <p className="mb-4 text-sm text-muted-foreground">
              {filter ? `No ${filter.toLowerCase()} posts yet.` : "Generate your first blog post."}
            </p>
            <Link href="/generate" className={buttonVariants()}>
              Generate a Post
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card className="group h-full transition-colors hover:border-primary/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-sm">{post.title}</CardTitle>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant={post.status === "FINAL" ? "default" : "secondary"}>
                        {post.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDelete(post.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {post.primaryKeyword && (
                    <Badge variant="outline" className="mb-2 text-xs">
                      {post.primaryKeyword}
                    </Badge>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {post.seoScore != null && (
                      <span className={post.seoScore >= 80 ? "text-green-600" : post.seoScore >= 60 ? "text-yellow-600" : "text-red-600"}>
                        SEO: {post.seoScore}
                      </span>
                    )}
                    {post.actualWordCount && <span>{post.actualWordCount} words</span>}
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
