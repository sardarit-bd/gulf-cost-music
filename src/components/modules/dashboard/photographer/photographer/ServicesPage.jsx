"use client";

import { useAuth } from "@/context/AuthContext";
import DeleteModal from "@/ui/DeleteModal";
import { Briefcase, CheckCircle, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(8);
  const [showAll, setShowAll] = useState(false);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    service: "",
    price: "",
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
      setShowAddModal(false);

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

  const handleUpdateService = async (e) => {
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

    const toastId = toast.loading("Updating service...");

    try {
      setSaving(true);

      const res = await fetch(
        `${API_BASE}/api/photographers/services/${editingId}`,
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
          service._id === editingId ? data.data.service : service,
        ),
      );

      resetForm();
      setShowEditModal(false);
      setEditingId(null);

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

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (service) => {
    setEditingId(service._id);
    setFormData({
      service: service.service,
      price: service.price,
      category: service.category || "photography",
      contact: service.contact || {
        email: user?.email || "",
        phone: "",
        preferredContact: "email",
        showPhonePublicly: false,
      },
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = showAll
    ? services
    : services.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(services.length / servicesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                <Briefcase className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Manage your services and pricing
                </p>
              </div>
            </div>

            {/* Add New Service Button */}
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Your Services
                    </h2>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {services.length} {services.length === 1 ? "service" : "services"} available
                    </p>
                  </div>

                  {/* Show All/Hide button */}
                  {services.length > servicesPerPage && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      {showAll ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Show less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Show all ({services.length})</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4">
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      No Services Yet
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 max-w-sm mx-auto">
                      Add your first service to showcase what you offer.
                    </p>
                    <button
                      onClick={openAddModal}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add First Service
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Services Grid - 2 columns for compact view */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                      {currentServices.map((service) => (
                        <ServiceCard
                          key={service._id}
                          service={service}
                          onEdit={() => openEditModal(service)}
                          onDelete={openDeleteModal}
                          isDeleting={deletingId}
                          categoryOptions={categoryOptions}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {!showAll && totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1 mt-4 pt-3 border-t">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-2 py-1 text-xs border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`px-2 py-1 text-xs rounded ${currentPage === i + 1
                              ? "bg-blue-600 text-white"
                              : "border hover:bg-gray-50"
                              }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-2 py-1 text-xs border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Stats */}
          <div className="space-y-4">
            <ServiceStats services={services} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <ServiceForm
              formData={formData}
              onChange={handleChange}
              onContactChange={handleContactChange}
              onSubmit={handleAddService}
              onCancel={() => {
                setShowAddModal(false);
                resetForm();
              }}
              isEditing={false}
              saving={saving}
              errors={errors}
              categoryOptions={categoryOptions}
              userEmail={user?.email}
            />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <ServiceForm
              formData={formData}
              onChange={handleChange}
              onContactChange={handleContactChange}
              onSubmit={handleUpdateService}
              onCancel={() => {
                setShowEditModal(false);
                resetForm();
              }}
              isEditing={true}
              saving={saving}
              errors={errors}
              categoryOptions={categoryOptions}
              userEmail={user?.email}
            />
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleDeleteService}
        title="Delete Service"
        description={`Delete "${serviceToDelete?.service}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deletingId === serviceToDelete?._id}
        type="danger"
        itemName={serviceToDelete?.service}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}