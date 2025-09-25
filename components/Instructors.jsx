"use client"

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



export default function Instructors() {
    const [instructors, setInstructors] = useState([])
    const [fetchingInstructors, setFetchingInstructors] = useState(true);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState();
    const [editingInstructor, setEditingInstructor] = useState();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [isAddInstructorOpen, setIsAddInstructorOpen] = useState(false)
    const [newInstructor, setNewInstructor] = useState({
        name: "",
        title: "",
        experience: "",
        avatar: "",
        bio: "",
        profileLink: "",
    })

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        experience: "",
        avatar: "",
        bio: "",
        profileLink: "",
    })

    // Fetch instructors from the backend
    useEffect(() => {
        const fetchInstructors = async () => {
            setFetchingInstructors(true);
            try {
                const res = await fetch("/api/instructors")
                const data = await res.json()
                setInstructors(data)
            } catch (error) {
                console.error("Error fetching instructors:", error)
            } finally {
                setFetchingInstructors(false);
            }
        }

        fetchInstructors()
    }, [])

    // Function to fetch instructors from the API and update state
    const fetchInstructors = async () => {
        try {
            const res = await fetch("/api/instructors");
            const data = await res.json();
            setInstructors(data);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        }
    };

    const handleAddInstructor = async () => {
        if (newInstructor.name && newInstructor.title && newInstructor.bio) {
            setLoading(true);
            try {
                let avatarUrl = newInstructor.avatar;

                // If the user selected a local file (not already a URL), upload it to S3
                if (newInstructor.avatar && newInstructor.avatar.startsWith("data:image")) {
                    const base64String = newInstructor.avatar.split(",")[1];
                    const fileName = `instructor-${Date.now()}.jpg`;
                    const bucketName = "nyfai-website-image";

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
                    avatarUrl = data.imageUrl;
                }

                // Prepare payload
                const payload = {
                    ...newInstructor,
                    avatar: avatarUrl,
                };

                const response = await fetch("/api/instructors", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error("Failed to add instructor");
                }

                // Re-fetch instructors to update the list
                await fetchInstructors();

                // Reset the form
                setNewInstructor({
                    name: "",
                    title: "",
                    experience: "",
                    avatar: "",
                    bio: "",
                    profileLink: "",
                });

                setIsAddInstructorOpen(false);
            } catch (error) {
                console.error("Error adding instructor:", error);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleEditInstructor = async (e) => {
        e.preventDefault();
        if (!editingInstructor) return;

        setLoading(true);

        try {
            let avatarUrl = formData.avatar;

            // If a new local image is selected, upload it first
            if (formData.avatar && formData.avatar.startsWith("data:image")) {
                const base64String = formData.avatar.split(",")[1];
                const fileName = `instructor-${Date.now()}.jpg`;
                const bucketName = "nyfai-website-image";

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageData: base64String, bucketName, fileName }),
                });

                if (!uploadRes.ok) throw new Error("Failed to upload image");

                const data = await uploadRes.json();
                avatarUrl = data.imageUrl;
            }

            // Send PUT request to update instructor
            const payload = { ...formData, id: editingInstructor.id, avatar: avatarUrl };

            const response = await fetch("/api/instructors", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to update instructor");

            const updatedInstructor = await response.json();

            // Update state
            setInstructors(instructors.map((instructor) =>
                (instructor.id === updatedInstructor.id ? updatedInstructor : instructor)
            ));

            // Close dialog
            setIsEditDialogOpen(false);
            setEditingInstructor(null);
            setFormData({
                name: "",
                title: "",
                experience: "",
                avatar: "",
                bio: "",
                profileLink: "",
            });
        } catch (err) {
            console.error("Error updating instructor:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveInstructor = async (index, instructorId) => {
        if (!confirm("Are you sure you want to delete this Instructor? This action cannot be undone.")) {
            return
        }
        setDeleteLoading(instructorId);
        try {
            const response = await fetch("/api/instructors", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: instructorId }),
            })

            if (!response.ok) {
                throw new Error("Failed to delete instructor")
            }

            setInstructors((prevInstructors) => prevInstructors.filter((_, i) => i !== index))
        } catch (error) {
            console.error("Error deleting instructor:", error)
        } finally {
            setDeleteLoading(null);
        }
    }

    // Image upload handler for ADD NEW INSTRUCTOR dialog
    const handleAddInstructorImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setNewInstructor({ ...newInstructor, avatar: e.target?.result })
            }
            reader.readAsDataURL(file)
        }
    }

    // Image upload handler for EDIT INSTRUCTOR dialog
    const handleEditInstructorImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setFormData({ ...formData, avatar: e.target?.result })
            }
            reader.readAsDataURL(file)
        }
    }

    // Remove image for ADD NEW INSTRUCTOR
    const handleAddInstructorImageRemove = () => {
        setNewInstructor({ ...newInstructor, avatar: "" });
        const imageInput = document.getElementById("instructor-image-upload-add");
        if (imageInput) {
            imageInput.value = "";
        }
    };

    // Remove image for EDIT INSTRUCTOR
    const handleEditInstructorImageRemove = () => {
        setFormData({ ...formData, avatar: "" });
        const imageInput = document.getElementById("instructor-image-upload-edit");
        if (imageInput) {
            imageInput.value = "";
        }
    };

    // if (fetchingInstructors) {
    //     return (
    //         <div>
    //             <div className="flex items-center justify-between mb-8">
    //                 <h2 className="text-2xl font-bold">Meet Your Instructors</h2>
    //             </div>
    //             <div className="flex justify-center items-center py-12">
    //                 <div className="text-center">
    //                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a729c] mx-auto mb-4"></div>
    //                     <p className="text-muted-foreground">Loading instructors...</p>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
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
                                        onChange={handleAddInstructorImageUpload}
                                        className="hidden"
                                        id="instructor-image-upload-add"
                                    />
                                    <label
                                        htmlFor="instructor-image-upload-add"
                                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-800"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>Upload Image</span>
                                    </label>
                                    {newInstructor.avatar && (
                                        <div className="relative">
                                            <img
                                                src={newInstructor.avatar || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-16 h-16 object-cover rounded-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddInstructorImageRemove}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                            >
                                                ×
                                            </button>
                                        </div>
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
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddInstructorOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddInstructor}
                                    className="bg-[#1a729c] hover:bg-[#1a729c]/90"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="loader"></span>
                                    ) : (
                                        "Add Instructor"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Instructor</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditInstructor} className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Instructor Name</label>
                            <Input
                                placeholder="Enter instructor name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Title/Position</label>
                            <Input
                                placeholder="e.g., AI & Project Management Expert"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Experience</label>
                            <Input
                                placeholder="e.g., 10+ years experience"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Bio</label>
                            <Textarea
                                placeholder="Enter instructor bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Profile Image (Optional)</label>
                            <div className="flex items-center space-x-4">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditInstructorImageUpload}
                                    className="hidden"
                                    id="instructor-image-upload-edit"
                                />
                                <label
                                    htmlFor="instructor-image-upload-edit"
                                    className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-500"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Image</span>
                                </label>
                                {formData.avatar && (
                                    <div className="relative">
                                        <img
                                            src={formData.avatar}
                                            alt="Preview"
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleEditInstructorImageRemove}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Profile Link (Optional)</label>
                            <Input
                                placeholder="https://linkedin.com/in/username"
                                value={formData.profileLink}
                                onChange={(e) => setFormData({ ...formData, profileLink: e.target.value })}
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
                                className="bg-[#1a729c] hover:bg-[#1a729c]/90"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loader"></span>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid md:grid-cols-3 gap-8">
                {instructors.map((instructor, index) => (
                    <Card key={index} className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 left-2 h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                            onClick={() => {
                                setEditingInstructor(instructor);
                                setFormData({
                                    name: instructor.name,
                                    title: instructor.title,
                                    experience: instructor.experience,
                                    avatar: instructor.avatar,
                                    bio: instructor.bio,
                                    profileLink: instructor.profileLink,
                                });
                                setIsEditDialogOpen(true);
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                            onClick={() => instructor.id && handleRemoveInstructor(index, instructor.id)}
                        >
                            {deleteLoading === instructor.id ? (
                                <span className="loader"></span>
                            ) : (
                                <X className="h-4 w-4" />
                            )}
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
    );
}
