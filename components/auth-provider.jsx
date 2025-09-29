"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on app load
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Include cookies
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("Auth check failed:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error }
      }

      // Store the logged-in user in context
      setUser(data.user || { email })
      return { success: true }
    } catch (err) {
      console.error("Login error:", err)
      return { success: false, error: "Something went wrong" }
    }
  }

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies
      })

      const data = await res.json()

      if (res.ok) {
        // Clear user from context
        setUser(null)

        // Redirect to login page
        router.push("/auth/login")

        return { success: true }
      } else {
        console.error("Logout failed:", data.error)
        return { success: false, error: data.error }
      }
    } catch (err) {
      console.error("Logout error:", err)

      // Even if the API call fails, clear the user locally
      // This ensures the UI updates properly
      setUser(null)
      router.push("/auth/login")

      return { success: false, error: "Something went wrong during logout" }
    }
  }

  const value = {
    user,
    login,
    logout,
    loading,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}