import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useNotificationActions() {
  const [loading, setLoading] = useState(false);

  const notify = useCallback((message, type = "info", options = {}) => {
    const toastOptions = {
      duration: 5000,
      ...options,
    };

    switch (type) {
      case "success":
        toast.success(message, toastOptions);
        break;
      case "error":
        toast.error(message, toastOptions);
        break;
      case "warning":
        toast.warning(message, toastOptions);
        break;
      case "info":
      default:
        toast.info(message, toastOptions);
        break;
    }
  }, []);

  const notifyLoading = useCallback((message) => {
    return toast.loading(message, { id: "loading" });
  }, []);

  const dismissLoading = useCallback((message, type = "success") => {
    switch (type) {
      case "success":
        toast.success(message, { id: "loading" });
        break;
      case "error":
        toast.error(message, { id: "loading" });
        break;
      default:
        toast(message, { id: "loading" });
    }
  }, []);

  return {
    notify,
    notifyLoading,
    dismissLoading,
    loading,
    setLoading,
  };
}
