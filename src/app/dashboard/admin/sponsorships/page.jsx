"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import DeleteConfirmation from "@/components/modules/dashboard/sponsorships/DeleteConfirmation";
import SponsorCard from "@/components/modules/dashboard/sponsorships/SponsorCard";
import SponsorForm from "@/components/modules/dashboard/sponsorships/SponsorForm";
import { ImageIcon, Loader2, Plus, Search, Settings, X } from "lucide-react";
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

  // Section text states
  const [sectionText, setSectionText] = useState({
    sectionTitle: "Our Sponsors",
    sectionSubtitle: "We're proud to partner with amazing local businesses and community supporters.",
  });
  const [isLoadingText, setIsLoadingText] = useState(false);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTextSettings, setShowTextSettings] = useState(false);

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

  // Fetch section text - UPDATED ENDPOINT
  const fetchSectionText = async () => {
    setIsLoadingText(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${API_BASE}/api/sponsors/section`); // Changed from /section/text

      const data = await res.json();

      if (data.success) {
        setSectionText({
          sectionTitle: data.data.sectionTitle || "Our Sponsors",
          sectionSubtitle: data.data.sectionSubtitle || "We're proud to partner with amazing local businesses and community supporters.",
        });
      }
    } catch (error) {
      console.error("Error fetching section text:", error);
      // Fallback to default values
      setSectionText({
        sectionTitle: "Our Sponsors",
        sectionSubtitle: "We're proud to partner with amazing local businesses and community supporters.",
      });
    } finally {
      setIsLoadingText(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
    fetchSectionText();
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

  // Handle section text update - UPDATED ENDPOINT
  const handleUpdateSectionText = async (e) => {
    e.preventDefault();

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

      // Send only the fields that backend supports
      const payload = {
        sectionTitle: sectionText.sectionTitle,
        sectionSubtitle: sectionText.sectionSubtitle,
      };

      const res = await fetch(`${API_BASE}/api/sponsors/section/update`, { // Changed from /section/text/update
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Section text updated successfully!");
        setShowTextSettings(false);
        // Update local state with new data
        setSectionText({
          sectionTitle: data.data.sectionTitle,
          sectionSubtitle: data.data.sectionSubtitle,
        });
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating section text:", error);
      toast.error("Error updating section text");
    }
  };

  // Close all modals
  const closeModals = () => {
    setShowForm(false);
    setShowDeleteConfirm(false);
    setShowTextSettings(false);
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

            <div className="flex gap-3">
              <button
                onClick={() => setShowTextSettings(true)}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Settings className="w-5 h-5" />
                Page Settings
              </button>

              <button
                onClick={handleAddSponsor}
                className="flex items-center gap-2 bg-[var(--primary)] text-black px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Sponsor
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sponsors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-500 w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            />
          </div>
        </div>

        {/* Sponsors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mr-3" />
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
                  className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors"
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

        {/* Section Text Settings Modal */}
        {showTextSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-[var(--primary)]" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Page Settings
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowTextSettings(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateSectionText} className="space-y-6">
                  {/* Current Section Preview */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Current Preview
                    </h3>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-900">
                        {sectionText.sectionTitle}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {sectionText.sectionSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Section Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title *
                    </label>
                    <input
                      type="text"
                      value={sectionText.sectionTitle}
                      onChange={(e) => setSectionText(prev => ({
                        ...prev,
                        sectionTitle: e.target.value
                      }))}
                      required
                      className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                      placeholder="Our Sponsors"
                    />
                  </div>

                  {/* Section Subtitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Description *
                    </label>
                    <textarea
                      value={sectionText.sectionSubtitle}
                      onChange={(e) => setSectionText(prev => ({
                        ...prev,
                        sectionSubtitle: e.target.value
                      }))}
                      required
                      rows="4"
                      className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] resize-none"
                      placeholder="We're proud to partner with amazing local businesses and community supporters."
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowTextSettings(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingText}
                      className="flex-1 px-4 py-3 bg-[var(--primary)] text-black rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingText && <Loader2 className="w-5 h-5 animate-spin" />}
                      {isLoadingText ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}