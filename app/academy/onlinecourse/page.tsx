"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play, Clock, Users, Star, Award, Plus, Upload, X, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Certifications from "@/components/certifications"
import Instructors from "@/components/Instructors"
import Loader from "@/components/Loader"

type Course = {
  id?: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  progress: number;
  image: string;
  externalLink: string;
};
export default function OnlineCourse() {
  const [courses, setCourses] = useState<Course[]>([
    // {
    //   title: "Artificial Intelligence for Project Managers",
    //   description: "Learn how AI can optimize your project planning, risk assessment, and stakeholder communication.",
    //   level: "All Levels",
    //   duration: "Self-paced",
    //   students: 5400,
    //   rating: 4.7,
    //   progress: 0,
    //   image: "/ai_automation.jpeg",
    //   externalLink: "https://www.linkedin.com/learning/artificial-intelligence-for-project-managers-24531458",
    // },
    // {
    //   title: "Intelligent Automation for Project Managers",
    //   description:
    //     "Understand how to harness automation tools to increase efficiency and streamline project workflows.",
    //   level: "All Levels",
    //   duration: "Self-paced",
    //   students: 4100,
    //   rating: 4.8,
    //   progress: 0,
    //   image: "/intellegent.jpeg",
    //   externalLink: "https://www.linkedin.com/learning/intelligent-automation-for-project-managers",
    // },
  ])
  const [fetchingCourses, setFetchingCourses] = useState(true);  // Loading state for fetching courses

  const [loading, setLoading] = useState(false);  // Loading state for add course operation

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null); // course being edited
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);  // controls the edit dialog visibility
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "All Levels",
    duration: "",
    students: 0,
    rating: 5.0,
    progress: 0,
    image: "",
    externalLink: "",
  })


  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    level: "All Levels",
    duration: "",
    students: 0,
    rating: 5.0,
    progress: 0,
    image: "",
    externalLink: "",
  })

  // Fetch courses from the backend (API route)
  useEffect(() => {
    const fetchCourses = async () => {
      setFetchingCourses(true);
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setFetchingCourses(false);  // Set loading state to false after the operation ends
      }
    }

    fetchCourses()
  }, [])

  const handleAddCourse = async () => {
    if (newCourse.title && newCourse.description) {
      setLoading(true);
      try {
        let imageUrl = newCourse.image; // Use existing image if already URL

        // If the user selected a local file (not already a URL), upload it to S3
        if (newCourse.image && newCourse.image.startsWith("data:image")) {
          const base64String = newCourse.image.split(",")[1]; // Remove base64 prefix
          const fileName = `course-${Date.now()}.jpg`; // Generate a unique file name
          const bucketName = "nyfai-website-image"; // Your S3 bucket name

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageData: base64String,
              bucketName,
              fileName,
            }),
          });

          if (!uploadRes.ok) throw new Error("Failed to upload image");

          const data = await uploadRes.json();
          imageUrl = data.imageUrl; // Use the uploaded S3 URL
        }

        // Prepare payload for course API
        const payload = {
          ...newCourse,
          image: imageUrl, // Ensure this is the S3 URL
        };

        // Send the course data along with the image URL to the /api/courses API
        const response = await fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to add course");
        }

        const newCourseData = await response.json();

        // After successfully adding a course, re-fetch the courses
        await fetchCourses(); // Re-fetch courses to update the list

        // Reset the form after adding the course
        setNewCourse({
          title: "",
          description: "",
          level: "All Levels",
          duration: "",
          students: 0,
          rating: 5.0,
          progress: 0,
          image: "",
          externalLink: "",
        });

        // Close the dialog
        setIsAddCourseOpen(false);
      } catch (error) {
        console.error("Error adding course:", error);
      } finally {
        setLoading(false); // Set loading to false after the operation ends
      }
    }
  };

  const handleEditCourse = async (e: any) => {
    e.preventDefault();
    if (!editingCourse) return;

    setLoading(true);

    try {
      let imageUrl = formData.image;

      // If a new local image is selected, upload it first
      if (formData.image && formData.image.startsWith("data:image")) {
        const base64String = formData.image.split(",")[1];
        const fileName = `course-${Date.now()}.jpg`;
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

      // Send PUT request to update course
      const payload = { ...formData, id: editingCourse.id, image: imageUrl };

      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update course");

      const updatedCourse = await response.json();

      // Update state
      setCourses(courses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course)));

      // Close dialog
      setIsEditDialogOpen(false);
      setEditingCourse(null);
      setFormData({ title: "", description: "", level: "All Levels", duration: "", students: 0, rating: 5.0, progress: 0, image: "", externalLink: "" });
    } catch (err) {
      console.error("Error updating course:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch courses from the API and update state
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);  // Set the courses state with the new fetched data
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleRemoveCourse = async (index: number, courseId: string) => {
    setDeleteLoading(true);
    try {
      const response = await fetch("/api/courses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete course")
      }

      setCourses((prevCourses) => prevCourses.filter((_, i) => i !== index))
    } catch (error) {
      console.error("Error deleting course:", error)
    } finally {
      setDeleteLoading(false);  // Set loading to false after the operation ends
    }
  }

  const handleImageRemove = () => {
    // Clear the image from the state
    setFormData({ ...formData, image: "" });

    // Manually reset the input value
    const imageInput = document.getElementById("image-upload-edit") as HTMLInputElement;
    if (imageInput) {
      imageInput.value = ""; // Clear the file input field
    }
  };

  // Image upload handler for ADD NEW COURSE dialog
  const handleAddCourseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewCourse({ ...newCourse, image: e.target?.result as string }); // Store the base64 image in newCourse state
      };
      reader.readAsDataURL(file);
    }
  };

  // Image upload handler for EDIT COURSE dialog
  const handleEditCourseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string }); // Store the base64 image in formData state
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image for ADD NEW COURSE
  const handleAddCourseImageRemove = () => {
    setNewCourse({ ...newCourse, image: "" });
    const imageInput = document.getElementById("image-upload-add") as HTMLInputElement;
    if (imageInput) {
      imageInput.value = "";
    }
  };

  if (fetchingCourses) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Professional courses</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a729c] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 lg:py-30 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Empowering learners through practical AI education
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Master AI with Real-World Impact</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical, comprehensive training tailored to business leaders, project managers, and innovators. Learn actionable strategies and frameworks you can implement immediately to drive meaningful results.
          </p>
        </div>

        {/* Learning Paths */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Professional Learning Paths</h2>
            <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1a729c] hover:bg-[#1a729c]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Professional Learning Path</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Course Title</label>
                    <Input
                      placeholder="Enter course title"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Enter course description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Level</label>
                      <Select
                        value={newCourse.level}
                        onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="All Levels">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration</label>
                      <Input
                        placeholder="e.g., Self-paced, 4 weeks"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Number of Students</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={newCourse.students}
                        onChange={(e) => setNewCourse({ ...newCourse, students: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Rating (1-5)</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        placeholder="5.0"
                        value={newCourse.rating}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, rating: Number.parseFloat(e.target.value) || 5.0 })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Course Image</label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAddCourseImageUpload}
                        className="hidden bg-gray-600 text-white"
                        id="image-upload-add"
                      />
                      <label
                        htmlFor="image-upload-add"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </label>
                      {newCourse.image && (
                        <div className="relative">
                          <img
                            src={newCourse.image || "/placeholder.svg"}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={handleAddCourseImageRemove}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">External Link (Optional)</label>
                    <Input
                      placeholder="https://example.com/course"
                      value={newCourse.externalLink}
                      onChange={(e) => setNewCourse({ ...newCourse, externalLink: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddCourseOpen(false)}
                      disabled={loading}  // Disable the button when loading
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddCourse}
                      className="bg-[#1a729c] hover:bg-[#1a729c]/90"
                      disabled={loading}  // Disable the button when loading
                    >
                      {loading ? (
                        <span className="loader"></span>  // Show loader when loading is true
                      ) : (
                        "Add Course"
                      )}
                    </Button>

                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-center mb-8">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Course</DialogTitle>
                  {/* <DialogDescription>Edit the course details below.</DialogDescription> */}
                </DialogHeader>
                <form onSubmit={handleEditCourse} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Course Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter course title"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter course description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Level</label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => setFormData({ ...formData, level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="All Levels">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration</label>
                      <Input
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 4 weeks"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Number of Students</label>
                      <Input
                        type="number"
                        value={formData.students}
                        onChange={(e) => setFormData({ ...formData, students: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Rating (1-5)</label>
                      <Input
                        type="number"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                        step="0.1"
                        min="1"
                        max="5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Course Image</label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleEditCourseImageUpload}
                        className="hidden"
                        id="image-upload-edit"
                      />
                      <label
                        htmlFor="image-upload-edit"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-500"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </label>

                      {formData.image && (
                        <div className="relative">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={handleImageRemove}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">External Link (Optional)</label>
                    <Input
                      value={formData.externalLink}
                      onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#1a729c] hover:bg-[#145a7a] space-x-4"
                      disabled={loading}
                    >
                      {loading ? <span className="loader"></span> : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {/* Display Courses */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fetchingCourses ? (
              // <div className="flex justify-center items-center w-full h-full">
              //   {/* <span className="loader">Loading</span>  Loader when fetching data */}
              // </div>
              <Loader />
            ) : (
              courses.map((course, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full relative"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 left-2 h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                    onClick={() => {
                      setEditingCourse(course);  // Set the course being edited
                      setFormData({             // Pre-fill the form with the course data
                        title: course.title,
                        description: course.description,
                        level: course.level,
                        duration: course.duration,
                        students: course.students,
                        rating: course.rating,
                        progress: course.progress,
                        image: course.image,
                        externalLink: course.externalLink,
                      });
                      setIsEditDialogOpen(true); // Open the dialog
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 z-10 bg-white/80 backdrop-blur-sm"
                    onClick={() => course.id && handleRemoveCourse(index, course.id)} // Only call if id is defined
                  >
                    {deleteLoading ? (<span className="loader"></span>) : (<X className="h-4 w-4" />)}

                  </Button>
                  {course.image ? (
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <Play className="h-12 w-12 text-[#1a729c]" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          course.level === "Beginner"
                            ? "secondary"
                            : course.level === "Intermediate"
                              ? "default"
                              : course.level === "Advanced"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {course.level}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-[#1a729c]">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-[#1a729c]" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-[#1a729c]" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>

                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    {course.externalLink ? (
                      <a href={course.externalLink} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-[#1a729c] transition-all">View Course</Button>
                      </a>
                    ) : (
                      <Button className="w-full text-[#1a729c] border-[#1a729c] hover:bg-[#1a729c] hover:text-white transition-all">
                        {course.progress > 0 ? "Continue Learning" : "View Course"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Certifications */}
        <Certifications />

        {/* Instructors */}
        <Instructors />
      </div>
    </div>
  )
}