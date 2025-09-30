"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Plus, Trash2, ExternalLink, Upload, X, Edit } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Declare the resetForm function
const resetForm = () => {
  // Implementation of resetForm goes here
}

export default function Past() {
  const [events, setEvents] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    heading: "",
    location: "",
    date: "",
    time: "",
    honors: "",
    description: "",
    url: "",
    image: "",
  })
  const [loading, setLoading] = useState(true) // Loading state to show when events are being fetched
  const [fetchingEvents, setFetchingEvents] = useState(true) // State for fetching events
  // Fetch Events
  const fetchEvents = async () => {
    setLoading(true)
    setFetchingEvents(true)
    try {
      const res = await fetch("/api/past")
      const data = await res.json()
      setEvents(data)
      console.log(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
      setFetchingEvents(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const handleInputChange = (field, value) => {
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
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    // Check if file is an SVG (we exclude it)
    if (file && file.type === "image/svg+xml") {
      alert("SVG files are not allowed.")
      return // Stop the process if SVG is selected
    }
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        setFormData((prev) => ({ ...prev, image: result }))
        setImageError(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this Event? This action cannot be undone.")) {
      return
    }
    try {
      setLoading(true)

      // Call the DELETE API to remove the event from Airtable
      const response = await fetch("/api/past", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: eventId }),
      })

      if (response.ok) {
        // Event deleted successfully
        alert("Event deleted successfully")
        // Optionally, update the UI to reflect the deletion
        // For example, by removing it from a list or resetting the form
      } else {
        // Handle errors
        alert("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("An error occurred while deleting the event")
    } finally {
      setLoading(false)
      window.location.reload() // Refresh the page to show the updated list of events
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation - Ensure all required fields are filled
    if (
      !formData.heading ||
      !formData.location ||
      !formData.date ||
      !formData.time ||
      !formData.honors ||
      !formData.description ||
      !formData.url ||
      !formData.image
    ) {
      alert("All fields including image are required!")
      return
    }

    try {
      setLoading(true)

      let imageUrl = formData.image

      // Check if we need to upload a new image (only if it's base64 data)
      if (formData.image.startsWith("data:image/")) {
        // Extract the base64 image data (remove the prefix)
        const imageData = formData.image.split(",")[1] // Extract base64 image data

        if (!imageData) {
          throw new Error("Invalid image data")
        }

        // Send the image data to the API route for uploading to S3
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: imageData, // Only send the base64 content (no prefix)
            bucketName: "nyfai-website-image", // S3 bucket name
            fileName: `event-images/${Date.now()}.jpg`, // Generate a unique file name
          }),
        })

        if (!response.ok) {
          throw new Error("Image upload failed")
        }

        // Extract the image URL from the response
        const uploadResponse = await response.json()
        imageUrl = uploadResponse.imageUrl
      }
      // If formData.image is already a URL (editing existing event), use it as is

      // Construct the event object with the image URL and form data
      const eventData = {
        heading: formData.heading,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        honors: formData.honors,
        description: formData.description,
        url: formData.url,
        image: imageUrl, // Use the uploaded image URL or existing URL
      }

      console.log("Event Data:", eventData)

      if (editingEvent) {
        // Update existing event
        await updateEventInDatabase(editingEvent, eventData)
      } else {
        // Add new event to the database
        await addEventToDatabase(eventData)
      }

      // Reset the form and close the dialog
      setFormData({
        heading: "",
        location: "",
        date: "",
        time: "",
        honors: "", // Added honors field to form reset
        description: "",
        url: "",
        image: "",
      })

      setEditingEvent(null) // Clear editing state
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error uploading image and adding/updating event:", error)
      alert("Error saving event. Please try again.")
    } finally {
      setLoading(false)
      window.location.reload() // Refresh the page to show the updated events
    }
  }

  // Add this new function to handle event updates
  const updateEventInDatabase = async (eventId, eventData) => {
    try {
      const response = await fetch("/api/past", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: eventId,
          ...eventData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating event:", error)
      throw error
    }
  }

  // You'll also need to add the handleEditEvent function
  const handleEditEvent = (event) => {
    setEditingEvent(event.id)
    setFormData({
      heading: event.heading,
      location: event.location,
      date: event.date,
      time: event.time,
      honors: event.honors,
      description: event.description,
      url: event.url,
      image: event.image,
    })
    setIsDialogOpen(true)
  }

  // Don't forget to add the editingEvent state at the top of your component
  // const [editingEvent, setEditingEvent] = useState(null);

  const addEventToDatabase = async (newEvent) => {
    try {
      // Sending the event data to the backend to add it to Airtable
      const response = await fetch("/api/past", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })

      if (!response.ok) {
        throw new Error("Failed to add event")
      }

      const eventData = await response.json()

      // Update the events state with the new event
      setEvents((prev) => [...prev, eventData])
    } catch (error) {
      console.error("Error adding event:", error)
    }
  }

  if (fetchingEvents) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a729c] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="py-24 bg-background px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Calendar className="w-3 h-3 mr-1" />
              Past Events
            </Badge>
            <h1 className="text-4xl font-bold mb-4 mt-6">Past Events</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Catch up on what you missed. Replays, resources, and takeaways from real-world AI in action.
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#1a729c] hover:bg-[#165881] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
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

                    <div>
                      <Label htmlFor="honors">Host *</Label>
                      <Input
                        id="honors"
                        value={formData.honors}
                        onChange={(e) => handleInputChange("honors", e.target.value)}
                        placeholder="Enter Host"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="date">Date</Label>
                        <DatePicker
                          id="date"
                          selected={formData.date ? new Date(formData.date) : null}
                          onChange={(date) => handleInputChange("date", date ? date.toISOString().split("T")[0] : "")}
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" className="bg-[#1a729c] hover:bg-[#165881] text-white" disabled={loading}>
                      {loading ? (
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full border-t-2 border-b-2 border-white w-5 h-5 mr-2"></div>
                          <span>Loading...</span>
                        </div>
                      ) : editingEvent ? (
                        "Update Event"
                      ) : (
                        "Add Event"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center mb-16">
              <div className="spinner">Loading...</div>
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

                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#1a729c] transition">
                        {event.heading}
                      </h3>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          disabled={loading}
                          className="border-neutral-600 hover:bg-neutral-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveEvent(event.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm text-neutral-400 space-y-1 mb-4">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-white">Location:</span> {event.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-white">Date:</span> {event.date}
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-white">Time:</span> {event.time}
                      </p>

                      <p className="flex items-center gap-2">
                        <span className="text-white">Host:</span> {event.honors}
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
