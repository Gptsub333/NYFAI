"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Plus,
  GripVertical,
  Trash2,
  Type,
  Quote,
  User,
  ImageIcon,
  List,
  SeparatorVertical as Separator,
  Code,
  Link,
  Upload,
  Edit3,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"





const sectionTemplates = [
  { type: "header", icon: Type, label: "Header", description: "Title or heading text" },
  { type: "paragraph", icon: Type, label: "Paragraph", description: "Body text content" },
  { type: "quote", icon: Quote, label: "Quote", description: "Highlighted quote or callout" },
  { type: "user", icon: User, label: "Author", description: "Author information" },
  { type: "image", icon: ImageIcon, label: "Image", description: "Image with caption" },
  { type: "list", icon: List, label: "List", description: "Bulleted or numbered list" },
  { type: "divider", icon: Separator, label: "Divider", description: "Visual separator" },
  { type: "code", icon: Code, label: "Code", description: "Code snippet" },
  { type: "link", icon: Link, label: "Link", description: "External link" },
]

export default function TemplateEditor({ initialSections = [], onChange, readOnly = false }) {
  const [sections, setSections] = useState(initialSections)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [draggedSection, setDraggedSection] = useState(null)
  const [editingSection, setEditingSection] = useState(null)
  const [uploadingImages, setUploadingImages] = useState(new Set())
  const dragCounter = useRef(0)

  useEffect(() => {
    if (initialSections && initialSections.length > 0) {
      setSections(initialSections)
    }
  }, [initialSections])

  const updateSections = useCallback(
    (newSections) => {
      setSections(newSections)
      onChange?.(newSections)
    },
    [onChange],
  )

  const addSection = (type) => {
    const newSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: getDefaultContent(type),
      order: sections.length,
    }

    updateSections([...sections, newSection])
    setShowAddMenu(false)
    setEditingSection(newSection.id)
  }

  const removeSection = (id) => {
    updateSections(sections.filter((section) => section.id !== id))
    if (editingSection === id) {
      setEditingSection(null)
    }
  }

  const updateSection = (id, content) => {
    updateSections(sections.map((section) => (section.id === id ? { ...section, content } : section)))
  }

  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections]
    const [movedSection] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, movedSection)

    // Update order
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }))

    updateSections(updatedSections)
  }

  const handleImageUpload = async (sectionId, file) => {
    if (!file) return

    setUploadingImages((prev) => new Set(prev).add(sectionId))

    try {
      // Convert file to base64
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result
          resolve(result.split(",")[1]) // Remove data:image/...;base64, prefix
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const fileName = `blog-image-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const bucketName = "nyfai-website-image"

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: base64String, bucketName, fileName }),
      })

      if (!uploadRes.ok) throw new Error("Failed to upload image")

      const data = await uploadRes.json()

      // Update section with uploaded image URL
      const section = sections.find((s) => s.id === sectionId)
      if (section) {
        updateSection(sectionId, {
          ...section.content,
          url: data.imageUrl,
          alt: section.content.alt || file.name.split(".")[0],
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingImages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(sectionId)
        return newSet
      })
    }
  }

  const handleDragStart = (e, sectionId, index) => {
    setDraggedSection(sectionId)
    e.dataTransfer.setData("text/plain", index.toString())
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))

    if (dragIndex !== dropIndex) {
      moveSection(dragIndex, dropIndex)
    }

    setDraggedSection(null)
    dragCounter.current = 0
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    dragCounter.current++
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    dragCounter.current--
  }

  function getDefaultContent(type) {
    switch (type) {
      case "header":
        return { text: "New Header", level: 2 }
      case "paragraph":
        return { text: "Start writing your content here..." }
      case "quote":
        return { text: "Your inspiring quote goes here", author: "Author Name" }
      case "user":
        return { name: "Author Name", bio: "Author bio", avatar: "" }
      case "image":
        return { url: "", caption: "", alt: "" }
      case "list":
        return { items: ["First item", "Second item"], ordered: false }
      case "divider":
        return { style: "line" }
      case "code":
        return { code: "// Your code here", language: "javascript" }
      case "link":
        return { url: "", text: "Link text", description: "" }
      default:
        return {}
    }
  }

  const renderSection = (section, index) => {
    const isDragging = draggedSection === section.id
    const isEditing = editingSection === section.id

    return (
      <div
        key={section.id}
        className={`template-section ${isDragging ? "dragging" : ""} ${isEditing ? "editing" : ""}`}
        draggable={!readOnly && !isEditing}
        onDragStart={(e) => handleDragStart(e, section.id, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="flex items-start gap-3">
          {!readOnly && (
            <div className="flex flex-col gap-1 pt-1">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
            </div>
          )}

          <div className="flex-1">{renderSectionContent(section, isEditing)}</div>

          {!readOnly && (
            <div className="section-controls flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingSection(isEditing ? null : section.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSection(section.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderSectionContent = (section, isEditing) => {
    const showEditControls = !readOnly && isEditing

    switch (section.type) {
      case "header":
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Header</span>
                <Select
                  value={section.content.level?.toString() || "2"}
                  onValueChange={(value) =>
                    updateSection(section.id, { ...section.content, level: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-20 h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">H1</SelectItem>
                    <SelectItem value="2">H2</SelectItem>
                    <SelectItem value="3">H3</SelectItem>
                    <SelectItem value="4">H4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {showEditControls ? (
              <Input
                value={section.content.text}
                onChange={(e) => updateSection(section.id, { ...section.content, text: e.target.value })}
                className="font-semibold text-lg"
                placeholder="Enter header text..."
              />
            ) : (
              <div
                className={`font-bold ${section.content.level === 1
                  ? "text-3xl"
                  : section.content.level === 2
                    ? "text-2xl"
                    : section.content.level === 3
                      ? "text-xl"
                      : "text-lg"
                  }`}
              >
                {section.content.text}
              </div>
            )}
          </div>
        )

      case "paragraph":
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Paragraph</span>
              </div>
            )}
            {showEditControls ? (
              <Textarea
                value={section.content.text}
                onChange={(e) => updateSection(section.id, { ...section.content, text: e.target.value })}
                placeholder="Start writing your content..."
                rows={4}
                className="resize-none"
              />
            ) : (
              <p className="text-foreground leading-relaxed">{section.content.text}</p>
            )}
          </div>
        )

      case "quote":
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Quote</span>
              </div>
            )}
            {showEditControls ? (
              <div className="space-y-2">
                <Textarea
                  value={section.content.text}
                  onChange={(e) => updateSection(section.id, { ...section.content, text: e.target.value })}
                  placeholder="Enter quote text..."
                  rows={3}
                />
                <Input
                  value={section.content.author}
                  onChange={(e) => updateSection(section.id, { ...section.content, author: e.target.value })}
                  placeholder="Quote author (optional)"
                />
              </div>
            ) : (
              <blockquote className="border-l-4 border-primary pl-4 italic">
                <p className="text-lg text-foreground mb-2">"{section.content.text}"</p>
                {section.content.author && (
                  <cite className="text-sm text-muted-foreground">— {section.content.author}</cite>
                )}
              </blockquote>
            )}
          </div>
        )

      case "user":
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Author Info</span>
              </div>
            )}
            {showEditControls ? (
              <div className="space-y-2">
                <Input
                  value={section.content.name}
                  onChange={(e) => updateSection(section.id, { ...section.content, name: e.target.value })}
                  placeholder="Author name"
                />
                <Input
                  value={section.content.bio}
                  onChange={(e) => updateSection(section.id, { ...section.content, bio: e.target.value })}
                  placeholder="Author bio"
                />
                <Input
                  value={section.content.avatar}
                  onChange={(e) => updateSection(section.id, { ...section.content, avatar: e.target.value })}
                  placeholder="Avatar URL (optional)"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {section.content.avatar ? (
                    <img
                      src={section.content.avatar || "/placeholder.svg"}
                      alt={section.content.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{section.content.name}</h4>
                  <p className="text-sm text-muted-foreground">{section.content.bio}</p>
                </div>
              </div>
            )}
          </div>
        )

      case "image":
        const isUploading = uploadingImages.has(section.id)
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Image</span>
              </div>
            )}
            {showEditControls ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={section.content.url}
                    onChange={(e) => updateSection(section.id, { ...section.content, url: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(section.id, file)
                    }}
                    className="hidden"
                    id={`image-upload-${section.id}`}
                  />
                  <label
                    htmlFor={`image-upload-${section.id}`}
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading ? "Uploading..." : "Upload"}
                  </label>
                </div>
                <Input
                  value={section.content.caption}
                  onChange={(e) => updateSection(section.id, { ...section.content, caption: e.target.value })}
                  placeholder="Image caption (optional)"
                />
                <Input
                  value={section.content.alt}
                  onChange={(e) => updateSection(section.id, { ...section.content, alt: e.target.value })}
                  placeholder="Alt text for accessibility"
                />
                {section.content.url && (
                  <img
                    src={section.content.url || "/placeholder.svg"}
                    alt={section.content.alt || "Preview"}
                    className="w-full max-w-md rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {section.content.url && (
                  <img
                    src={section.content.url || "/placeholder.svg"}
                    alt={section.content.alt || section.content.caption}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                )}
                {section.content.caption && (
                  <p className="text-sm text-muted-foreground text-center italic">{section.content.caption}</p>
                )}
              </div>
            )}
          </div>
        )

      case "list":
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">List</span>
                <Select
                  value={section.content.ordered ? "ordered" : "unordered"}
                  onValueChange={(value) =>
                    updateSection(section.id, { ...section.content, ordered: value === "ordered" })
                  }
                >
                  <SelectTrigger className="w-32 h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unordered">Bulleted</SelectItem>
                    <SelectItem value="ordered">Numbered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {showEditControls ? (
              <div className="space-y-2">
                {section.content.items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...section.content.items]
                        newItems[index] = e.target.value
                        updateSection(section.id, { ...section.content, items: newItems })
                      }}
                      placeholder={`Item ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newItems = section.content.items.filter((_, i) => i !== index)
                        updateSection(section.id, { ...section.content, items: newItems })
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = [...section.content.items, "New item"]
                    updateSection(section.id, { ...section.content, items: newItems })
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            ) : (
              <div>
                {section.content.ordered ? (
                  <ol className="list-decimal list-inside space-y-1">
                    {section.content.items.map((item, index) => (
                      <li key={index} className="text-foreground">
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {section.content.items.map((item, index) => (
                      <li key={index} className="text-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )

      case "divider":
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <Separator className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Divider</span>
              </div>
            )}
            <div className="border-t border-border my-4"></div>
          </div>
        )

      case "code":
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Code</span>
                <Select
                  value={section.content.language || "javascript"}
                  onValueChange={(value) => updateSection(section.id, { ...section.content, language: value })}
                >
                  <SelectTrigger className="w-32 h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {showEditControls ? (
              <Textarea
                value={section.content.code}
                onChange={(e) => updateSection(section.id, { ...section.content, code: e.target.value })}
                placeholder="Enter your code..."
                rows={6}
                className="font-mono text-sm"
              />
            ) : (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono">{section.content.code}</code>
              </pre>
            )}
          </div>
        )

      case "link":
        return (
          <div className="space-y-2">
            {showEditControls && (
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Link</span>
              </div>
            )}
            {showEditControls ? (
              <div className="space-y-2">
                <Input
                  value={section.content.url}
                  onChange={(e) => updateSection(section.id, { ...section.content, url: e.target.value })}
                  placeholder="https://example.com"
                />
                <Input
                  value={section.content.text}
                  onChange={(e) => updateSection(section.id, { ...section.content, text: e.target.value })}
                  placeholder="Link text"
                />
                <Input
                  value={section.content.description}
                  onChange={(e) => updateSection(section.id, { ...section.content, description: e.target.value })}
                  placeholder="Description (optional)"
                />
              </div>
            ) : (
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <a
                  href={section.content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  {section.content.text || section.content.url}
                </a>
                {section.content.description && (
                  <p className="text-sm text-muted-foreground mt-1">{section.content.description}</p>
                )}
              </div>
            )}
          </div>
        )

      default:
        return <div className="text-muted-foreground">Unknown section type</div>
    }
  }

  if (readOnly) {
    return (
      <div className="space-y-6">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <div key={section.id}>{renderSectionContent(section, false)}</div>
          ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sections.sort((a, b) => a.order - b.order).map((section, index) => renderSection(section, index))}

      {/* Add Section Button */}
      <div className="relative">
        <div className="flex flex-col items-center border-2 border-white" onClick={() => setShowAddMenu(!showAddMenu)}>
          <Plus className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">Add Section</p>
          <p className="text-sm">Choose from templates below</p>
        </div>

        {showAddMenu && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 p-4 border border-border rounded-lg bg-popover shadow-lg absolute z-10 w-full">
            {sectionTemplates.map((template) => {
              const Icon = template.icon
              return (
                <div
                  key={template.type}
                  className="template-option"
                  onClick={() => addSection(template.type)}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-sm">{template.label}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
