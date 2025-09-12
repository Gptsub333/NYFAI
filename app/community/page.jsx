"use client"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8 flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 mt-6">Our Community</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          This is where professionals, business owners, and executives come together to learn and grow. Inside, you'll
          find honest conversations, practical tips, and a space that encourages progress without pressure. Whether
          you're asking your first question or sharing your latest breakthrough, you're in good company.
        </p>
      </div>
      <div className="w-full h-[calc(100vh-150px)] rounded-xl overflow-hidden shadow-lg border">
        <iframe
          src="https://freefuse.com/my-community/notyourfathersai"
          title="Not Your Father's AI Community"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allowFullScreen
        />
      </div>
    </div>
  )
}
