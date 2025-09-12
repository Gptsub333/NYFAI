"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play, Clock, Users, Star, Award, Plus, Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function OnlineCourse() {
  const [courses, setCourses] = useState([
    {
      title: "Artificial Intelligence for Project Managers",
      description: "Learn how AI can optimize your project planning, risk assessment, and stakeholder communication.",
      level: "All Levels",
      duration: "Self-paced",
      students: 5400,
      rating: 4.7,
      progress: 0,
      image: "/ai_automation.jpeg",
      externalLink: "https://www.linkedin.com/learning/artificial-intelligence-for-project-managers-24531458",
    },
    {
      title: "Intelligent Automation for Project Managers",
      description:
        "Understand how to harness automation tools to increase efficiency and streamline project workflows.",
      level: "All Levels",
      duration: "Self-paced",
      students: 4100,
      rating: 4.8,
      progress: 0,
      image: "/intellegent.jpeg",
      externalLink: "https://www.linkedin.com/learning/intelligent-automation-for-project-managers",
    },
  ])

  const [certifications, setCertifications] = useState([
    {
      title: "Certified AI Business Leader",
      description: "Comprehensive certification covering AI tools, strategies, and implementation in marketing.",
      duration: "12 weeks",
      projects: 8,
      badge: "Professional",
      learnMoreUrl: "",
    },
    {
      title: "Advanced Strategic AI Implementation Expert",
      description: "Master-level certification for marketing automation platforms and advanced strategies.",
      duration: "16 weeks",
      projects: 12,
      badge: "Expert",
      learnMoreUrl: "",
    },
  ])

  const [instructors, setInstructors] = useState([
    {
      name: "Oliver Yarbrough, M.S., PMP®",
      title: "AI & Project Management Expert",
      experience: "20+ years leading business transformation & AI adoption",
      avatar: "/oliver_headshot.jpeg",
      bio: "Founder of Not Your Father's A.I., LinkedIn Learning Author, coach and speaker. He helps business leaders bridge AI, project management, and growth strategy.",
      profileLink: "https://www.linkedin.com/in/oliveryarbrough/",
    },
    {
      name: "Marcus Chen",
      title: "Automation Expert",
      experience: "12+ years",
      avatar: "",
      bio: "Built marketing automation systems for Fortune 500 companies and startups alike.",
      profileLink: "",
    },
    {
      name: "Lisa Rodriguez",
      title: "Data Analytics Guru",
      experience: "10+ years",
      avatar: "",
      bio: "Specializes in turning complex data into actionable marketing insights and strategies.",
      profileLink: "",
    },
  ])

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [isAddCertOpen, setIsAddCertOpen] = useState(false)
  const [isAddInstructorOpen, setIsAddInstructorOpen] = useState(false)

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

  const [newCertification, setNewCertification] = useState({
    title: "",
    description: "",
    duration: "",
    projects: 0,
    badge: "Professional",
    learnMoreUrl: "",
  })

  const [newInstructor, setNewInstructor] = useState({
    name: "",
    title: "",
    experience: "",
    avatar: "",
    bio: "",
    profileLink: "",
  })

  const handleAddCourse = () => {
    if (newCourse.title && newCourse.description) {
      setCourses([...courses, { ...newCourse }])
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
      })
      setIsAddCourseOpen(false)
    }
  }

  const handleAddCertification = () => {
    if (newCertification.title && newCertification.description) {
      setCertifications([...certifications, { ...newCertification }])
      setNewCertification({
        title: "",
        description: "",
        duration: "",
        projects: 0,
        badge: "Professional",
        learnMoreUrl: "",
      })
      setIsAddCertOpen(false)
    }
  }

  const handleAddInstructor = () => {
    if (newInstructor.name && newInstructor.title && newInstructor.bio) {
      setInstructors([...instructors, { ...newInstructor }])
      setNewInstructor({
        name: "",
        title: "",
        experience: "",
        avatar: "",
        bio: "",
        profileLink: "",
      })
      setIsAddInstructorOpen(false)
    }
  }

  const handleRemoveInstructor = (index: number) => {
    setInstructors(instructors.filter((_, i) => i !== index))
  }

  const handleRemoveCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewCourse({ ...newCourse, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInstructorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewInstructor({ ...newInstructor, avatar: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Empowering learners through practical AI education
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Master AI with Real-World Impact</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical, comprehensive training tailored to business leaders, project managers, and innovators. Learn
            actionable strategies and frameworks you can implement immediately to drive meaningful results.
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
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </label>
                      {newCourse.image && (
                        <img
                          src={newCourse.image || "/placeholder.svg"}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md"
                        />
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
                    <Button variant="outline" onClick={() => setIsAddCourseOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCourse} className="bg-[#1a729c] hover:bg-[#1a729c]/90">
                      Add Course
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 z-10 bg-white/80 backdrop-blur-sm"
                  onClick={() => handleRemoveCourse(index)}
                >
                  <X className="h-4 w-4" />
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
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Professional Certifications</h2>
            <Dialog open={isAddCertOpen} onOpenChange={setIsAddCertOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1a729c] hover:bg-[#1a729c]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Certification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Professional Certification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Certification Title</label>
                    <Input
                      placeholder="Enter certification title"
                      value={newCertification.title}
                      onChange={(e) => setNewCertification({ ...newCertification, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Enter certification description"
                      value={newCertification.description}
                      onChange={(e) => setNewCertification({ ...newCertification, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Certification Level</label>
                      <Select
                        value={newCertification.badge}
                        onValueChange={(value) => setNewCertification({ ...newCertification, badge: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Program Duration</label>
                      <Input
                        placeholder="e.g., 12 weeks, 6 months"
                        value={newCertification.duration}
                        onChange={(e) => setNewCertification({ ...newCertification, duration: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Projects</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newCertification.projects}
                      onChange={(e) =>
                        setNewCertification({ ...newCertification, projects: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Learn More URL (Optional)</label>
                    <Input
                      placeholder="https://example.com/certification"
                      value={newCertification.learnMoreUrl}
                      onChange={(e) => setNewCertification({ ...newCertification, learnMoreUrl: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddCertOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCertification} className="bg-[#1a729c] hover:bg-[#1a729c]/90">
                      Add Certification
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="border-2 border-[#1a729c]/20 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 z-10"
                  onClick={() => handleRemoveCertification(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-6 w-6 text-[#1a729c]" />
                    <Badge variant="outline">{cert.badge}</Badge>
                  </div>
                  <CardTitle className="">{cert.title}</CardTitle>
                  <CardDescription>{cert.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{cert.duration} program</span>
                    <span>{cert.projects} hands-on projects</span>
                  </div>
                  {cert.learnMoreUrl ? (
                    <a href={cert.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full bg-transparent text-[#1a729c] border-[#1a729c]">
                        Learn More
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" className="w-full bg-transparent text-[#1a729c] border-[#1a729c]">
                      Learn More
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Instructors */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Meet Your Instructors</h2>
            <Dialog open={isAddInstructorOpen} onOpenChange={setIsAddInstructorOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1a729c] hover:bg-[#1a729c]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Instructor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Instructor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Instructor Name</label>
                    <Input
                      placeholder="Enter instructor name"
                      value={newInstructor.name}
                      onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Title/Position</label>
                    <Input
                      placeholder="e.g., AI & Project Management Expert"
                      value={newInstructor.title}
                      onChange={(e) => setNewInstructor({ ...newInstructor, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience</label>
                    <Input
                      placeholder="e.g., 10+ years experience"
                      value={newInstructor.experience}
                      onChange={(e) => setNewInstructor({ ...newInstructor, experience: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <Textarea
                      placeholder="Enter instructor bio"
                      value={newInstructor.bio}
                      onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Profile Image (Optional)</label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleInstructorImageUpload}
                        className="hidden"
                        id="instructor-image-upload"
                      />
                      <label
                        htmlFor="instructor-image-upload"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </label>
                      {newInstructor.avatar && (
                        <img
                          src={newInstructor.avatar || "/placeholder.svg"}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Profile Link (Optional)</label>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      value={newInstructor.profileLink}
                      onChange={(e) => setNewInstructor({ ...newInstructor, profileLink: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddInstructorOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddInstructor} className="bg-[#1a729c] hover:bg-[#1a729c]/90">
                      Add Instructor
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <Card key={index} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  onClick={() => handleRemoveInstructor(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="p-6 text-center">
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar || "/placeholder.svg"}
                      alt={`${instructor.name} avatar`}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border border-[#1a729c]"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-8 w-8 text-[#1a729c]" />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg mb-1">{instructor.name}</h3>
                  <p className="text-[#1a729c] text-sm mb-1">{instructor.title}</p>
                  {instructor.experience && (
                    <p className="text-muted-foreground text-xs mb-3">{instructor.experience} experience</p>
                  )}
                  <p className="text-sm">{instructor.bio}</p>
                  {instructor.profileLink && (
                    <div className="mt-4">
                      <a
                        href={instructor.profileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1a729c] hover:underline text-sm"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
