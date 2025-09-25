// "use client";
// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Copy, FileText, Mic, Search, Edit, User, MessageSquare, Plus, X, Brain, Lightbulb, Target, Zap, Rocket, Star } from "lucide-react";

// // Define category-to-icon mapping object
// const categoryIcons = {
//   Writing: User,
//   Editing: Edit,
//   Research: Search,
//   Communication: Mic,
//   Analysis: Brain,
//   Creative: Star,
// };

// const fetchPrompts = async () => {
//   const response = await fetch("/api/prompts"); // Replace with your actual Airtable API endpoint
//   if (!response.ok) {
//     throw new Error("Failed to fetch prompts");
//   }
//   return await response.json();
// };

// export default function PromptLibraryPage() {
//   const [prompts, setPrompts] = useState([]);
//   const [selectedPrompt, setSelectedPrompt] = useState(null);
//   const [copiedId, setCopiedId] = useState(null);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [newPrompt, setNewPrompt] = useState({
//     title: "",
//     description: "",
//     content: "",
//     category: "",
//     difficulty: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [isAddingPrompt, setIsAddingPrompt] = useState(false);
//   const [isRemovingPrompt, setIsRemovingPrompt] = useState(false);




//   // Fetch prompts when the component mounts
//   useEffect(() => {
//     const getPrompts = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchPrompts();
//         // Assign the icon based on the category
//         const promptsWithIcons = data.map((prompt) => ({
//           ...prompt,
//           icon: categoryIcons[prompt.category] || FileText, // Default to FileText if no match
//         }));
//         setPrompts(promptsWithIcons);
//       } catch (error) {
//         console.error("Error fetching prompts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getPrompts();
//   }, []);

//   // Add new prompt with assigned icon
//   const addNewPrompt = async () => {
//     setIsAddingPrompt(true); // Show loader
//     const response = await fetch("/api/prompts", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         title: newPrompt.title,
//         description: newPrompt.description,
//         content: newPrompt.content,
//         category: newPrompt.category,
//         difficulty: newPrompt.difficulty,
//       }),
//     });
//     setIsAddingPrompt(false);
//     setIsAddDialogOpen(false)

//     if (!response.ok) {
//       throw new Error("Failed to add prompt");
//     }
//     await fetchPrompts();

//     const newPromptData = await response.json();

//     // Assign the icon based on the category from the backend response
//     const icon = categoryIcons[newPromptData.category] || FileText; // Default to FileText if no match

//     // Add the new prompt to the state with the icon
//     setPrompts([...prompts, { ...newPromptData, icon }]);

//     // Reset the new prompt state
//     setNewPrompt({
//       title: "",
//       description: "",
//       content: "",
//       category: "",
//       difficulty: "",
//     });
//     fetchPrompts()
//   };


//   // Remove a prompt
//   const removePrompt = async (id) => {
//     // Start the loader for removing the prompt
//     setIsRemovingPrompt(true);

//     try {
//       const response = await fetch("/api/prompts", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete prompt");
//       }

//       // Refresh the page after successful deletion
//       window.location.reload(); // Refreshes the entire page

//     } catch (error) {
//       console.error("Error removing prompt:", error);
//     } finally {
//       setIsRemovingPrompt(false); // Hide the loader after the action is done
//     }
//   };

//   const handleEditEvent = (event) => {
//     // Implement edit functionality here
//     console.log("Edit event:", event);
//   }

//   // Copy prompt content to clipboard
//   const copyToClipboard = async (text, id) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedId(id);
//       setTimeout(() => setCopiedId(null), 2000);
//     } catch (err) {
//       console.error("Failed to copy text:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background py-16">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <Badge variant="secondary" className="mb-4">
//             <FileText className="w-3 h-3 mr-1" />
//             AI Prompt Library
//           </Badge>
//           <h1 className="text-4xl font-bold mb-4">Professional AI Prompts</h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Curated collection of powerful prompts for writing, editing, research, and communication. Each prompt is
//             designed to help you work more effectively with AI tools.
//           </p>
//         </div>

//         {/* Add New Prompt Button */}
//         <div className="flex justify-center mb-8">
//           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add New Prompt
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>Add New AI Prompt</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="title">Title</Label>
//                   <Input
//                     id="title"
//                     value={newPrompt.title}
//                     onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
//                     placeholder="Enter prompt title"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     value={newPrompt.description}
//                     onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
//                     placeholder="Brief description of what this prompt does"
//                     rows={3}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="content">Prompt Content</Label>
//                   <Textarea
//                     id="content"
//                     value={newPrompt.content}
//                     onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
//                     placeholder="Enter the full prompt text"
//                     rows={6}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="category">Category</Label>
//                     <Select
//                       value={newPrompt.category}
//                       onValueChange={(value) => setNewPrompt({ ...newPrompt, category: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Writing">Writing</SelectItem>
//                         <SelectItem value="Editing">Editing</SelectItem>
//                         <SelectItem value="Research">Research</SelectItem>
//                         <SelectItem value="Communication">Communication</SelectItem>
//                         <SelectItem value="Analysis">Analysis</SelectItem>
//                         <SelectItem value="Creative">Creative</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="difficulty">Difficulty Level</Label>
//                     <Select
//                       value={newPrompt.difficulty}
//                       onValueChange={(value) => setNewPrompt({ ...newPrompt, difficulty: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select difficulty" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Beginner">Beginner</SelectItem>
//                         <SelectItem value="Intermediate">Intermediate</SelectItem>
//                         <SelectItem value="Advanced">Advanced</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 pt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => setIsAddDialogOpen(false)}
//                     disabled={isAddingPrompt}
//                   >
//                     {isAddingPrompt ? (
//                       <span className="loader"></span> // You can use any loader component here
//                     ) : (
//                       "Cancel"
//                     )}
//                   </Button>
//                   <Button onClick={addNewPrompt} disabled={isAddingPrompt}>
//                     {isAddingPrompt ? (
//                       <span className="loader"></span> // Use your custom loader component
//                     ) : (
//                       "Add Prompt"
//                     )}
//                   </Button>

//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Prompts Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//           {loading ? (
//             <div>Loading...</div> // You can replace this with a loader component
//           ) : (
//             prompts.map((prompt) => (
//               <Card
//                 key={prompt.id}
//                 className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col relative group"
//                 onClick={() => setSelectedPrompt(prompt)}
//               >
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-6 w-6 p-0"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     removePrompt(prompt.id);
//                   }}
//                   disabled={isRemovingPrompt}
//                 >
//                   {isRemovingPrompt ? (
//                     <span className="pr-2 flex items-center">
//                       <svg
//                         className="animate-spin h-4 w-4 text-blue-500"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                       >
//                         <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                         <path
//                           d="M4 12a8 8 0 1 0 8-8"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                           fill="none"
//                         />
//                       </svg>

//                     </span>
//                     // Custom loader component
//                   ) : (
//                     <X className="h-3 w-3" />
//                   )}
//                 </Button>

//                 <CardHeader className="flex-1">
//                   <div className="flex items-center justify-between mb-3">
//                     {/* Dynamically render the icon based on category */}
//                     {React.createElement(prompt.icon, { className: "h-8 w-8 text-[#1a729c]" })}
//                     <Badge variant="outline" className="text-xs">
//                       {prompt.difficulty}
//                     </Badge>
//                   </div>
//                   <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
//                   <p className="text-sm text-muted-foreground flex-1">{prompt.description}</p>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   <div className="flex items-center justify-between w-full">
//                     <div className="flex items-center">
//                       <Badge variant="secondary" className="text-xs">
//                         {prompt.category}
//                       </Badge>
//                     </div>

//                     <div className="flex items-center ml-2 space-x-2">
//                       <Button
//                         className="p-2 bg-transparent hover:bg-gray-600"
//                         onClick={() => handleEditEvent(prompt)}
//                       >
//                         <Edit className="h-3 w-3  " stroke="white" />
//                       </Button>

//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           copyToClipboard(prompt.content, prompt.id);
//                         }}
//                         className="flex items-center space-x-1 p-1.5"
//                       >
//                         <Copy className="h-4 w-4" />
//                         <span>{copiedId === prompt.id ? "Copied!" : "Copy"}</span>
//                       </Button>
//                     </div>
//                   </div>

//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>

//         {/* Selected Prompt Modal */}
//         {selectedPrompt && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-background rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <selectedPrompt.icon className="h-8 w-8 text-primary" />
//                     <div>
//                       <h2 className="text-2xl font-bold">{selectedPrompt.title}</h2>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge variant="secondary">{selectedPrompt.category}</Badge>
//                         <Badge variant="outline">{selectedPrompt.difficulty}</Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <Button variant="ghost" size="sm" onClick={() => setSelectedPrompt(null)}>
//                     ✕
//                   </Button>
//                 </div>

//                 <div className="bg-muted/50 rounded-lg p-4 mb-4">
//                   <p className="text-sm text-muted-foreground mb-2">Description:</p>
//                   <p className="text-sm">{selectedPrompt.description}</p>
//                 </div>

//                 <div className="bg-muted/50 rounded-lg p-4 mb-4">
//                   <p className="text-sm text-muted-foreground mb-2">Prompt:</p>
//                   <pre className="text-sm whitespace-pre-wrap font-mono bg-background p-3 rounded border">
//                     {selectedPrompt.content}
//                   </pre>
//                 </div>

//                 <div className="flex justify-end gap-2">
//                   <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
//                     Close
//                   </Button>
//                   <Button onClick={() => copyToClipboard(selectedPrompt.content, selectedPrompt.id)}>
//                     <Copy className="h-4 w-4 mr-1" />
//                     {copiedId === selectedPrompt.id ? "Copied!" : "Copy Prompt"}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, FileText, Mic, Search, Edit, User, MessageSquare, Plus, X, Brain, Lightbulb, Target, Zap, Rocket, Star } from "lucide-react";

// Define category-to-icon mapping object
const categoryIcons = {
  Writing: User,
  Editing: Edit,
  Research: Search,
  Communication: Mic,
  Analysis: Brain,
  Creative: Star,
};

const fetchPrompts = async () => {
  const response = await fetch("/api/prompts");
  if (!response.ok) {
    throw new Error("Failed to fetch prompts");
  }
  return await response.json();
};

export default function PromptLibraryPage() {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null); // For editing
  const [copiedId, setCopiedId] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    difficulty: "",
  });
  const [loading, setLoading] = useState(true);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [isRemovingPrompt, setIsRemovingPrompt] = useState(false);
  const [fetchingPrmompts, setFetchingPrmompts] = useState(true); // State for fetching prompts

  // Fetch prompts when the component mounts
  useEffect(() => {
    const getPrompts = async () => {
      setLoading(true);
      setFetchingPrmompts(true);
      try {
        const data = await fetchPrompts();
        const promptsWithIcons = data.map((prompt) => ({
          ...prompt,
          icon: categoryIcons[prompt.category] || FileText,
        }));
        setPrompts(promptsWithIcons);
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setLoading(false);
        setFetchingPrmompts(false);
      }
    };
    getPrompts();
  }, []);

  // Add new prompt with assigned icon
  const addNewPrompt = async () => {
    setIsAddingPrompt(true); // Show loader
    const response = await fetch("/api/prompts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newPrompt.title,
        description: newPrompt.description,
        content: newPrompt.content,
        category: newPrompt.category,
        difficulty: newPrompt.difficulty,
      }),
    });
    setIsAddingPrompt(false);
    setIsAddDialogOpen(false);

    if (!response.ok) {
      throw new Error("Failed to add prompt");
    }

    const newPromptData = await response.json();
    const icon = categoryIcons[newPromptData.category] || FileText;
    setPrompts([...prompts, { ...newPromptData, icon }]);

    setNewPrompt({
      title: "",
      description: "",
      content: "",
      category: "",
      difficulty: "",
    });
  };


  const editPrompt = async () => {
    // Ensure the prompt has an id
    if (!selectedPrompt?.id) {
      console.error("Prompt ID is missing");
      return;
    }
    try {
      setLoading(true);
      // Send the updated prompt to the API
      const response = await fetch(`/api/prompts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedPrompt.id,
          title: selectedPrompt.title,
          description: selectedPrompt.description,
          content: selectedPrompt.content,
          category: selectedPrompt.category,
          difficulty: selectedPrompt.difficulty,
        }),
      });

      // Handle unsuccessful response
      if (!response.ok) {
        throw new Error("Failed to update prompt");
      }

      // Get the updated prompt data from the response
      const updatedPrompt = await response.json();

      // Update the state to reflect the changes
      setPrompts(prompts.map((prompt) => (prompt.id === updatedPrompt.id ? updatedPrompt : prompt)));

      // Close the edit dialog
      setIsEditDialogOpen(false);

      // Reset the selected prompt
      setSelectedPrompt(null);
    } catch (error) {
      console.error("Error updating prompt:", error);
    } finally {
      setLoading(false);
      window.location.reload(); // Refresh the page to reflect changes
    }
  };

  if (fetchingPrmompts) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Professional Prompts</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a729c] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Prompts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Remove a prompt
  const removePrompt = async (id) => {
    if (!confirm("Are you sure you want to delete this Prompt? This action cannot be undone.")) {
      return
    }
    setIsRemovingPrompt(true);

    try {
      const response = await fetch("/api/prompts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete prompt");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error removing prompt:", error);
    } finally {
      setIsRemovingPrompt(false);
    }
  };

  const handleEditEvent = (prompt) => {
    setSelectedPrompt(prompt);
    setIsEditDialogOpen(true);
  };

  // Copy prompt content to clipboard
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <FileText className="w-3 h-3 mr-1" />
            AI Prompt Library
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Professional AI Prompts</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated collection of powerful prompts for writing, editing, research, and communication. Each prompt is
            designed to help you work more effectively with AI tools.
          </p>
        </div>

        {/* Add New Prompt Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New AI Prompt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPrompt.title}
                    onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                    placeholder="Enter prompt title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPrompt.description}
                    onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                    placeholder="Brief description of what this prompt does"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Prompt Content</Label>
                  <Textarea
                    id="content"
                    value={newPrompt.content}
                    onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                    placeholder="Enter the full prompt text"
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newPrompt.category}
                      onValueChange={(value) => setNewPrompt({ ...newPrompt, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Writing">Writing</SelectItem>
                        <SelectItem value="Editing">Editing</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Communication">Communication</SelectItem>
                        <SelectItem value="Analysis">Analysis</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={newPrompt.difficulty}
                      onValueChange={(value) => setNewPrompt({ ...newPrompt, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isAddingPrompt}
                  >
                    {isAddingPrompt ? (
                      <span className="loader"></span> // You can use any loader component here
                    ) : (
                      "Cancel"
                    )}
                  </Button>
                  <Button onClick={addNewPrompt} disabled={isAddingPrompt}>
                    {isAddingPrompt ? (
                      <span className="loader"></span> // Use your custom loader component
                    ) : (
                      "Add Prompt"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Prompt Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit AI Prompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={selectedPrompt?.title || ""}
                  onChange={(e) => setSelectedPrompt({ ...selectedPrompt, title: e.target.value })}
                  placeholder="Enter prompt title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={selectedPrompt?.description || ""}
                  onChange={(e) => setSelectedPrompt({ ...selectedPrompt, description: e.target.value })}
                  placeholder="Brief description of what this prompt does"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="content">Prompt Content</Label>
                <Textarea
                  id="content"
                  value={selectedPrompt?.content || ""}
                  onChange={(e) => setSelectedPrompt({ ...selectedPrompt, content: e.target.value })}
                  placeholder="Enter the full prompt text"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedPrompt?.category || ""}
                    onValueChange={(value) => setSelectedPrompt({ ...selectedPrompt, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Writing">Writing</SelectItem>
                      <SelectItem value="Editing">Editing</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Communication">Communication</SelectItem>
                      <SelectItem value="Analysis">Analysis</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={selectedPrompt?.difficulty || ""}
                    onValueChange={(value) => setSelectedPrompt({ ...selectedPrompt, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={loading}  // Disable button when loading
                >

                  Cancel

                </Button>
                <Button
                  onClick={editPrompt}
                  disabled={loading}  // Disable button when loading
                >
                  {loading ? (
                    <span className="loader"></span> // Replace with your loader component or spinner
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>

            </div>
          </DialogContent>
        </Dialog>

        {/* Prompts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <div>Loading...</div>
          ) : (
            prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col relative group"
                onClick={() => setSelectedPrompt(prompt)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePrompt(prompt.id);
                  }}
                  disabled={isRemovingPrompt}
                >
                  {isRemovingPrompt ? (
                    <span className="pr-2 flex items-center">
                      <svg
                        className="animate-spin h-4 w-4 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path
                          d="M4 12a8 8 0 1 0 8-8"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                      </svg>
                    </span>
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </Button>

                <CardHeader className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    {React.createElement(prompt.icon, { className: "h-8 w-8 text-[#1a729c]" })}
                    <Badge variant="outline" className="text-xs">
                      {prompt.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
                  <p className="text-sm text-muted-foreground flex-1">{prompt.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="text-xs">
                        {prompt.category}
                      </Badge>
                    </div>

                    <div className="flex items-center ml-2 space-x-2">
                      <Button
                        className="p-2 bg-transparent hover:bg-gray-600"
                        onClick={() => handleEditEvent(prompt)} // Open edit dialog
                      >
                        <Edit className="h-3 w-3  " stroke="white" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(prompt.content, prompt.id);
                        }}
                        className="flex items-center space-x-1 p-1.5"
                      >
                        <Copy className="h-4 w-4" />
                        <span>{copiedId === prompt.id ? "Copied!" : "Copy"}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Selected Prompt Modal */}
        {selectedPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <selectedPrompt.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPrompt.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{selectedPrompt.category}</Badge>
                        <Badge variant="outline">{selectedPrompt.difficulty}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPrompt(null)}>
                    ✕
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Description:</p>
                  <p className="text-sm">{selectedPrompt.description}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Prompt:</p>
                  <pre className="text-sm whitespace-pre-wrap font-mono bg-background p-3 rounded border">
                    {selectedPrompt.content}
                  </pre>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
                    Close
                  </Button>
                  <Button onClick={() => copyToClipboard(selectedPrompt.content, selectedPrompt.id)}>
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedId === selectedPrompt.id ? "Copied!" : "Copy Prompt"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
