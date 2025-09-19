"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Plus, Minus, Edit, Trash2, X } from "lucide-react"
import BlogDetail from "../../../components/BlogDetail"

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedIndustries, setSelectedIndustries] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredBlogs, setFilteredBlogs] = useState([])

  const [isTypeExpanded, setIsTypeExpanded] = useState(true)
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true)
  const [isIndustryExpanded, setIsIndustryExpanded] = useState(true)
  const [showMoreTypes, setShowMoreTypes] = useState(false)
  const [showMoreCategories, setShowMoreCategories] = useState(false)
  const [showMoreIndustries, setShowMoreIndustries] = useState(false)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [blogData, setBlogData] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    date: "",
    description: "",
    image: "",
    type: "",
    category: "",
    industry: "",
  })

  const [selectedBlogForView, setSelectedBlogForView] = useState(null)
  const [isViewingBlog, setIsViewingBlog] = useState(false)

  const blogsPerPage = 8

  const initialBlogData = [
    {
      id: 1,
      title: "How to Harness AI for Video Creation with Joshua Xu [MAICON 2025 Speaker Series]",
      author: "Cathy McPhillips",
      date: "September 18, 2025",
      description:
        "In our ongoing speaker series, we're spotlighting the remarkable AI leaders featured at MAICON 2025. During this upcoming session, Joshua Xu will explore how AI video generation is transforming content creation as we know it.",
      image: "/placeholder.svg",
      type: "Tech",
      category: "Content",
      industry: "Media",
    },
    {
      id: 2,
      title: "How to Reframe Your AI Adoption for Real Results with Pam Boiros [MAICON 2025 Speaker Series]",
      author: "Cathy McPhillips",
      date: "September 18, 2025",
      description:
        "In our ongoing speaker series, we're spotlighting the remarkable AI leaders featured at MAICON 2025. During this upcoming session, Pam Boiros will show attendees how to frame problems in a way that reveals actionable AI strategies.",
      image: "/placeholder.svg",
      type: "Use Cases",
      category: "Analytics",
      industry: "Software",
    },
    {
      id: 3,
      title: "Should You Turn Your Executives Into AI Avatars?",
      author: "Mike Kaput",
      date: "September 16, 2025",
      description:
        "Databox CEO Peter Caputa recently posted that he is releasing a new video course taught entirely by his AI double. Should your execs do the same?",
      image: "/placeholder.svg",
      type: "Case Studies",
      category: "Content",
      industry: "Marketing Agencies",
    },
    {
      id: 4,
      title: "How Replit Made Its AI Agent 10x Better",
      author: "Mike Kaput",
      date: "September 15, 2025",
      description:
        "Replit's AI agent can now build full-stack applications, debug code, and deploy projects with unprecedented accuracy and speed.",
      image: "",
      type: "Tech",
      category: "Analytics",
      industry: "Software",
    },
    {
      id: 5,
      title: "How OpenAI and Microsoft Just Changed Everything",
      author: "Sarah Johnson",
      date: "September 14, 2025",
      description:
        "The latest partnership between OpenAI and Microsoft introduces groundbreaking capabilities that will reshape enterprise AI adoption.",
      image: "",
      type: "Courses",
      category: "Advertising",
      industry: "Software",
    },
    {
      id: 6,
      title: "The Future of AI in Marketing Automation",
      author: "David Chen",
      date: "September 13, 2025",
      description:
        "Explore how AI is revolutionizing marketing automation, from personalized campaigns to predictive analytics and customer journey optimization.",
      image: "",
      type: "Webinars",
      category: "Advertising",
      industry: "Marketing Agencies",
    },
    {
      id: 7,
      title: "Building Ethical AI Systems: A Comprehensive Guide",
      author: "Dr. Emily Rodriguez",
      date: "September 12, 2025",
      description:
        "Learn the fundamental principles of ethical AI development, including bias mitigation, transparency, and responsible deployment strategies.",
      image: "",
      type: "Podcasts",
      category: "Comms & PR",
      industry: "Software",
    },
    {
      id: 8,
      title: "AI-Powered Customer Service: Real-World Case Studies",
      author: "Alex Thompson",
      date: "September 11, 2025",
      description:
        "Discover how leading companies are using AI to transform their customer service operations and improve satisfaction rates.",
      image: "",
      type: "Case Studies",
      category: "Content",
      industry: "Retail",
    },
    {
      id: 9,
      title: "The Rise of Multimodal AI Models",
      author: "Dr. Lisa Wang",
      date: "September 10, 2025",
      description:
        "Understanding the latest developments in multimodal AI that can process text, images, audio, and video simultaneously.",
      image: "",
      type: "Tech",
      category: "Analytics",
      industry: "Healthcare",
    },
    {
      id: 10,
      title: "AI in Healthcare: Transforming Patient Care",
      author: "Dr. Michael Brown",
      date: "September 9, 2025",
      description:
        "Explore how artificial intelligence is revolutionizing healthcare delivery, from diagnosis to treatment planning and patient monitoring.",
      image: "",
      type: "Use Cases",
      category: "Content",
      industry: "Healthcare",
    },
  ]

  useEffect(() => {
    setBlogData(initialBlogData)
  }, [])

  const typeOptions = ["Case Studies", "Courses", "Podcasts", "Tech", "Use Cases", "Webinars", "Research", "Tutorials"]
  const categoryOptions = [
    "Advertising",
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

  useEffect(() => {
    let filtered = blogData

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((blog) => selectedTypes.includes(blog.type))
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((blog) => selectedCategories.includes(blog.category))
    }

    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((blog) => selectedIndustries.includes(blog.industry))
    }

    setFilteredBlogs(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedTypes, selectedCategories, selectedIndustries, blogData])

  const handleAddBlog = () => {
    const newBlog = {
      id: Math.max(...blogData.map((b) => b.id)) + 1,
      ...formData,
      date:
        formData.date ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    }
    setBlogData([...blogData, newBlog])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditBlog = () => {
    setBlogData(blogData.map((blog) => (blog.id === selectedBlog.id ? { ...selectedBlog, ...formData } : blog)))
    setIsEditDialogOpen(false)
    resetForm()
    setSelectedBlog(null)
  }

  const handleDeleteBlog = () => {
    setBlogData(blogData.filter((blog) => blog.id !== selectedBlog.id))
    setIsDeleteDialogOpen(false)
    setSelectedBlog(null)
  }

  const openEditDialog = (blog) => {
    setSelectedBlog(blog)
    setFormData({
      title: blog.title,
      author: blog.author,
      date: blog.date,
      description: blog.description,
      image: blog.image,
      type: blog.type,
      category: blog.category,
      industry: blog.industry,
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
      date: "",
      description: "",
      image: "",
      type: "",
      category: "",
      industry: "",
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
          <label key={option} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleChange(option)}
              className="w-4 h-4 text-[#1a729c] border-gray-300 rounded focus:ring-[#1a729c]/50"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
        {hasMoreOptions && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 text-[#1a729c] hover:text-[#165881] text-sm font-medium"
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
  const startIndex = (currentPage - 1) * blogsPerPage
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const Dialog = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }

  const handleBlogClick = (blog) => {
    setSelectedBlogForView(blog)
    setIsViewingBlog(true)
  }

  const handleBackToList = () => {
    setIsViewingBlog(false)
    setSelectedBlogForView(null)
  }

  if (isViewingBlog && selectedBlogForView) {
    return <BlogDetail blog={selectedBlogForView} onBack={handleBackToList} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1a729c] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Articles & Insights</h1>
              <p className="text-xl text-blue-100 max-w-4xl leading-relaxed">
                Discover the latest trends, insights, and expert perspectives on artificial intelligence, technology,
                and digital transformation. Stay informed with our comprehensive collection of articles, case studies,
                and industry analysis.
              </p>
            </div>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-white text-[#1a729c] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Article
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Search and Filters */}
          <div className="lg:w-80 space-y-6">
            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Clear All Button */}
            {(selectedTypes.length > 0 ||
              selectedCategories.length > 0 ||
              selectedIndustries.length > 0 ||
              searchTerm) && (
                <button
                  onClick={clearAllFilters}
                  className="bg-[#1a729c] text-white px-6 py-3 rounded-md hover:bg-[#165881] transition-colors flex items-center gap-2 font-medium"
                >
                  CLEAR ALL ✕
                </button>
              )}

            {/* Type Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <button
                onClick={() => setIsTypeExpanded(!isTypeExpanded)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="font-semibold text-gray-900">Type</h3>
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
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <button
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="font-semibold text-gray-900">Category</h3>
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

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <button
                onClick={() => setIsIndustryExpanded(!isIndustryExpanded)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="font-semibold text-gray-900">Industry</h3>
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
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
                  onClick={() => handleBlogClick(blog)}
                >
                  <div className="relative">
                    <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditDialog(blog)
                        }}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-[#1a729c]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteDialog(blog)
                        }}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">{blog.date}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight hover:text-[#1a729c] transition-colors">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-[#1a729c] rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {blog.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{blog.author}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{blog.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-[#1a729c] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
                      className={`w-10 h-10 rounded font-medium transition-colors ${currentPage === page
                        ? "bg-[#1a729c] text-white shadow-md"
                        : "text-gray-600 hover:text-[#1a729c] hover:bg-gray-100"
                        }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-[#1a729c] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="e.g., September 18, 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
                required
              >
                <option value="">Select Type</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
                required
              >
                <option value="">Select Industry</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddBlog}
              disabled={
                !formData.title ||
                !formData.author ||
                !formData.type ||
                !formData.category ||
                !formData.industry ||
                !formData.description
              }
              className="flex-1 bg-[#1a729c] text-white py-2 px-4 rounded-md hover:bg-[#165881] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Article
            </button>
            <button
              onClick={() => {
                setIsAddDialogOpen(false)
                resetForm()
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="e.g., September 18, 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
                required
              >
                <option value="">Select Type</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
                required
              >
                <option value="">Select Industry</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a729c]/50 focus:border-[#1a729c] outline-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleEditBlog}
              disabled={
                !formData.title ||
                !formData.author ||
                !formData.type ||
                !formData.category ||
                !formData.industry ||
                !formData.description
              }
              className="flex-1 bg-[#1a729c] text-white py-2 px-4 rounded-md hover:bg-[#165881] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Update Article
            </button>
            <button
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
                setSelectedBlog(null)
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedBlog(null)
        }}
        title="Delete Article"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this article? This action cannot be undone.</p>
          {selectedBlog && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{selectedBlog.title}</h4>
              <p className="text-sm text-gray-600">by {selectedBlog.author}</p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteBlog}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Article
            </button>
            <button
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedBlog(null)
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
