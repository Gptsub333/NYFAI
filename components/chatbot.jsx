"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your site assistant. Ask me about community, academy, newsletter, events, or anything on this site.",
      isBot: true,
      timestamp: new Date(),
      actions: [],
    },
  ])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isTyping) return

    const userMessage = {
      id: crypto.randomUUID(),
      text,
      isBot: false,
      timestamp: new Date(),
      actions: [],
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const payload = {
        messages: [{ role: "user", content: text }],
        // sitePrompt: "...", // optional per-request override
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const botText = data.answer || "Sorry, I couldn’t generate a response."
      const botActions = Array.isArray(data.actions) ? data.actions : []

      const botMessage = {
        id: crypto.randomUUID(),
        text: botText,
        isBot: true,
        timestamp: new Date(),
        actions: botActions, // <-- renderable buttons
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (e) {
      const botMessage = {
        id: crypto.randomUUID(),
        text:
          "I hit an error talking to the chat API. Please try again, or refresh. " +
          (e?.message ? `Details: ${e.message}` : ""),
        isBot: true,
        timestamp: new Date(),
        actions: [],
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-white/20"
                size="icon"
              >
                <MessageCircle className="h-7 w-7" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-8 right-8 z-50 w-[92vw] sm:w-[20rem] md:w-[25rem] max-w-[75vw]"
          >
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 overflow-hidden rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-7 h-7 bg-transparent rounded-full flex items-center justify-center"
                  >
                    <Image src="/nyfai.svg" height={25} width={25} />
                  </motion.div>
                  <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea
                  ref={scrollAreaRef}
                  className="h-[65vh] sm:h-[26rem] md:h-[30rem] p-4"
                >
                  <motion.div className="flex flex-col space-y-3.5" layout transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <AnimatePresence mode="popLayout">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.97 }}
                          transition={{
                            layout: { type: "spring", stiffness: 400, damping: 25 },
                            opacity: { duration: 0.35 },
                            scale: { duration: 0.25 },
                            y: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.015 }}
                            layout
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${message.isBot
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                              }`}
                          >
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                              {message.text}
                            </motion.span>

                            {/* Action buttons for bot messages */}
                            {message.isBot && message.actions?.length ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.actions.map((a) => (
                                  <a
                                    key={`${message.id}-${a.url}`}
                                    href={a.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block"
                                  >
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      className="rounded-full"
                                    >
                                      {a.label}
                                    </Button>
                                  </a>
                                ))}
                              </div>
                            ) : null}
                          </motion.div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex justify-start"
                        >
                          <div className="max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md">
                            <span className="inline-flex items-center">
                              <span className="mr-2">Thinking</span>
                              <span className="inline-flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0ms]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:120ms]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:240ms]" />
                              </span>
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </ScrollArea>

                <motion.div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50" layout>
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about the site…"
                      onKeyDown={handleKeyDown}
                      disabled={isTyping}
                      className="text-sm border-0 bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500/20"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={sendMessage}
                        size="icon"
                        disabled={isTyping || !input.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-9 w-9 rounded-full shadow-sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
