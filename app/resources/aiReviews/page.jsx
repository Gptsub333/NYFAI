// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Star, Plus, X, Image, Edit2, Loader2 } from "lucide-react"

// /**
//  * @typedef {Object} AIReview
//  * @property {string} id
//  * @property {string} toolName
//  * @property {string} description
//  * @property {string} image
//  * @property {number} rating
//  * @property {string[]} pros
//  * @property {string[]} cons
//  * @property {string} useCase
//  */

// export default function AIReviewsPage() {
//   const [reviews, setReviews] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(true)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingReview, setEditingReview] = useState(null)
//   const [imageUploading, setImageUploading] = useState(false)
//   const [selectedImageFile, setSelectedImageFile] = useState(null)

//   const [formData, setFormData] = useState({
//     toolName: "",
//     description: "",
//     image: "",
//     rating: 5,
//     pros: "",
//     cons: "",
//     useCase: "",
//   })
//   const [imagePreview, setImagePreview] = useState("")
//   // Add this near your other useState declarations
//   const [useCaseOptions] = useState([
//     "Content Creation",
//     "Data Analysis",
//     "Image Generation",
//     "Code Development",
//     "Customer Support",
//     "Marketing & Advertising",
//     "Research & Documentation",
//     "Design & Creative Work",
//     "Business Intelligence",
//     "Automation & Workflows",
//     "Education & Training",
//     "Personal Productivity",
//     "Sales & Lead Generation",
//     "Video & Audio Processing",
//     "Translation & Language"
//   ])

//   // Fetch reviews on component mount
//   useEffect(() => {
//     fetchReviews();
//   }, [])

//   const fetchReviews = async () => {
//     try {
//       setFetchLoading(true)
//       const response = await fetch('/api/ai-reviews', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })

//       if (!response.ok) {
//         console.error('Fetch error:', response.status, response.statusText)
//         throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`)
//       }

//       const data = await response.json()
//       console.log('Raw API response:', data)

//       // Transform the API response to match component structure
//       const transformedReviews = data.map(review => ({
//         id: review.id,
//         toolName: review.name || review["Tool Name"] || '',
//         description: review.description || review.Description || '',
//         image: review.image || review["Tool Image"] || '/placeholder.svg',
//         rating: review.rating || review["Rating (1-5 stars)"] || 0,
//         pros: typeof review.pros === 'string' ? review.pros.split(',').map(p => p.trim()) :
//           typeof review.Pros === 'string' ? review.Pros.split(',').map(p => p.trim()) :
//             (review.pros || review.Pros || []),
//         cons: typeof review.cons === 'string' ? review.cons.split(',').map(c => c.trim()) :
//           typeof review.Cons === 'string' ? review.Cons.split(',').map(c => c.trim()) :
//             (review.cons || review.Cons || []),
//         useCase: Array.isArray(review.bestUseCase) ? review.bestUseCase.join(', ') :
//           Array.isArray(review["Best Use Case"]) ? review["Best Use Case"].join(', ') :
//             (review.bestUseCase || review["Best Use Case"] || '')
//       })).filter(review => review.toolName) // Filter out incomplete records

//       console.log('Transformed reviews:', transformedReviews)
//       setReviews(transformedReviews)
//     } catch (error) {
//       console.error('Error fetching reviews:', error)
//       alert(`Failed to fetch reviews: ${error.message}`)
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const handleImageSelect = (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setSelectedImageFile(file)

//     // Create preview URL
//     const previewUrl = URL.createObjectURL(file)
//     setImagePreview(previewUrl)

//     // Clear the current image URL since we have a new file to upload
//     setFormData(prev => ({ ...prev, image: "" }))
//   }
//   // Add this new function to handle uploading the selected file
//   const uploadSelectedImage = async (file) => {
//     try {
//       // Validate file type
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
//       if (!allowedTypes.includes(file.type)) {
//         throw new Error(`Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`)
//       }

//       // Validate file size (max 10MB)
//       const maxSize = 10 * 1024 * 1024 // 10MB
//       if (file.size > maxSize) {
//         throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 10MB`)
//       }

//       // Convert file to base64
//       const base64Data = await new Promise((resolve, reject) => {
//         const reader = new FileReader()
//         reader.onload = () => {
//           // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
//           const base64 = reader.result.split(',')[1]
//           resolve(base64)
//         }
//         reader.onerror = reject
//         reader.readAsDataURL(file)
//       })

//       // Generate unique filename
//       const timestamp = Date.now()
//       const randomString = Math.random().toString(36).substring(2, 8)
//       const fileExtension = file.name.split('.').pop() || 'jpg'
//       const uniqueFileName = `ai-reviews/${timestamp}-${randomString}.${fileExtension}`

//       // Prepare data for your API
//       const uploadData = {
//         imageData: base64Data,
//         bucketName: "nyfai-website-image",
//         fileName: "event-image"
//       }

//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(uploadData),
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//       }

//       const result = await response.json()

//       if (!result.imageUrl) {
//         throw new Error('No image URL returned')
//       }

//       return result.imageUrl
//     } catch (error) {
//       console.error('Error uploading image:', error)
//       throw error
//     }
//   }

//   // Update the handleSubmit function
//   const handleSubmit = async () => {
//     if (
//       !formData.toolName ||
//       !formData.description ||
//       !formData.pros ||
//       !formData.cons ||
//       !formData.useCase
//     ) {
//       alert("Please fill in all required fields")
//       return
//     }

//     // Check if we need an image (new review) or if we have an image (edit or new with image)
//     if (!editingReview && !selectedImageFile && !formData.image) {
//       alert("Please select an image for the tool")
//       return
//     }

//     try {
//       setLoading(true)
//       let imageUrl = formData.image // Use existing image URL for edits

//       // Upload new image if one was selected
//       if (selectedImageFile) {
//         try {
//           setImageUploading(true) // Set uploading state
//           imageUrl = await uploadSelectedImage(selectedImageFile) // ✅ This now works correctly
//           if (!imageUrl) {
//             alert("Failed to upload image. Please try again.")
//             return
//           }
//         } catch (error) {
//           console.error('Image upload error:', error)
//           alert(`Failed to upload image: ${error.message}`)
//           return
//         } finally {
//           setImageUploading(false)
//         }
//       }

//       if (editingReview) {
//         // Update existing review
//         await handleUpdateReview(imageUrl)
//       } else {
//         // Create new review
//         await handleCreateReview(imageUrl)
//       }

//       resetForm()
//       setIsDialogOpen(false)

//       alert(`Review ${editingReview ? 'updated' : 'created'} successfully!`)
//     } catch (error) {
//       console.error('Error saving review:', error)
//       alert(`Failed to ${editingReview ? 'update' : 'create'} review. Please try again.`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Keep the original handleImageUpload for direct file input events (if needed elsewhere)
//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     try {
//       setImageUploading(true)
//       const imageUrl = await uploadSelectedImage(file)

//       setImagePreview(imageUrl)
//       setFormData(prev => ({ ...prev, image: imageUrl }))
//     } catch (error) {
//       console.error('Error uploading image:', error)
//       alert(`Failed to upload image: ${error.message}`)
//     } finally {
//       setImageUploading(false)
//     }
//   }

//   // const handleImageUpload = async (e) => {
//   //   const file = e.target.files?.[0]
//   //   if (!file) return

//   //   try {
//   //     setImageUploading(true)

//   //     // Validate file type
//   //     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
//   //     if (!allowedTypes.includes(file.type)) {
//   //       throw new Error(`Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`)
//   //     }

//   //     // Validate file size (max 10MB)
//   //     const maxSize = 10 * 1024 * 1024 // 10MB
//   //     if (file.size > maxSize) {
//   //       throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 10MB`)
//   //     }

//   //     // Convert file to base64
//   //     const base64Data = await new Promise((resolve, reject) => {
//   //       const reader = new FileReader()
//   //       reader.onload = () => {
//   //         // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
//   //         const base64 = reader.result.split(',')[1]
//   //         resolve(base64)
//   //       }
//   //       reader.onerror = reject
//   //       reader.readAsDataURL(file)
//   //     })

//   //     // Generate unique filename
//   //     const timestamp = Date.now()
//   //     const randomString = Math.random().toString(36).substring(2, 8)
//   //     const fileExtension = file.name.split('.').pop() || 'jpg'
//   //     const uniqueFileName = `ai-reviews/${timestamp}-${randomString}.${fileExtension}`

//   //     // Prepare data for your API
//   //     const uploadData = {
//   //       imageData: base64Data,
//   //       bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'your-default-bucket-name',
//   //       fileName: uniqueFileName
//   //     }

//   //     const response = await fetch('/api/upload', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(uploadData),
//   //     })

//   //     if (!response.ok) {
//   //       const errorText = await response.text()
//   //       throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//   //     }

//   //     const result = await response.json()

//   //     if (result.imageUrl) {
//   //       setImagePreview(result.imageUrl)
//   //       setFormData(prev => ({ ...prev, image: result.imageUrl }))
//   //     } else {
//   //       throw new Error('No image URL returned')
//   //     }
//   //   } catch (error) {
//   //     console.error('Error uploading image:', error)
//   //     alert(`Failed to upload image: ${error.message}`)
//   //   } finally {
//   //     setImageUploading(false)
//   //   }
//   // }
//   const resetForm = () => {
//     setFormData({
//       toolName: "",
//       description: "",
//       image: "",
//       rating: 5,
//       pros: "",
//       cons: "",
//       useCase: "",
//     })
//     setImagePreview("")
//     setSelectedImageFile(null)
//     setEditingReview(null)

//     // Clean up any preview URLs
//     if (imagePreview && imagePreview.startsWith('blob:')) {
//       URL.revokeObjectURL(imagePreview)
//     }
//   }

//   const handleEdit = (review) => {
//     setEditingReview(review)
//     setFormData({
//       toolName: review.toolName,
//       description: review.description,
//       image: review.image,
//       rating: review.rating,
//       pros: Array.isArray(review.pros) ? review.pros.join(", ") : review.pros,
//       cons: Array.isArray(review.cons) ? review.cons.join(", ") : review.cons,
//       useCase: review.useCase,
//     })
//     setImagePreview(review.image)
//     setSelectedImageFile(null) // No new file selected when editing
//     setIsDialogOpen(true)
//   }

//   // const handleSubmit = async () => {
//   //   if (
//   //     !formData.toolName ||
//   //     !formData.description ||
//   //     !formData.pros ||
//   //     !formData.cons ||
//   //     !formData.useCase
//   //   ) {
//   //     alert("Please fill in all required fields")
//   //     return
//   //   }

//   //   // Check if we need an image (new review) or if we have an image (edit or new with image)
//   //   if (!editingReview && !selectedImageFile && !formData.image) {
//   //     alert("Please select an image for the tool")
//   //     return
//   //   }

//   //   try {
//   //     setLoading(true)
//   //     let imageUrl = formData.image // Use existing image URL for edits

//   //     // Upload new image if one was selected
//   //     if (selectedImageFile) {
//   //       try {
//   //         imageUrl = await handleImageUpload()
//   //         if (!imageUrl) {
//   //           alert("Failed to upload image. Please try again.")
//   //           return
//   //         }
//   //       } catch (error) {
//   //         alert("Failed to upload image. Please try again.")
//   //         return
//   //       }
//   //     }

//   //     if (editingReview) {
//   //       // Update existing review
//   //       await handleUpdateReview(imageUrl)
//   //     } else {
//   //       // Create new review
//   //       await handleCreateReview(imageUrl)
//   //     }

//   //     resetForm()
//   //     setIsDialogOpen(false)

//   //     alert(`Review ${editingReview ? 'updated' : 'created'} successfully!`)
//   //   } catch (error) {
//   //     console.error('Error saving review:', error)
//   //     alert(`Failed to ${editingReview ? 'update' : 'create'} review. Please try again.`)
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   const handleCreateReview = async (imageUrl) => {
//     const reviewData = {
//       name: formData.toolName,
//       description: formData.description,
//       image: imageUrl,
//       rating: formData.rating,
//       pros: formData.pros,
//       cons: formData.cons,
//       bestUseCase: formData.useCase.split(',').map(item => item.trim()).filter(item => item),
//     }

//     const response = await fetch('/api/ai-reviews', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(reviewData),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to create review')
//     }

//     const result = await response.json()

//     // Transform the result to match component structure
//     const transformedResult = {
//       id: result.id,
//       toolName: result["Tool Name"] || result.name,
//       description: result.Description || result.description || '',
//       image: result["Tool Image"] || result.image || '/placeholder.svg',
//       rating: result["Rating (1-5 stars)"] || result.rating || 0,
//       pros: typeof result.Pros === 'string' ? result.Pros.split(',').map(p => p.trim()) :
//         typeof result.pros === 'string' ? result.pros.split(',').map(p => p.trim()) :
//           (result.Pros || result.pros || []),
//       cons: typeof result.Cons === 'string' ? result.Cons.split(',').map(c => c.trim()) :
//         typeof result.cons === 'string' ? result.cons.split(',').map(c => c.trim()) :
//           (result.Cons || result.cons || []),
//       useCase: Array.isArray(result["Best Use Case"]) ? result["Best Use Case"].join(', ') :
//         Array.isArray(result.bestUseCase) ? result.bestUseCase.join(', ') :
//           (result["Best Use Case"] || result.bestUseCase || '')
//     }

//     // Add new review to the list
//     setReviews(prev => [transformedResult, ...prev])
//   }

//   const handleUpdateReview = async (imageUrl) => {
//     const reviewData = {
//       id: editingReview.id,
//       name: formData.toolName,
//       description: formData.description,
//       image: imageUrl,
//       rating: formData.rating,
//       pros: formData.pros,
//       cons: formData.cons,
//       bestUseCase: formData.useCase.split(',').map(item => item.trim()).filter(item => item),
//     }

//     const response = await fetch('/api/ai-reviews', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(reviewData),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to update review')
//     }

//     const result = await response.json()

//     // Transform the result to match component structure
//     const transformedResult = {
//       id: result.id,
//       toolName: result.name || result["Tool Name"],
//       description: result.description || result.Description || '',
//       image: result.image || result["Tool Image"] || '/placeholder.svg',
//       rating: result.rating || result["Rating (1-5 stars)"] || 0,
//       pros: typeof result.pros === 'string' ? result.pros.split(',').map(p => p.trim()) :
//         typeof result.Pros === 'string' ? result.Pros.split(',').map(p => p.trim()) :
//           (result.pros || result.Pros || []),
//       cons: typeof result.cons === 'string' ? result.cons.split(',').map(c => c.trim()) :
//         typeof result.Cons === 'string' ? result.Cons.split(',').map(c => c.trim()) :
//           (result.cons || result.Cons || []),
//       useCase: Array.isArray(result.bestUseCase) ? result.bestUseCase.join(', ') :
//         Array.isArray(result["Best Use Case"]) ? result["Best Use Case"].join(', ') :
//           (result.bestUseCase || result["Best Use Case"] || '')
//     }

//     // Update existing review in the list
//     setReviews(prev =>
//       prev.map(review =>
//         review.id === editingReview.id ? transformedResult : review
//       )
//     )
//   }

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this review?')) {
//       return
//     }

//     try {
//       const response = await fetch('/api/ai-reviews', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id }),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to delete review')
//       }

//       setReviews(prev => prev.filter(review => review.id !== id))
//       alert('Review deleted successfully!')
//     } catch (error) {
//       console.error('Error deleting review:', error)
//       alert('Failed to delete review. Please try again.')
//     }
//   }

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
//     ))
//   }

//   const handleDialogClose = (open) => {
//     if (!open) {
//       resetForm()
//     }
//     setIsDialogOpen(open)
//   }

//   const removeSelectedImage = () => {
//     if (imagePreview && imagePreview.startsWith('blob:')) {
//       URL.revokeObjectURL(imagePreview)
//     }
//     setImagePreview("")
//     setSelectedImageFile(null)
//     setFormData(prev => ({ ...prev, image: "" }))
//   }

//   if (fetchLoading) {
//     return (
//       <div className="min-h-screen py-12 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading reviews...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen py-12">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <Badge variant="secondary" className="mb-4">
//             <Star className="w-3 h-3 mr-1" />
//             AI Tool Reviews
//           </Badge>
//           <h1 className="text-4xl font-bold mb-4">No-Nonsense AI Tool Reviews</h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Honest, practical reviews of AI tools with real-world use cases, pros and cons, and actionable insights for
//             business leaders.
//           </p>
//         </div>

//         {/* Add Review Button */}
//         <div className="flex justify-center mb-12">
//           <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
//             <DialogTrigger asChild>
//               <Button className="bg-[#1a729c] hover:bg-[#1a729c]/90">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add AI Tool Review
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>
//                   {editingReview ? 'Edit AI Tool Review' : 'Add New AI Tool Review'}
//                 </DialogTitle>
//               </DialogHeader>
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="toolName">Tool Name *</Label>
//                   <Input
//                     id="toolName"
//                     value={formData.toolName}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, toolName: e.target.value }))}
//                     placeholder="e.g., ChatGPT, Midjourney, Claude"
//                     required
//                     disabled={loading || imageUploading}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description *</Label>
//                   <Textarea
//                     id="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                     placeholder="Brief overview of what the tool does and its main strengths"
//                     rows={3}
//                     required
//                     disabled={loading || imageUploading}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="image">Tool Image *</Label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
//                     {imagePreview ? (
//                       <div className="relative">
//                         <img
//                           src={imagePreview}
//                           alt="Preview"
//                           className="max-w-full h-32 object-cover mx-auto rounded"
//                         />
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="sm"
//                           className="absolute top-2 right-2"
//                           onClick={removeSelectedImage}
//                           disabled={loading || imageUploading}
//                         >
//                           <X className="w-4 h-4" />
//                         </Button>
//                         {selectedImageFile && (
//                           <p className="text-xs text-muted-foreground mt-2">
//                             New image selected - will be uploaded when you save the review
//                           </p>
//                         )}
//                       </div>
//                     ) : (
//                       <div>
//                         <Image className="mx-auto h-12 w-12 text-gray-400" />
//                         <div className="mt-4">
//                           <label htmlFor="image-upload" className="cursor-pointer">
//                             <span className="mt-2 block text-sm font-medium text-gray-900">
//                               Upload tool screenshot or logo
//                             </span>
//                             <input
//                               id="image-upload"
//                               type="file"
//                               className="sr-only"
//                               accept="image/*"
//                               onChange={handleImageSelect}
//                               disabled={loading || imageUploading}
//                             />
//                           </label>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="rating">Rating (1-5 stars)</Label>
//                   <select
//                     id="rating"
//                     value={formData.rating}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number.parseInt(e.target.value) }))}
//                     className="w-full p-2 border border-gray-300 bg-background rounded-md"
//                     disabled={loading || imageUploading}
//                   >
//                     {[1, 2, 3, 4, 5].map((num) => (
//                       <option key={num} value={num}>
//                         {num} Star{num !== 1 ? "s" : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="pros">Pros (comma-separated) *</Label>
//                   <Textarea
//                     id="pros"
//                     value={formData.pros}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, pros: e.target.value }))}
//                     placeholder="e.g., Easy to use, Great results, Fast processing"
//                     rows={2}
//                     required
//                     disabled={loading || imageUploading}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="cons">Cons (comma-separated) *</Label>
//                   <Textarea
//                     id="cons"
//                     value={formData.cons}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, cons: e.target.value }))}
//                     placeholder="e.g., Expensive, Limited features, Steep learning curve"
//                     rows={2}
//                     required
//                     disabled={loading || imageUploading}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="useCase">Best Use Case *</Label>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 border border-gray-300 rounded-md bg-background max-h-48 overflow-y-auto">
//                     {useCaseOptions.map((option) => {
//                       const isSelected = formData.useCase ? formData.useCase.split(', ').includes(option) : false
//                       return (
//                         <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
//                           <input
//                             type="checkbox"
//                             checked={isSelected}
//                             onChange={(e) => {
//                               const currentSelections = formData.useCase ? formData.useCase.split(', ').filter(item => item.trim()) : []
//                               let newSelections

//                               if (e.target.checked) {
//                                 newSelections = [...currentSelections, option]
//                               } else {
//                                 newSelections = currentSelections.filter(item => item !== option)
//                               }

//                               setFormData((prev) => ({
//                                 ...prev,
//                                 useCase: newSelections.join(', ')
//                               }))
//                             }}
//                             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                             disabled={loading || imageUploading}
//                           />
//                           <span className="text-sm">{option}</span>
//                         </label>
//                       )
//                     })}
//                   </div>
//                   {formData.useCase && (
//                     <p className="text-xs text-muted-foreground">
//                       Selected: {formData.useCase}
//                     </p>
//                   )}
//                 </div>
//                 <Button
//                   type="submit"
//                   onClick={handleSubmit}
//                   className="w-full bg-[#1a729c] hover:bg-[#1a729c]/90"
//                   disabled={loading || imageUploading}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       {imageUploading ? 'Uploading image...' : editingReview ? 'Updating...' : 'Adding...'}
//                     </>
//                   ) : (
//                     editingReview ? 'Update Review' : 'Add Review'
//                   )}
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Reviews Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {reviews.map((review) => (
//             <Card
//               key={review.id}
//               className="relative group hover:shadow-lg transition-all duration-300 bg-card/60 backdrop-blur border border-border/60"
//             >
//               <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={() => handleEdit(review)}
//                 >
//                   <Edit2 className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => handleDelete(review.id)}
//                 >
//                   <X className="w-4 h-4" />
//                 </Button>
//               </div>

//               <div className="aspect-video overflow-hidden rounded-t-lg">
//                 <img
//                   src={review.image || "/placeholder.svg"}
//                   alt={review.toolName}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//               </div>

//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-xl">{review.toolName}</CardTitle>
//                   <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 <p className="text-sm text-muted-foreground leading-relaxed">{review.description}</p>

//                 <div className="space-y-3">
//                   <div>
//                     <h4 className="font-semibold text-green-600 text-sm mb-1">Pros:</h4>
//                     <ul className="text-xs text-muted-foreground space-y-1">
//                       {review.pros.map((pro, index) => (
//                         <li key={index} className="flex items-start gap-1">
//                           <span className="text-green-500 mt-0.5">•</span>
//                           {pro}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-red-600 text-sm mb-1">Cons:</h4>
//                     <ul className="text-xs text-muted-foreground space-y-1">
//                       {review.cons.map((con, index) => (
//                         <li key={index} className="flex items-start gap-1">
//                           <span className="text-red-500 mt-0.5">•</span>
//                           {con}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="pt-2 border-t border-border/60">
//                     <h4 className="font-semibold text-sm mb-1">Best for:</h4>
//                     <p className="text-xs text-muted-foreground">{review.useCase}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {reviews.length === 0 && !fetchLoading && (
//           <div className="text-center py-12">
//             <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
//             <p className="text-muted-foreground">Be the first to add an AI tool review!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Plus, X, ImageIcon, Edit2, Loader2, ChevronDown } from "lucide-react"

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
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState(null)
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

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterQuery, setFilterQuery] = useState("")

  const [useCaseOptions] = useState([
    "Content Creation",
    "Data Analysis",
    "Image Generation",
    "Code Development",
    "Customer Support",
    "Marketing & Advertising",
    "Research & Documentation",
    "Design & Creative Work",
    "Business Intelligence",
    "Automation & Workflows",
    "Education & Training",
    "Personal Productivity",
    "Sales & Lead Generation",
    "Video & Audio Processing",
    "Translation & Language",
  ])

  const filterOptions = [
    "Content Creation",
    "Data Analysis",
    "Image Generation",
    "Code Development",
    "Customer Support",
    "Marketing & Advertising",
    "Research & Documentation",
    "Design & Creative Work",
    "Business Intelligence",
    "Automation & Workflows",
    "Education & Training",
    "Personal Productivity",
    "Sales & Lead Generation",
    "Video & Audio Processing",
    "Translation & Language",
  ]

  const filteredOptions = filterOptions.filter((option) => option.toLowerCase().includes(filterQuery.toLowerCase()))

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = !selectedFilter || review.useCase.toLowerCase().includes(selectedFilter.toLowerCase())

    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch("/api/ai-reviews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error("Fetch error:", response.status, response.statusText)
        throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Raw API response:", data)

      const transformedReviews = data
        .map((review) => ({
          id: review.id,
          toolName: review.name || review["Tool Name"] || "",
          description: review.description || review.Description || "",
          image: review.image || review["Tool Image"] || "/placeholder.svg",
          rating: review.rating || review["Rating (1-5 stars)"] || 0,
          pros:
            typeof review.pros === "string"
              ? review.pros.split(",").map((p) => p.trim())
              : typeof review.Pros === "string"
                ? review.Pros.split(",").map((p) => p.trim())
                : review.pros || review.Pros || [],
          cons:
            typeof review.cons === "string"
              ? review.cons.split(",").map((c) => c.trim())
              : typeof review.Cons === "string"
                ? review.Cons.split(",").map((c) => c.trim())
                : review.cons || review.Cons || [],
          useCase: Array.isArray(review.bestUseCase)
            ? review.bestUseCase.join(", ")
            : Array.isArray(review["Best Use Case"])
              ? review["Best Use Case"].join(", ")
              : review.bestUseCase || review["Best Use Case"] || "",
        }))
        .filter((review) => review.toolName)

      console.log("Transformed reviews:", transformedReviews)
      setReviews(transformedReviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      alert(`Failed to fetch reviews: ${error.message}`)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedImageFile(file)

    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const uploadSelectedImage = async (file) => {
    try {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(", ")}`)
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 10MB`)
      }

      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result.split(",")[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const fileExtension = file.name.split(".").pop() || "jpg"
      const uniqueFileName = `ai-reviews/${timestamp}-${randomString}.${fileExtension}`

      const uploadData = {
        imageData: base64Data,
        bucketName: "nyfai-website-image",
        fileName: "event-image",
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      if (!result.imageUrl) {
        throw new Error("No image URL returned")
      }

      return result.imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    if (!formData.toolName || !formData.description || !formData.pros || !formData.cons || !formData.useCase) {
      alert("Please fill in all required fields")
      return
    }

    if (!editingReview && !selectedImageFile && !formData.image) {
      alert("Please select an image for the tool")
      return
    }

    try {
      setLoading(true)
      let imageUrl = formData.image

      if (selectedImageFile) {
        try {
          setImageUploading(true)
          imageUrl = await uploadSelectedImage(selectedImageFile)
          if (!imageUrl) {
            alert("Failed to upload image. Please try again.")
            return
          }
        } catch (error) {
          console.error("Image upload error:", error)
          alert(`Failed to upload image: ${error.message}`)
          return
        } finally {
          setImageUploading(false)
        }
      }

      if (editingReview) {
        await handleUpdateReview(imageUrl)
      } else {
        await handleCreateReview(imageUrl)
      }

      resetForm()
      setIsDialogOpen(false)

      alert(`Review ${editingReview ? "updated" : "created"} successfully!`)
    } catch (error) {
      console.error("Error saving review:", error)
      alert(`Failed to ${editingReview ? "update" : "create"} review. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setImageUploading(true)
      const imageUrl = await uploadSelectedImage(file)

      setImagePreview(imageUrl)
      setFormData((prev) => ({ ...prev, image: imageUrl }))
    } catch (error) {
      console.error("Error uploading image:", error)
      alert(`Failed to upload image: ${error.message}`)
    } finally {
      setImageUploading(false)
    }
  }

  const resetForm = () => {
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
    setSelectedImageFile(null)
    setEditingReview(null)

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    setFormData({
      toolName: review.toolName,
      description: review.description,
      image: review.image,
      rating: review.rating,
      pros: Array.isArray(review.pros) ? review.pros.join(", ") : review.pros,
      cons: Array.isArray(review.cons) ? review.cons.join(", ") : review.cons,
      useCase: review.useCase,
    })
    setImagePreview(review.image)
    setSelectedImageFile(null)
    setIsDialogOpen(true)
  }

  const handleCreateReview = async (imageUrl) => {
    const reviewData = {
      name: formData.toolName,
      description: formData.description,
      image: imageUrl,
      rating: formData.rating,
      pros: formData.pros,
      cons: formData.cons,
      bestUseCase: formData.useCase
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    }

    const response = await fetch("/api/ai-reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      throw new Error("Failed to create review")
    }

    const result = await response.json()

    const transformedResult = {
      id: result.id,
      toolName: result["Tool Name"] || result.name,
      description: result.Description || result.description || "",
      image: result["Tool Image"] || result.image || "/placeholder.svg",
      rating: result["Rating (1-5 stars)"] || result.rating || 0,
      pros:
        typeof result.Pros === "string"
          ? result.Pros.split(",").map((p) => p.trim())
          : typeof result.pros === "string"
            ? result.pros.split(",").map((p) => p.trim())
            : result.Pros || result.pros || [],
      cons:
        typeof result.cons === "string"
          ? result.cons.split(",").map((c) => c.trim())
          : typeof result.Cons === "string"
            ? result.Cons.split(",").map((c) => c.trim())
            : result.cons || result.Cons || [],
      useCase: Array.isArray(result.bestUseCase)
        ? result.bestUseCase.join(", ")
        : Array.isArray(result["Best Use Case"])
          ? result["Best Use Case"].join(", ")
          : result.bestUseCase || result["Best Use Case"] || "",
    }

    setReviews((prev) => [transformedResult, ...prev])
  }

  const handleUpdateReview = async (imageUrl) => {
    const reviewData = {
      id: editingReview.id,
      name: formData.toolName,
      description: formData.description,
      image: imageUrl,
      rating: formData.rating,
      pros: formData.pros,
      cons: formData.cons,
      bestUseCase: formData.useCase
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    }

    const response = await fetch("/api/ai-reviews", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      throw new Error("Failed to update review")
    }

    const result = await response.json()

    const transformedResult = {
      id: result.id,
      toolName: result.name || result["Tool Name"],
      description: result.description || result.Description || "",
      image: result.image || result["Tool Image"] || "/placeholder.svg",
      rating: result.rating || result["Rating (1-5 stars)"] || 0,
      pros:
        typeof result.pros === "string"
          ? result.pros.split(",").map((p) => p.trim())
          : typeof result.Pros === "string"
            ? result.Pros.split(",").map((p) => p.trim())
            : result.pros || result.Pros || [],
      cons:
        typeof result.cons === "string"
          ? result.cons.split(",").map((c) => c.trim())
          : typeof result.Cons === "string"
            ? result.Cons.split(",").map((c) => c.trim())
            : result.cons || result.Cons || [],
      useCase: Array.isArray(result.bestUseCase)
        ? result.bestUseCase.join(", ")
        : Array.isArray(result["Best Use Case"])
          ? result["Best Use Case"].join(", ")
          : result.bestUseCase || result["Best Use Case"] || "",
    }

    setReviews((prev) => prev.map((review) => (review.id === editingReview.id ? transformedResult : review)))
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return
    }

    try {
      const response = await fetch("/api/ai-reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete review")
      }

      setReviews((prev) => prev.filter((review) => review.id !== id))
      alert("Review deleted successfully!")
    } catch (error) {
      console.error("Error deleting review:", error)
      alert("Failed to delete review. Please try again.")
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const handleDialogClose = (open) => {
    if (!open) {
      resetForm()
    }
    setIsDialogOpen(open)
  }

  const removeSelectedImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview("")
    setSelectedImageFile(null)
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={`Search ${reviews.length} agents...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 text-base border-2 border-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
            />
          </div>

          <div className="relative flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Filter by tag..."
                value={filterQuery}
                onChange={(e) => {
                  setFilterQuery(e.target.value)
                  setIsFilterOpen(true)
                }}
                onFocus={() => setIsFilterOpen(true)}
                className="w-full h-12 text-base border-2 border-[#1a729c] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors pr-10"
              />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a729c] border-2 border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedFilter(option)
                          setFilterQuery(option)
                          setIsFilterOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#010817] rounded transition-colors flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilter === option}
                          readOnly
                          className="w-4 h-4 text-cyan-400 border-gray-300 rounded focus:ring-cyan-400"
                        />
                        {option}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No matching tags found</div>
                  )}
                  {selectedFilter && (
                    <button
                      onClick={() => {
                        setSelectedFilter("")
                        setFilterQuery("")
                        setIsFilterOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors text-red-600 border-t border-gray-200 mt-1 pt-3"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {isFilterOpen && <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />}

        <div className="flex justify-center mb-12">
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a729c] hover:bg-[#1a729c]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add AI Tool Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingReview ? "Edit AI Tool Review" : "Add New AI Tool Review"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="toolName">Tool Name *</Label>
                  <Input
                    id="toolName"
                    value={formData.toolName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, toolName: e.target.value }))}
                    placeholder="e.g., ChatGPT, Midjourney, Claude"
                    required
                    disabled={loading || imageUploading}
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
                    disabled={loading || imageUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Tool Image *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full h-32 object-cover mx-auto rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeSelectedImage}
                          disabled={loading || imageUploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        {selectedImageFile && (
                          <p className="text-xs text-muted-foreground mt-2">
                            New image selected - will be uploaded when you save the review
                          </p>
                        )}
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
                              onChange={handleImageSelect}
                              disabled={loading || imageUploading}
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
                    className="w-full p-2 border border-gray-300 bg-background rounded-md"
                    disabled={loading || imageUploading}
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
                    disabled={loading || imageUploading}
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
                    disabled={loading || imageUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="useCase">Best Use Case *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 border border-gray-300 rounded-md bg-background max-h-48 overflow-y-auto">
                    {useCaseOptions.map((option) => {
                      const isSelected = formData.useCase ? formData.useCase.split(", ").includes(option) : false
                      return (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-600 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const currentSelections = formData.useCase
                                ? formData.useCase.split(", ").filter((item) => item.trim())
                                : []
                              let newSelections

                              if (e.target.checked) {
                                newSelections = [...currentSelections, option]
                              } else {
                                newSelections = currentSelections.filter((item) => item !== option)
                              }

                              setFormData((prev) => ({
                                ...prev,
                                useCase: newSelections.join(", "),
                              }))
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={loading || imageUploading}
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      )
                    })}
                  </div>
                  {formData.useCase && <p className="text-xs text-muted-foreground">Selected: {formData.useCase}</p>}
                </div>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-[#1a729c] hover:bg-[#1a729c]/90"
                  disabled={loading || imageUploading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {imageUploading ? "Uploading image..." : editingReview ? "Updating..." : "Adding..."}
                    </>
                  ) : editingReview ? (
                    "Update Review"
                  ) : (
                    "Add Review"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((review) => (
            <Card
              key={review.id}
              className="relative group hover:shadow-lg transition-all duration-300 bg-card/60 backdrop-blur border border-border/60"
            >
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(review)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(review.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

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

        {filteredReviews.length === 0 && !fetchLoading && (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            {searchQuery || selectedFilter ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedFilter("")
                  }}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">Be the first to add an AI tool review!</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
