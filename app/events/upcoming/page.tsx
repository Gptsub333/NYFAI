"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Plus, Trash2, ExternalLink, Upload, X } from "lucide-react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { useRef } from "react"

interface Event {
  id: string
  heading: string
  location: string
  date: string
  time: string
  description: string
  url: string
  image: string
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({
    heading: "",
    location: "",
    date: "",
    time: "",
    description: "",
    url: "",
    image: "",
  })

  const handleInputChange = (field: string, value: string) => {
    if (field === "date" && value) {
      const parsedDate = new Date(value)
      if (isNaN(parsedDate.getTime())) {
        alert("Invalid date")
        return
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }


  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setFormData((prev) => ({ ...prev, image: result }))
        setImageError(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  // Removed duplicate handleSubmit function

  const handleRemoveEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  // Drag and Drop Handling
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const result = event.target?.result as string
          setFormData((prev) => ({ ...prev, image: result }))
          setImageError(false)
        }
        reader.readAsDataURL(file)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !formData.heading ||
      !formData.location ||
      !formData.date ||
      !formData.time ||
      !formData.description ||
      !formData.url ||
      !formData.image
    ) {
      alert("All fields including image are required!")
      return
    }

    // Create new event
    const newEvent: Event = {
      id: Date.now().toString(),
      ...formData,
    }

    // Update events state
    setEvents((prev) => [...prev, newEvent])

    // Reset form
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

  return (
    <div className="min-h-screen">
      <section className="py-24 bg-background px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Calendar className="w-3 h-3 mr-1" />
              Upcoming Events
            </Badge>
            <h1 className="text-4xl font-bold mb-4 mt-6">Upcoming Events</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Workshops, talks, and live sessions built to help you apply AI fast. Online or in person, always hands-on,
              never theoretical.
            </p>
          </div>

          {/* Add Event Button */}
          <div className="mb-8 flex justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1a729c] hover:bg-[#165881] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="heading">Event Heading *</Label>
                      <Input
                        id="heading"
                        value={formData.heading}
                        onChange={(e) => handleInputChange("heading", e.target.value)}
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Event Image *</Label>
                      <div className="space-y-2">
                        {!formData.image ? (
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <Label htmlFor="image-upload" className="cursor-pointer">
                              <span className="text-sm text-muted-foreground">
                                Click to upload an image or drag and drop
                              </span>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                required
                              />
                            </Label>
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={formData.image || "/placeholder.svg"}
                              alt="Event preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Enter event location"
                        required
                      />
                    </div>

                    {/* Inside the event form where you are using DatePicker: */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="date">Date</Label>
                        <DatePicker
                          id="date"
                          selected={formData.date ? new Date(formData.date) : null}  // Check if the date is valid
                          onChange={(date: Date | null) => handleInputChange("date", date ? date.toISOString().split('T')[0] : "")}  // Update formData.date
                          dateFormat="yyyy-MM-dd"
                          className="bg-transparent border border-neutral-600 text-white px-2 py-1 rounded-sm w-fit"
                          placeholderText="Select a date"
                          required
                        />

                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleInputChange("time", e.target.value)}
                          required
                        />
                      </div>
                    </div>


                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Enter event description"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="url">Event URL *</Label>
                      <Input
                        id="url"
                        type="url"
                        value={formData.url}
                        onChange={(e) => handleInputChange("url", e.target.value)}
                        placeholder="https://example.com/event"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#1a729c] hover:bg-[#165881] text-white">
                      Add Event
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Events Display */}
          {events.length === 0 ? (
            <div className="text-center mb-16">
              <div className="rounded-3xl ring-1 ring-border/60 bg-background/40 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] p-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No upcoming events</h3>
                <p className="text-lg text-muted-foreground">Add your first event to get started!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group flex flex-col md:flex-row bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden hover:shadow-[0_0_40px_#2563eb40] transition duration-300"
                >
                  <div className="md:w-80 h-48 md:h-auto">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.heading}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#1a729c] transition">
                        {event.heading}
                      </h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveEvent(event.id)}
                        className="ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-neutral-400 space-y-1 mb-4">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-white">Location:</span> {event.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-white">Date:</span>
                        <DatePicker
                          id="date"
                          selected={formData.date ? new Date(formData.date) : null}  // Check if the date is valid
                          onChange={(date: Date | null) => handleInputChange("date", date ? date.toISOString().split('T')[0] : "")}  // Update formData.date
                          dateFormat="yyyy-MM-dd"
                          className="bg-transparent border border-neutral-600 text-white px-2 py-1 rounded-sm w-fit"
                          placeholderText="Select a date"
                          required
                        />

                      </p>

                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-white">Time:</span> {event.time}
                      </p>
                    </div>

                    <p className="text-neutral-300 text-sm leading-relaxed mb-4">{event.description}</p>

                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium hover:text-purple-300 transition"
                    >
                      View Event Details
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
function useDropzone({
  accept,
  onDrop,
}: {
  accept: string
  onDrop: (acceptedFiles: File[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const getRootProps = () => ({
    onClick: () => inputRef.current?.click(),
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        accept ? file.type.startsWith(accept.split("/")[0]) : true
      )
      if (files.length > 0) {
        onDrop(files)
      }
    },
    style: { cursor: "pointer" },
  })

  const getInputProps = () => ({
    type: "file",
    accept,
    ref: inputRef,
    style: { display: "none" },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) {
        onDrop(files)
      }
    },
  })

  return { getRootProps, getInputProps }
}

