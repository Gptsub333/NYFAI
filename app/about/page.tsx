"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Users, Lightbulb, MessageCircle } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-background dark:to-purple-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            custom={0}
            viewport={{ once: true }}
          >
            <Image
            src="/AI_LOGO 2.png"
            alt="AI logo"
            width={650}
            height={1}
            className="block mx-auto mb-[-40]"
          />
          </motion.div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            custom={2}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mb-4"
          >
            Media Production | Est. 2022 | Atlanta, US
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            custom={3}
            className="text-primary"
          >
            <Sparkles className="h-10 w-10 animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {[
            {
              icon: <Lightbulb className="h-6 w-6 text-blue-500" />,
              title: "Our Mission",
              text:
                "At Not Your Father’s A.I., we help professionals and businesses use AI in practical, results-driven ways. Our focus is on clear instruction, real tools, and everyday application, so that you can understand AI and put it to work immediately.",
            },
            {
              icon: <MessageCircle className="h-6 w-6 text-purple-500" />,
              title: "Relatable & Engaging",
              text:
                "We break down complex topics into simple, step-by-step instructions. Our content is designed to be clear, direct, and easy to follow, with examples that make sense and language that respects your time.",
            },
            {
              icon: <Users className="h-6 w-6 text-green-500" />,
              title: "Practical Takeaways",
              text:
                "Everything we share is built to be used. You’ll leave with ideas, tools, and steps you can apply right away in your job, your business, or your daily workflow.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <Card className="bg-background/70 backdrop-blur-lg border border-border shadow-md transition hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">{item.icon}<span className="font-semibold text-lg">{item.title}</span></div>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Block */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center shadow-xl"
        >
          <p className="text-2xl sm:text-3xl italic font-medium mb-3 text-white]">
            “We cut through the hype, simplify AI, and show you how to get results”
          </p>
          <span className="text-muted-foreground text-sm">— The NYFAI Team</span>
        </motion.div>
      </section>
    </div>
  )
}
