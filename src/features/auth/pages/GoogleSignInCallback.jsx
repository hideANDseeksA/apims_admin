// pages/GoogleSignInCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function GoogleSignInCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const idToken = params.get("id_token");
    const API_URL = import.meta.env.VITE_API_URL

    if (!email || !idToken) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: "Missing email or authentication token.",
        confirmButtonText: "Back to Login",
      }).then(() => navigate("/login"));
      return;
    }

    fetch(`${API_URL}/auth/signin/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, id_token: idToken }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Authentication failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Signed in user:", data);

        // Store session info
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("hr_role", data.hr_role);
        localStorage.setItem("employee_id", data.employee_id);
        localStorage.setItem("f_name", data.f_name)
        localStorage.setItem("l_name", data.l_name)

        Swal.fire({
          icon: "success",
          title: "Welcome! "+(data.f_name),
          text: "You have successfully signed in.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/dashboard"));
      })
      .catch((err) => {
        console.error(err);

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.message || "Unable to sign in. Please try again.",
          confirmButtonText: "Back to Login",
        }).then(() => navigate("/login"));
      });
  }, [navigate]);

 return (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Spinner */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

      {/* Text */}
      <h2 className="text-lg font-semibold text-gray-800">
        Signing you in
      </h2>
      <p className="text-sm text-gray-500">
        Please wait, this will only take a moment
      </p>
    </div>
  </div>
);
}
