import { FileAudio, Headphones, Play, Volume2 } from "lucide-react";

export default function AudioTab({ studio, setShowAudioPlayer }) {
  const audioSamples = studio.audioFile
    ? [
      {
        id: 1,
        title: "Studio Demo Track",
        description: "Professional recording sample",
        file: studio.audioFile.url,
      },
    ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Audio Samples</h3>
        {studio.audioFile && (
          <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
            Audio Available
          </span>
        )}
      </div>

      {audioSamples.length > 0 ? (
        <div className="space-y-4">
          {audioSamples.map((audio) => (
            <div
              key={audio.id}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600/20 rounded-xl">
                    <FileAudio size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {audio.title}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {audio.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAudioPlayer(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Play size={16} />
                  <span>Play Sample</span>
                </button>
              </div>

              {/* Audio Waveform Placeholder */}
              <div className="mt-4 flex items-center gap-1 h-8">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-purple-500/50 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 24 + 8}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Studio Quality Note */}
          <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-yellow-500" />
              <div>
                <p className="text-white text-sm font-medium">Studio Quality</p>
                <p className="text-gray-400 text-xs mt-1">
                  High-quality audio samples recorded in professional studio environment
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl">
          <Headphones size={48} className="mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No audio samples available.</p>
          <p className="text-gray-500 text-sm mt-2">
            Contact the studio to request audio samples
          </p>
        </div>
      )}
    </div>
  );
}