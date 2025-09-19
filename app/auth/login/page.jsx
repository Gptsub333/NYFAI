"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const result = await login(email, password)
        if (result.success) {
            router.push("/")
        } else {
            setError(result.error)
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen pt-10 bg-gradient-to-br from-[#010817] via-[#010817] to-[#010817] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <img src="/AI_LOGO 2.png" alt="AI Text" className="h-16 mx-auto" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-white/80">Sign in to your account to continue</p>
                </div>

                {/* Login Card */}
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">Sign In</CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Enter your credentials to access your account
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
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-4  h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                    <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-[#1a729c] focus:ring-[#1a729c]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="rounded bg-white border-gray-300 text-[#1a729c] focus:ring-[#1a729c]"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-gray-600">
                                        Remember me
                                    </Label>
                                </div>
                                <Link href="/auth/forgot-password" className="text-sm text-[#1a729c] hover:text-[#165881] font-medium">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-[#1a729c] hover:bg-[#165881] text-white font-semibold text-base transition-colors"
                            >
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{" "}
                                <Link href="/auth/signup" className="text-[#1a729c] hover:text-[#165881] font-semibold">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {/* Demo Credentials */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-700 font-medium mb-1">Demo Credentials:</p>
                            <p className="text-xs text-blue-600">Email: demo@gmail.com</p>
                            <p className="text-xs text-blue-600">Password: demo</p>
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
