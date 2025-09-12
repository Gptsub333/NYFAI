"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your AI course assistant. Ask me about our AI courses, training programs, or anything related to artificial intelligence education!",
      isBot: true,
      timestamp: new Date(),
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
  }, [messages])

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase()

    if (message.includes("course") || message.includes("training")) {
      return "We offer comprehensive AI courses including Machine Learning Fundamentals, Deep Learning, Natural Language Processing, and Computer Vision. Our courses are designed for both beginners and advanced practitioners."
    }

    if (message.includes("price") || message.includes("cost") || message.includes("fee")) {
      return "Our AI courses range from $299 for introductory courses to $1,299 for advanced specializations. We also offer bundle packages and payment plans. Check our Academy section for detailed pricing."
    }

    if (message.includes("duration") || message.includes("long") || message.includes("time")) {
      return "Course durations vary: Introductory courses are 4-6 weeks, intermediate courses are 8-10 weeks, and advanced specializations are 12-16 weeks. All courses include hands-on projects and mentorship."
    }

    if (message.includes("certificate") || message.includes("certification")) {
      return "Yes! All our courses provide industry-recognized certificates upon completion. Advanced courses also offer preparation for major AI certifications like TensorFlow Developer and AWS Machine Learning."
    }

    if (message.includes("prerequisite") || message.includes("requirement")) {
      return "Basic programming knowledge (Python preferred) is recommended for most courses. Our beginner courses start from scratch. We provide a free Python primer for those who need it."
    }

    if (message.includes("job") || message.includes("career") || message.includes("placement")) {
      return "Our courses include career support with resume reviews, interview preparation, and job placement assistance. 85% of our graduates find AI-related positions within 6 months of completion."
    }

    if (message.includes("instructor") || message.includes("teacher")) {
      return "Our instructors are industry experts from top tech companies like Google, Microsoft, and OpenAI. All have 5+ years of practical AI experience and are passionate about teaching."
    }

    if (message.includes("online") || message.includes("remote")) {
      return "Yes! All our courses are available online with live sessions, recorded lectures, and interactive labs. We also offer hybrid options with in-person workshops in select cities."
    }

    if (message.includes("project") || message.includes("portfolio")) {
      return "Every course includes 3-5 hands-on projects that you can add to your portfolio. Projects range from building chatbots to creating computer vision applications and deploying ML models."
    }

    if (message.includes("support") || message.includes("help")) {
      return "We provide 24/7 student support through our community forum, weekly office hours with instructors, and dedicated mentorship. You'll never feel stuck!"
    }

    // Default responses for general queries
    if (message.includes("hello") || message.includes("hi")) {
      return "Hello! I'm here to help you learn about our AI courses. What would you like to know?"
    }

    return "That's a great question! For detailed information about our AI courses, pricing, and enrollment, please visit our Academy section or contact our admissions team. Is there anything specific about AI education I can help you with?"
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")

    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userInput),
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <>
      <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
                className="rounded-full w-14 h-14 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-white/20"
                size="icon"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-72 sm:w-80"
          >
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Bot className="h-4 w-4" />
                  </motion.div>
                  <CardTitle className="text-sm font-semibold">AI Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea ref={scrollAreaRef} className="h-64 p-3">
                  <motion.div
                    className="flex flex-col space-y-3"
                    layout
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <AnimatePresence mode="popLayout">
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{
                            layout: { type: "spring", stiffness: 400, damping: 25 },
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.3 },
                            y: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            layout
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                              message.isBot
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                            }`}
                          >
                            {message.isBot ? (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                              >
                                {message.text}
                              </motion.span>
                            ) : (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                              >
                                {message.text}
                              </motion.span>
                            )}
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </ScrollArea>
                <motion.div
                  className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about AI courses..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="text-xs border-0 bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500/20"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={sendMessage}
                        size="icon"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-8 w-8 rounded-full shadow-sm"
                      >
                        <Send className="h-3 w-3" />
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
