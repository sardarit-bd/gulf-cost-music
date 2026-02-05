import { FileAudio, Headphones, ListMusic, Music, Play } from "lucide-react";

export default function AudioTab({ studio, setShowAudioPlayer }) {
  // Sample audio data - in real app, this would come from API
  const audioSamples = studio.audioFile
    ? [
        {
          id: 1,
          title: "Studio Demo Track",
          description: "Showcase of recording quality",
          duration: "2:45",
          file: studio.audioFile.url,
        },
        {
          id: 2,
          title: "Mixing Sample",
          description: "Before and after mixing example",
          duration: "3:20",
          file: "/audio/mixing-sample.mp3",
        },
        {
          id: 3,
          title: "Live Session",
          description: "Recorded live band session",
          duration: "4:15",
          file: "/audio/live-session.mp3",
        },
      ]
    : [];

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-6">Audio Samples</h3>

      {audioSamples.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Audio Sample */}
            {studio.audioFile && (
              <div className="md:col-span-2 lg:col-span-3">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-purple-600 rounded-xl">
                        <Music size={32} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">
                          Featured Audio Sample
                        </h4>
                        <p className="text-gray-300">
                          Studio's best work showcasing recording quality
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAudioPlayer(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2 whitespace-nowrap"
                    >
                      <Play size={20} />
                      Play Demo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Audio Samples */}
            {audioSamples.map((audio) => (
              <div
                key={audio.id}
                className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600 hover:border-purple-500/30 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <FileAudio className="text-purple-400" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                    {audio.duration}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition">
                  {audio.title}
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  {audio.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setShowAudioPlayer(true)}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
                  >
                    <Play size={16} />
                    <span className="font-semibold">Play Sample</span>
                  </button>
                  <button className="text-gray-400 hover:text-white transition">
                    <ListMusic size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Audio Equipment Info */}
          <div className="mt-8 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-2xl p-6 border border-gray-600">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Headphones className="text-yellow-500" />
              Recording Equipment Used
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-white font-semibold mb-2">Microphones:</h5>
                <ul className="space-y-1 text-gray-300">
                  <li>• Neumann U87 Ai</li>
                  <li>• Shure SM7B</li>
                  <li>• AKG C414</li>
                </ul>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-2">Software:</h5>
                <ul className="space-y-1 text-gray-300">
                  <li>• Pro Tools HD</li>
                  <li>• Logic Pro X</li>
                  <li>• Ableton Live 11</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Headphones size={64} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 text-lg">No audio samples available.</p>
          <p className="text-gray-500 text-sm mt-2">
            Contact the studio to request audio samples.
          </p>
        </div>
      )}
    </div>
  );
}
