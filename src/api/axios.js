import axios from "axios";
import Swal from "sweetalert2";

let loadingAlert = null;

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// CUSTOM BEAUTIFUL LOADER HTML
const loadingHTML = `
<div class="flex flex-col items-center justify-center">
  <div class="loader"></div>
  <p style="margin-top: 15px; font-size: 16px; font-weight: 500; color: #2d5f2e;">
    Processing...
  </p>
</div>

<style>
.loader {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(0,0,0,0.1);
  border-top-color: #2d5f2e;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
`;

// REQUEST INTERCEPTOR
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  

  // BEAUTIFUL LOADING FOR ALL REQUESTS
  loadingAlert = Swal.fire({
    html: loadingHTML,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    background: "#ffffffee",
    backdrop: `rgba(0,0,0,0.3)`
  });

  return config;
});

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => {
    const { method } = response.config;

    if (loadingAlert) {
      Swal.close();
      loadingAlert = null;
    }

    if (["post", "put", "delete"].includes(method)) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data?.message || "Operation Successful!",
        confirmButtonColor: "#2d5f2e"
      });
    }

    return response;
  },

  (error) => {
    if (loadingAlert) {
      Swal.close();
      loadingAlert = null;
    }

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Something went wrong";

    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#2d5f2e"
    });

    return Promise.reject(error);
  }
);

export default API;
