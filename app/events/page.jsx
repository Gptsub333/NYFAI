"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Star } from "lucide-react"

export default function EventsPage() {
  // minimal preview data (just for the cards below)
  const pastPreview = {
    title: "Digital Marketing Revolution 2024",
    date: "December 2024",
    attendees: 3200,
    rating: 4.9,
    image: "/nyfai_event.avif",
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (unchanged) */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Calendar className="w-3 h-3 mr-1" />
            Events & Conferences
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Experience AI Firsthand</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Be at the forefront of AI innovation by participating in our exclusive events. Gain actionable insights,
            network with industry leaders, and stay prepared for the future.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-10">
          {/* ========= Upcoming Events (Updated to show link) ========= */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Upcoming Events</CardTitle>
                <CardDescription>Workshops, talks, and live sessions.</CardDescription>
                <div className="mt-4">
                  <Link href="/events/upcoming" className="inline-block">
                    <Button size="sm" variant="outline" className="bg-[#1a729c] hover:bg-[#165881]">
                      View & Manage Upcoming Events
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </div>
          </section>

          {/* ========= Past Events (Preview) ========= */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 -translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Past Events</CardTitle>
                <CardDescription>Replays, resources, and takeaways.</CardDescription>
                <div className="mt-4">
                  <Link href="/events/past" className="inline-block">
                    <Button size="sm" variant="outline" className="bg-[#1a729c]">
                      View past events
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                {/* Compact preview cards */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Past event preview card */}
                  <article className="group relative overflow-hidden rounded-2xl ring-1 ring-border/60 bg-card/60 hover:bg-card transition-colors">
                    <div
                      className="relative aspect-[16/9] bg-cover bg-center"
                      style={{ backgroundImage: `url(${pastPreview.image})` }}
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {pastPreview.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {pastPreview.rating}
                        </span>
                      </div>
                      <h3 className="font-semibold leading-snug">{pastPreview.title}</h3>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {pastPreview.attendees.toLocaleString()} attended
                        </span>
                        <Link href="/events/past">
                          <Button size="sm" variant="secondary">
                            Recap
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>

                  {/* A second lightweight placeholder preview */}
                  <article className="relative overflow-hidden rounded-2xl ring-1 ring-border/60 bg-card/60 p-4">
                    <div className="text-xs text-muted-foreground mb-1 inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> November 2024
                    </div>
                    <h3 className="font-semibold leading-snug">AI Tools Workshop Series</h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        850 attended
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        4.8
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link href="/events/past">
                        <Button size="sm" variant="outline" className="w-full bg-transparent bg-[#1a729c]">
                          View recordings
                        </Button>
                      </Link>
                    </div>
                  </article>
                </div>
              </CardContent>
            </div>
          </section>

          {/* ========= Optional: Keep your calendar teaser ========= */}
          {/* <section>
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-[#1a729c] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
                  <p className="text-muted-foreground mb-6">
                    Subscribe to our event calendar to never miss an important AI event.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-[#1a729c]">Subscribe to Calendar</Button>
                    <Button variant="outline">Get Email Updates</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section> */}
        </div>
      </div>
    </div>
  )
}
