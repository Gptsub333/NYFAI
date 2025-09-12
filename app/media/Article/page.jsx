"use client"

export default function Articles() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8 flex flex-col items-center">
      <div className="text-center mb-16"></div>
      <div className="w-full h-[calc(100vh-150px)] rounded-xl overflow-hidden shadow-lg border">
        <iframe
          src="https://widgets.sociablekit.com/medium-publication-feed/iframe/25591904"
          title="Not Your Father's AI Community"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}
