"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Plus, Minus, Edit, Trash2, X, Upload } from "lucide-react"
import BlogDetail from "../../../components/BlogDetail"
import { Input } from "@/components/ui/input"
import { useBlogContext } from "../../../contexts/BlogContext"

const Dialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#010817] border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function Articles() {
  const {
    blogListCache,
    fetchBlogList,
    addBlogToCache,
    updateBlogInCache,
    removeBlogFromCache,
    saveScrollPosition,
    restoreScrollPosition,
    currentPage: contextCurrentPage, // Renamed to avoid conflict
    setCurrentPage: setContextCurrentPage, // Renamed to avoid conflict
    filters,
    setFilters,
  } = useBlogContext()

  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [blogData, setBlogData] = useState([])

  const [searchTerm, setSearchTerm] = useState(filters.searchTerm)
  const [selectedTypes, setSelectedTypes] = useState(filters.selectedTypes)
  const [selectedCategories, setSelectedCategories] = useState(filters.selectedCategories)
  const [selectedIndustries, setSelectedIndustries] = useState(filters.selectedIndustries)

  const [isTypeExpanded, setIsTypeExpanded] = useState(true)
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true)
  const [isIndustryExpanded, setIsIndustryExpanded] = useState(true)
  const [showMoreTypes, setShowMoreTypes] = useState(false)
  const [showMoreCategories, setShowMoreCategories] = useState(false)
  const [showMoreIndustries, setShowMoreIndustries] = useState(false)
  const [fetchingArticles, setFetchingArticles] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    type: "",
    industry: "",
    tags: "",
    date: new Date().toISOString().split("T")[0], // Default to today
  })

  const [selectedBlogForView, setSelectedBlogForView] = useState(null)
  const [isViewingBlog, setIsViewingBlog] = useState(false)
  const [apiLoading, setApiLoading] = useState(false)

  const blogsPerPage = 8

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

  // API Functions
  const fetchArticles = async (forceRefresh = false) => {
    setLoading(true)
    setFetchingArticles(true)
    try {
      const data = await fetchBlogList(forceRefresh)
      setBlogData(data)
    } catch (error) {
      console.error("Error fetching articles:", error)
      setBlogData([])
    } finally {
      setLoading(false)
      setFetchingArticles(false)
    }
  }

  // Fixed handleImageUpload function with proper parameter
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target?.result }) // store base64 image
      }
      reader.readAsDataURL(file)
    }
  }

  const createArticle = async (articleData) => {
    try {
      let imageUrl = formData.image

      // If a new local image is selected, upload it first
      if (formData.image && formData.image.startsWith("data:image")) {
        const base64String = formData.image.split(",")[1]
        const fileName = `article-${Date.now()}.jpg`
        const bucketName = "nyfai-website-image"

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData: base64String, bucketName, fileName }),
        })

        if (!uploadRes.ok) throw new Error("Failed to upload image")

        const data = await uploadRes.json()
        imageUrl = data.imageUrl
      }

      // Prepare payload with proper handling of empty select fields
      const payload = {
        title: formData.title,
        author: formData.author,
        excerpt: formData.excerpt,
        content: JSON.stringify({ blocks: [] }),
        image: imageUrl,
        date: formatDateForAirtable(formData.date),
        readTime: "5 Min Read",
      }

      // Only include select fields if they have valid values
      if (formData.category && formData.category.trim()) {
        payload.category = formData.category
      }
      if (formData.type && formData.type.trim()) {
        payload.type = formData.type
      }
      if (formData.industry && formData.industry.trim()) {
        payload.industry = formData.industry
      }
      if (formData.tags && formData.tags.trim()) {
        payload.tags = formData.tags
      }

      setApiLoading(true)
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create article")
      }

      const newArticle = await response.json()
      addBlogToCache(newArticle)
      setBlogData((prev) => [newArticle, ...prev])
      return newArticle
    } catch (error) {
      console.error("Error creating article:", error)
      throw error
    } finally {
      setApiLoading(false)
    }
  }

  // Updated updateArticle function with S3 upload logic
  const updateArticle = async (articleData) => {
    try {
      setApiLoading(true)
      let imageUrl = formData.image

      // If a new local image is selected, upload it first
      if (formData.image && formData.image.startsWith("data:image")) {
        const base64String = formData.image.split(",")[1]
        const fileName = `article-${Date.now()}-updated.jpg`
        const bucketName = "nyfai-website-image"

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData: base64String, bucketName, fileName }),
        })

        if (!uploadRes.ok) throw new Error("Failed to upload image")

        const data = await uploadRes.json()
        imageUrl = data.imageUrl
      }

      const response = await fetch("/api/articles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: articleData.id,
          ...articleData,
          image: imageUrl,
          content:
            typeof articleData.content === "string"
              ? articleData.content
              : JSON.stringify(articleData.content || { blocks: [] }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update article")
      }

      const updatedArticle = await response.json()
      updateBlogInCache(articleData.id, updatedArticle)
      setBlogData((prev) => prev.map((blog) => (blog.id === articleData.id ? updatedArticle : blog)))
      return updatedArticle
    } catch (error) {
      console.error("Error updating article:", error)
      throw error
    } finally {
      setApiLoading(false)
    }
  }

  const deleteArticle = async (id) => {
    if (!confirm("Are you sure you want to delete this Article? This action cannot be undone.")) {
      return
    }
    try {
      setApiLoading(true)
      const response = await fetch("/api/articles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to delete article")
      }

      removeBlogFromCache(id)
      setBlogData((prev) => prev.filter((blog) => blog.id !== id))
      return await response.json()
    } catch (error) {
      console.error("Error deleting article:", error)
      throw error
    } finally {
      setApiLoading(false)
    }
  }

  useEffect(() => {
    if (blogListCache) {
      console.log("[v0] Using cached blog list data")
      setBlogData(blogListCache)
      setLoading(false)
      // Restore scroll position after data is set
      setTimeout(() => {
        restoreScrollPosition()
      }, 100)
    } else {
      console.log("[v0] No cache found, fetching blog list")
      fetchArticles()
    }
  }, [blogListCache, restoreScrollPosition])

  useEffect(() => {
    if (!blogData || blogData.length === 0) {
      setFilteredBlogs([])
      return
    }

    const filtered = blogData.filter((blog) => {
      const matchesSearch =
        !searchTerm ||
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(blog.type)
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(blog.category)
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(blog.industry)

      return matchesSearch && matchesType && matchesCategory && matchesIndustry
    })

    setFilteredBlogs(filtered)
    console.log(`[v0] Filtered ${filtered.length} blogs from ${blogData.length} total`)
  }, [blogData, searchTerm, selectedTypes, selectedCategories, selectedIndustries])

  useEffect(() => {
    setFilters({
      searchTerm,
      selectedTypes,
      selectedCategories,
      selectedIndustries,
    })
  }, [searchTerm, selectedTypes, selectedCategories, selectedIndustries])

  // Helper function to format date for Airtable
  const formatDateForAirtable = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0]

    // If it's already in YYYY-MM-DD format, return as is
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString
    }

    // If it's in MM/DD/YYYY format, convert it
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const [month, day, year] = dateString.split("/")
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    }

    // Try to parse as a regular date and format
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split("T")[0]
      }
      return date.toISOString().split("T")[0]
    } catch (error) {
      return new Date().toISOString().split("T")[0]
    }
  }

  const handleAddBlog = async () => {
    try {
      const articleData = {
        ...formData,
        date: formatDateForAirtable(formData.date),
        readTime: "5 Min Read",
      }

      const newArticle = await createArticle(articleData)

      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      alert("Error creating article: " + error.message)
    }
  }

  const handleEditBlog = async () => {
    try {
      const articleData = {
        id: selectedBlog.id,
        ...formData,
        tags: formData.tags,
        date: formatDateForAirtable(formData.date),
      }

      await updateArticle(articleData)

      setIsEditDialogOpen(false)
      resetForm()
      setSelectedBlog(null)
    } catch (error) {
      alert("Error updating article: " + error.message)
    }
  }

  const handleDeleteBlog = async () => {
    try {
      await deleteArticle(selectedBlog.id)

      setIsDeleteDialogOpen(false)
      setSelectedBlog(null)
    } catch (error) {
      alert("Error deleting article: " + error.message)
    }
  }

  const openEditDialog = (blog) => {
    setSelectedBlog(blog)
    setFormData({
      title: blog.title || "",
      author: blog.author || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      image: blog.image || "",
      category: blog.category || "",
      type: blog.type || "",
      industry: blog.industry || "",
      tags: blog.tags || "",
      date: blog.date
        ? blog.date.includes("T")
          ? blog.date.split("T")[0]
          : blog.date
        : new Date().toISOString().split("T")[0],
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (blog) => {
    setSelectedBlog(blog)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
      type: "",
      industry: "",
      tags: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleIndustryChange = (industry) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry],
    )
  }

  const clearAllFilters = () => {
    setSelectedTypes([])
    setSelectedCategories([])
    setSelectedIndustries([])
    setSearchTerm("")
  }

  const renderFilterOptions = (options, selectedOptions, handleChange, showMore, setShowMore) => {
    const visibleOptions = showMore ? options : options.slice(0, 6)
    const hasMoreOptions = options.length > 6

    return (
      <div className="space-y-3">
        {visibleOptions.map((option) => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleChange(option)}
              className="w-4 h-4 text-[#1a729c] bg-white/10 border-white/20 rounded focus:ring-[#1a729c]/50 focus:ring-2"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">{option}</span>
          </label>
        ))}
        {hasMoreOptions && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 text-[#1a729c] hover:text-white text-sm font-medium transition-colors"
          >
            {showMore ? "Show Less" : "Show More"}
            {showMore ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
      </div>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)
  const startIndex = (contextCurrentPage - 1) * blogsPerPage // Use contextCurrentPage
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage)

  const handlePageChange = (page) => {
    setContextCurrentPage(page) // Use setContextCurrentPage
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBlogClick = (blog) => {
    saveScrollPosition()
    setSelectedBlogForView(blog.id)
    setIsViewingBlog(true)
  }

  const handleBackToList = () => {
    setIsViewingBlog(false)
    setSelectedBlogForView(null)
    restoreScrollPosition()
  }

  const handleBlogDeleted = (deletedId) => {
    removeBlogFromCache(deletedId)
    setBlogData((prev) => prev.filter((blog) => blog.id !== deletedId))
  }

  if (isViewingBlog && selectedBlogForView) {
    return <BlogDetail blogId={selectedBlogForView} onBack={handleBackToList} onBlogDeleted={handleBlogDeleted} />
  }

  return (
    <div className="min-h-screen bg-[#010817]">
      <div className="bg-gradient-to-r from-[#165881] to-[#165881] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Articles & Insights</h1>
              <p className="text-xl text-blue-100 max-w-4xl leading-relaxed">
                Discover the latest trends, insights, and expert perspectives on artificial intelligence, technology,
                and digital transformation. Stay informed with our comprehensive collection of articles, case studies,
                and industry analysis.
              </p>
            </div>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              disabled={apiLoading}
              className="bg-[#010817] backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-medium hover:bg-[#010817]/80 transition-all duration-300 flex items-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Add Article
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-xl">Loading articles...</div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Search and Filters */}
            <div className="lg:w-80 space-y-6">
              {/* Search */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
                </div>
              </div>

              {/* Clear All Button */}
              {(selectedTypes.length > 0 ||
                selectedCategories.length > 0 ||
                selectedIndustries.length > 0 ||
                searchTerm) && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-[#1a729c] to-[#165881] text-white px-6 py-3 rounded-xl hover:from-[#165881] hover:to-[#1a729c] transition-all duration-300 flex items-center gap-2 font-medium shadow-lg w-full justify-center"
                  >
                    CLEAR ALL ✕
                  </button>
                )}

              {/* Type Filter */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                <button
                  onClick={() => setIsTypeExpanded(!isTypeExpanded)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="font-semibold text-white">Type</h3>
                  {isTypeExpanded ? (
                    <Minus className="w-5 h-5 text-[#1a729c]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#1a729c]" />
                  )}
                </button>
                {isTypeExpanded &&
                  renderFilterOptions(typeOptions, selectedTypes, handleTypeChange, showMoreTypes, setShowMoreTypes)}
              </div>

              {/* Category Filter */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                <button
                  onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="font-semibold text-white">Category</h3>
                  {isCategoryExpanded ? (
                    <Minus className="w-5 h-5 text-[#1a729c]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#1a729c]" />
                  )}
                </button>
                {isCategoryExpanded &&
                  renderFilterOptions(
                    categoryOptions,
                    selectedCategories,
                    handleCategoryChange,
                    showMoreCategories,
                    setShowMoreCategories,
                  )}
              </div>

              {/* Industry Filter */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                <button
                  onClick={() => setIsIndustryExpanded(!isIndustryExpanded)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="font-semibold text-white">Industry</h3>
                  {isIndustryExpanded ? (
                    <Minus className="w-5 h-5 text-[#1a729c]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#1a729c]" />
                  )}
                </button>
                {isIndustryExpanded &&
                  renderFilterOptions(
                    industryOptions,
                    selectedIndustries,
                    handleIndustryChange,
                    showMoreIndustries,
                    setShowMoreIndustries,
                  )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* No Results Message */}
              {currentBlogs.length === 0 && !loading && (
                <div className="text-center py-20">
                  <div className="text-gray-400 text-lg mb-4">Your article will be here</div>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}

              {/* Blog Grid */}
              {currentBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {currentBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="bg-white/5 backdrop-blur-sm border border-white/100 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                      onClick={() => handleBlogClick(blog)}
                    >
                      <div className="relative">
                        <img
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title || "Article image"}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditDialog(blog)
                            }}
                            disabled={apiLoading}
                            className="bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white/30 transition-colors border border-white/20 disabled:opacity-50"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openDeleteDialog(blog)
                            }}
                            disabled={apiLoading}
                            className="bg-red-500/20 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-500/30 transition-colors border border-red-500/20 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-gray-300 mb-2">
                          {blog.date ? new Date(blog.date).toLocaleDateString() : "No date"}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 leading-tight hover:text-[#1a729c] transition-colors">
                          {blog.title || "Untitled"}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#1a729c] to-[#165881] rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-xs font-medium text-white">
                              {(blog.author || "Unknown")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="text-sm text-gray-300 font-medium">{blog.author || "Unknown Author"}</span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                          {blog.excerpt || "No excerpt available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(contextCurrentPage - 1)}
                    disabled={contextCurrentPage === 1}
                    className="flex items-center gap-1 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-12 h-12 rounded-lg font-medium transition-all duration-200 ${contextCurrentPage === page
                          ? "bg-gradient-to-r from-[#1a729c] to-[#165881] text-white shadow-lg"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(contextCurrentPage + 1)}
                    disabled={contextCurrentPage === totalPages}
                    className="flex items-center gap-1 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg transition-all duration-200"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Article Dialog */}
      <Dialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false)
          resetForm()
        }}
        title="Add New Article"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
              placeholder="Enter article title..."
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Author *</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, author: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
              placeholder="Enter author name..."
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
              placeholder="Brief description of the article..."
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Article Image</label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload-add"
              />
              <label
                htmlFor="image-upload-add"
                className="flex items-center space-x-2 px-4 py-2 border border-white/20 rounded-md cursor-pointer hover:bg-white/10 text-white transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </label>

              {formData.image && (
                <div className="relative">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, category: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white"
                required
              >
                <option value="" className="bg-[#010817] text-white">
                  Select Category
                </option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category} className="bg-[#010817] text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, tags: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
                placeholder="tag1, tag2, tag3..."
                autoComplete="off"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, type: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white"
                required
              >
                <option value="" className="bg-[#010817] text-white">
                  Select Type
                </option>
                {typeOptions.map((type) => (
                  <option key={type} value={type} className="bg-[#010817] text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Industry *</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, industry: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white"
                required
              >
                <option value="" className="bg-[#010817] text-white">
                  Select Industry
                </option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry} className="bg-[#010817] text-white">
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Publication Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, date: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white"
              placeholder="MM/DD/YYYY or YYYY-MM-DD"
            />
            <div className="text-xs text-gray-400 mt-1">Format: YYYY-MM-DD or MM/DD/YYYY</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Content</label>
            <textarea
              value={typeof formData.content === "string" ? formData.content : ""}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, content: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
              placeholder="Write your article content here..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddBlog}
              disabled={
                !formData.title ||
                !formData.author ||
                !formData.category ||
                !formData.excerpt ||
                !formData.type ||
                !formData.industry ||
                apiLoading
              }
              className="flex-1 bg-[#1a729c] text-white py-2 px-4 rounded-md hover:bg-[#165881] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {apiLoading ? "Creating..." : "Add Article"}
            </button>
            <button
              onClick={() => {
                setIsAddDialogOpen(false)
                resetForm()
              }}
              disabled={apiLoading}
              className="px-6 py-2 border border-white/20 text-gray-300 rounded-md hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          resetForm()
          setSelectedBlog(null)
        }}
        title="Edit Article"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Author *</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, author: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
              placeholder="Brief description of the article..."
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-white">Article Image</label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload-edit"
              />
              <label
                htmlFor="image-upload-edit"
                className="flex items-center space-x-2 px-4 py-2 border border-white/20 rounded-md cursor-pointer hover:bg-white/10 text-white transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </label>

              {formData.image && (
                <div className="relative">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, category: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white"
                required
              >
                <option value="" className="bg-[#010817] text-white">
                  Select Category
                </option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category} className="bg-[#010817] text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, tags: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
                placeholder="tag1, tag2, tag3..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, type: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white"
                required
              >
                <option value="" className="bg-[#010817] text-white">
                  Select Type
                </option>
                {typeOptions.map((type) => (
                  <option key={type} value={type} className="bg-[#010817] text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Industry *</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, industry: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white"
                required
              >
                <option value="" className="bg-[#010817] text-white">
                  Select Industry
                </option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry} className="bg-[#010817] text-white">
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Publication Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, date: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white"
              placeholder="MM/DD/YYYY or YYYY-MM-DD"
            />
            <div className="text-xs text-gray-400 mt-1">Format: YYYY-MM-DD or MM/DD/YYYY</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Content</label>
            <textarea
              value={typeof formData.content === "string" ? formData.content : ""}
              onChange={(e) => setFormData((prevData) => ({ ...prevData, content: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none text-white placeholder-gray-300"
              placeholder="Write your article content here..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleEditBlog}
              disabled={
                !formData.title ||
                !formData.author ||
                !formData.category ||
                !formData.excerpt ||
                !formData.type ||
                !formData.industry ||
                apiLoading
              }
              className="flex-1 bg-[#1a729c] text-white py-2 px-4 rounded-md hover:bg-[#165881] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {apiLoading ? "Updating..." : "Update Article"}
            </button>
            <button
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
                setSelectedBlog(null)
              }}
              disabled={apiLoading}
              className="px-6 py-2 border border-white/20 text-gray-300 rounded-md hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>

      {/* Delete Article Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedBlog(null)
        }}
        title="Delete Article"
      >
        <div className="space-y-4">
          <p className="text-gray-300">Are you sure you want to delete this article? This action cannot be undone.</p>
          {selectedBlog && (
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-2">{selectedBlog.title}</h4>
              <p className="text-sm text-gray-300">by {selectedBlog.author}</p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteBlog}
              disabled={apiLoading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {apiLoading ? "Deleting..." : "Delete Article"}
            </button>
            <button
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedBlog(null)
              }}
              disabled={apiLoading}
              className="px-6 py-2 border border-white/20 text-gray-300 rounded-md hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
