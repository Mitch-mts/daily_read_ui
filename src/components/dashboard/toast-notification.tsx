import type { ToastState } from "@/hooks/useReadingSession";
import { cn } from "@/lib/utils";

interface ToastNotificationProps {
  toast: ToastState;
  onDismiss: () => void;
}

export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl px-5 py-4 shadow-2xl animate-slide-up",
        toast.variant === "error"
          ? "bg-red-600 text-white"
          : toast.variant === "success"
            ? "bg-emerald-600 text-white"
            : "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900",
      )}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{toast.title}</p>
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 opacity-80 hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
