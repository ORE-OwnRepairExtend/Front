import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// accessToken 재발급 API 경로
const REISSUE_URL = "/auth/refresh";
const LOGOUT_URL = "/auth/logout";

const clearAuthStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== REISSUE_URL &&
      originalRequest.url !== LOGOUT_URL
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post<{ accessToken: string }>(REISSUE_URL);

        const newAccessToken = response.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (reissueError) {
        clearAuthStorage();

        window.location.href = "/login";

        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  },
);