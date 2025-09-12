"use client";

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
import {
  BookOpen,
  Play,
  Headphones,
  Clock,
  ExternalLink,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function MediaPage() {
  // Source of truth: same content as your /media/Article page
  const articles = [
    {
      title: "Bold Predictions: The Rise of AI-Driven Projects in the 2020s",
      url: "https://oliveryarbrough.medium.com/bold-predictions-the-rise-of-ai-driven-projects-in-the-2020s-f801590c40e7",
      date: "Jan 27, 2020",
      readTime: "5 min read",
      badge: "AI & Projects",
      description:
        "Explore bold predictions and key trends about how AI will transform project management through the 2020s.",
    },
    {
      title: "Non-Project Managers: Leverage Technology to Get Work Done",
      url: "https://oliveryarbrough.medium.com/non-project-managers-leverage-technology-to-get-work-done-4c925b01b0fc",
      date: "Jan 14, 2021",
      readTime: "4 min read",
      badge: "Tech & Productivity",
      description:
        "Discover how non-project managers can harness AI tools to improve execution and streamline work processes.",
    },
    {
      title: "3 Ways Project Managers Can Survive a Robot Takeover",
      url: "https://oliveryarbrough.medium.com/3-ways-project-managers-can-survive-a-robot-takeover-dd15d393fc5a",
      date: "Apr 26, 2017",
      readTime: "6 min read",
      badge: "AI Survival Tips",
      description:
        "Insights into staying relevant in an AI-dominated future. Learn how PMs can lead in collaboration with machines.",
    },
  ];

  const episodes = [
    {
      title: "That's So AI!",
      episode: "Ep 1",
      link: "https://bit.ly/3vFZkph",
      description: "An introduction to the series where we explore the world of AI and its potential.",
    },
    {
      title: "What's So Smart About AI?",
      episode: "Ep 2",
      link: "https://bit.ly/3SaMNmk",
      description: "Understanding the basics of AI and why it's becoming so integral in today's world.",
    },
    {
      title: "My A.I. Digital Assistant Is Smarter Than Yours!",
      episode: "Ep 3",
      link: "https://bit.ly/3rcWAwS",
      description: "A deep dive into AI-powered personal assistants and how they're changing the game.",
    },
  ];

  const articlePreviews = articles.slice(0, 2);
  const episodePreviews = episodes.slice(0, 2);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (kept) */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Media & Content
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Stay Ahead with Cutting-Edge Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover essential insights and trends through our dynamic content.
            Engage with strategic perspectives and inspiring stories that
            empower you to lead confidently in the era of AI.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-10">
          {/* ===== Episodes (Updated with actual preview) ===== */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Episodes</CardTitle>
                <CardDescription>
                  Conversations, breakdowns, and hands-on demos.
                </CardDescription>
                <div className="mt-4">
                  <Link href="/media/Episode" className="inline-block">
                    <Button size="sm" className="bg-[#1a729c] text-white">
                      View all episodes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {episodePreviews.map((episode, index) => (
                    <article
                      key={index}
                      className="group rounded-2xl ring-1 ring-border/60 bg-card/60 hover:bg-card transition-colors p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[#1a729c] border-[#1a729c]">
                          {episode.episode}
                        </Badge>
                        <Play className="w-4 h-4 text-[#1a729c]" />
                      </div>
                      <h3 className="font-semibold leading-snug text-[#1a729c] mb-2">
                        {episode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {episode.description}
                      </p>
                      <a
                        href={episode.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button
                          size="sm"
                          className="inline-flex items-center gap-1 bg-[#1a729c] hover:bg-[#1a729c]/90 text-white"
                        >
                          Watch {episode.episode} <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    </article>
                  ))}
                </div>
              </CardContent>
            </div>
          </section>

          {/* ===== Articles (Updated with actual preview) ===== */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Articles</CardTitle>
                <CardDescription>
                  Curated Medium articles and insights from our team.
                </CardDescription>
                <div className="mt-4">
                  <Link href="/media/Article" className="inline-block">
                    <Button size="sm" className="bg-[#1a729c] text-white">
                      Browse all articles <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                <article className="relative overflow-hidden rounded-2xl ring-1 ring-border/60 p-6 bg-card/60">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <BookOpen className="h-12 w-12 text-[#1a729c]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Medium Publication Feed</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                      Explore our curated collection of Medium articles covering AI trends, 
                      project management insights, and practical frameworks for modern professionals.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Latest updates
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ExternalLink className="h-3.5 w-3.5" /> Direct from Medium
                      </span>
                    </div>
                    <Link href="https://oliveryarbrough.medium.com/">
                      <Button className="inline-flex items-center gap-2 bg-[#1a729c] hover:bg-[#1a729c]/90 text-white">
                        <BookOpen className="w-4 h-4" />
                        View Publication Feed
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </article>
              </CardContent>
            </div>
          </section>

          {/* ===== Newsletters (Preview → Beehiiv) ===== */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 -translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Newsletters</CardTitle>
                <CardDescription>
                  Curated insights, no fluff. Sent occasionally.
                </CardDescription>
                <div className="mt-4">
                  <a
                    href="https://not-your-fathers-ai.beehiiv.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button size="sm" variant="outline" className="bg-[#1a729c] text-white">
                      Open newsletter
                    </Button>
                  </a>
                </div>
              </CardHeader>

              <CardContent>
                <article className="relative overflow-hidden rounded-2xl ring-1 ring-border/60 p-6 bg-card/60">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">Not Your Father's A.I.</h3>
                      <p className="text-sm text-muted-foreground">
                        Frameworks, playbooks, and real-world learnings.
                      </p>
                    </div>
                    <a
                      href="https://not-your-fathers-ai.beehiiv.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="inline-flex items-center gap-1 bg-[#1a729c] text-white"
                      >
                        Read now <Mail className="w-3.5 h-3.5" />
                      </Button>
                    </a>
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
