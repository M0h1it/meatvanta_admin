import Swal from "sweetalert2";

const BRAND = "#8a1f11"; // primary-container - matches every button in the app

export function showSuccess(message) {
  return Swal.fire({
    icon: "success",
    title: message,
    toast: true,
    position: "top-end",
    timer: 1800,
    showConfirmButton: false,
  });
}

export function showError(message) {
  return Swal.fire({
    icon: "error",
    title: "Something went wrong",
    text: message,
    toast: true,
    position: "top-end",
    timer: 3500,
    showConfirmButton: false,
  });
}

/** Replaces the native confirm() dialog for destructive actions (delete, cancel order). */
export function showConfirm({ title, text, confirmButtonText = "Yes, proceed" }) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    confirmButtonColor: BRAND,
    cancelButtonColor: "#6b7280",
  }).then((result) => result.isConfirmed);
}
