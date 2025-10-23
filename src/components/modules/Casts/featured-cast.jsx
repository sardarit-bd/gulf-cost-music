"use client"

import Image from "next/image"

export default function FeaturedCast() {
  return (
    <div className="space-y-9">
      <div>
        <h2 className="text-black text-2xl font-bold mb-2">Cast</h2>
        <p className="text-muted-foreground">
          Tune into engaging podcast episodes featuring your favorite personalities
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden  shadow-lg">
        {/* Background Image */}
        <div className="relative h-[550px] w-full">
          <Image src="/images/postcast.webp" alt="Saint Social Podcast" fill className="object-cover" />
        </div>

        {/* Content Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Uncle Emmington - The Furniture Song | Wave #87</h3>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <span>🌴</span>
              <span>PODCAST</span>
            </div>
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition-colors">
            {/* <Youtube className="w-4 h-4 mr-2" /> */}
            Watch on YouTube
          </button>
        </div>
      </div>
    </div>
  )
}
