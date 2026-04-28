import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// accessToken 재발급 API 경로
const REISSUE_URL = "/auth/refresh";

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== REISSUE_URL
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post<{ accessToken: string }>(REISSUE_URL);

        const newAccessToken = response.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (reissueError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  },
);