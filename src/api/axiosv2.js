import axios from "axios";

// Axios instance
const APIV2 = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// REQUEST INTERCEPTOR
APIV2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[APIV2] Request started: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[APIV2] Request error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
APIV2.interceptors.response.use(
  (response) => {
    const { method, url } = response.config;

    console.log(`[APIV2] Response received: ${method.toUpperCase()} ${url}`, response.data);

    // Special handling for sign-in route
    if (url.includes("/auth/signin/")) {
      const name = response.data?.user?.name || response.data?.full_name || "User";
      console.log(`[APIV2] Sign-in success: Welcome, ${name}!`);
    }

    // Default success logging for POST, PUT, DELETE
    if (["post", "put", "delete"].includes(method)) {
      console.log(`[APIV2] Success:`, response.data?.message || "Operation Successful!");
    }

    return response;
  },
  (error) => {
    const { config } = error;
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Something went wrong";

    console.error(`[APIV2] Error on ${config?.method?.toUpperCase()} ${config?.url}:`, message);

    return Promise.reject(error);
  }
);

export default APIV2;
