"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function NewsletterModule() {
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)


    try {
      const beehiivPromise = fetch(
        "/api/beehiiv-subscribe",
        // "http://localhost:3001/api/beehiiv-subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        },
      )

      const airtablePromise = fetch(
        "/api/airtable-subscribe",
        // "http://localhost:3001/api/airtable-subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name, email: formData.email }),
        },
      )

      const [beehiivRes, airtableRes] = await Promise.all([beehiivPromise, airtablePromise])

      if (!beehiivRes.ok || !airtableRes.ok) {
        const beehiivError = await beehiivRes.text()
        const airtableError = await airtableRes.text()
        throw new Error(
          `Beehiiv error (${beehiivRes.status}): ${beehiivError}\nAirtable error (${airtableRes.status}): ${airtableError}`,
        )
      }

      setIsSubmitted(true)
      setIsLoading(false)

      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: "", email: "" })
      }, 3000)
    } catch (err: unknown) {
      console.error("Subscription Error:", err)
      let message = "Something went wrong. Please try again."
      if (err instanceof Error) message = err.message
      else if (typeof err === "string") message = err
      else if (typeof err === "object" && err !== null) {
        try {
          message = JSON.stringify(err)
        } catch {
          message = "Unknown error."
        }
      }
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    // <section className="pt-16 pb-1 bg-background text-foreground">
    <section className="py-20 bg-muted/50 dark:bg-muted/50 mb-0">
      {/* Decorative divider */}
      <div className="w-full flex justify-center mb-10">
        <div className="w-28 h-1 bg-gradient-to-r from-[#1a729c] via-pink-500 to-purple-500 rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-0">
        <Card className="p-0 md:flex md:items-center shadow-xl border-none overflow-hidden">
          {!isSubmitted ? (
            <>
              {/* Left Content */}
              <div className="md:w-1/2 p-8 bg-gradient-to-br from-[#165881]/50 via-white to-[#165881]/50 dark:from-[#1a729c]/30 dark:via-muted dark:to-[#1a729c]/30">
                <h2 className="text-2xl font-bold mb-4">
                  AI Insight <span className="text-[#1a729c]">Subscription</span>
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  Three times a week, we send curated insights to help you explore and apply AI in ways that feel
                  relevant to your work. Simple, thoughtful, and actionable built to fit your routine and support your
                  growth.
                </p>
                <p className="mt-6 text-lg sm:text-xl font-semibold text-[#1a729c]">Subscribe & Stay in Loop</p>
              </div>

              {/* Right Form */}
              <CardContent className="md:w-1/2 p-8">
                <form id="newsletter-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 text-sm rounded-xl border-gray-300 focus:border-[#1a729c] focus:ring-2 focus:ring-[#1a729c]/50 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 text-sm rounded-xl border-gray-300 focus:border-[#1a729c] focus:ring-2 focus:ring-[#1a729c]/50 transition"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#165881] to-[#165881] hover:from-[#1a729c] hover:to-[#1a729c] transition-all shadow-md hover:shadow-lg text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </Button>
                  {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
                  <p className="text-xs text-muted-foreground text-center">
                    Join 25,000+ business leaders who trust our insights.
                  </p>
                </form>
              </CardContent>
            </>
          ) : (
            <div className="w-full text-center py-16 px-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome to the Community!</h3>
              <p className="text-muted-foreground">
                Thank you for subscribing, {formData.name}! You'll receive your first AI insights newsletter within 24
                hours.
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
