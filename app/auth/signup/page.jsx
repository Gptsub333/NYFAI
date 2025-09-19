"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { signup } = useAuth()
    const router = useRouter()

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        setIsLoading(true)

        const result = await signup(formData.email, formData.password, formData.name)
        if (result.success) {
            router.push("/")
        } else {
            setError(result.error)
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br pt-10 from-[#010817] via-[#010817] to-[#010817] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <img src="/AI_LOGO 2.png" alt="AI Text" className="h-16 mx-auto" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Join Us Today</h1>
                    <p className="text-white/80">Create your account to get started</p>
                </div>

                {/* Signup Card */}
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">Create Account</CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Fill in your details to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 font-medium">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3  top-4  h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 h-12 bg-white border-gray-200 focus:border-[#1a729c] focus:ring-[#1a729c]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3  top-4  h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10 h-12 bg-white border-gray-200 focus:border-[#1a729c] focus:ring-[#1a729c]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3  top-4  h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-[#1a729c] focus:ring-[#1a729c]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3  top-4  text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-[#1a729c] focus:ring-[#1a729c]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3  top-4  text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="rounded border-gray-300 text-[#1a729c] focus:ring-[#1a729c]"
                                    required
                                />
                                <Label htmlFor="terms" className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-[#1a729c] hover:text-[#165881] font-medium">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-[#1a729c] hover:text-[#165881] font-medium">
                                        Privacy Policy
                                    </Link>
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-[#1a729c] hover:bg-[#165881] text-white font-semibold text-base transition-colors"
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-[#1a729c] hover:text-[#165881] font-semibold">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-white/60 text-sm">© 2025 Not Your Father's A.I. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}
