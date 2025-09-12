"use client"


import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Plus, X, ImageIcon } from "lucide-react"

/**
 * @typedef {Object} AIReview
 * @property {string} id
 * @property {string} toolName
 * @property {string} description
 * @property {string} image
 * @property {number} rating
 * @property {string[]} pros
 * @property {string[]} cons
 * @property {string} useCase
 */

export default function AIReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: "1",
      toolName: "ChatGPT",
      description:
        "OpenAI's conversational AI that excels at text generation, coding assistance, and creative writing. Great for brainstorming and quick content creation.",
      image: "/midjourney-ai-art-generation-interface.jpg",
      rating: 4,
      pros: ["Excellent text generation", "Wide knowledge base", "User-friendly interface"],
      cons: ["Can hallucinate facts", "Limited real-time data", "Usage limits on free tier"],
      useCase: "Content creation, coding help, research assistance",
    },
    {
      id: "2",
      toolName: "Midjourney",
      description:
        "AI-powered image generation tool that creates stunning artwork from text prompts. Perfect for creative professionals and content creators.",
      image: "/midjourney-ai-art-generation-interface.jpg",
      rating: 5,
      pros: ["High-quality images", "Creative artistic styles", "Active community"],
      cons: ["Discord-only interface", "Subscription required", "Limited commercial rights"],
      useCase: "Digital art, marketing visuals, concept design",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    toolName: "",
    description: "",
    image: "",
    rating: 5,
    pros: "",
    cons: "",
    useCase: "",
  })
  const [imagePreview, setImagePreview] = useState("")

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !formData.toolName ||
      !formData.description ||
      !formData.image ||
      !formData.pros ||
      !formData.cons ||
      !formData.useCase
    ) {
      alert("Please fill in all fields")
      return
    }

    const newReview = {
      id: Date.now().toString(),
      toolName: formData.toolName,
      description: formData.description,
      image: formData.image,
      rating: formData.rating,
      pros: formData.pros
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
      cons: formData.cons
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
      useCase: formData.useCase,
    }

    setReviews((prev) => [newReview, ...prev])
    setFormData({
      toolName: "",
      description: "",
      image: "",
      rating: 5,
      pros: "",
      cons: "",
      useCase: "",
    })
    setImagePreview("")
    setIsDialogOpen(false)
  }

  const removeReview = (id) => {
    setReviews((prev) => prev.filter((review) => review.id !== id))
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            AI Tool Reviews
          </Badge>
          <h1 className="text-4xl font-bold mb-4">No-Nonsense AI Tool Reviews</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Honest, practical reviews of AI tools with real-world use cases, pros and cons, and actionable insights for
            business leaders.
          </p>
        </div>

        {/* Add Review Button */}
        <div className="flex justify-center mb-12">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a729c] hover:bg-[#1a729c]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add AI Tool Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New AI Tool Review</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="toolName">Tool Name *</Label>
                  <Input
                    id="toolName"
                    value={formData.toolName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, toolName: e.target.value }))}
                    placeholder="e.g., ChatGPT, Midjourney, Claude"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief overview of what the tool does and its main strengths"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Tool Image *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-32 object-cover mx-auto rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImagePreview("")
                            setFormData((prev) => ({ ...prev, image: "" }))
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload tool screenshot or logo
                            </span>
                            <input
                              id="image-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageUpload}
                              required
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5 stars)</Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number.parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-30 bg-black rounded-md"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pros">Pros (comma-separated) *</Label>
                  <Textarea
                    id="pros"
                    value={formData.pros}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pros: e.target.value }))}
                    placeholder="e.g., Easy to use, Great results, Fast processing"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cons">Cons (comma-separated) *</Label>
                  <Textarea
                    id="cons"
                    value={formData.cons}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cons: e.target.value }))}
                    placeholder="e.g., Expensive, Limited features, Steep learning curve"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="useCase">Best Use Case *</Label>
                  <Input
                    id="useCase"
                    value={formData.useCase}
                    onChange={(e) => setFormData((prev) => ({ ...prev, useCase: e.target.value }))}
                    placeholder="e.g., Content creation, Data analysis, Image generation"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#1a729c] hover:bg-[#1a729c]/90">
                  Add Review
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="relative group hover:shadow-lg transition-all duration-300 bg-card/60 backdrop-blur border border-border/60"
            >
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => removeReview(review.id)}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={review.image || "/placeholder.svg"}
                  alt={review.toolName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{review.toolName}</CardTitle>
                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{review.description}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-green-600 text-sm mb-1">Pros:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-green-500 mt-0.5">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-600 text-sm mb-1">Cons:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {review.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-red-500 mt-0.5">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <h4 className="font-semibold text-sm mb-1">Best for:</h4>
                    <p className="text-xs text-muted-foreground">{review.useCase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">Be the first to add an AI tool review!</p>
          </div>
        )}
      </div>
    </div>
  )
}
