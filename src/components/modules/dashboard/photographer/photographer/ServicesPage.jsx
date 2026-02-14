// app/dashboard/photographer/services/page.jsx (অথবা আপনার ফাইল পাথ)
"use client";

// import ServiceCard from "@/components/modules/dashboard/photographer/ServiceCard";
// import ServiceForm from "@/components/modules/dashboard/photographer/ServiceForm";
// import ServiceStats from "@/components/modules/dashboard/photographer/ServiceStats";
import { useAuth } from "@/context/AuthContext";
import DeleteModal from "@/ui/DeleteModal";
import { Briefcase, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ServiceCard from "../Service/ServiceCard";
import ServiceForm from "../Service/ServiceForm";
import ServiceStats from "../Service/ServiceStats";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // Options
  const categoryOptions = [
    { value: "", label: "Select Category", disabled: true },
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

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          email: user.email,
        },
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.service.trim()) {
      newErrors.service = "Service name is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (!/^\$?\d+(\.\d{2})?$/.test(formData.price)) {
      newErrors.price = "Please enter a valid price (e.g., $199 or 199)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
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
    setErrors({});
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const token = getCookie("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const toastId = toast.loading("Adding service...");

    try {
      setSaving(true);

      const serviceData = {
        service: formData.service.trim(),
        price: formData.price.trim(),
        description: formData.description.trim() || "",
        duration: formData.duration || "",
        category: formData.category,
        contact: formData.contact,
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
      resetForm();

      toast.dismiss(toastId);
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Service added successfully!</span>
        </div>,
      );
    } catch (error) {
      console.error("Add service error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "Error adding service.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateService = async (serviceId) => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const token = getCookie("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const toastId = toast.loading("Updating service...");

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
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update service.");

      setServices((prev) =>
        prev.map((service) =>
          service._id === serviceId ? data.data.service : service,
        ),
      );

      resetForm();

      toast.dismiss(toastId);
      toast.success("Service updated successfully!");
    } catch (error) {
      console.error("Update service error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "Error updating service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    const token = getCookie("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const toastId = toast.loading(`Deleting "${serviceToDelete.service}"...`);

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

      toast.dismiss(toastId);
      toast.success(`"${serviceToDelete.service}" deleted successfully!`);

      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error("Delete service error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "Error deleting service.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (service) => {
    setEditingId(service._id);
    setFormData({
      service: service.service,
      price: service.price,
      // description: service.description || "",
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

  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <ServiceCard
                        key={service._id}
                        service={service}
                        onEdit={startEditing}
                        onDelete={openDeleteModal}
                        isDeleting={deletingId}
                        durationOptions={durationOptions}
                        categoryOptions={categoryOptions}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Form and Stats */}
          <div className="space-y-6">
            {editingId ? (
              <ServiceForm
                formData={formData}
                onChange={handleChange}
                onContactChange={handleContactChange}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateService(editingId);
                }}
                onCancel={resetForm}
                isEditing={true}
                saving={saving}
                errors={errors}
                categoryOptions={categoryOptions}
                durationOptions={durationOptions}
                userEmail={user?.email}
              />
            ) : (
              <ServiceForm
                formData={formData}
                onChange={handleChange}
                onContactChange={handleContactChange}
                onSubmit={handleAddService}
                isEditing={false}
                saving={saving}
                errors={errors}
                categoryOptions={categoryOptions}
                durationOptions={durationOptions}
                userEmail={user?.email}
              />
            )}

            <ServiceStats services={services} />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleDeleteService}
        title="Delete Service"
        description={`Are you sure you want to delete "${serviceToDelete?.service}"?`}
        confirmText="Delete Service"
        cancelText="Cancel"
        loading={deletingId === serviceToDelete?._id}
        type="danger"
        itemName={serviceToDelete?.service}
      />
    </div>
  );
}
