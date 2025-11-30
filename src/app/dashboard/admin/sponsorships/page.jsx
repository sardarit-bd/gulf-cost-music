"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import DeleteConfirmation from "@/components/modules/dashboard/sponsorships/DeleteConfirmation";
import SponsorCard from "@/components/modules/dashboard/sponsorships/SponsorCard";
import SponsorForm from "@/components/modules/dashboard/sponsorships/SponsorForm";
import { ImageIcon, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Function to get cookie value by name
const getCookie = (name) => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Selected items
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [deletingSponsor, setDeletingSponsor] = useState(null);

  // Fetch sponsors
  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

      const res = await fetch(`${API_BASE}/api/sponsors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setSponsors(data.data);
      } else {
        toast.error("Failed to fetch sponsors");
      }
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast.error("Error loading sponsors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  // Open form for adding new sponsor
  const handleAddSponsor = () => {
    setEditingSponsor(null);
    setShowForm(true);
  };

  // Open form for editing sponsor
  const handleEditSponsor = (sponsor) => {
    setEditingSponsor(sponsor);
    setShowForm(true);
  };

  // Open delete confirmation
  const handleDeleteClick = (sponsor) => {
    setDeletingSponsor(sponsor);
    setShowDeleteConfirm(true);
  };

  // Handle actual deletion
  const handleDeleteConfirm = async () => {
    if (!deletingSponsor) return;

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

      const res = await fetch(
        `${API_BASE}/api/sponsors/${deletingSponsor._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Sponsor deleted successfully!");
        fetchSponsors();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast.error("Error deleting sponsor");
    } finally {
      setShowDeleteConfirm(false);
      setDeletingSponsor(null);
    }
  };

  // Close all modals
  const closeModals = () => {
    setShowForm(false);
    setShowDeleteConfirm(false);
    setEditingSponsor(null);
    setDeletingSponsor(null);
  };

  // Filter sponsors based on search
  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <Toaster />

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sponsors Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your sponsors and partners
              </p>
            </div>

            <button
              onClick={handleAddSponsor}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Sponsor
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sponsors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-500 w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sponsors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading sponsors...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSponsors.map((sponsor) => (
              <SponsorCard
                key={sponsor._id}
                sponsor={sponsor}
                onEdit={handleEditSponsor}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSponsors.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Sponsors Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "No sponsors match your search criteria."
                  : "Get started by adding your first sponsor."}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddSponsor}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Sponsor
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sponsor Form Modal */}
        {showForm && (
          <SponsorForm
            sponsor={editingSponsor}
            onClose={closeModals}
            onSave={fetchSponsors}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmation
            item={deletingSponsor}
            itemType="sponsor"
            onConfirm={handleDeleteConfirm}
            onCancel={closeModals}
          />
        )}
      </div>
    </AdminLayout>
  );
}
