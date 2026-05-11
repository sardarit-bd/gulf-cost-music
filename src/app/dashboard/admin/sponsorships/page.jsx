"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";

import {
  getCookie,
  fetchSponsors,
  fetchSectionText,
  updateSectionText,
  deleteSponsor,
} from "@/components/modules/dashboard/sponsorships/sponsors.api";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SectionTextModal from "@/components/modules/dashboard/sponsorships/SectionTextModal";
import DeleteConfirmationModal from "@/components/modules/dashboard/sponsorships/DeleteConfirmationModal";
import SponsorFormModal from "@/components/modules/dashboard/sponsorships/SponsorFormModal";
import SponsorsGrid from "@/components/modules/dashboard/sponsorships/SponsorsGrid";
import SponsorsStats from "@/components/modules/dashboard/sponsorships/SponsorsStats";
import SponsorsHeader from "@/components/modules/dashboard/sponsorships/SponsorsHeader";

export default function SponsorsManagement() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Section text states
  const [sectionText, setSectionText] = useState({
    sectionTitle: "Our Sponsors",
    sectionSubtitle:
      "We're proud to partner with amazing local businesses and community supporters.",
  });
  const [isLoadingText, setIsLoadingText] = useState(false);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTextSettings, setShowTextSettings] = useState(false);

  // Selected items
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [deletingSponsor, setDeletingSponsor] = useState(null);

  const loadSponsors = async () => {
    setLoading(true);
    try {
      const data = await fetchSponsors();
      setSponsors(data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast.error("Error loading sponsors");
    } finally {
      setLoading(false);
    }
  };

  const loadSectionText = async () => {
    setIsLoadingText(true);
    try {
      const data = await fetchSectionText();
      setSectionText({
        sectionTitle: data.sectionTitle || "Our Sponsors",
        sectionSubtitle:
          data.sectionSubtitle ||
          "We're proud to partner with amazing local businesses and community supporters.",
      });
    } catch (error) {
      console.error("Error fetching section text:", error);
    } finally {
      setIsLoadingText(false);
    }
  };

  useEffect(() => {
    loadSponsors();
    loadSectionText();
  }, []);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleAddSponsor = () => {
    setEditingSponsor(null);
    setShowForm(true);
  };

  const handleEditSponsor = (sponsor) => {
    setEditingSponsor(sponsor);
    setShowForm(true);
  };

  const handleDeleteClick = (sponsor) => {
    setDeletingSponsor(sponsor);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSponsor) return;

    try {
      await deleteSponsor(deletingSponsor._id);
      toast.success("Sponsor deleted successfully!");
      loadSponsors();
      setShowDeleteConfirm(false);
      setDeletingSponsor(null);
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast.error("Error deleting sponsor");
    }
  };

  const handleUpdateSectionText = async (newText) => {
    try {
      await updateSectionText(newText);
      toast.success("Section text updated successfully!");
      setShowTextSettings(false);
      setSectionText(newText);
    } catch (error) {
      console.error("Error updating section text:", error);
      toast.error("Error updating section text");
    }
  };

  const closeModals = () => {
    setShowForm(false);
    setShowDeleteConfirm(false);
    setShowTextSettings(false);
    setEditingSponsor(null);
    setDeletingSponsor(null);
  };

  // Filter sponsors based on search
  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: sponsors.length,
    active: sponsors.filter((s) => s.isActive !== false).length,
    withLogo: sponsors.filter((s) => s.logo).length,
  };

  const hasActiveFilters = searchTerm !== "";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <Toaster position="top-right" />

        {/* Header */}
        <SponsorsHeader
          loading={loading}
          onRefresh={loadSponsors}
          onAddSponsor={handleAddSponsor}
          onOpenSettings={() => setShowTextSettings(true)}
        />

        {/* Stats Cards */}
        <SponsorsStats stats={stats} />

        {/* Sponsors Grid with Search */}
        <SponsorsGrid
          sponsors={filteredSponsors}
          loading={loading}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
          onClearSearch={clearSearch}
          hasActiveFilters={hasActiveFilters}
          activeSearchTerm={searchTerm}
          onEdit={handleEditSponsor}
          onDelete={handleDeleteClick}
          onAddNew={handleAddSponsor}
        />

        {/* Sponsor Form Modal */}
        {showForm && (
          <SponsorFormModal
            sponsor={editingSponsor}
            onClose={closeModals}
            onSave={loadSponsors}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmationModal
            item={deletingSponsor}
            onConfirm={handleDeleteConfirm}
            onCancel={closeModals}
          />
        )}

        {/* Section Text Settings Modal */}
        {showTextSettings && (
          <SectionTextModal
            sectionText={sectionText}
            isLoading={isLoadingText}
            onSave={handleUpdateSectionText}
            onClose={() => setShowTextSettings(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
