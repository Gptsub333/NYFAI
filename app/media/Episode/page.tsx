"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState([
    {
      title: "That's So AI!",
      episode: "Ep 1",
      link: "https://bit.ly/3vFZkph",
      description: "An introduction to the series where we explore the world of AI and its potential.",
    },
    {
      title: "What's So Smart About AI?",
      episode: "Ep 2",
      link: "https://bit.ly/3SaMNmk",
      description: "Understanding the basics of AI and why it's becoming so integral in today's world.",
    },
    {
      title: "My A.I. Digital Assistant Is Smarter Than Yours!",
      episode: "Ep 3",
      link: "https://bit.ly/3rcWAwS",
      description: "A deep dive into AI-powered personal assistants and how they're changing the game.",
    },
    {
      title: "Ready for Job Training in the Metaverse?",
      episode: "Ep 4",
      link: "https://bit.ly/3WkQCsd",
      description: "Exploring how job training is evolving with AI and the metaverse.",
    },
    {
      title: "Leverage AI to Automate Project Workflows",
      episode: "Ep 5",
      link: "https://bit.ly/3TPGB3z",
      description: "See how AI can help automate workflows to save time and reduce errors.",
    },
    {
      title: "Does Your PMO Have AI Super Powers?",
      episode: "Ep 6",
      link: "https://bit.ly/3GMFr4x",
      description: "Find out how AI can supercharge your PMO for better project outcomes.",
    },
    {
      title: "Supply Chains Love A.I. Too!",
      episode: "Ep 7",
      link: "https://bit.ly/3HWGcZs",
      description: "Learn how AI is revolutionizing supply chains and driving efficiency.",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    episode: "",
    link: "",
    description: "",
  })

  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.episode && formData.description) {
      setEpisodes([...episodes, { ...formData }])
      setFormData({ title: "", episode: "", link: "", description: "" })
      setIsDialogOpen(false)
    }
  }

  const removeEpisode = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen py-20 md:py-33 lg:py-40 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">AI Series Episodes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to our AI series! Watch the latest episodes where we dive deep into how AI is transforming various
            industries and processes. Stay tuned for new insights in every episode!
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a729c] hover:bg-[#145a7a] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Episode
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Episode</DialogTitle>
                <DialogDescription>
                  Create a new episode for the AI series. Fill in all the details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEpisode} className="space-y-4">
                <div>
                  <Label htmlFor="title">Episode Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter episode title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="episode">Episode Number</Label>
                  <Input
                    id="episode"
                    value={formData.episode}
                    onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
                    placeholder="e.g., Ep 8"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter episode description"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="link">Episode URL (Optional)</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com/episode"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#1a729c] hover:bg-[#145a7a]">
                    Add Episode
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Episodes List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes.map((episode, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full border-[#1a729c] relative"
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                onClick={() => removeEpisode(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardHeader>
                <CardTitle className="text-xl text-[#1a729c] pr-8">{episode.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{episode.description}</p>
              </CardHeader>
              <CardContent className="mt-auto">
                {episode.link ? (
                  <a href={episode.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="text-[#1a729c] border-[#1a729c] bg-[#1a729c] text-white transition-all w-full">
                      Watch {episode.episode}
                    </Button>
                  </a>
                ) : (
                  <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                    {episode.episode} - Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
