import { toast } from "react-toastify";

export const notify = (message, type) => {
  if (type === "info") {
    toast.info(message);
  }
  if (type === "success") {
    toast.success(message);
  }
  if (type === "warning") {
    toast.warning(message);
  }
  if (type === "error") {
    toast.error(message);
  }
  if (!type || type === "default") {
    toast(message);
  }
};
