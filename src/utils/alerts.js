import Swal from "sweetalert2";

// Success alert
export const showSuccess = (message = "Operation Successful") => {
  return Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    timer: 1200,
    showConfirmButton: false,
    heightAuto: false,   // ⬅ IMPORTANT for ShadCN compatibility
  });
};

// Error alert
export const showError = (message = "Something went wrong") => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    heightAuto: false,   // ⬅ prevents layout jump
    confirmButtonColor: "#2d5f2e",
  });
};

// Confirmation dialog
export const showConfirm = (text = "Are you sure?") => {
  return Swal.fire({
    icon: "warning",
    title: "Confirm",
    text,
    showCancelButton: true,
    confirmButtonColor: "#2d5f2e",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    heightAuto: false,   // ⬅ prevents issues when ShadCN Dialog is open
  });
};


export const showSessionTimeout = () => {
  return Swal.fire({
    icon: "info",
    title: "Session Expired",
    text: "Your session has timed out. Please login again.",
    confirmButtonText: "OK",
    confirmButtonColor: "#2d5f2e",
    heightAuto: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};