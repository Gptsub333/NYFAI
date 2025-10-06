"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Plus } from "lucide-react"
import { set } from "date-fns"
import { fi } from "date-fns/locale"

export default function SuccessStory() {
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(false)

    // Modal controls
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [addLoading, setAddLoading] = useState(false)



    // Forms
    const [newForm, setNewForm] = useState({
        company: "",
        result: "",
        quote: "",
        author: "",
        stars: 5,
    })

    const [editForm, setEditForm] = useState({
        id: "",
        company: "",
        result: "",
        quote: "",
        author: "",
        stars: 5,
    })

    // Fetch success stories
    const fetchStories = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/success-stories")
            const data = await res.json()
            setStories(data)
        } catch (err) {
            console.error("Error fetching stories:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStories()
    }, [])

    // Input change handler (for both forms)
    const handleChange = (e, setForm) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    // Add story
    const handleAdd = async (e) => {
        e.preventDefault()
        setAddLoading(true)
        try {
            await fetch("/api/success-stories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newForm),
            })
            setNewForm({ company: "", result: "", quote: "", author: "", stars: 5 })
            setIsAddOpen(false)
            fetchStories()
        } catch (err) {
            console.error("Error adding story:", err)
        } finally {
            setAddLoading(false)
        }
    }

    // Update story
    const handleUpdate = async (e) => {
        e.preventDefault()
        setAddLoading(true)
        try {
            await fetch("/api/success-stories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            })
            setIsEditOpen(false)
            fetchStories()
        } catch (err) {
            console.error("Error updating story:", err)
        } finally {
            setAddLoading(false)
        }
    }

    // Delete story
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this story?")) return
        try {
            await fetch("/api/success-stories", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            fetchStories()
        } catch (err) {
            console.error("Error deleting story:", err)
        }
    }

    // Open edit modal with values
    const openEditModal = (story) => {
        setEditForm({
            id: story.id,
            company: story.company,
            result: story.result,
            quote: story.quote,
            author: story.author,
            stars: story.stars || 5,
        })
        setIsEditOpen(true)
    }

    return (
        <div className="mb-16 relative">
            {/* Header with button */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-center flex-1">Partner Success Stories</h2>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-[#1a729c] text-white px-4 py-2 rounded shadow hover:bg-[#145776]"
                >
                    <Plus className="h-4 w-4" />
                    Add Story
                </button>
            </div>

            {/* Story grid */}
            {loading ? (
                <p className="text-center">Loading stories...</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {stories.map((story) => (
                        <Card
                            key={story.id}
                            className="bg-gradient-to-br from-[#1a729c]/10 to-purple-50 dark:from-[#1a729c]/20 dark:to-purple-950/20 border-none"
                        >
                            <CardContent className="p-6">
                                <div className="text-2xl font-bold text-[#1a729c] mb-2">{story.result}</div>
                                <blockquote className="text-sm italic mb-4">"{story.quote}"</blockquote>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-sm">{story.company}</div>
                                        <div className="text-xs text-muted-foreground">{story.author}</div>
                                    </div>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < (story.stars || 0)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => openEditModal(story)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(story.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* BACKDROP & MODALS */}

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-black p-6 rounded-md shadow-md w-full max-w-md relative">
                        <h3 className="text-lg font-semibold mb-4">Add New Story</h3>
                        <form onSubmit={handleAdd} className="space-y-3">
                            <input
                                name="company"
                                placeholder="Company"
                                value={newForm.company}
                                onChange={(e) => handleChange(e, setNewForm)}
                                className="w-full  p-2  bg-black border-2 rounded text-white"
                                required
                            />
                            <input
                                name="result"
                                placeholder="Result"
                                value={newForm.result}
                                onChange={(e) => handleChange(e, setNewForm)}
                                className="w-full  bg-black  text-white border p-2 rounded"
                                required
                            />
                            <textarea
                                name="quote"
                                placeholder="Quote"
                                value={newForm.quote}
                                onChange={(e) => handleChange(e, setNewForm)}
                                className="w-full bg-black  text-white border-2 p-2 rounded"
                                required
                            />
                            <input
                                name="author"
                                placeholder="Author"
                                value={newForm.author}
                                onChange={(e) => handleChange(e, setNewForm)}
                                className="w-full bg-black  text-white border-2 p-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="stars"
                                min="1"
                                max="5"
                                value={newForm.stars}
                                onChange={(e) => handleChange(e, setNewForm)}
                                className="w-full bg-black  text-white border p-2 rounded"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" disabled={addLoading} onClick={() => setIsAddOpen(false)} className="px-3 py-1 rounded border">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addLoading}
                                    className="px-3 py-1 bg-[#1a729c] text-white rounded disabled:opacity-50"
                                >
                                    {addLoading ? "Saving..." : "Save"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-black border-2 p-6 rounded-md shadow-md w-full max-w-md relative">
                        <h3 className="text-lg font-semibold mb-4">Update Story</h3>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <input
                                name="company"
                                placeholder="Company"
                                value={editForm.company}
                                onChange={(e) => handleChange(e, setEditForm)}
                                className="w-full bg-black  text-white border-2 p-2 rounded"
                                required
                            />
                            <input
                                name="result"
                                placeholder="Result"
                                value={editForm.result}
                                onChange={(e) => handleChange(e, setEditForm)}
                                className="w-full bg-black  text-white border-2 p-2 rounded"
                                required
                            />
                            <textarea
                                name="quote"
                                placeholder="Quote"
                                value={editForm.quote}
                                onChange={(e) => handleChange(e, setEditForm)}
                                className="w-ful bg-black  text-white border-2 p-2 rounded"
                                required
                            />
                            <input
                                name="author"
                                placeholder="Author"
                                value={editForm.author}
                                onChange={(e) => handleChange(e, setEditForm)}
                                className="w-full bg-black  text-white border-2 p-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="stars"
                                min="1"
                                max="5"
                                value={editForm.stars}
                                onChange={(e) => handleChange(e, setEditForm)}
                                className="w-full bg-black  text-white border-2 p-2 rounded"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" disabled={addLoading} onClick={() => setIsEditOpen(false)} className="px-3 py-1 rounded border">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addLoading}
                                    className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                                >
                                    {addLoading ? "Updating..." : "Update"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
