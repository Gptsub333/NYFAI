"use client"

import { ArrowLeft, Clock, Edit, Save, X, Calendar, Upload, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import both EditorComponent and EditorRenderer to prevent SSR issues
const EditorComponent = dynamic(() => import("./EditorComponent"), {
    ssr: false,
    loading: () => <div className="text-gray-400 text-center py-8">Loading editor...</div>
});

const EditorRenderer = dynamic(() => import("./EditorRenderer"), {
    ssr: false,
    loading: () => <div className="text-gray-400 text-center py-8">Loading content...</div>
});

export default function BlogDetail({ blogId, onBack, onBlogDeleted }) {
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [editData, setEditData] = useState({
        title: "",
        excerpt: "",
        content: {},
        author: "",
        category: "",
        tags: "",
        image: "",
        date: "",
        type: "",
        industry: "",
    })

    // Dropdown options from the Articles page
    const typeOptions = ["Case Studies", "Courses", "Podcasts", "Tech", "Use Cases", "Webinars", "Research", "Tutorials"]
    const categoryOptions = [
        "Technology",
        "Analytics",
        "Comms & PR",
        "Content",
        "Strategy",
        "Implementation",
        "Best Practices",
    ]
    const industryOptions = [
        "Healthcare",
        "Marketing Agencies",
        "Media",
        "Recreation",
        "Retail",
        "Software",
        "Transportation",
        "Travel",
        "Finance",
        "Education",
    ]

    // Fetch blog data from API
    useEffect(() => {
        if (blogId) {
            fetchBlog()
        }
    }, [blogId])

    const fetchBlog = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/articles/${blogId}`)

            if (!response.ok) {
                throw new Error('Blog not found')
            }

            const blogData = await response.json()
            setBlog(blogData)
        } catch (err) {
            console.error('Error fetching blog:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (blog && isEditMode) {
            const parsedContent = blog.content ? (typeof blog.content === 'string' ? JSON.parse(blog.content) : blog.content) : {};

            setEditData({
                title: blog.title || "",
                excerpt: blog.excerpt || "",
                content: parsedContent,
                author: blog.author || "",
                category: blog.category || "",
                tags: blog.tags || "",
                image: blog.image || "",
                date: blog.date ? (blog.date.includes('T') ? blog.date.split('T')[0] : blog.date) : "",
                type: blog.type || "",
                industry: blog.industry || "",
            })
        }
    }, [blog, isEditMode])

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setEditData({ ...editData, image: event.target?.result });
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            let imageUrl = editData.image;

            // If a new local image is selected, upload it first
            if (editData.image && editData.image.startsWith("data:image")) {
                const base64String = editData.image.split(",")[1];
                const fileName = `article-${Date.now()}-updated.jpg`;
                const bucketName = "nyfai-website-image";

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageData: base64String, bucketName, fileName }),
                });

                if (!uploadRes.ok) throw new Error("Failed to upload image");

                const data = await uploadRes.json();
                imageUrl = data.imageUrl;
            }

            // Ensure content is properly formatted as JSON and then stringify for Airtable
            const contentToSave = editData.content && typeof editData.content === 'object'
                ? editData.content
                : { blocks: [] };

            // Prepare payload with proper handling of empty select fields
            const payload = {
                id: blog.id,
                title: editData.title,
                author: editData.author,
                excerpt: editData.excerpt,
                content: JSON.stringify(contentToSave),
                image: imageUrl,
                date: editData.date
            };

            // Only include select fields if they have valid values
            if (editData.category && editData.category.trim()) {
                payload.category = editData.category;
            }
            if (editData.type && editData.type.trim()) {
                payload.type = editData.type;
            }
            if (editData.industry && editData.industry.trim()) {
                payload.industry = editData.industry;
            }
            if (editData.tags && editData.tags.trim()) {
                payload.tags = editData.tags;
            }

            const response = await fetch('/api/articles', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to update article')
            }

            const updatedBlog = await response.json()
            setBlog(updatedBlog)
            setIsEditMode(false)
        } catch (err) {
            console.error('Error updating blog:', err)
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            setDeleting(true)

            const response = await fetch('/api/articles', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: blog.id })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to delete article')
            }

            // Call the callback to notify parent component
            if (onBlogDeleted) {
                onBlogDeleted(blog.id)
            }

            // Navigate back to articles list
            onBack()
        } catch (err) {
            console.error('Error deleting blog:', err)
            setError(err.message)
        } finally {
            setDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleCancelEdit = () => {
        setIsEditMode(false)
        setEditData({
            title: "",
            excerpt: "",
            content: {},
            author: "",
            category: "",
            tags: "",
            image: "",
            date: "",
            type: "",
            industry: "",
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#010817] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#010817] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">Error: {error}</div>
                    <button onClick={onBack} className="text-[#1a729c] hover:text-blue-400 transition-colors">
                        Back to Articles
                    </button>
                </div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-[#010817] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-xl mb-4">Blog not found</div>
                    <button onClick={onBack} className="text-[#1a729c] hover:text-blue-400 transition-colors">
                        Back to Articles
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#010817]">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#010817] border border-white/20 rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Delete Article</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="px-6 py-2 border border-white/20 text-gray-300 rounded-md hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="bg-[#1a729c] text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a729c] to-[#165881]"></div>
                <div className="relative max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Articles
                        </button>

                        <div className="flex items-center gap-3">
                            {!isEditMode ? (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsEditMode(true)}
                                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Article
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 px-4 py-2 rounded-lg transition-colors border border-red-500/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-2 text-blue-100 mb-4">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{blog.readTime || "5 Min Read"}</span>
                            </div>

                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-transparent border-b-2 border-white/30 focus:border-white outline-none w-full text-white placeholder-white/50"
                                    placeholder="Blog title..."
                                />
                            ) : (
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-blue-100">By</span>
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                        {((isEditMode ? editData.author : blog.author) || 'Unknown')
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                </div>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        value={editData.author}
                                        onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                                        className="font-medium text-white bg-transparent border-b border-white/30 focus:border-white outline-none"
                                        placeholder="Author name..."
                                    />
                                ) : (
                                    <span className="font-medium text-white">{blog.author}</span>
                                )}
                                {isEditMode ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-100">on</span>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={editData.date}
                                                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                                className="bg-white/10 border border-white/30 rounded px-2 py-1 text-white text-sm focus:border-white outline-none"
                                            />
                                            <Calendar className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none" />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-blue-100">on {blog.date ? new Date(blog.date).toLocaleDateString() : 'No date'}</span>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-black/20 rounded-lg p-8 backdrop-blur-sm">
                                {isEditMode ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <input
                                                type="url"
                                                value={editData.image}
                                                onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                                                className="flex-1 bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-white outline-none"
                                                placeholder="Image URL..."
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Upload
                                            </label>
                                        </div>
                                        <img
                                            src={editData.image || "/placeholder.svg"}
                                            alt="Preview"
                                            className="w-full h-64 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.svg";
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <img
                                        src={blog.image || "/placeholder.svg"}
                                        alt={blog.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = "/placeholder.svg";
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                <div className="bg-[#010817] border border-white/10 rounded-lg shadow-2xl p-8 md:p-12 backdrop-blur-sm">
                    {isEditMode ? (
                        <div className="mb-8 pb-8 border-b border-white/10">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                            <textarea
                                value={editData.excerpt}
                                onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:border-[#1a729c] outline-none resize-none"
                                rows={3}
                                placeholder="Brief description of the article..."
                            />
                        </div>
                    ) : (
                        blog.excerpt && (
                            <div className="mb-8 pb-8 border-b border-white/10">
                                <p className="text-xl text-gray-300 leading-relaxed font-medium italic">{blog.excerpt}</p>
                            </div>
                        )
                    )}

                    <div className="prose prose-lg max-w-none">
                        {isEditMode ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-4">Content</label>
                                <EditorComponent
                                    key={`editor-${blog.id}-${isEditMode}`}
                                    data={editData.content}
                                    onChange={(content) => {
                                        setEditData(prev => ({ ...prev, content: content }))
                                    }}
                                />
                            </div>
                        ) : (
                            blog.content ? (
                                <EditorRenderer data={typeof blog.content === 'string' ? JSON.parse(blog.content) : blog.content} />
                            ) : (
                                <div className="text-gray-400 italic">No content available</div>
                            )
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/20">
                        {isEditMode ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                                    <select
                                        value={editData.category}
                                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:border-[#1a729c] outline-none"
                                        required
                                    >
                                        <option value="" className="bg-[#1f2937] text-white">
                                            Select Category
                                        </option>
                                        {categoryOptions.map((category) => (
                                            <option key={category} value={category} className="bg-[#1f2937] text-white">
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                                    <select
                                        value={editData.type}
                                        onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:border-[#1a729c] outline-none"
                                        required
                                    >
                                        <option value="" className="bg-[#1f2937] text-white">
                                            Select Type
                                        </option>
                                        {typeOptions.map((type) => (
                                            <option key={type} value={type} className="bg-[#1f2937] text-white">
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Industry *</label>
                                    <select
                                        value={editData.industry}
                                        onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:border-[#1a729c] outline-none"
                                        required
                                    >
                                        <option value="" className="bg-[#1f2937] text-white">
                                            Select Industry
                                        </option>
                                        {industryOptions.map((industry) => (
                                            <option key={industry} value={industry} className="bg-[#1f2937] text-white">
                                                {industry}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={editData.tags}
                                        onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:border-[#1a729c] outline-none"
                                        placeholder="tag1, tag2, tag3..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {blog.category && (
                                    <span className="bg-[#1a729c]/20 text-[#1a729c] border border-[#1a729c]/30 px-3 py-1 rounded-full text-sm font-medium">
                                        {blog.category}
                                    </span>
                                )}
                                {blog.type && (
                                    <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm font-medium">
                                        {blog.type}
                                    </span>
                                )}
                                {blog.industry && (
                                    <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-sm font-medium">
                                        {blog.industry}
                                    </span>
                                )}
                                {blog.tags && (
                                    (Array.isArray(blog.tags)
                                        ? blog.tags
                                        : blog.tags.split(',').map(tag => tag.trim())
                                    ).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-white/10 text-gray-300 border border-white/20 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}