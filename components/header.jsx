"use client"

import { useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut, ChevronDown, Settings, UserCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

const mainNavigation = [
  { name: "Community", href: "/community" },
  { name: "Solutions", href: "/solutions" },
  { name: "Academy", href: "/academy" },
  { name: "Events", href: "/events" },
  { name: "Media", href: "/media" },
  { name: "Resources", href: "/resources" },
  { name: "Sponsor", href: "/sponsor" },
  { name: "About", href: "/about" },
  { name: "Marketplace", href: "http://51.20.109.190" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileDropdown, setMobileDropdown] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const closeTimeout = useRef(null)
  const { user, logout, loading } = useAuth()
  const pathname = usePathname()

  const isActive = (href) => pathname === href

  const handleLogout = async () => {
    if (isLoggingOut) return // Prevent double clicks

    setIsLoggingOut(true)
    try {
      const result = await logout()
      if (!result.success) {
        // You could show a toast notification here
        console.error("Logout failed:", result.error)
      }
      // The auth provider handles redirecting to login page
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
      setIsOpen(false) // Close mobile menu if open
    }
  }

  const dropdowns = {
    Academy: [
      { label: "Online Course", href: "/academy/onlinecourse" },
      { label: "Live Training", href: "/academy/livetraining" },
    ],
    Events: [
      { label: "Upcoming Events", href: "/events/upcoming" },
      { label: "Past Events", href: "/events/past" },
    ],
    Media: [
      { label: "Episodes", href: "/media/Episode" },
      { label: "Articles", href: "/media/Article" },
      {
        label: "Newsletters",
        href: "https://not-your-fathers-ai.beehiiv.com/",
      },
    ],
    Resources: [
      { label: "Prompt Library", href: "/resources/promptLibrary" },
      { label: "Tools & Template", href: "/resources/toolsTemplate" },
      { label: "AI Reviews", href: "/resources/aiReviews" },
    ],
    Marketplace: [{ label: "AI agent Tools", href: "http://51.20.109.190" }],
  }

  const toggleMobileDropdown = (name) => {
    setMobileDropdown(mobileDropdown === name ? null : name)
  }

  // Show loading state if auth is still loading
  if (loading) {
    return (
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[radial-gradient(circle_at_left,rgba(164,153,200,0.25),transparent_70%)] bg-[#1069a1] shadow-sm border-b border-border">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mt-2">
          <div className="flex items-center h-20 mb-[-10] lg:-mt-1 gap-6">
            <Link href="/" className="flex items-center group">
              <img src="/AI_LOGO 2.png" alt="AI Text" className="h-16 sm:h-20 lg:h-24 max-h-24 object-contain" />
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[radial-gradient(circle_at_left,rgba(164,153,200,0.25),transparent_70%)] bg-[#1069a1] shadow-sm border-b border-border">
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mt-2">
        {/* Top Row - Hidden on mobile */}
        <div className="hidden lg:flex justify-end items-center h-8 text-xs">
          <div className="flex items-center space-x-6">
            <Link href="/about" className="text-white hover:text-white/20 transition-colors font-medium">
              About
            </Link>
            <Link href="/sponsor" className="text-gray-50 hover:text-white/20 transition-colors font-medium">
              Sponsor
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-white hover:text-white/80 hover:bg-white/10 transition-colors px-3 py-1 rounded-full"
                  disabled={isLoggingOut}
                >
                  {user ? (
                    <>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="font-medium">{user.name || user.email}</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                {user ? (
                  <>
                    <DropdownMenuLabel className="text-gray-900">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name || "User"}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 hover:bg-red-50 focus:bg-red-50"
                      disabled={isLoggingOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="text-gray-900">Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/login"
                        className="text-gray-700 hover:bg-[#1a729c]/10 focus:bg-[#1a729c]/10 cursor-pointer"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>

                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="flex items-center h-20 mb-[-10] lg:-mt-1 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img src="/AI_LOGO 2.png" alt="AI Text" className="h-16 sm:h-20 lg:h-24 max-h-24 object-contain" />
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10 lg:ml-10 xl:ml-16 2xl:ml-24">
            {mainNavigation
              .filter((nav) =>
                ["Community", "Solutions", "Academy", "Events", "Media", "Resources", "Marketplace"].includes(nav.name),
              )
              .map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => {
                    if (closeTimeout.current) clearTimeout(closeTimeout.current)
                    setOpenDropdown(item.name)
                  }}
                  onMouseLeave={() => {
                    closeTimeout.current = setTimeout(() => setOpenDropdown(null), 500)
                  }}
                >
                  <Link
                    href={item.href}
                    className={`relative text-base font-medium transition-colors flex items-center gap-1 ${isActive(item.href) ? "text-white font-semibold" : "text-white hover:text-white/20"
                      }`}
                  >
                    {item.name}
                    {isActive(item.href) && (
                      <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
                    )}
                    {dropdowns[item.name] && (
                      <ChevronDown
                        className={`w-4 h-4 mt-0.5 transition-transform ${openDropdown === item.name ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </Link>
                  {openDropdown === item.name && dropdowns[item.name] && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 mt-3 min-w-[220px] bg-white/80 border border-gray-200 rounded-2xl shadow-xl z-50 py-3 flex flex-col gap-1 backdrop-blur-md transition-all"
                      onMouseEnter={() => closeTimeout.current && clearTimeout(closeTimeout.current)}
                      onMouseLeave={() => {
                        closeTimeout.current = setTimeout(() => setOpenDropdown(null), 1000)
                      }}
                    >
                      {dropdowns[item.name].map((dd) => (
                        <Link
                          key={dd.href}
                          href={dd.href}
                          className="px-4 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-md text-sm font-medium text-gray-700 transition-all"
                        >
                          {dd.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Spacer */}
          <div className="hidden lg:block flex-1" />

          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-auto">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 rounded-full transition-all"
                >
                  <Menu className="h-6 w-6 text-gray-700" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 backdrop-blur-xl bg-white/90">
                <div className="flex flex-col h-full bg-white/60">
                  {/* Mobile Header */}
                  <div className="flex items-center bg-white/65 justify-between p-4 border-b border-border">
                    <div className="flex items-center space-x-2 bg-white/60">
                      <img src="/ai_logo.png" alt="AI Logo" className="w-8 h-8 object-contain" />
                      <span className="font-bold text-lg text-gray-900">
                        NYF{" "}
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                          A.I.
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto p-4 bg-white/60">
                    <nav className="space-y-2">
                      {/* Top row items for mobile */}
                      <div className="pb-4 mb-4 border-b border-border">
                        <Link
                          href="/about"
                          className="block py-2 text-sm text-muted-foreground hover:bg-white/90"
                          onClick={() => setIsOpen(false)}
                        >
                          About
                        </Link>
                        <Link
                          href="/sponsor"
                          className="block py-2 text-sm text-muted-foreground hover:bg-white/90"
                          onClick={() => setIsOpen(false)}
                        >
                          Sponsor
                        </Link>
                      </div>

                      {/* Main navigation items */}
                      {mainNavigation
                        .filter((nav) =>
                          ["Community", "Solutions", "Academy", "Events", "Media", "Resources", "Marketplace"].includes(
                            nav.name,
                          ),
                        )
                        .map((item) => (
                          <div key={item.name} className="space-y-1">
                            {dropdowns[item.name] ? (
                              <div>
                                <button
                                  onClick={() => toggleMobileDropdown(item.name)}
                                  className={`flex items-center justify-between w-full py-3 px-2 text-left font-medium transition-colors rounded-md ${isActive(item.href) ? "text-primary" : "text-gray-700 hover:bg-white/90"
                                    }`}
                                >
                                  {item.name}
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform ${mobileDropdown === item.name ? "rotate-180" : ""
                                      }`}
                                  />
                                </button>
                                {mobileDropdown === item.name && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {dropdowns[item.name].map((dd) => (
                                      <Link
                                        key={dd.href}
                                        href={dd.href}
                                        className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                        onClick={() => setIsOpen(false)}
                                      >
                                        {dd.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={item.href}
                                className={`block py-3 px-2 font-medium transition-colors rounded-md ${isActive(item.href) ? "text-primary" : "text-gray-700 hover:bg-white/90"
                                  }`}
                                onClick={() => setIsOpen(false)}
                              >
                                {item.name}
                              </Link>
                            )}
                          </div>
                        ))}
                    </nav>
                  </div>

                  {/* Mobile Footer - auth */}
                  <div className="p-4 border-t border-border">
                    {user ? (
                      <>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{user.name || "User"}</span>
                            <span className="text-xs text-gray-500">{user.email}</span>
                          </div>
                        </div>
                        <div className="space-y-2">

                          <Button
                            onClick={handleLogout}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-600 hover:bg-red-50"
                            disabled={isLoggingOut}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            {isLoggingOut ? "Logging out..." : "Logout"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full">
                            Login
                          </Button>
                        </Link>

                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Gradient animation for logo */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </header>
  )
}