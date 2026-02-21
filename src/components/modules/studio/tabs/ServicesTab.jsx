import { CheckCircle, Clock, Headphones, Mic, Music, Sliders } from "lucide-react";
import { useState } from "react";

export default function ServicesTab({ studio, formatPrice }) {
  const [selectedService, setSelectedService] = useState(null);

  // Service icons mapping
  const getServiceIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "recording": return <Mic className="text-blue-400" size={20} />;
      case "mixing": return <Sliders className="text-purple-400" size={20} />;
      case "mastering": return <Music className="text-green-400" size={20} />;
      default: return <Headphones className="text-yellow-400" size={20} />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Services & Pricing</h3>
        <span className="text-sm text-gray-400">
          {studio.services?.length || 0} services available
        </span>
      </div>

      {studio.services && studio.services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studio.services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-gray-700 overflow-hidden hover:border-yellow-500/30 transition-all duration-300"
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setSelectedService(selectedService === index ? null : index)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    {getServiceIcon(service.category)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-white group-hover:text-yellow-400 transition">
                        {service.service}
                      </h4>
                      <span className="text-lg font-bold text-yellow-500 whitespace-nowrap">
                        {formatPrice(service.price)}
                      </span>
                    </div>

                    {/* Service Details Preview */}
                    <div className="mt-2 space-y-1">
                      {service.duration && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={12} />
                          <span>{service.duration}</span>
                        </div>
                      )}
                      {service.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedService === index && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>Professional studio equipment</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>Experienced audio engineer</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>High-quality output</span>
                      </div>

                      <button className="w-full mt-3 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition text-sm">
                        Contact for Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl">
          <Headphones size={48} className="mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No services listed yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Contact the studio for service information
          </p>
        </div>
      )}
    </div>
  );
}