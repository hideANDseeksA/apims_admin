import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function GoogleSignUpCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const idToken = params.get("id_token");
    const API_URL = import.meta.env.VITE_API_URL
    if (!email || !idToken) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: "Missing Google authentication data.",
      }).then(() => navigate("/signup"));
      return;
    }

    const signup = async () => {
      // 🔄 SHOW LOADING
      Swal.fire({
        title: "Signing you up...",
        text: "Please wait while we create your account",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        // 1️⃣ REGISTER
        const registerRes = await fetch(
          `${API_URL}/auth/register/email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, id_token: idToken }),
          }
        );

        if (!registerRes.ok) {
          const err = await registerRes.json();
          throw new Error(err.detail || "Registration failed");
        }

        // 2️⃣ SIGN IN
        const loginRes = await fetch(
          `${API_URL}/auth/signin/email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, id_token: idToken }),
          }
        );

        if (!loginRes.ok) {
          const err = await loginRes.json();
          throw new Error(err.detail || "Login failed");
        }

        const data = await loginRes.json();

        // 3️⃣ SAVE SESSION
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("hr_role", data.hr_role);
        localStorage.setItem("employee_id", data.employee_id);
        localStorage.setItem("f_name", data.f_name)
        localStorage.setItem("l_name", data.l_name)

        // ✅ SUCCESS
        await Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: "Your account has been created.",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/dashboard");
      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: error.message || "Something went wrong.",
        }).then(() => navigate("/signup"));
      }
    };

    signup();
  }, [navigate]);

 return (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Spinner */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

      {/* Text */}
      <h2 className="text-lg font-semibold text-gray-800">
        Signing you up
      </h2>
      <p className="text-sm text-gray-500">
        Please wait, this will only take a moment
      </p>
    </div>
  </div>
);

}
