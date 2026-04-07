"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PenTool, FileText, TrendingUp, Sparkles } from "lucide-react";
import type { PostData } from "@/types";

interface UsageData {
  plan: string;
  generationsUsed: number;
  generationsLimit: number;
  totalPosts: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [recentPosts, setRecentPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/usage").then((r) => r.json()),
      fetch("/api/posts?limit=6").then((r) => r.json()),
    ])
      .then(([usageData, postsData]) => {
        setUsage(usageData);
        setRecentPosts(postsData.posts || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const usagePercent = usage
    ? usage.generationsLimit === Infinity
      ? 0
      : (usage.generationsUsed / usage.generationsLimit) * 100
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground">
            {usage?.plan || "Free"} Plan
          </p>
        </div>
        <Link href="/generate" className={buttonVariants()}>
          <Sparkles className="mr-2 h-4 w-4" />
          Create New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Posts This Month</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage?.generationsUsed || 0}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {usage?.generationsLimit === Infinity ? "\u221E" : usage?.generationsLimit || 3}
              </span>
            </div>
            <Progress value={usagePercent} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Posts created this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage?.totalPosts || 0}</div>
            <p className="mt-1 text-xs text-muted-foreground">Posts saved in your library</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg SEO Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentPosts.length
                ? Math.round(
                    recentPosts.reduce((sum, p) => sum + (p.seoScore || 0), 0) /
                      recentPosts.filter((p) => p.seoScore).length || 1
                  )
                : "--"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Across your recent posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          {recentPosts.length > 0 && (
            <Link href="/posts" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              View all
            </Link>
          )}
        </div>

        {recentPosts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="mb-2 text-sm font-medium">No posts yet</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first post to get started.
              </p>
              <Link href="/generate" className={buttonVariants()}>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Your First Post
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <Card className="h-full transition-colors hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 text-sm">{post.title}</CardTitle>
                      <Badge
                        variant={post.status === "FINAL" ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {post.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {post.seoScore !== null && post.seoScore !== undefined && (
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
    </div>
  );
}
