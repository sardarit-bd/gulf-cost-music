"use client";

import { Edit2, List, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// SVG Icons
function CalendarIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"
      />
    </svg>
  );
}

const iconOptions = [
  { value: "calendar", label: "Calendar", icon: CalendarIcon },
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "location", label: "Location", icon: MapPinIcon },
  { value: "ticket", label: "Ticket", icon: TicketIcon },
];

const ListItemsCard = ({ featuredData, setFeaturedData, isEditMode }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    icon: "calendar",
    title: "",
    text: "",
  });

  const handleAddItem = () => {
    if (!newItem.title.trim() || !newItem.text.trim()) {
      toast.error("Please fill in both title and text");
      return;
    }
    setFeaturedData((prev) => ({
      ...prev,
      listItems: [...prev.listItems, { ...newItem }],
    }));
    setNewItem({ icon: "calendar", title: "", text: "" });
    setShowAddForm(false);
  };

  const handleEditItem = (index) => {
    setEditingIndex(index);
    setNewItem(featuredData.listItems[index]);
    setShowAddForm(true);
  };

  const handleUpdateItem = () => {
    if (!newItem.title.trim() || !newItem.text.trim()) return;
    const updatedItems = [...featuredData.listItems];
    updatedItems[editingIndex] = { ...newItem };
    setFeaturedData((prev) => ({ ...prev, listItems: updatedItems }));
    setNewItem({ icon: "calendar", title: "", text: "" });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = featuredData.listItems.filter((_, i) => i !== index);
    setFeaturedData((prev) => ({ ...prev, listItems: updatedItems }));
  };

  const getIconComponent = (iconName) => {
    const icons = {
      calendar: CalendarIcon,
      users: UsersIcon,
      location: MapPinIcon,
      ticket: TicketIcon,
    };
    return icons[iconName] || CalendarIcon;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-100 rounded-lg">
              <List className="w-3.5 h-3.5 text-yellow-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">
              Feature List
            </h2>
          </div>
          {isEditMode && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {isEditMode && showAddForm && (
        <div className="p-3 bg-yellow-50 border-b border-yellow-200">
          <div className="space-y-2">
            <select
              value={newItem.icon}
              onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-yellow-400 cursor-pointer text-gray-700"
            >
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Title"
              value={newItem.title}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-yellow-400 outline-none cursor-pointer text-gray-500"
            />
            <textarea
              placeholder="Description"
              value={newItem.text}
              onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
              rows={2}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-yellow-400 outline-none resize-none cursor-pointer text-gray-500"
            />
            <div className="flex gap-2">
              <button
                onClick={
                  editingIndex !== null ? handleUpdateItem : handleAddItem
                }
                className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingIndex(null);
                  setNewItem({ icon: "calendar", title: "", text: "" });
                }}
                className="flex-1 px-2 py-1 bg-gray-500 text-white rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Items */}
      <div>
        {featuredData.listItems.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-xs">
            No items added
          </div>
        ) : (
          featuredData.listItems.map((item, idx) => {
            const Icon = getIconComponent(item.icon);
            return (
              <div key={idx}>
                <div className="p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-yellow-100 rounded">
                      <Icon />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">{item.text}</p>
                    </div>
                    {isEditMode && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditItem(idx)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Border between items - except last one */}
                {idx !== featuredData.listItems.length - 1 && (
                  <div className="border-t border-gray-100"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListItemsCard;
