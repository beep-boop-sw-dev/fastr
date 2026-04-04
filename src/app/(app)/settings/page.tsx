"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SPECIALTIES, TONES, AUDIENCES } from "@/lib/constants";
import type { PracticeInfoData } from "@/types";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [practiceName, setPracticeName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [defaultTone, setDefaultTone] = useState("warm");
  const [defaultAudience, setDefaultAudience] = useState("potential_clients");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetch("/api/practice")
      .then((r) => r.json())
      .then((data: PracticeInfoData | null) => {
        if (data) {
          setPracticeName(data.practiceName || "");
          setCity(data.city || "");
          setState(data.state || "");
          setNeighborhood(data.neighborhood || "");
          setSpecialties(data.specialties || []);
          setDefaultTone(data.defaultTone || "warm");
          setDefaultAudience(data.defaultAudience || "potential_clients");
          setWebsiteUrl(data.websiteUrl || "");
          setPhone(data.phone || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function toggleSpecialty(specialty: string) {
    setSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/practice", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          practiceName: practiceName || undefined,
          city: city || undefined,
          state: state || undefined,
          neighborhood: neighborhood || undefined,
          specialties,
          defaultTone,
          defaultAudience,
          websiteUrl: websiteUrl || undefined,
          phone: phone || undefined,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Save your practice info so it auto-fills when generating posts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice Information</CardTitle>
          <CardDescription>
            This info will pre-fill your blog generator for local SEO optimization.
          </CardDescription>
        </CardHeader>
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
            <Label htmlFor="neighborhood">Neighborhood</Label>
            <Input
              id="neighborhood"
              placeholder="e.g., East Side, Downtown"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                placeholder="https://yourpractice.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
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
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Preferences</CardTitle>
          <CardDescription>These will be pre-selected when you generate new posts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Tone</Label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setDefaultTone(t.value)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    defaultTone === t.value
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
            <Label>Default Audience</Label>
            <div className="grid grid-cols-3 gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setDefaultAudience(a.value)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    defaultAudience === a.value
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
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save Settings
      </Button>
    </div>
  );
}
