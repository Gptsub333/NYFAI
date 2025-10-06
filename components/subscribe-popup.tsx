"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SubscribePopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "" })
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check if user has seen the popup before
        const hasSeenPopup = localStorage.getItem("hasSeenSubscribePopup")

        if (!hasSeenPopup) {
            // Show popup after a short delay for better UX
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 1500)

            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        // Mark as seen in localStorage
        localStorage.setItem("hasSeenSubscribePopup", "true")
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
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

            // Close popup after success and mark as seen
            setTimeout(() => {
                handleClose()
            }, 2500)
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

    if (!isVisible) return null

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
                onClick={handleClose}
            />

            {/* Popup card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="relative w-full max-w-md pointer-events-auto animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute -top-2 -right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close popup"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Card content */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 backdrop-blur-xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                        {!isSubmitted ? (
                            <>
                                <div className="text-center mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                                        🚀 Join <span className="text-[#1a729c]">The AI Movement</span>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get exclusive AI insights delivered to your inbox. No spam. Only real value. ✨
                                    </p>
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
                                        className="w-full text-sm py-3 rounded-xl bg-gradient-to-r from-[#1a729c] to-[#1a729c] hover:from-[#1a729c]/90 hover:to-[#1a729c]/90 transition-all shadow-md hover:shadow-lg text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Subscribing..." : "✨ Subscribe Now"}
                                    </Button>

                                    {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                                </form>
                            </>
                        ) : (
                            <div className="text-center animate-in fade-in duration-300">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">
                                    Welcome aboard, {formData.name}! 🎉
                                </h3>
                                <p className="text-sm text-muted-foreground">Your first AI insights are on their way 🚀</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
