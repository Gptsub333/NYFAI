"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Zap, BookOpen, Calendar } from "lucide-react"
import Link from "next/link"

export default function JoinPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            Join the AI Movement
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Ready to Transform Your Leadership?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with professionals who share your curiosity and drive to innovate with AI. Whether you're a seasoned
            leader or just starting your AI journey, find your tribe and grow together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Why Join Our Community</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Zap,
                    title: "Practical AI Strategies",
                    description: "Access real-world frameworks and tools you can apply immediately to your work.",
                  },
                  {
                    icon: BookOpen,
                    title: "Expert-Led Learning",
                    description: "Learn from industry experts through courses, workshops, and certification programs.",
                  },
                  {
                    icon: Users,
                    title: "Professional Network",
                    description: "Build meaningful relationships with business leaders and innovative change-makers.",
                  },
                  {
                    icon: Calendar,
                    title: "Exclusive Event Access",
                    description: "Participate in live sessions, webinars, and conferences with thought leaders.",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <benefit.icon className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-none">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic mb-3">
                  "This community completely transformed how I approach AI in my organization. The practical insights
                  are game-changing for real business applications!"
                </p>
                <div className="text-xs text-muted-foreground">— Sarah Chen, Marketing Director at TechCorp</div>
              </CardContent>
            </Card>
          </div>

          {/* Sign Up Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Join Today</CardTitle>
              <CardDescription>Fill out the form below to get started with your AI marketing journey.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@company.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your Company" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Marketing Manager" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Areas of Interest</Label>
                  <Textarea id="interests" placeholder="Tell us about your marketing goals and interests..." rows={3} />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Join the Community
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Already have an account?{" "}
                  <Link href="/auth" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
