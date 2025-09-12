import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Target,
  BarChart3,
  MessageSquare,
  Mail,
  Search,
  ArrowRight,
  Building,
  Mic,
  Briefcase,
  GraduationCap,
  Users,
  BadgeCheck,
} from "lucide-react";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1 text-[#1a729c]" />
            AI Solutions
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Tailored AI Strategies for Your Success
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Facing unique business challenges? Our bespoke AI solutions deliver
            measurable outcomes by aligning cutting-edge AI strategies with your
            specific organizational goals.
          </p>
        </div>

        {/* Solution Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Building,
              title: "Corporate Solutions",
              description:
                "Custom AI-driven strategies and tools to optimize your organization's operations, productivity, and growth.",
              features: [
                "Tailored AI integration",
                "Process automation",
                "Data-driven decision support",
              ],
            },
            {
              icon: Mic,
              title: "Speaking Engagements",
              description:
                "Inspiring keynotes and expert talks on AI trends, ethics, and real-world impact for your events or teams.",
              features: [
                "Keynote presentations",
                "Panel moderation",
                "Industry-specific insights",
              ],
            },
            {
              icon: Briefcase,
              title: "Consulting",
              description:
                "Expert guidance to help you navigate AI adoption, digital transformation, and innovation roadmaps.",
              features: [
                "AI readiness assessment",
                "Strategy workshops",
                "Implementation support",
              ],
            },
            {
              icon: GraduationCap,
              title: "Training Programs",
              description:
                "Hands-on training to upskill your workforce in practical AI tools, techniques, and best practices.",
              features: [
                "Custom curriculum",
                "Interactive workshops",
                "Real-world case studies",
              ],
            },
            {
              icon: Users,
              title: "Cohort Programs",
              description:
                "Collaborative learning experiences for teams or groups to master AI together and drive collective growth.",
              features: [
                "Peer-to-peer learning",
                "Group projects",
                "Mentorship & support",
              ],
            },
            {
              icon: BadgeCheck,
              title: "Certification Programs",
              description:
                "Industry-recognized certifications to validate your AI skills and boost your professional credibility.",
              features: [
                "Accredited curriculum",
                "Practical assessments",
                "Official certification",
              ],
            },
          ].map((solution, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[#1a729c]"
            >
              <CardHeader>
                <solution.icon className="h-10 w-10 text-[#1a729c] mb-2" />
                <CardTitle className="text-xl">{solution.title}</CardTitle>
                <CardDescription>{solution.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {solution.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-center"
                        >
                          <div className="w-1.5 h-1.5 bg-[#1a729c] rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "TechCorp",
                result: "340% ROI Increase",
                description:
                  "Implemented AI-powered email optimization and saw dramatic improvements in engagement.",
                metric: "340%",
                label: "ROI Increase",
              },
              {
                company: "RetailPlus",
                result: "65% Cost Reduction",
                description:
                  "Automated customer service with AI chatbots, reducing support costs significantly.",
                metric: "65%",
                label: "Cost Reduction",
              },
              {
                company: "StartupX",
                result: "5x Lead Generation",
                description:
                  "Used audience intelligence to identify and target high-value prospects effectively.",
                metric: "5x",
                label: "Lead Generation",
              },
            ].map((story, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-[#1a729c] mb-2">
                    {story.metric}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {story.label}
                  </div>
                  <h3 className="font-semibold mb-2">{story.company}</h3>
                  <p className="text-sm text-muted-foreground">
                    {story.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
