"use client"

import React from "react";
import { useState, useEffect } from "react";
import { Plus, X, Award, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"



export default function Certifications() {
    const [certifications, setCertifications] = useState([])
    const [fetchingCertifications, setFetchingCertifications] = useState(true);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [editingCertification, setEditingCertification] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [newCertification, setNewCertification] = useState({
        title: "",
        description: "",
        duration: "",
        projects: 0,
        badge: "Professional",
        learnMoreUrl: "",
    })

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        projects: 0,
        badge: "Professional",
        learnMoreUrl: "",
    })

    const [isAddCertOpen, setIsAddCertOpen] = useState(false)

    // Fetch certifications from the backend
    useEffect(() => {
        const fetchCertifications = async () => {
            setFetchingCertifications(true);
            try {
                const res = await fetch("/api/certifications")
                const data = await res.json()
                setCertifications(data)
            } catch (error) {
                console.error("Error fetching certifications:", error)
            } finally {
                setFetchingCertifications(false);
            }
        }

        fetchCertifications()
    }, [])

    // Function to fetch certifications from the API and update state
    const fetchCertifications = async () => {
        try {
            const res = await fetch("/api/certifications");
            const data = await res.json();
            setCertifications(data);
        } catch (error) {
            console.error("Error fetching certifications:", error);
        }
    };

    const handleAddCertification = async () => {
        if (newCertification.title && newCertification.description) {
            setLoading(true);
            try {
                const response = await fetch("/api/certifications", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCertification),
                });

                if (!response.ok) {
                    throw new Error("Failed to add certification");
                }

                // Re-fetch certifications to update the list
                await fetchCertifications();

                // Reset the form after adding the certification
                setNewCertification({
                    title: "",
                    description: "",
                    duration: "",
                    projects: 0,
                    badge: "Professional",
                    learnMoreUrl: "",
                });

                // Close the dialog
                setIsAddCertOpen(false);
            } catch (error) {
                console.error("Error adding certification:", error);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleEditCertification = async (e) => {
        e.preventDefault();
        if (!editingCertification) return;

        setLoading(true);

        try {
            // Send PUT request to update certification
            const payload = { ...formData, id: editingCertification.id };

            const response = await fetch("/api/certifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to update certification");

            const updatedCertification = await response.json();

            // Update state
            setCertifications(certifications.map((cert) =>
                (cert.id === updatedCertification.id ? updatedCertification : cert)
            ));

            // Close dialog
            setIsEditDialogOpen(false);
            setEditingCertification(null);
            setFormData({
                title: "",
                description: "",
                duration: "",
                projects: 0,
                badge: "Professional",
                learnMoreUrl: "",
            });
        } catch (err) {
            console.error("Error updating certification:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCertification = async (index, certificationId) => {
        setDeleteLoading(certificationId);
        try {
            const response = await fetch("/api/certifications", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: certificationId }),
            })

            if (!response.ok) {
                throw new Error("Failed to delete certification")
            }

            setCertifications((prevCerts) => prevCerts.filter((_, i) => i !== index))
        } catch (error) {
            console.error("Error deleting certification:", error)
        } finally {
            setDeleteLoading(null);
        }
    }

    // if (fetchingCertifications) {
    //     return (
    //         <div className="mb-16">
    //             <div className="flex items-center justify-between mb-8">
    //                 <h2 className="text-2xl font-bold">Professional Certifications</h2>
    //             </div>
    //             <div className="flex justify-center items-center py-12">
    //                 <div className="text-center">
    //                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a729c] mx-auto mb-4"></div>
    //                     <p className="text-muted-foreground">Loading certifications...</p>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
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
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddCertOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddCertification}
                                    className="bg-[#1a729c] hover:bg-[#1a729c]/90"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="loader"></span>
                                    ) : (
                                        "Add Certification"
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
                        <DialogTitle>Edit Professional Certification</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditCertification} className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Certification Title</label>
                            <Input
                                placeholder="Enter certification title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Textarea
                                placeholder="Enter certification description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Certification Level</label>
                                <Select
                                    value={formData.badge}
                                    onValueChange={(value) => setFormData({ ...formData, badge: value })}
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
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Number of Projects</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.projects}
                                onChange={(e) => setFormData({ ...formData, projects: Number.parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Learn More URL (Optional)</label>
                            <Input
                                placeholder="https://example.com/certification"
                                value={formData.learnMoreUrl}
                                onChange={(e) => setFormData({ ...formData, learnMoreUrl: e.target.value })}
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

            <div className="grid md:grid-cols-2 gap-8">
                {certifications.map((cert, index) => (
                    <Card key={index} className="border-2 border-[#1a729c]/20 relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 left-2 h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                            onClick={() => {
                                setEditingCertification(cert);
                                setFormData({
                                    title: cert.title,
                                    description: cert.description,
                                    duration: cert.duration,
                                    projects: cert.projects,
                                    badge: cert.badge,
                                    learnMoreUrl: cert.learnMoreUrl,
                                });
                                setIsEditDialogOpen(true);
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 z-10"
                            onClick={() => cert.id && handleRemoveCertification(index, cert.id)}
                        >
                            {deleteLoading === cert.id ? (
                                <span className="loader"></span>
                            ) : (
                                <X className="h-4 w-4" />
                            )}
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
    );
}