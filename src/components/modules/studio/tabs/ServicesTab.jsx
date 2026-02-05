import { ChevronDown, ChevronUp, Headphones } from "lucide-react";
import { useState } from "react";

export default function ServicesTab({ studio, formatPrice }) {
  const [expandedService, setExpandedService] = useState(null);

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-6">Services & Pricing</h3>

      {studio.services && studio.services.length > 0 ? (
        <div className="space-y-4">
          {studio.services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600 overflow-hidden"
            >
              <div
                className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition"
                onClick={() =>
                  setExpandedService(expandedService === index ? null : index)
                }
              >
                <div className="flex items-center gap-4">
                  <Headphones className="text-yellow-500" size={24} />
                  <div>
                    <div className="text-xl font-bold text-white">
                      {service.service}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      Professional studio service
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-yellow-500">
                    {formatPrice(service.price)}
                  </div>
                  <div className="text-gray-400">
                    {expandedService === index ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </div>
                </div>
              </div>

              {expandedService === index && (
                <div className="p-6 pt-0 border-t border-gray-700">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">
                      Service Includes:
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Professional audio engineer
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        State-of-the-art equipment
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Mixing and mastering available
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Flexible scheduling options
                      </li>
                    </ul>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <button className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition">
                        Book This Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Headphones size={64} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 text-lg">No services listed yet.</p>
        </div>
      )}
    </div>
  );
}
