import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, TrendingUp, Award, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link";
import SuccessStory from "@/components/success-stories";

export default function SponsorPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Award className="w-3 h-3 mr-1" />
            Partnership Opportunities
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Amplify Your Brand's Impact
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Become a valued sponsor and align your brand with a community of
            influential AI practitioners and industry leaders. Together, we can
            accelerate intelligent transformation.
          </p>
        </div>

        {/* Current Sponsors */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Our Trusted Partners
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "TechCorp AI",
                logo: "/placeholder.svg?height=80&width=120",
                tier: "Platinum",
              },
              {
                name: "MarketingPro",
                logo: "/placeholder.svg?height=80&width=120",
                tier: "Gold",
              },
              {
                name: "DataInsights",
                logo: "/placeholder.svg?height=80&width=120",
                tier: "Gold",
              },
              {
                name: "AutomateNow",
                logo: "/placeholder.svg?height=80&width=120",
                tier: "Silver",
              },
            ].map((sponsor, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-24 h-16 bg-gradient-to-br from-[#1a729c]/20 to-purple-100 dark:from-[#1a729c]/20 dark:to-purple-900/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xs font-medium text-[#1a729c]">
                      {sponsor.name}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{sponsor.name}</h3>
                  <Badge
                    className="text-[#1a729c] bg-white"
                    variant={
                      sponsor.tier === "Platinum"
                        ? "default"
                        : sponsor.tier === "Gold"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {sponsor.tier} Partner
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partnership Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Partnership Tiers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                tier: "Silver",
                price: "$2,500/month",
                description:
                  "Perfect for growing companies looking to establish their presence.",
                features: [
                  "Logo placement on website",
                  "Newsletter mentions (2/month)",
                  "Social media shoutouts",
                  "Community directory listing",
                  "Basic analytics reporting",
                ],
                popular: false,
              },
              {
                tier: "Gold",
                price: "$5,000/month",
                description:
                  "Ideal for established companies seeking broader visibility.",
                features: [
                  "Everything in Silver",
                  "Event sponsorship opportunities",
                  "Webinar co-hosting rights",
                  "Content collaboration",
                  "Premium directory placement",
                  "Quarterly performance reports",
                ],
                popular: true,
              },
              {
                tier: "Platinum",
                price: "$10,000/month",
                description:
                  "Maximum exposure for industry leaders and major platforms.",
                features: [
                  "Everything in Gold",
                  "Exclusive conference sponsorship",
                  "Custom content creation",
                  "Speaking opportunities",
                  "VIP networking access",
                  "Dedicated account manager",
                  "Custom integration opportunities",
                ],
                popular: false,
              },
            ].map((tier, index) => (
              <Card
                key={index}
                className={`relative ${tier.popular ? "border-2 border-[#1a729c] shadow-lg" : ""
                  }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1a729c]">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.tier}</CardTitle>
                  <div className="text-3xl font-bold text-[#1a729c]">
                    {tier.price}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${tier.popular ? "" : "variant-outline"
                      } bg-[#1a729c] text-white`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Why Partner With Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "25,000+ Business Leaders",
                description:
                  "Reach our engaged community of AI-focused business professionals and decision-makers",
              },
              {
                icon: TrendingUp,
                title: "300% Growth",
                description: "Our community has grown 300% in the past year",
              },
              {
                icon: Star,
                title: "Premium Audience",
                description: "Decision-makers and influencers in AI marketing",
              },
              {
                icon: Award,
                title: "Industry Recognition",
                description:
                  "Associate your brand with the leading AI marketing platform",
              },
            ].map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <benefit.icon className="h-12 w-12 text-[#1a729c] mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <SuccessStory />
        {/* <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Partner Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                company: "TechCorp AI",
                result: "Transformed Business Operations",
                quote:
                  "Partnering with Not Your Father's A.I. has been transformative for our business. We've seen a 400% increase in qualified leads.",
                author: "Sarah Johnson, CMO",
              },
              {
                company: "MarketingPro",
                result: "Enhanced Brand Leadership",
                quote:
                  "The exposure and credibility we've gained through this partnership has significantly boosted our brand recognition in the AI space.",
                author: "Mike Chen, VP Marketing",
              },
            ].map((story, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-[#1a729c]/10 to-purple-50 dark:from-[#1a729c]/20 dark:to-purple-950/20 border-none"
              >
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-[#1a729c] mb-2">
                    {story.result}
                  </div>
                  <blockquote className="text-sm italic mb-4">
                    "{story.quote}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">
                        {story.company}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {story.author}
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-[#1a729c] to-purple-600 text-white border-none">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-white/65 text-lg mb-8 max-w-2xl mx-auto">
              Join the leading brands that trust us to connect them with the AI
              marketing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://calendly.com/oliveryarbrough" passHref>
                <Button size="lg" variant="secondary" className="group">
                  Schedule Partnership Call
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1a729c] bg-transparent"
              >
                Download Partnership Kit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
