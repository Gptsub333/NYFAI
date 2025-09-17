// "use client"

// import type React from "react"


// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Plus, X } from "lucide-react"

// export default function EpisodesPage() {
//   const [episodes, setEpisodes] = useState([
//     // {
//     //   id: 1,
//     //   title: "That's So AI!",
//     //   episode: "Ep 1",
//     //   link: "https://bit.ly/3vFZkph",
//     //   description: "An introduction to the series where we explore the world of AI and its potential.",
//     // },
//     // {
//     //   id: 2,
//     //   title: "What's So Smart About AI?",
//     //   episode: "Ep 2",
//     //   link: "https://bit.ly/3SaMNmk",
//     //   description: "Understanding the basics of AI and why it's becoming so integral in today's world.",
//     // },
//     // {
//     //   id: 3,
//     //   title: "My A.I. Digital Assistant Is Smarter Than Yours!",
//     //   episode: "Ep 3",
//     //   link: "https://bit.ly/3rcWAwS",
//     //   description: "A deep dive into AI-powered personal assistants and how they're changing the game.",
//     // },
//     // {
//     //   id: 4,
//     //   title: "Ready for Job Training in the Metaverse?",
//     //   episode: "Ep 4",
//     //   link: "https://bit.ly/3WkQCsd",
//     //   description: "Exploring how job training is evolving with AI and the metaverse.",
//     // },
//     // {
//     //   id: 5,
//     //   title: "Leverage AI to Automate Project Workflows",
//     //   episode: "Ep 5",
//     //   link: "https://bit.ly/3TPGB3z",
//     //   description: "See how AI can help automate workflows to save time and reduce errors.",
//     // },
//     // {
//     //   id: 6,
//     //   title: "Does Your PMO Have AI Super Powers?",
//     //   episode: "Ep 6",
//     //   link: "https://bit.ly/3GMFr4x",
//     //   description: "Find out how AI can supercharge your PMO for better project outcomes.",
//     // },
//     // {
//     //   id: 7,
//     //   title: "Supply Chains Love A.I. Too!",
//     //   episode: "Ep 7",
//     //   link: "https://bit.ly/3HWGcZs",
//     //   description: "Learn how AI is revolutionizing supply chains and driving efficiency.",
//     // },
//   ])

//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [formData, setFormData] = useState({
//     title: "",
//     episode: "",
//     link: "",
//     description: "",
//   })

//   useEffect(() => {
//     const fetchEpisodes = async () => {
//       try {
//         const res = await fetch("/api/episodes");
//         const data = await res.json();
//         setEpisodes(data);
//       } catch (error) {
//         console.error("Error fetching episodes:", error);
//       }
//     };

//     fetchEpisodes();
//   }, []);


//   const handleAddEpisode = async (e: any) => {
//     e.preventDefault();
//     if (formData.title && formData.episode && formData.description) {
//       try {
//         const response = await fetch("/api/episodes", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to add episode");
//         }

//         const newEpisode = await response.json();
//         setEpisodes([...episodes, newEpisode]);
//         setFormData({ title: "", episode: "", link: "", description: "" });
//         setIsDialogOpen(false);
//       } catch (error) {
//         console.error("Error adding episode:", error);
//       }
//     }
//   };


//   interface Episode {
//     title: string;
//     episode: string;
//     link: string;
//     description: string;
//     id?: string | number;
//   }

//   interface RemoveEpisodeParams {
//     index: number;
//     episodeId: string | number;
//   }

//   const removeEpisode = async ({ index, episodeId }: RemoveEpisodeParams): Promise<void> => {
//     try {
//       const response = await fetch("/api/episodes", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: episodeId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete episode");
//       }

//       setEpisodes(episodes.filter((_, i) => i !== index));
//     } catch (error) {
//       console.error("Error deleting episode:", error);
//     }
//   };


//   return (
//     <div className="min-h-screen py-20 md:py-33 lg:py-40">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-bold mb-4">AI Series Episodes</h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Welcome to our AI series! Watch the latest episodes where we dive deep into how AI is transforming various
//             industries and processes. Stay tuned for new insights in every episode!
//           </p>
//         </div>

//         <div className="flex justify-center mb-8">
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-[#1a729c] hover:bg-[#145a7a] text-white">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add New Episode
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Add New Episode</DialogTitle>
//                 <DialogDescription>
//                   Create a new episode for the AI series. Fill in all the details below.
//                 </DialogDescription>
//               </DialogHeader>
//               <form onSubmit={handleAddEpisode} className="space-y-4">
//                 <div>
//                   <Label htmlFor="title">Episode Title</Label>
//                   <Input
//                     id="title"
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     placeholder="Enter episode title"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="episode">Episode Number</Label>
//                   <Input
//                     id="episode"
//                     value={formData.episode}
//                     onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
//                     placeholder="e.g., Ep 8"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     placeholder="Enter episode description"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="link">Episode URL (Optional)</Label>
//                   <Input
//                     id="link"
//                     type="url"
//                     value={formData.link}
//                     onChange={(e) => setFormData({ ...formData, link: e.target.value })}
//                     placeholder="https://example.com/episode"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" className="bg-[#1a729c] hover:bg-[#145a7a]">
//                     Add Episode
//                   </Button>
//                 </div>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Episodes List */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {episodes.map((episode, index) => (
//             <Card
//               key={index}
//               className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full border-[#1a729c] relative"
//             >
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
//                 onClick={() => removeEpisode(index, episode.id)} // Pass the episode id here
//               >
//                 <X className="h-4 w-4" />
//               </Button>

//               <CardHeader>
//                 <CardTitle className="text-xl text-[#1a729c] pr-8">{episode.title}</CardTitle>
//                 <p className="text-sm text-muted-foreground">{episode.description}</p>
//               </CardHeader>
//               <CardContent className="mt-auto">
//                 {episode.link ? (
//                   <a href={episode.link} target="_blank" rel="noopener noreferrer" className="w-full">
//                     <Button className="text-[#1a729c] border-[#1a729c] bg-[#1a729c] text-white transition-all w-full">
//                       Watch {episode.episode}
//                     </Button>
//                   </a>
//                 ) : (
//                   <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
//                     {episode.episode} - Coming Soon
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    episode: "",
    link: "",
    description: "",
  })

  // Loading state for fetching data and adding/removing episodes
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/episodes")
        const data = await res.json()
        setEpisodes(data)
      } catch (error) {
        console.error("Error fetching episodes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [])

  const handleAddEpisode = async (e: any) => {
    e.preventDefault()
    if (formData.title && formData.episode && formData.description) {
      setLoading(true)
      try {
        const response = await fetch("/api/episodes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to add episode")
        }

        const newEpisode = await response.json()
        setEpisodes([...episodes, newEpisode])
        setFormData({ title: "", episode: "", link: "", description: "" })
        setIsDialogOpen(false)
      } catch (error) {
        console.error("Error adding episode:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const removeEpisode = async (index: number, episodeId: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/episodes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: episodeId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete episode")
      }

      setEpisodes(episodes.filter((_, i) => i !== index))
    } catch (error) {
      console.error("Error deleting episode:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 md:py-33 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">AI Series Episodes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to our AI series! Watch the latest episodes where we dive deep into how AI is transforming various
            industries and processes. Stay tuned for new insights in every episode!
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a729c] hover:bg-[#145a7a] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Episode
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Episode</DialogTitle>
                <DialogDescription>
                  Create a new episode for the AI series. Fill in all the details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEpisode} className="space-y-4">
                <div>
                  <Label htmlFor="title">Episode Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter episode title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="episode">Episode Number</Label>
                  <Input
                    type="number"
                    id="episode"
                    value={formData.episode}
                    onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
                    placeholder="e.g., 8"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter episode description"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="link">Episode URL (Optional)</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com/episode"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#1a729c] hover:bg-[#145a7a] space-x-4 ">
                    {loading ? <span className="loader"></span> : "Add Episode"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Episodes List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="flex justify-center items-center">Loading Episodes...</div>
          ) : (
            episodes.map((episode, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full border-[#1a729c] relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  onClick={() => removeEpisode(index, episode.id)} // Pass the episode id here
                >
                  <X className="h-4 w-4" />
                </Button>

                <CardHeader>
                  <CardTitle className="text-xl text-[#1a729c] pr-8">{episode.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{episode.description}</p>
                </CardHeader>
                <CardContent className="mt-auto">
                  {episode.link ? (
                    <a href={episode.link} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="text-[#1a729c] border-[#1a729c] bg-[#1a729c] text-white transition-all w-full">
                        Watch {episode.episode}
                      </Button>
                    </a>
                  ) : (
                    <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                      {episode.episode} - Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

