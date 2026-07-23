import API_BASE_URL, { getAuthHeader } from "./config";

export const getBoxes = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/boxes`, {
      headers: getAuthHeader(),
      credentials: 'include'
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to fetch boxes:", err);
    return [];
  }
};

export const createBox = async (box) => {
  try {
    const res = await fetch(`${API_BASE_URL}/boxes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify(box),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to create box:", err);
    return { message: "Failed to create box" };
  }
};

export const updateBox = async (id, box) => {
  try {
    const res = await fetch(`${API_BASE_URL}/boxes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify(box),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to update box:", err);
    return { message: "Failed to update box" };
  }
};

export const deleteBox = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/boxes/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to delete box:", err);
    return { message: "Failed to delete box" };
  }
};

// ✅ NEW: Update maintenance alert
export const updateAlert = async (id, alertDays, action) => {
  try {
    const res = await fetch(`${API_BASE_URL}/boxes/${id}/alert`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify({ alertDays, action }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to update alert:", err);
    return { message: "Failed to update alert" };
  }
};
