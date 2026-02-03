"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Edit,
  Loader2,
  Package,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

export default function StudioServices() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newService, setNewService] = useState({ service: "", price: "" });
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/studios/profile");
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    if (!newService.service.trim() || !newService.price.trim()) {
      setErrors({
        service: !newService.service.trim() ? "Service name is required" : "",
        price: !newService.price.trim() ? "Price is required" : "",
      });
      return;
    }

    // Validate price format
    const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!priceRegex.test(newService.price)) {
      setErrors({ price: "Please enter a valid price (e.g., 99 or 149.99)" });
      return;
    }

    setServices((prev) => [...prev, newService]);
    setNewService({ service: "", price: "" });
    setErrors({});
    setHasChanges(true);
  };

  const handleEditService = (index) => {
    setEditingIndex(index);
    setNewService(services[index]);
  };

  const handleSaveEdit = () => {
    if (!newService.service.trim() || !newService.price.trim()) {
      setErrors({
        service: !newService.service.trim() ? "Service name is required" : "",
        price: !newService.price.trim() ? "Price is required" : "",
      });
      return;
    }

    // Validate price format
    const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!priceRegex.test(newService.price)) {
      setErrors({ price: "Please enter a valid price" });
      return;
    }

    const updatedServices = [...services];
    updatedServices[editingIndex] = newService;
    setServices(updatedServices);
    setEditingIndex(null);
    setNewService({ service: "", price: "" });
    setErrors({});
    setHasChanges(true);
  };

  const handleDeleteService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    setHasChanges(true);

    if (editingIndex === index) {
      setEditingIndex(null);
      setNewService({ service: "", price: "" });
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const response = await api.put("/api/studios/services", { services });

      toast.success("Services updated successfully!");
      setHasChanges(false);

      setTimeout(() => {
        router.push("/dashboard/studios/profile");
      }, 1500);
    } catch (error) {
      console.error("Error saving services:", error);

      if (error.status === 400 && error.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to save services");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/studios/profile")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Studio Services
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your services and pricing
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {services.length} Services
            </div>
            <div
              className={`px-4 py-2 rounded-full ${services.length > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} font-medium flex items-center gap-2`}
            >
              {services.length > 0 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {services.length > 0 ? "Services Added" : "No Services"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Add/Edit Service Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                {editingIndex !== null ? (
                  <Edit className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingIndex !== null ? "Edit Service" : "Add New Service"}
                </h3>
                <p className="text-sm text-gray-600">
                  {editingIndex !== null
                    ? "Update service details"
                    : "Add a new service to your studio profile"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={newService.service}
                  onChange={(e) => {
                    setNewService((prev) => ({
                      ...prev,
                      service: e.target.value,
                    }));
                    if (errors.service)
                      setErrors((prev) => ({ ...prev, service: "" }));
                  }}
                  placeholder="e.g., Mixing, Mastering, Recording"
                  className={`text-gray-600 w-full px-4 py-3 bg-gray-50 border ${errors.service ? "border-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.service && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.service}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </div>
                  <input
                    type="text"
                    value={newService.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      setNewService((prev) => ({ ...prev, price: value }));
                      if (errors.price)
                        setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    placeholder="e.g., 99, 149.99"
                    className={`text-gray-600 w-full pl-8 pr-4 py-3 bg-gray-50 border ${errors.price ? "border-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.price}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              {editingIndex !== null && (
                <button
                  onClick={() => {
                    setEditingIndex(null);
                    setNewService({ service: "", price: "" });
                    setErrors({});
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                onClick={
                  editingIndex !== null ? handleSaveEdit : handleAddService
                }
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2"
              >
                {editingIndex !== null ? (
                  <>
                    <Save className="w-4 h-4" />
                    Update Service
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Service
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Services List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Your Services
                </h3>
                <p className="text-sm text-gray-600">
                  {services.length} service{services.length !== 1 ? "s" : ""}{" "}
                  listed
                </p>
              </div>
              {hasChanges && (
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Unsaved Changes
                </div>
              )}
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No services added yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Add your first service above
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {service.service}
                          </h4>
                          <p className="text-sm text-gray-600">
                            ${service.price} per session
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditService(index)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Save Button */}
            {hasChanges && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save All Services
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Tips */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Pricing Tips</h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-sm">
                  Be clear about what's included in each service
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-sm">
                  Research competitor pricing in your area
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-sm">
                  Offer package deals for multiple services
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-sm">
                  Consider hourly vs. project-based pricing
                </span>
              </li>
            </ul>
          </div>

          {/* Service Examples */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Service Examples
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Mixing</p>
                <p className="text-sm text-gray-600">$99 - $199</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Mastering</p>
                <p className="text-sm text-gray-600">$79 - $149</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Recording Session</p>
                <p className="text-sm text-gray-600">$50/hour</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">
                  Mixing + Mastering Package
                </p>
                <p className="text-sm text-gray-600">$249</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Service Statistics</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Services</span>
                <span className="font-bold text-2xl">{services.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Price</span>
                <span className="font-bold text-2xl">
                  $
                  {services.length > 0
                    ? (
                        services.reduce(
                          (sum, s) => sum + parseFloat(s.price),
                          0,
                        ) / services.length
                      ).toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm mb-2">Price Range</p>
                {services.length > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      ${Math.min(...services.map((s) => parseFloat(s.price)))}
                    </span>
                    <span className="text-sm">to</span>
                    <span className="text-sm">
                      ${Math.max(...services.map((s) => parseFloat(s.price)))}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm opacity-75">
                    Add services to see price range
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
