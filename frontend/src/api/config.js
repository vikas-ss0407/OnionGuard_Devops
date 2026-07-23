const API_BASE_URL = "http://127.0.0.1:5002/api"; 

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_BASE_URL;
