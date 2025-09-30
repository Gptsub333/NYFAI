"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AcademyPage() {
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

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8 flex flex-col items-center">
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
            <div className="px-6 pt-8 pb-8 text-center">
              <h2 className="text-3xl font-bold">Meet Your Instructors</h2>
              <p className="text-muted-foreground mt-4 max-w-3xl mx-auto leading-relaxed">
                Our academy features industry-leading experts and AI practitioners who bring real-world experience to
                every course. These instructors are seasoned professionals with deep expertise in artificial
                intelligence, machine learning, and business transformation. They've worked with Fortune 500 companies,
                led cutting-edge research, and built AI solutions that drive measurable results. Each instructor is
                carefully selected for their ability to translate complex AI concepts into practical, actionable
                strategies that you can apply immediately in your role.
              </p>
              <div className="mt-6">
                <Link href="/academy/onlinecourse" className="inline-block">
                  <Button size="lg" className="bg-[#165881]">
                    Explore All Instructors
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </section>

        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
          <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm" />

          <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)]">
            <div className="px-6 pt-8 pb-8 text-center">
              <h2 className="text-3xl font-bold">Online Courses</h2>
              <p className="text-muted-foreground mt-4 max-w-3xl mx-auto leading-relaxed">
                Our online courses are designed for busy professionals who want to learn AI at their own pace. Available
                through LinkedIn Learning, these comprehensive programs cover everything from AI fundamentals to
                advanced implementation strategies. Each course is structured to deliver practical knowledge you can
                apply immediately, with real-world examples, hands-on exercises, and actionable frameworks. Whether
                you're a project manager looking to leverage AI for better decision-making, or a business leader seeking
                to understand AI's strategic implications, our courses provide the insights and skills you need to
                succeed in an AI-driven world.
              </p>
              <div className="mt-6">
                <Link href="/academy/onlinecourse" className="inline-block">
                  <Button size="lg" className="bg-[#165881]">
                    Explore All Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live Training section remains unchanged */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 -translate-x-2 translate-y-2 rounded-3xl bg-primary/5" />
          <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-sm" />

          <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="px-6 pt-8 text-center">
              <h2 className="text-3xl font-bold">Live Training</h2>
              <p className="text-muted-foreground mt-2">Interactive sessions, community Q&amp;A, and demos.</p>
              <div className="mt-4">
                <Link href="/academy/livetraining" className="inline-block">
                  <Button size="sm" className="bg-[#165881]">
                    Open live training
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6">
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-border/60">
                <div className="aspect-[16/9] bg-[url('/ai_automation.jpeg')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">Community on FreeFuse</p>
                    <p className="text-muted-foreground">Join sessions and replays.</p>
                  </div>
                  <Link href="/academy/livetraining">
                    <Button size="sm" className="bg-[#165881]">
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
