import API_BASE_URL, { getAuthHeader } from "./config";

export const getShops = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/shops`, {
      headers: getAuthHeader(),
      credentials: 'include'
    });
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error("Failed to fetch shops:", err);
    return [];
  }
};

export const createShop = async (shop) => {
  try {
    const res = await fetch(`${API_BASE_URL}/shops`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify(shop),
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("Failed to create shop:", err);
    return null;
  }
};

export const updateShop = async (id, shop) => {
  try {
    const res = await fetch(`${API_BASE_URL}/shops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify(shop),
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("Failed to update shop:", err);
    return null;
  }
};

export const deleteShop = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/shops/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
      credentials: 'include',
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("Failed to delete shop:", err);
    return null;
  }
};
