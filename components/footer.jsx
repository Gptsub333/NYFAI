import { Linkedin, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background/40 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-center md:items-center md:gap-8">
          {/* Social Media Links */}
          <div className="flex gap-4 sm:gap-6">
            <a
              href="https://www.linkedin.com/company/not-your-father-s-ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group"
            >
              <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-primary transition-colors duration-200 group-hover:scale-110 transform transition-transform" />
            </a>
            <a
              href="https://www.facebook.com/people/Not-Your-Fathers-AI/61575105248578"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="group"
            >
              <Facebook className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-primary transition-colors duration-200 group-hover:scale-110 transform transition-transform" />
            </a>
            <a
              href="https://x.com/NYFAI22"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="group"
            >
              <Twitter className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-primary transition-colors duration-200 group-hover:scale-110 transform transition-transform" />
            </a>
          </div>

          {/* Vertical Divider - Hidden on mobile */}
          <span className="hidden md:inline-block h-6 w-px bg-border" />

          {/* Copyright & Attribution */}
          <div className="flex flex-col items-center text-center md:flex-row md:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="whitespace-nowrap">Copyright © 2025, Not Your Father's A.I.</span>
            <span className="hidden md:inline-block mx-1 sm:mx-2">|</span>
            <span className="text-center md:text-left">
              Powered by{" "}
              <a
                href="https://bizrainmaker.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors duration-200 hover:no-underline"
              >
                BIZ Rainmakers
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
