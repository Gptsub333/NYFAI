"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Upload, X } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface PastEvent {
  id: string
  heading: string
  location: string
  date: string
  time: string
  description: string
  url: string
  image?: string
}

export default function Past() {
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([
    {
      id: "1",
      heading: "Evening Mixer @ NY Tech Week 2025",
      location: "New York City",
      date: "2025-06-15",
      time: "18:00",
      description:
        "This unforgettable evening brought together founders, technologists, and AI thinkers for demos, discussions, and drinks. Catch the key takeaways, photos, and resources from the event at the link below.",
      url: "https://lu.ma/notyourfathersaiNY",
      image: "/nyfai_event.avif",
    },
  ])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    heading: "",
    location: "",
    date: "",
    time: "",
    description: "",
    url: "",
    image: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields are filled
    if (
      !formData.heading ||
      !formData.location ||
      !formData.date ||
      !formData.time ||
      !formData.description ||
      !formData.url ||
      !formData.image
    ) {
      alert("Please fill in all fields including uploading an image")
      return
    }

    const newEvent: PastEvent = {
      id: Date.now().toString(),
      ...formData,
    }

    setPastEvents((prev) => [...prev, newEvent])
    setFormData({
      heading: "",
      location: "",
      date: "",
      time: "",
      description: "",
      url: "",
      image: "",
    })
    setIsDialogOpen(false)
  }

  const removeEvent = (id: string) => {
    setPastEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen">
      <section className="py-24 bg-background px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mt-6 mb-4">Past Events</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Catch up on what you missed. Replays, resources, and takeaways from real-world AI in action.
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1a729c] hover:bg-[#1a729c]/80 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Past Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-[#0a0a0a] border-neutral-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Past Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="heading" className="text-white">
                        Event Heading *
                      </Label>
                      <Input
                        id="heading"
                        name="heading"
                        placeholder="eg. Evening Mixer @ NY Tech Week 2025"
                        value={formData.heading}
                        onChange={handleInputChange}
                        className="bg-neutral-900 border-neutral-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-white">
                        Location *
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        placeholder="eg. New York City"
                        onChange={handleInputChange}
                        className="bg-neutral-900 border-neutral-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {/* Date Picker */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="date" className="text-white">
                        Date *
                      </Label>
                      <DatePicker
                        id="date"
                        name="date"
                        selected={formData.date ? new Date(formData.date) : null}
                        onChange={(date: Date | null) =>
                          setFormData((prev) => ({
                            ...prev,
                            date: date ? date.toISOString().split("T")[0] : "",
                          }))
                        }
                        dateFormat="yyyy-MM-dd"
                        className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-sm text-white"
                        placeholderText="Select date"
                        required
                      />
                    </div>

                    {/* Time Input */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="time" className="text-white">
                        Time *
                      </Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        placeholder="18:00"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-sm text-white"
                        required
                      />
                    </div>
                  </div>


                  <div>
                    <Label htmlFor="url" className="text-white">
                      Event URL *
                    </Label>
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="bg-neutral-900 border-neutral-700 text-white"
                      placeholder="https://..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Brief summary of the event"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="bg-neutral-900 border-neutral-700 text-white min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white">Event Image *</Label>
                    {!formData.image ? (
                      <div
                        className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center hover:border-neutral-600 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                        <p className="text-neutral-400 mb-2">Drag and drop an image here, or click to select</p>
                        <p className="text-sm text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-neutral-700 text-white hover:bg-neutral-800"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#1a729c] hover:bg-[#1a729c]/80 text-white">
                      Add Event
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-8">
            {pastEvents.map((event) => (
              <div key={event.id} className="relative group">
                <Link
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col md:flex-row bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden hover:shadow-[0_0_40px_#2563eb40] transition duration-300"
                >
                  {/* Text Content */}
                  <div className="md:w-1/2 p-6 md:p-10">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#1a729c] transition">
                      {event.heading}
                    </h3>
                    <div className="text-sm text-neutral-400 space-y-1 mb-4">
                      <p>
                        <span className="text-white">📍 Location:</span> {event.location}
                      </p>
                      <p>
                        <span className="text-white">🗓 Date:</span> {formatDate(event.date)}
                      </p>
                      <p>
                        <span className="text-white">🕕 Time:</span> {formatTime(event.time)}
                      </p>
                    </div>
                    <p className="text-neutral-300 text-sm leading-relaxed">{event.description}</p>
                    <div className="mt-4 text-purple-400 text-sm font-medium underline">View recap →</div>
                  </div>
                  {/* Image */}
                  <div className="md:w-1/2 h-64 md:h-auto relative">
                    <Image
                      src={event.image || "/placeholder.svg?height=300&width=400"}
                      alt={event.heading}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                <Button
                  onClick={() => removeEvent(event.id)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Remove event"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
