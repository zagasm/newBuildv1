// import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Default Toast Settings
const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  zIndex: 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999,
};

// Toast Functions
export const showToast = {
  success: (message) => toast.success(message, toastOptions),
  error: (message) => toast.error(message, toastOptions),
  warning: (message) => toast.warning(message, toastOptions),
  info: (message) => toast.info(message, toastOptions),
};
