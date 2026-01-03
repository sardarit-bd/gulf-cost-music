import Input from "@/ui/Input";
import {
    Briefcase,
    DollarSign,
    Loader2,
    Trash2
} from "lucide-react";
import {ConfirmModal} from "@/components/modules/dashboard/photographer/photographer/ConfirmModal";
import { useState } from "react";

export default function ServicesTab({
    services,
    newService,
    setNewService,
    handleAddService,
    handleDeleteService,
    loading,
}) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);






    return (
        <div className="animate-fadeIn">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Services List */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Briefcase size={20} />
                            Your Services
                            {services.length > 0 && (
                                <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-medium ml-2">
                                    {services.length}
                                </span>
                            )}
                        </h3>

                        {services.length === 0 ? (
                            <div className="text-center py-12 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600">
                                <Briefcase size={48} className="text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg mb-2">No services yet</p>
                                <p className="text-gray-500 text-sm">Add your first service to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {services.map((service, index) => (
                                    <div
                                        key={service._id || index}
                                        className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors group"
                                    >
                                        <div>
                                            <h4 className="text-white font-semibold text-lg">{service.service}</h4>
                                            <p className="text-yellow-400 font-medium">{service.price}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedService(service);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-400/10 rounded-lg"
                                            title="Delete service"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Service Form */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <DollarSign size={20} />
                            Add New Service
                        </h3>

                        <form onSubmit={handleAddService} className="space-y-4">
                            <Input
                                label="Service Name"
                                name="service"
                                value={newService.service}
                                onChange={(e) => setNewService(prev => ({ ...prev, service: e.target.value }))}
                                placeholder="e.g., Music Video, Photo Shoot"
                                required
                            />
                            <Input
                                label="Price"
                                name="price"
                                value={newService.price}
                                onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                                placeholder="e.g., $99, $49"
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading || !newService.service || !newService.price}
                                className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Briefcase size={18} />
                                        Add Service
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Tips */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-3">💡 Service Tips</h4>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li>• Be specific about what's included</li>
                            <li>• Consider package deals</li>
                            <li>• Highlight your specialties</li>
                            <li>• Include delivery timelines</li>
                        </ul>
                    </div>
                </div>
            </div>


            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    handleDeleteService(selectedService._id);
                    setDeleteModalOpen(false);
                }}
                title="Delete Service"
                message={`Are you sure you want to delete "${selectedService?.service}"? This action cannot be undone.`}
                confirmText="Delete Service"
                cancelText="Cancel"
                type="delete"
            />

        </div>
    );
}