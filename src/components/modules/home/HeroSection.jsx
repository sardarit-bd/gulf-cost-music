export default function HeroSection() {
  return (
    <section className="relative w-full h-screen bg-cover bg-center pt-16 overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
          Welcome to Gulf Coast Music
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 text-balance">
          Experience the best with stunning venues and powerful performances.
        </p>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded font-bold hover:bg-primary/90 transition text-lg">
          Get Started
        </button>
      </div>
    </section>
  );
}
