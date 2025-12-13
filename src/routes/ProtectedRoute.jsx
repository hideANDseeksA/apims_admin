// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isTokenValid, getTokenExpiration } from "../utils/helper";
import { useEffect } from "react";
import { showSessionTimeout } from "../utils/alerts"; // <— import it

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  const logoutWithAlert = async () => {
    await showSessionTimeout(); // wait for user to click OK
    localStorage.removeItem("access_token");
    localStorage.removeItem("hr_role");
    localStorage.removeItem("employee_id");
    localStorage.removeItem("workstation_hold");
    localStorage.removeItem("f_name");
    localStorage.removeItem("l_name");
    window.location.href = "/";
  };

  if (!token || !isTokenValid(token)) {
    logoutWithAlert();
    return null;
  }

  useEffect(() => {
    const expTime = getTokenExpiration(token);
    const timeout = expTime - Date.now();

    if (timeout <= 0) {
      logoutWithAlert();
      return;
    }

    const timer = setTimeout(() => {
      logoutWithAlert();
    }, timeout);

    return () => clearTimeout(timer);
  }, [token]);

  return children;
}
