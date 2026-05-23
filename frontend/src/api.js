import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://ai-jobportal-sjbg.onrender.com"}/api/`,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  const publicRoutes = ["users/login", "users/register"];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.includes(route)
  );

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Optional: response interceptor (auto logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;