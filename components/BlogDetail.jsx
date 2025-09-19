"use client"

import { ArrowLeft, Clock } from "lucide-react"

export default function BlogDetail({ blog, onBack }) {
    if (!blog) return null

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-[#1a729c] text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a729c] to-[#165881]"></div>
                <div className="relative max-w-7xl mx-auto px-4 md:px-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-blue-100 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Articles
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-2 text-blue-100 mb-4">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">3 Min Read</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-blue-100">By</span>
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                        {blog.author
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                </div>
                                <span className="font-medium text-white">{blog.author}</span>
                                <span className="text-blue-100">on {blog.date}</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-black/20 rounded-lg p-8 backdrop-blur-sm">
                                <img
                                    src={blog.image || "/placeholder.svg"}
                                    alt={blog.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                <div className="bg-white rounded-lg shadow-sm border p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">{blog.description}</p>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                AI coding platform Replit{" "}
                                <a href="#" className="text-[#1a729c] hover:underline">
                                    just raised $250 million
                                </a>
                                , tripling its valuation to $3 billion. But the real story isn't just the money. It's the launch of{" "}
                                <a href="#" className="text-[#1a729c] hover:underline">
                                    Agent
                                </a>
                                , a next-generation AI developer that can build, test, and debug
                            </p>

                            <p>
                                applications from simple prompts. This represents a fundamental shift in how we think about software
                                development and the role of AI in creative processes.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">The Evolution of AI Development Tools</h2>

                            <p>
                                Traditional AI coding assistants have been limited to code completion and simple suggestions. Replit's
                                Agent goes far beyond this, offering a comprehensive development environment that can understand complex
                                requirements and implement full-stack solutions.
                            </p>

                            <p>
                                The implications for developers and businesses are significant. Teams can now prototype and deploy
                                applications at unprecedented speed, while maintaining code quality and following best practices.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Key Features and Capabilities</h2>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Full-stack application development from natural language prompts</li>
                                <li>Intelligent debugging and error resolution</li>
                                <li>Automated testing and deployment workflows</li>
                                <li>Integration with popular frameworks and libraries</li>
                                <li>Real-time collaboration and code review capabilities</li>
                            </ul>

                            <p>
                                These features represent a new paradigm in software development, where the barrier between idea and
                                implementation continues to shrink. The technology democratizes app development, making it accessible to
                                a broader range of creators and entrepreneurs.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Impact on the Development Community</h2>

                            <p>
                                The launch of Replit Agent has sparked intense discussion within the developer community. While some see
                                it as a threat to traditional programming roles, others view it as a powerful tool that will augment
                                human creativity and productivity.
                            </p>

                            <p>
                                Early adopters report significant improvements in development speed and the ability to experiment with
                                new ideas without the typical overhead of setting up development environments and boilerplate code.
                            </p>

                            <blockquote className="border-l-4 border-[#1a729c] pl-6 italic text-gray-600 my-8">
                                "This isn't about replacing developers—it's about empowering them to focus on the creative and strategic
                                aspects of building software while AI handles the repetitive tasks."
                            </blockquote>

                            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Looking Forward</h2>

                            <p>
                                As AI development tools continue to evolve, we can expect to see even more sophisticated capabilities
                                emerge. The future of software development will likely involve closer collaboration between human
                                creativity and AI efficiency.
                            </p>

                            <p>
                                For businesses and developers looking to stay competitive, understanding and adopting these new tools
                                will be crucial. The question isn't whether AI will transform software development, but how quickly
                                organizations can adapt to leverage these capabilities.
                            </p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-[#1a729c]/10 text-[#1a729c] px-3 py-1 rounded-full text-sm font-medium">
                                    {blog.type}
                                </span>
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {blog.category}
                                </span>
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {blog.industry}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
