"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Clock, Users, User, Plus, Linkedin, Twitter, Globe } from "lucide-react"
import { useState } from "react"

export default function AcademyPage() {
  // tiny preview dataset (same two courses you already show on the Online Course page)
  const previewCourses = [
    {
      title: "Artificial Intelligence for Project Managers",
      description: "Learn how AI can optimize your project planning, risk assessment, and stakeholder communication.",
      level: "All Levels",
      duration: "Self-paced",
      students: 5400,
      rating: 4.7,
      image: "/ai_automation.jpeg",
      href: "https://www.linkedin.com/learning/artificial-intelligence-for-project-managers-24531458",
    },
    {
      title: "Intelligent Automation for Project Managers",
      description:
        "Understand how to harness automation tools to increase efficiency and streamline project workflows.",
      level: "All Levels",
      duration: "Self-paced",
      students: 4100,
      rating: 4.8,
      image: "/intellegent.jpeg",
      href: "https://www.linkedin.com/learning/intelligent-automation-for-project-managers",
    },
  ]

  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "AI Research Director",
      bio: "Leading AI researcher with 15+ years in machine learning and neural networks. Published author and keynote speaker.",
      image: "/professional-ai-researcher.png",
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen",
      website: "https://sarahchen.ai",
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "Senior ML Engineer",
      bio: "Former Google AI engineer specializing in computer vision and deep learning applications for business.",
      image: "/professional-man-ml-engineer.jpg",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      website: "https://marcusml.com",
    },
  ])

  const [isInstructorDialogOpen, setIsInstructorDialogOpen] = useState(false)
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    title: "",
    bio: "",
    image: "",
    linkedin: "",
    twitter: "",
    website: "",
  })

  const handleAddInstructor = () => {
    if (newInstructor.name && newInstructor.title && newInstructor.bio) {
      const instructor = {
        id: Date.now(),
        ...newInstructor,
      }
      setInstructors([...instructors, instructor])
      setNewInstructor({
        name: "",
        title: "",
        bio: "",
        image: "",
        linkedin: "",
        twitter: "",
        website: "",
      })
      setIsInstructorDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8 flex flex-col items-center">
      {/* ====== Your original content (unchanged) ====== */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 mt-6">Our Academy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          This is your starting point for practical, career-focused AI learning. Explore our LinkedIn Learning courses
          that align with your goals, and get early access to insights on what professionals like you are eager to learn
          next. It's a growing space, built around your needs, your pace, and your ambition.
        </p>
      </div>

      <div className="w-full max-w-6xl space-y-10">
        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
          <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-sm" />

          <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)]">
            <div className="px-6 pt-8 text-center">
              <h2 className="text-3xl font-bold">Meet Your Instructors</h2>
              <p className="text-muted-foreground mt-2">Learn from industry experts and AI practitioners.</p>
              <div className="mt-4">
                <Dialog open={isInstructorDialogOpen} onOpenChange={setIsInstructorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-[#1a729c]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Instructor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Instructor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="instructor-name">Name *</Label>
                        <Input
                          id="instructor-name"
                          value={newInstructor.name}
                          onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                          placeholder="Enter instructor name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor-title">Title *</Label>
                        <Input
                          id="instructor-title"
                          value={newInstructor.title}
                          onChange={(e) => setNewInstructor({ ...newInstructor, title: e.target.value })}
                          placeholder="e.g., Senior AI Engineer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor-bio">Bio *</Label>
                        <Textarea
                          id="instructor-bio"
                          value={newInstructor.bio}
                          onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                          placeholder="Brief bio and expertise"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor-image">Profile Image URL (Optional)</Label>
                        <Input
                          id="instructor-image"
                          value={newInstructor.image}
                          onChange={(e) => setNewInstructor({ ...newInstructor, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor-linkedin">LinkedIn URL (Optional)</Label>
                        <Input
                          id="instructor-linkedin"
                          value={newInstructor.linkedin}
                          onChange={(e) => setNewInstructor({ ...newInstructor, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor-twitter">Twitter URL (Optional)</Label>
                        <Input
                          id="instructor-twitter"
                          value={newInstructor.twitter}
                          onChange={(e) => setNewInstructor({ ...newInstructor, twitter: e.target.value })}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor-website">Website URL (Optional)</Label>
                        <Input
                          id="instructor-website"
                          value={newInstructor.website}
                          onChange={(e) => setNewInstructor({ ...newInstructor, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                      <Button onClick={handleAddInstructor} className="w-full">
                        Add Instructor
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((instructor) => (
                  <Card key={instructor.id} className="group hover:shadow-lg transition-all duration-300 bg-card/60">
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage src={instructor.image || "/placeholder.svg"} alt={instructor.name} />
                        <AvatarFallback className="bg-primary/10">
                          <User className="w-8 h-8 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg mb-1">{instructor.name}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{instructor.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{instructor.bio}</p>
                      <div className="flex justify-center gap-2">
                        {instructor.linkedin && (
                          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                            <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {instructor.twitter && (
                          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                            <a href={instructor.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {instructor.website && (
                          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                            <a href={instructor.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========= 1) Upcoming Trainings (Coming soon) ========= */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
          <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 blur-sm" />

          <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="px-6 pt-8 text-center">
              <h2 className="text-3xl font-bold">Upcoming Trainings</h2>
              <p className="text-muted-foreground mt-2">New live cohorts and workshops are being scheduled.</p>
              <div className="mt-3">
                <Badge variant="secondary" className="text-xs">
                  Coming soon
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* lightweight placeholders */}
                {[
                  {
                    title: "Coming soon",
                    blurb: "....",
                  },
                  {
                    title: "Coming Soon",
                    blurb: "....",
                  },
                ].map((item) => (
                  <article key={item.title} className="rounded-2xl ring-1 ring-border/60 bg-card/60 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{item.title}</h3>
                      <Badge variant="outline" className="text-[11px]">
                        Coming soon
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.blurb}</p>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Dates and registration will be announced here.
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========= 2) Online Courses (preview) ========= */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
          <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm" />

          <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)]">
            <div className="px-6 pt-8 text-center">
              <h2 className="text-3xl font-bold">Online Courses</h2>
              <p className="text-muted-foreground mt-2">Self-paced learning on LinkedIn Learning.</p>
              <div className="mt-4">
                <Link href="/academy/onlinecourse" className="inline-block">
                  <Button size="sm" className="bg-[#1a729c]">
                    View all courses
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {previewCourses.map((c) => (
                  <article
                    key={c.title}
                    className="group relative overflow-hidden rounded-2xl ring-1 ring-border/60 bg-card/60 hover:bg-card transition-colors"
                  >
                    {/* Thumb */}
                    <div className="relative aspect-[16/9]">
                      <img
                        src={c.image || "/placeholder.svg"}
                        alt={c.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

                      {/* Level pill */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-background/80 ring-1 ring-border">
                          {c.level}
                        </span>
                      </div>

                      {/* Rating pill */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] bg-background/80 ring-1 ring-border">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{c.rating}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col h-full">
                      <h3 className="font-semibold leading-snug line-clamp-2">{c.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>

                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {c.duration}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {c.students.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-4">
                        <a href={c.href} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" size="sm" className="bg-[#1a729c] w-full">
                            Quick View
                          </Button>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========= 3) Live Training (preview) ========= */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 -translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
          <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-sm" />

          <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="px-6 pt-8 text-center">
              <h2 className="text-3xl font-bold">Live Training</h2>
              <p className="text-muted-foreground mt-2">Interactive sessions, community Q&amp;A, and demos.</p>
              <div className="mt-4">
                <Link href="/academy/livetraining" className="inline-block">
                  <Button size="sm" className="bg-[#1a729c]">
                    Open live training
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6">
              {/* Lightweight hero-style preview, not the full iframe */}
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-border/60">
                <div className="aspect-[16/9] bg-[url('/ai_automation.jpeg')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">Community on FreeFuse</p>
                    <p className="text-muted-foreground">Join upcoming sessions and replays.</p>
                  </div>
                  <Link href="/academy/livetraining">
                    <Button size="sm" className="bg-[#1a729c]">
                      Join now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
