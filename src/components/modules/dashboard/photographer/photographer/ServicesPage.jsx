"use client";

import { useAuth } from "@/context/AuthContext";
import DeleteModal from "@/ui/DeleteModal";
import Input from "@/ui/Input";
import Select from "@/ui/Select";
import Textarea from "@/ui/Textarea";
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Edit2,
  Loader2,
  Mail,
  Phone,
  Plus,
  Tag,
  Trash2,
  User,
} from "lucide-react";
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

  // ===== DELETE MODAL STATE =====
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const serviceCategories = [
    { value: "photography", label: "Photography" },
    { value: "videography", label: "Videography" },
    { value: "editing", label: "Editing" },
    { value: "consultation", label: "Consultation" },
    { value: "workshop", label: "Workshop" },
    { value: "equipment", label: "Equipment" },
    { value: "other", label: "Other" },
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
    { value: "custom", label: "Custom" },
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

        const profileRes = await fetch(
          `${API_BASE}/api/photographers/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

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
        category: newService.category,
        contact: newService.contact,
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

      setServices((prev) => [...prev, data.data.service]);
      setNewService({
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
      setFormErrors({});
      toast.success("Service added successfully!");
    } catch (error) {
      console.error("Add service error:", error);
      toast.error(error.message || "Error adding service.");
    } finally {
      setSaving(false);
    }
  };

  // ===== OPEN DELETE MODAL =====
  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  // ===== HANDLE DELETE SERVICE =====
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    const token = getCookie("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    try {
      setDeletingId(serviceToDelete._id);
      const res = await fetch(
        `${API_BASE}/api/photographers/services/${serviceToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete service.");

      setServices((prev) =>
        prev.filter((service) => service._id !== serviceToDelete._id),
      );
      toast.success("Service deleted successfully!");
      setDeleteModalOpen(false);
      setServiceToDelete(null);
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
      contact: service.contact || {
        email: user?.email || "",
        phone: "",
        preferredContact: "email",
        showPhonePublicly: false,
      },
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({
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

      const res = await fetch(
        `${API_BASE}/api/photographers/services/${serviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update service.");

      setServices((prev) =>
        prev.map((service) =>
          service._id === serviceId ? data.data.service : service,
        ),
      );
      setEditingId(null);
      setEditForm({
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
    setEditForm((prev) => ({ ...prev, [name]: value }));

    if (editErrors[name]) {
      setEditErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      photography: "bg-blue-100 text-blue-800 border-blue-200",
      videography: "bg-purple-100 text-purple-800 border-purple-200",
      editing: "bg-green-100 text-green-800 border-green-200",
      consultation: "bg-amber-100 text-amber-800 border-amber-200",
      workshop: "bg-indigo-100 text-indigo-800 border-indigo-200",
      equipment: "bg-rose-100 text-rose-800 border-rose-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category] || colors.other;
  };

  const handleContactChange = (e, isEdit = false) => {
    const { name, value, type, checked } = e.target;

    const updater = isEdit ? setEditForm : setNewService;

    updater((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  // Minimalist Info Item Component
  const InfoItem = ({ icon: Icon, label, value, color = "gray" }) => {
    const colorClasses = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      green: "text-green-600",
      amber: "text-amber-600",
      gray: "text-gray-600",
      rose: "text-rose-600",
      indigo: "text-indigo-600",
    };

    return (
      <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
        <div
          className={`p-2 rounded-lg ${colorClasses[color]} bg-white border border-gray-200`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-gray-900 font-medium">{value || "—"}</p>
        </div>
      </div>
    );
  };

  // Minimalist Tag Component
  const ServiceTag = ({ children, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      green: "bg-green-50 text-green-700 border-green-200",
      amber: "bg-amber-50 text-amber-700 border-amber-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}
      >
        {children}
      </span>
    );
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
            <div className="p-3 bg-white rounded-xl border border-gray-200">
              <Briefcase className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-1">
                Manage your photography services and pricing
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Services
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {services.length}{" "}
                      {services.length === 1 ? "service" : "services"} available
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {
                        services.filter((s) => s.category === "photography")
                          .length
                      }{" "}
                      Photography
                    </div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {
                        services.filter((s) => s.category === "videography")
                          .length
                      }{" "}
                      Videography
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      No Services Yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start by adding your first photography service. Show
                      clients what you offer.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium">
                      <Plus className="w-5 h-5" />
                      Add Your First Service
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
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
                                className="md:col-span-2"
                              />

                              <Input
                                label="Price *"
                                name="price"
                                value={editForm.price}
                                onChange={handleEditChange}
                                placeholder="e.g., $199"
                                required
                                error={editErrors.price}
                                icon={<DollarSign className="w-4 h-4" />}
                              />

                              <Select
                                label="Category"
                                name="category"
                                value={editForm.category}
                                onChange={handleEditChange}
                                options={serviceCategories}
                                icon={<Tag className="w-4 h-4" />}
                              />

                              <Select
                                label="Duration"
                                name="duration"
                                value={editForm.duration}
                                onChange={handleEditChange}
                                options={durationOptions}
                                icon={<Clock className="w-4 h-4" />}
                              />

                              <Textarea
                                label="Description"
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                rows={3}
                                placeholder="Describe this service..."
                                className="md:col-span-2"
                              />

                              <div className="md:col-span-2 border-t pt-4">
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Contact
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    label="Email"
                                    name="email"
                                    value={editForm.contact.email}
                                    onChange={(e) =>
                                      handleContactChange(e, true)
                                    }
                                    icon={<Mail className="w-4 h-4" />}
                                  />

                                  <Input
                                    label="Phone"
                                    name="phone"
                                    value={editForm.contact.phone}
                                    onChange={(e) =>
                                      handleContactChange(e, true)
                                    }
                                    icon={<Phone className="w-4 h-4" />}
                                  />

                                  <Select
                                    label="Preferred Contact"
                                    name="preferredContact"
                                    value={editForm.contact.preferredContact}
                                    onChange={(e) =>
                                      handleContactChange(e, true)
                                    }
                                    options={[
                                      { value: "email", label: "Email" },
                                      { value: "phone", label: "Phone" },
                                    ]}
                                  />

                                  <div className="flex items-center h-full">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg w-full">
                                      <input
                                        type="checkbox"
                                        name="showPhonePublicly"
                                        checked={
                                          editForm.contact.showPhonePublicly
                                        }
                                        onChange={(e) =>
                                          handleContactChange(e, true)
                                        }
                                        className="rounded"
                                      />
                                      Show phone publicly
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                              <button
                                onClick={cancelEditing}
                                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleUpdateService(service._id)}
                                disabled={saving}
                                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 font-medium flex items-center gap-2"
                              >
                                {saving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Update
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {service.service}
                                  </h3>
                                  <ServiceTag
                                    color={
                                      service.category === "photography"
                                        ? "blue"
                                        : service.category === "videography"
                                          ? "purple"
                                          : service.category === "editing"
                                            ? "green"
                                            : service.category ===
                                                "consultation"
                                              ? "amber"
                                              : service.category === "workshop"
                                                ? "indigo"
                                                : "gray"
                                    }
                                  >
                                    {serviceCategories.find(
                                      (c) => c.value === service.category,
                                    )?.label || service.category}
                                  </ServiceTag>
                                </div>
                                {service.description && (
                                  <p className="text-gray-600 text-sm mb-4">
                                    {service.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => startEditing(service)}
                                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                  title="Edit service"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openDeleteModal(service)}
                                  disabled={deletingId === service._id}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                  title="Delete service"
                                >
                                  {deletingId === service._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                              {/* Left Column */}
                              <div className="space-y-1">
                                <InfoItem
                                  icon={DollarSign}
                                  label="Price"
                                  value={service.price}
                                  color="green"
                                />
                                <InfoItem
                                  icon={Clock}
                                  label="Duration"
                                  value={
                                    durationOptions.find(
                                      (d) => d.value === service.duration,
                                    )?.label || service.duration
                                  }
                                  color="blue"
                                />
                              </div>

                              {/* Right Column */}
                              <div className="space-y-1">
                                <InfoItem
                                  icon={Mail}
                                  label="Email"
                                  value={service.contact?.email}
                                  color="gray"
                                />
                                <InfoItem
                                  icon={Phone}
                                  label="Phone"
                                  value={
                                    service.contact?.phone
                                      ? `${service.contact.phone} ${service.contact.showPhonePublicly ? "(Public)" : "(Private)"}`
                                      : null
                                  }
                                  color="gray"
                                />
                                <InfoItem
                                  icon={User}
                                  label="Preferred Contact"
                                  value={
                                    service.contact?.preferredContact ===
                                    "phone"
                                      ? "Phone"
                                      : "Email"
                                  }
                                  color="gray"
                                />
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
          </div>

          {/* Add Service Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Add New Service
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Fill in the details below
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddService} className="p-6 space-y-4">
                <Input
                  label="Service Name *"
                  name="service"
                  value={newService.service}
                  onChange={handleNewServiceChange}
                  placeholder="Portrait Photography"
                  required
                  error={formErrors.service}
                />

                <Input
                  label="Price *"
                  name="price"
                  value={newService.price}
                  onChange={handleNewServiceChange}
                  placeholder="$199"
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

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      name="email"
                      value={newService.contact.email}
                      onChange={(e) => handleContactChange(e)}
                      icon={<Mail className="w-4 h-4" />}
                    />

                    <Input
                      label="Phone (Optional)"
                      name="phone"
                      value={newService.contact.phone}
                      onChange={(e) => handleContactChange(e)}
                      icon={<Phone className="w-4 h-4" />}
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
                        className="rounded"
                      />
                      Show phone publicly
                    </label>
                  </div>
                </div>

                <Textarea
                  label="Description (Optional)"
                  name="description"
                  value={newService.description}
                  onChange={handleNewServiceChange}
                  rows={3}
                  placeholder="Describe this service..."
                />

                <button
                  type="submit"
                  disabled={saving || !newService.service || !newService.price}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Service
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Service Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Service Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-900 font-bold">
                        {services.length}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">
                        Total Services
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-sm">Photography</p>
                    <p className="text-gray-900 font-bold text-lg">
                      {
                        services.filter((s) => s.category === "photography")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-sm">Videography</p>
                    <p className="text-gray-900 font-bold text-lg">
                      {
                        services.filter((s) => s.category === "videography")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== COMMON DELETE MODAL ===== */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleDeleteService}
        title="Delete Service"
        description={`Are you sure you want to delete "${serviceToDelete?.service}"? This action cannot be undone.`}
        confirmText="Delete Service"
        cancelText="Cancel"
        loading={deletingId === serviceToDelete?._id}
        type="danger"
        itemName={serviceToDelete?.service}
      />
    </div>
  );
}
