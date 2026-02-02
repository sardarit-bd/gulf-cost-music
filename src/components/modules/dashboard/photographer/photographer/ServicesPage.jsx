// components/modules/dashboard/photographer/ServicesPage.js
"use client";

import { useAuth } from "@/context/AuthContext";
import Input from "@/ui/Input";
import Select from "@/ui/Select";
import Textarea from "@/ui/Textarea";
import { Briefcase, CheckCircle, Clock, DollarSign, Edit2, Loader2, Plus, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function ServicesPage() {
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    service: "",
    price: "",
    description: "",
    duration: "",
    category: "photography",
    contact: {
      email: user?.email || "",
      phone: "",
      preferredContact: "email",
      showPhonePublicly: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    service: "",
    price: "",
    description: "",
    duration: "",
    category: "photography",
    contact: {
      email: "",
      phone: "",
      preferredContact: "email",
      showPhonePublicly: false,
    },
  });

  const [formErrors, setFormErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const serviceCategories = [
    { value: "photography", label: "Photography" },
    { value: "videography", label: "Videography" },
    { value: "editing", label: "Editing" },
    { value: "consultation", label: "Consultation" },
    { value: "workshop", label: "Workshop" },
    { value: "other", label: "Other" }
  ];

  const durationOptions = [
    { value: "", label: "Select Duration", disabled: true },
    { value: "30min", label: "30 minutes" },
    { value: "1hour", label: "1 hour" },
    { value: "2hours", label: "2 hours" },
    { value: "3hours", label: "3 hours" },
    { value: "4hours", label: "4 hours" },
    { value: "6hours", label: "6 hours" },
    { value: "8hours", label: "8 hours" },
    { value: "fullday", label: "Full day" },
    { value: "custom", label: "Custom" }
  ];

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      if (authLoading) return;

      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // First get photographer profile
        const profileRes = await fetch(`${API_BASE}/api/photographers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.data?.photographer?.services) {
            setServices(profileData.data.photographer.services);
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchServices();
    }
  }, [authLoading, API_BASE]);

  const validateForm = (formData, isEdit = false) => {
    const errors = {};

    if (!formData.service.trim()) {
      errors.service = "Service name is required";
    }

    if (!formData.price.trim()) {
      errors.price = "Price is required";
    } else if (!formData.price.match(/^\$?\d+(\.\d{2})?$/)) {
      errors.price = "Please enter a valid price (e.g., $199 or 199)";
    }

    if (isEdit) {
      setEditErrors(errors);
    } else {
      setFormErrors(errors);
    }

    return Object.keys(errors).length === 0;
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    if (!validateForm(newService)) {
      toast.error("Please fix the form errors");
      return;
    }

    const token = getCookie("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    try {
      setSaving(true);

      const serviceData = {
        service: newService.service.trim(),
        price: newService.price.trim(),
        description: newService.description.trim() || "",
        duration: newService.duration || "",
        category: newService.category
      };

      const res = await fetch(`${API_BASE}/api/photographers/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add service.");

      setServices(prev => [...prev, data.data.service]);
      setNewService({ service: "", price: "", description: "", duration: "", category: "photography" });
      setFormErrors({});
      toast.success("Service added successfully!");
    } catch (error) {
      console.error("Add service error:", error);
      toast.error(error.message || "Error adding service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const token = getCookie("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    try {
      setDeletingId(serviceId);
      const res = await fetch(
        `${API_BASE}/api/photographers/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete service.");

      setServices(prev => prev.filter(service => service._id !== serviceId));
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Delete service error:", error);
      toast.error(error.message || "Error deleting service.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (service) => {
    setEditingId(service._id);
    setEditForm({
      service: service.service,
      price: service.price,
      description: service.description || "",
      duration: service.duration || "",
      category: service.category || "photography",
      contact: {
        email: service.contact?.email || user?.email || "",
        phone: service.contact?.phone || "",
        preferredContact: service.contact?.preferredContact || "email",
        showPhonePublicly: service.contact?.showPhonePublicly || false,
      },
    });
  };


  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ service: "", price: "", description: "", duration: "", category: "photography" });
    setEditErrors({});
  };

  const handleUpdateService = async (serviceId) => {
    if (!validateForm(editForm, true)) {
      toast.error("Please fix the form errors");
      return;
    }

    const token = getCookie("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/api/photographers/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update service.");

      setServices(prev => prev.map(service =>
        service._id === serviceId ? data.data.service : service
      ));
      setEditingId(null);
      setEditForm({ service: "", price: "", description: "", duration: "", category: "photography" });
      setEditErrors({});
      toast.success("Service updated successfully!");
    } catch (error) {
      console.error("Update service error:", error);
      toast.error(error.message || "Error updating service.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      photography: "bg-blue-100 text-blue-700",
      videography: "bg-purple-100 text-purple-700",
      editing: "bg-green-100 text-green-700",
      consultation: "bg-yellow-100 text-yellow-700",
      workshop: "bg-indigo-100 text-indigo-700",
      other: "bg-gray-100 text-gray-700"
    };
    return colors[category] || colors.other;
  };

  const handleContactChange = (e, isEdit = false) => {
    const { name, value, type, checked } = e.target;

    const updater = isEdit ? setEditForm : setNewService;

    updater(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };


  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-1">Manage your photography services and pricing</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
                  <p className="text-gray-600 mt-1">
                    {services.length} {services.length === 1 ? 'service' : 'services'} available
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    {services.filter(s => s.category === 'photography').length} Photography
                  </div>
                  <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                    {services.filter(s => s.category === 'videography').length} Videography
                  </div>
                </div>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-6">
                    <Briefcase className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Services Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start by adding your first photography service. Show clients what you offer.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-md">
                    <Plus className="w-5 h-5" />
                    Add Your First Service
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      {editingId === service._id ? (
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                              label="Service Name *"
                              name="service"
                              value={editForm.service}
                              onChange={handleEditChange}
                              placeholder="e.g., Portrait Photography"
                              required
                              error={editErrors.service}
                              className="md:col-span-1"
                            />

                            <Input
                              label="Price *"
                              name="price"
                              value={editForm.price}
                              onChange={handleEditChange}
                              placeholder="e.g., $199"
                              required
                              error={editErrors.price}
                              className="md:col-span-1"
                              icon={<DollarSign className="w-4 h-4" />}
                            />

                            <Select
                              label="Category"
                              name="category"
                              value={editForm.category}
                              onChange={handleEditChange}
                              options={serviceCategories}
                              icon={<Tag className="w-4 h-4" />}
                              className="md:col-span-1"
                            />

                            <Select
                              label="Duration"
                              name="duration"
                              value={editForm.duration}
                              onChange={handleEditChange}
                              options={durationOptions}
                              icon={<Clock className="w-4 h-4" />}
                              className="md:col-span-1"
                            />

                            <Input
                              label="Contact Email"
                              name="email"
                              value={editForm.contact.email}
                              onChange={(e) => handleContactChange(e, true)}
                            />

                            <Input
                              label="Phone"
                              name="phone"
                              value={editForm.contact.phone}
                              onChange={(e) => handleContactChange(e, true)}
                            />

                            <Select
                              label="Preferred Contact"
                              name="preferredContact"
                              value={editForm.contact.preferredContact}
                              onChange={(e) => handleContactChange(e, true)}
                              options={[
                                { value: "email", label: "Email" },
                                { value: "phone", label: "Phone" },
                              ]}
                            />

                            <label className="flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                name="showPhonePublicly"
                                checked={editForm.contact.showPhonePublicly}
                                onChange={(e) => handleContactChange(e, true)}
                              />
                              Show phone publicly
                            </label>

                            <Textarea
                              label="Description"
                              name="description"
                              value={editForm.description}
                              onChange={handleEditChange}
                              rows={3}
                              placeholder="Describe what this service includes..."
                              className="md:col-span-2"
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                              onClick={cancelEditing}
                              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateService(service._id)}
                              disabled={saving}
                              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 font-medium flex items-center gap-2"
                            >
                              {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  Update Service
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-bold text-gray-900">{service.service}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                                  {serviceCategories.find(c => c.value === service.category)?.label || service.category}
                                </span>
                              </div>

                              {service.description && (
                                <p className="text-gray-600 mb-4">{service.description}</p>
                              )}

                              <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <span className="text-lg font-bold text-gray-900">{service.price}</span>
                                </div>

                                {service.duration && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {durationOptions.find(d => d.value === service.duration)?.label || service.duration}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => startEditing(service)}
                                className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                title="Edit service"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(service._id)}
                                disabled={deletingId === service._id}
                                className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                title="Delete service"
                              >
                                {deletingId === service._id ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Service Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Add New Service</h3>
                  <p className="text-gray-600 text-sm">Fill in the details below</p>
                </div>
              </div>

              <form onSubmit={handleAddService} className="space-y-4">
                <Input
                  label="Service Name *"
                  name="service"
                  value={newService.service}
                  onChange={handleNewServiceChange}
                  placeholder="e.g., Portrait Photography, Wedding Coverage"
                  required
                  error={formErrors.service}
                  icon={<Briefcase className="w-4 h-4" />}
                />

                <Input
                  label="Price *"
                  name="price"
                  value={newService.price}
                  onChange={handleNewServiceChange}
                  placeholder="e.g., $199, Starting from $299"
                  required
                  error={formErrors.price}
                  icon={<DollarSign className="w-4 h-4" />}
                />

                <Select
                  label="Category"
                  name="category"
                  value={newService.category}
                  onChange={handleNewServiceChange}
                  options={serviceCategories}
                  icon={<Tag className="w-4 h-4" />}
                />

                <Select
                  label="Duration"
                  name="duration"
                  value={newService.duration}
                  onChange={handleNewServiceChange}
                  options={durationOptions}
                  icon={<Clock className="w-4 h-4" />}
                />

                <Input
                  label="Contact Email"
                  name="email"
                  value={newService.contact.email}
                  onChange={(e) => handleContactChange(e)}
                  placeholder="contact@email.com"
                />

                <Input
                  label="Phone (Optional)"
                  name="phone"
                  value={newService.contact.phone}
                  onChange={(e) => handleContactChange(e)}
                  placeholder="+1 555 123 4567"
                />

                <Select
                  label="Preferred Contact"
                  name="preferredContact"
                  value={newService.contact.preferredContact}
                  onChange={(e) => handleContactChange(e)}
                  options={[
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Phone" },
                  ]}
                />

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="showPhonePublicly"
                    checked={newService.contact.showPhonePublicly}
                    onChange={(e) => handleContactChange(e)}
                  />
                  Show phone publicly
                </label>

                <Textarea
                  label="Description (Optional)"
                  name="description"
                  value={newService.description}
                  onChange={handleNewServiceChange}
                  rows={3}
                  placeholder="Describe what this service includes, any requirements, deliverables..."
                />

                <button
                  type="submit"
                  disabled={saving || !newService.service || !newService.price}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding Service...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Service
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Service Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Service Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{services.length}</span>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Total Services</p>
                      <p className="text-gray-500 text-sm">Active listings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-bold">100%</p>
                    <p className="text-gray-500 text-sm">Complete</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-gray-700 text-sm">Photography</p>
                    <p className="text-purple-600 font-bold text-xl">
                      {services.filter(s => s.category === 'photography').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-gray-700 text-sm">Videography</p>
                    <p className="text-green-600 font-bold text-xl">
                      {services.filter(s => s.category === 'videography').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}