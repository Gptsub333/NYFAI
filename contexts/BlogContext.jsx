"use client"

import { createContext, useContext, useState, useCallback, useRef } from "react"

const BlogContext = createContext()

export const useBlogContext = () => {
    const context = useContext(BlogContext)
    if (!context) {
        throw new Error("useBlogContext must be used within a BlogProvider")
    }
    return context
}

export const BlogProvider = ({ children }) => {
    const [blogCache, setBlogCache] = useState({})
    const [blogListCache, setBlogListCache] = useState(null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState({
        searchTerm: "",
        selectedTypes: [],
        selectedCategories: [],
        selectedIndustries: [],
    })
    const fetchingRef = useRef(new Set()) // Track ongoing fetches

    const fetchBlogList = useCallback(
        async (forceRefresh = false) => {
            if (blogListCache && !forceRefresh) {
                console.log("[v0] Using cached blog list data")
                return blogListCache
            }

            if (fetchingRef.current.has("blogList")) {
                console.log("[v0] Blog list fetch already in progress")
                return blogListCache
            }

            try {
                fetchingRef.current.add("blogList")
                console.log("[v0] Fetching blog list from API")

                const res = await fetch("/api/articles")
                if (!res.ok) {
                    throw new Error("Failed to fetch articles")
                }
                const data = await res.json()
                const blogList = Array.isArray(data) ? data : []

                setBlogListCache(blogList)
                return blogList
            } catch (error) {
                console.error("Error fetching articles:", error)
                return []
            } finally {
                fetchingRef.current.delete("blogList")
            }
        },
        [blogListCache],
    )

    const fetchBlog = useCallback(
        async (blogId, forceRefresh = false) => {
            if (blogCache[blogId] && !forceRefresh) {
                console.log(`[v0] Using cached blog data for ID: ${blogId}`)
                return blogCache[blogId]
            }

            if (fetchingRef.current.has(blogId)) {
                console.log(`[v0] Blog fetch already in progress for ID: ${blogId}`)
                return blogCache[blogId]
            }

            try {
                fetchingRef.current.add(blogId)
                console.log(`[v0] Fetching blog from API for ID: ${blogId}`)

                const response = await fetch(`/api/articles/${blogId}`)
                if (!response.ok) {
                    throw new Error("Blog not found")
                }

                const blogData = await response.json()
                setBlogCache((prev) => ({
                    ...prev,
                    [blogId]: blogData,
                }))

                return blogData
            } catch (error) {
                console.error("Error fetching blog:", error)
                throw error
            } finally {
                fetchingRef.current.delete(blogId)
            }
        },
        [blogCache],
    )

    const updateBlogInCache = useCallback(
        (blogId, updatedBlog) => {
            setBlogCache((prev) => ({
                ...prev,
                [blogId]: updatedBlog,
            }))

            // Also update the blog list cache if it exists
            if (blogListCache) {
                setBlogListCache((prev) => prev.map((blog) => (blog.id === blogId ? updatedBlog : blog)))
            }
        },
        [blogListCache],
    )

    const removeBlogFromCache = useCallback(
        (blogId) => {
            setBlogCache((prev) => {
                const newCache = { ...prev }
                delete newCache[blogId]
                return newCache
            })

            // Also remove from blog list cache
            if (blogListCache) {
                setBlogListCache((prev) => prev.filter((blog) => blog.id !== blogId))
            }
        },
        [blogListCache],
    )

    const addBlogToCache = useCallback(
        (newBlog) => {
            setBlogCache((prev) => ({
                ...prev,
                [newBlog.id]: newBlog,
            }))

            // Also add to blog list cache
            if (blogListCache) {
                setBlogListCache((prev) => [newBlog, ...prev])
            }
        },
        [blogListCache],
    )

    const saveScrollPosition = useCallback(() => {
        const position = window.scrollY
        setScrollPosition(position)
        console.log(`[v0] Saved scroll position: ${position}`)
    }, [])

    const restoreScrollPosition = useCallback(() => {
        if (scrollPosition > 0) {
            console.log(`[v0] Restoring scroll position: ${scrollPosition}`)
            setTimeout(() => {
                window.scrollTo({ top: scrollPosition, behavior: "instant" })
            }, 100)
        }
    }, [scrollPosition])

    const clearCache = useCallback(() => {
        setBlogCache({})
        setBlogListCache(null)
        setScrollPosition(0)
        fetchingRef.current.clear()
        console.log("[v0] Cleared all blog caches")
    }, [])

    const value = {
        // Data
        blogCache,
        blogListCache,
        scrollPosition,
        currentPage,
        filters,

        // Actions
        fetchBlogList,
        fetchBlog,
        updateBlogInCache,
        removeBlogFromCache,
        addBlogToCache,
        saveScrollPosition,
        restoreScrollPosition,
        clearCache,
        setCurrentPage,
        setFilters,
    }

    return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
}
