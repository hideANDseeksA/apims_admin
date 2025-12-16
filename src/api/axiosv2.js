import axios from "axios";
import Swal from "sweetalert2";

const specialRoutes = [
  "/auth/signin/",
  "/auth/register",
  "/auth/forgot-password"
];

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

    // Sign-in success alert
const isSpecialRoute = specialRoutes.some(route =>
  url?.includes(route)
);

if (isSpecialRoute) {
  const name =
    response.data?.user?.name ||
    response.data?.full_name ||
    "User";

  Swal.fire({
    icon: "success",
    title: "Welcome!",
    text: `Welcome, ${name}!`,
    confirmButtonColor: "#2d5f2e",
  });

  return response;
}


    // Default success alert for POST, PUT, DELETE
    if (["post", "put", "delete"].includes(method)) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data?.message || "Operation Successful!",
        confirmButtonColor: "#2d5f2e",
      });
    }

    return response;
  },
  (error) => {
    const { config } = error;

const isSpecialRoute = specialRoutes.some(route => config?.url?.includes(route));
const status = error.response?.status;
const message =
  error.response?.data?.detail ||
  error.response?.data?.message ||
  "Something went wrong";

if (isSpecialRoute) {
  if (status === 429) {
    Swal.fire({
      icon: "warning",
      title: "Too Many Attempts",
      text: "You have reached the maximum allowed attempts. Please wait 15 minutes before trying again.",
      confirmButtonColor: "#2d5f2e",
    });
  } else if (status === 401 || status === 403) {
    Swal.fire({
      icon: "error",
      title: "Invalid Credentials",
      text: "The credentials provided are incorrect.",
      confirmButtonColor: "#2d5f2e",
    });
  } else if (status === 404) {
    Swal.fire({
      icon: "error",
      title: "Invalid Credentials",
      text: "The credentials provided are incorrect.",
      confirmButtonColor: "#2d5f2e",
    });
  } 
}

// Default logging
console.error(`[APIV2] Error on ${config?.method?.toUpperCase()} ${config?.url}:`, message);

return Promise.reject(error);

  }
);

export default APIV2;
