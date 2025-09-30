import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Wrench, Star } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (unchanged) */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Resources & Tools
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Your Comprehensive AI Knowledge Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Navigate the complexities of AI with our extensive library of
            resources designed to provide practical, actionable knowledge for
            business leaders.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-10">
          {/* ===== Prompt Library (Preview) ===== */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Prompt Library</CardTitle>
                <CardDescription>
                  Battle-tested prompts for planning, ops, and communication.
                </CardDescription>
                <div className="mt-3">
                  <Badge variant="secondary" className="text-xs">
                    Coming soon
                  </Badge>
                </div>
                <div className="mt-4">
                  <Link
                    href="/resources/promptLibrary"
                    className="inline-block"
                  >
                    <Button size="sm" className="bg-[#1a729c]">Open Prompt Library</Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                <article className="rounded-2xl ring-1 ring-border/60 p-6 bg-card/60">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        Curated prompts for project plans, risk logs, meeting
                        notes, stakeholder updates.
                      </p>
                      <p>
                        Clear instructions, variables to fill, and examples for
                        fast reuse.
                      </p>
                      <p>Save your own variants for your team’s workflows.</p>
                    </div>
                  </div>
                </article>
              </CardContent>
            </div>
          </section>



          {/* ===== AI Reviews (Preview) ===== */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">AI Reviews</CardTitle>
                <CardDescription>
                  No-nonsense takes on tools and workflows.
                </CardDescription>
                <div className="mt-3">
                  <Badge variant="secondary" className="text-xs">
                    Coming soon
                  </Badge>
                </div>
                <div className="mt-4">
                  <Link href="/resources/aiReviews" className="inline-block">
                    <Button size="sm" variant="outline" className="bg-[#1a729c]">
                      Explore AI Reviews
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                <article className="rounded-2xl ring-1 ring-border/60 p-6 bg-card/60">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">
                      <Star className="h-6 w-6" />
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        Short, opinionated reviews of AI tools with pros/cons
                        and concrete use cases.
                      </p>
                      <p>Stack recommendations by role and company size.</p>
                      <p>Benchmarks with example prompts and outputs.</p>
                    </div>
                  </div>
                </article>
              </CardContent>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
