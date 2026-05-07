"use client";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const fetchSponsors = async () => {
  const token = getCookie("token");
  if (!token) throw new Error("Authentication token not found");

  const res = await fetch(`${API_BASE}/api/sponsors`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!data.success)
    throw new Error(data.message || "Failed to fetch sponsors");
  return data.data;
};

export const fetchSectionText = async () => {
  const res = await fetch(`${API_BASE}/api/sponsors/section`);
  const data = await res.json();
  if (!data.success)
    throw new Error(data.message || "Failed to fetch section text");
  return data.data;
};

export const updateSectionText = async (payload) => {
  const token = getCookie("token");
  if (!token) throw new Error("Authentication token not found");

  const res = await fetch(`${API_BASE}/api/sponsors/section/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!data.success)
    throw new Error(data.message || "Failed to update section text");
  return data.data;
};

export const createSponsor = async (formData) => {
  const token = getCookie("token");
  if (!token) throw new Error("Authentication token not found");

  const res = await fetch(`${API_BASE}/api/sponsors`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!data.success)
    throw new Error(data.message || "Failed to create sponsor");
  return data.data;
};

export const updateSponsor = async (id, formData) => {
  const token = getCookie("token");
  if (!token) throw new Error("Authentication token not found");

  const res = await fetch(`${API_BASE}/api/sponsors/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!data.success)
    throw new Error(data.message || "Failed to update sponsor");
  return data.data;
};

export const deleteSponsor = async (id) => {
  const token = getCookie("token");
  if (!token) throw new Error("Authentication token not found");

  const res = await fetch(`${API_BASE}/api/sponsors/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!data.success)
    throw new Error(data.message || "Failed to delete sponsor");
  return data.data;
};
