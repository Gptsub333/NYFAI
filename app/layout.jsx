import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"
import NewsletterModule from "@/components/newsletter-modal"
import { ChatBot } from "@/components/chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Not Your Father's A.I.",
  description: "Contemporary digital marketing and AI-focused platform for the modern era",
  generator: "HolboxAI (Dev Joshi)",
  icons: {
    icon: "/ai_logo.png",
    shortcut: "/ai_logo.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthProvider>
          <div className="min-h-screen">
            <Header />
            <main className="pt-16">{children}</main>
            <NewsletterModule />
            <Footer />
            <ChatBot />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
