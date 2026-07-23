import API_BASE_URL from "./config";

export const signup = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

// No need to pass userId now, token handles it
export const updateProfile = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
};
