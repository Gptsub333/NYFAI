"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cormorant_Garamond } from "next/font/google"
import { SubscribePopup } from "@/components/subscribe-popup"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic"],
})

export default function HomePage() {
  const heroRef = useRef(null)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [error, setError] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-fade-in-up")
        })
      },
      { threshold: 0.1 },
    )
    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const beehiivPromise = fetch("/api/beehiiv-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })

      const airtablePromise = fetch("/api/airtable-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      })

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
    } catch (err) {
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
    <div className="min-h-screen">
      {/* Subscribe Popup */}
      <SubscribePopup />

      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-muted/50 dark:bg-muted/50"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a729c]/20 via-white to-purple-50 dark:from-[#1a729c]/20 dark:via-background dark:to-purple-950/20 z-0" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center text-center max-w-4xl animate-on-scroll">
          <Image src="/AI_LOGO 2.png" alt="AI logo" width={650} height={1} className="block mx-auto mb-[-40]" />

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We cut through the hype, simplify AI, and show you how to get results.
          </p>

          {/* Newsletter */}
          <div className="relative w-full max-w-md mx-auto mt-10">
            <div className="rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-xl shadow-lg p-6 sm:p-8 border border-white/30 animate-on-scroll">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold">
                      🚀 Join <span className="text-[#1a729c]">The AI Movement</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">No spam. Only real insights. ✨</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div className="relative">
                      <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10 text-sm rounded-xl border-gray-300 focus:border-[#1a729c] focus:ring-2 focus:ring-[#1a729c]/50 transition"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">👤</span>
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 text-sm rounded-xl border-gray-300 focus:border-[#1a729c] focus:ring-2 focus:ring-[#1a729c]/50 transition"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">📧</span>
                    </div>

                    {/* Button */}
                    <Button
                      type="submit"
                      className="w-full text-sm py-3 rounded-xl bg-gradient-to-r from-[#1a729c] to-[#1a729c] hover:from-[#1a729c] hover:to-[#1a729c] transition-all shadow-md hover:shadow-lg text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Subscribing..." : "✨ Subscribe"}
                    </Button>

                    {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                  </form>
                </>
              ) : (
                <div className="text-center animate-fade-in">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-green-700 dark:text-green-200">
                    Welcome aboard, {formData.name}! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Your first AI insights are on their way 🚀
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explore More */}
        <div className="relative z-10 mb-20 flex justify-center">
          <button
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
            className="flex flex-col items-center hover:text-[#1a729c] transition-colors"
          >
            <svg
              className="h-6 w-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section className="py-20 bg-muted/50 dark:bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-[#1a729c]/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-[#1a729c]/10 to-[#1a729c]/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <div className="md:flex md:items-center">
                {/* Left Graphic */}
                <div className="md:w-1/2 p-6 md:p-10">
                  <Image
                    src="/communitypic.png"
                    alt="Community illustration"
                    width={600}
                    height={500}
                    className="rounded-xl shadow-lg object-contain w-full"
                  />
                </div>

                {/* Right Content */}
                <div className="md:w-1/2 p-8 bg-gradient-to-br from-[#1a729c]/50 via-white to-[#1a729c]/50 dark:from-[#1a729c]/30 dark:via-muted dark:to-[#1a729c]/30 h-full flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Join the <span className="text-[#1a729c]">Community</span>
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed mb-4">
                    This is where professionals, entrepreneurs, and curious teams come together to learn and grow.
                  </p>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    Inside, you&apos;ll find honest conversations, practical tips, and a space that encourages progress
                    without pressure. Whether you&apos;re asking your first question or sharing your latest
                    breakthrough, you&apos;re in good company.
                  </p>
                  <Link href="/community">
                    <Button size="lg" className="bg-[#1a729c]">
                      Join the Conversation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOLUTIONS ================= */}
      <section className="py-20 bg-background/40">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 -translate-x-2 translate-y-2 rounded-3xl bg-[#1a729c]/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-[#1a729c]/10 to-[#1a729c]/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <div className="md:flex md:items-center">
                {/* Left Content */}
                <div className="md:w-1/2 p-8 bg-gradient-to-br from-[#1a729c]/50 via-white to-[#1a729c]/50 dark:from-[#1a729c]/30 dark:via-muted dark:to-[#1a729c]/30">
                  <h2 className="text-2xl font-bold mb-4">
                    Explore Our <span className="text-[#1a729c]">Solutions</span>
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    We offer tailored support for individuals, teams, and organizations looking to move forward with
                    clarity. Whether it&apos;s training, consulting, speaking, or certification programs, every solution
                    is designed with impact in mind.
                  </p>
                  <Link href="/solutions">
                    <Button size="lg" className="bg-[#1a729c]">
                      Explore what we offer
                    </Button>
                  </Link>
                </div>

                {/* Right Graphic */}
                <div className="md:w-1/2 p-6 md:p-10 flex justify-center">
                  <Image
                    src="/exploresol.jpg"
                    alt="Solutions graphic"
                    width={600}
                    height={500}
                    className="rounded-xl shadow-lg object-contain w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ARTICLES ================= */}
      <section className="py-20 bg-muted/50 dark:bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-3xl bg-[#1a729c]/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-[#1a729c]/10 to-[#1a729c]/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <div className="md:flex md:items-center">
                {/* Left Graphic */}
                <div className="md:w-1/2 p-6 md:p-10">
                  <Image
                    src="/articles.jpg"
                    alt="Articles illustration"
                    width={600}
                    height={500}
                    className="rounded-xl shadow-lg object-contain w-full"
                  />
                </div>

                {/* Right Content */}
                <div className="md:w-1/2 p-8 bg-gradient-to-br from-[#1a729c]/50 via-white to-[#1a729c]/50 dark:from-[#1a729c]/30 dark:via-muted dark:to-[#1a729c]/30 h-full flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Explore our <span className="text-[#1a729c]">Articles</span>
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed mb-4">
                    Dive into thought-provoking insights, practical how-tos, and AI trends that matter. Our articles are
                    written to help you think smarter, act faster, and stay ahead.
                  </p>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    Whether you&apos;re a curious learner or a seasoned pro, these reads will fuel your growth.
                  </p>
                  <Link href="/media/Article">
                    <Button size="lg" className="bg-[#1a729c]">
                      Read Articles
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <section className="py-20 bg-background/40">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 -translate-x-2 translate-y-2 rounded-3xl bg-[#1a729c]/5" />
            <div className="pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-gradient-to-r from-[#1a729c]/10 to-[#1a729c]/10 blur-sm" />

            <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] overflow-hidden">
              <div className="md:flex md:items-center">
                {/* Left Content */}
                <div className="md:w-1/2 p-8 bg-gradient-to-br from-[#1a729c]/50 via-white to-[#1a729c]/50 dark:from-[#1a729c]/30 dark:via-muted dark:to-[#1a729c]/30 h-full flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Join our <span className="text-[#1a729c]">Tech Events</span>
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed mb-4">
                    We host impactful AI and tech events that bring together founders, engineers, and enthusiasts from
                    across the globe. Our events foster real conversations, connections, and ideas. Whether it&apos;s
                    hands-on workshops or founder mixers, there&apos;s something for everyone.
                  </p>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    Come join us to engage with leading professionals in the industry, share knowledge, and accelerate
                    your growth.
                  </p>
                  <Link href="/events/upcoming">
                    <Button size="lg" className="bg-[#1a729c]">
                      Explore Upcoming Events
                    </Button>
                  </Link>
                </div>

                {/* Right Graphic */}
                <div className="md:w-1/2 p-6 md:p-10 flex justify-center">
                  <Image
                    src="/techevents.webp"
                    alt="Tech Events Graphic"
                    width={600}
                    height={500}
                    className="rounded-xl shadow-lg object-contain w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
