"use client"

export default function LiveTraining() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full h-[calc(100vh-150px)] rounded-xl overflow-hidden shadow-lg border">
        <iframe
          src="https://freefuse.com/community/664726ee158e2236b50d661f"
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
