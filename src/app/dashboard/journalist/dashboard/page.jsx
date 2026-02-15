"use client";

import JournalistHeader from "@/components/modules/journalist/JournalistHeader";
// import JournalistHeader from "@/components/modules/journalist/JournalistHeader";
import NewsDetailModal from "@/components/modules/journalist/NewsDetailModal";
import NewsListTab from "@/components/modules/journalist/NewsListTab";
// import JournalistHeader from "@/components/journalist/JournalistHeader";
// import NewsDetailModal from "@/components/journalist/NewsDetailModal";
// import NewsListTab from "@/components/journalist/NewsListTab";
// import DeleteModal from "@/components/ui/DeleteModal";
import { useAuth } from "@/context/AuthContext";
import DeleteModal from "@/ui/DeleteModal";
import { getCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function JournalistDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsLoading, setNewsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch News List
  useEffect(() => {
    if (!user) return;

    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const token = getCookie("token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/journalist/my-news`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        if (res.ok && data.data?.news) {
          setNewsList(data.data.news);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        toast.error("Failed to load news");
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, [user]);

  const viewNewsDetails = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const editNews = (news) => {
    router.push(`/journalist/edit-news/${news._id}`);
  };

  const handleDeleteClick = (news) => {
    setNewsToDelete(news);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!newsToDelete) return;

    setDeleting(true);
    try {
      const token = getCookie("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${newsToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      setNewsList((prev) => prev.filter((n) => n._id !== newsToDelete._id));
      toast.success("News deleted successfully!");
      setDeleteModalOpen(false);
      setNewsToDelete(null);
    } catch (err) {
      console.error("Delete news error:", err);
      toast.error(err.message || "Error deleting news");
    } finally {
      setDeleting(false);
    }
  };

  const navigateToCreateNews = () => {
    router.push("/journalist/create-news");
  };

  if (newsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        <JournalistHeader />

        <NewsDetailModal
          news={selectedNews}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setNewsToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete News Article"
          description="Are you sure you want to delete this news article? This action cannot be undone."
          itemName={newsToDelete?.title}
          loading={deleting}
          type="danger"
        />

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My News Articles</h2>
            <button
              onClick={navigateToCreateNews}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              + Create News
            </button>
          </div>

          <NewsListTab
            newsList={newsList}
            onViewDetails={viewNewsDetails}
            onEditNews={editNews}
            onDeleteNews={handleDeleteClick}
            onCreateNews={navigateToCreateNews}
          />
        </div>
      </div>
    </div>
  );
}
