"use client";

import {
  UNSTABLE_ToastRegion as ToastRegion,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastQueue as ToastQueue,
  Button,
} from "react-aria-components";
import { motion } from "motion/react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastContent {
  message: string;
  variant?: ToastVariant;
  title?: string;
}

export const toastQueue = new ToastQueue<ToastContent>({
  maxVisibleToasts: 5,
});

export const toast = {
  success: (message: string, title?: string) =>
    toastQueue.add({ message, variant: "success", title }, { timeout: 5000 }),
  error: (message: string, title?: string) =>
    toastQueue.add({ message, variant: "error", title }, { timeout: 5000 }),
  info: (message: string, title?: string) =>
    toastQueue.add({ message, variant: "info", title }, { timeout: 5000 }),
  warning: (message: string, title?: string) =>
    toastQueue.add({ message, variant: "warning", title }, { timeout: 5000 }),
};

const MotionToast = motion.create(Toast);

const variantConfig = {
  success: {
    bg: "bg-green-600",
    icon: CheckCircle,
    border: "border-green-500",
  },
  error: {
    bg: "bg-red-600",
    icon: XCircle,
    border: "border-red-500",
  },
  info: {
    bg: "bg-blue-600",
    icon: Info,
    border: "border-blue-500",
  },
  warning: {
    bg: "bg-yellow-600",
    icon: AlertTriangle,
    border: "border-yellow-500",
  },
};

export default function ToastProvider() {
  return (
    <ToastRegion
      queue={toastQueue}
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {({ toast: toastItem }) => {
        const variant = toastItem.content.variant || "info";
        const config = variantConfig[variant];
        const Icon = config.icon;

        return (
          <MotionToast
            key={toastItem.key}
            toast={toastItem}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className={`flex items-start gap-3 rounded-lg ${config.bg} text-white px-4 py-3 shadow-lg min-w-[280px] max-w-md border-l-4 ${config.border}`}
          >
            {/* Icon */}
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              {toastItem.content.title && (
                <div className="font-semibold text-sm mb-1">
                  {toastItem.content.title}
                </div>
              )}
              <div className="text-sm text-white/90">
                {toastItem.content.message}
              </div>
            </div>

            {/* Close button */}
            <Button
              slot="close"
              aria-label="Close notification"
              className="text-white/70 hover:text-white transition shrink-0 -mt-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </MotionToast>
        );
      }}
    </ToastRegion>
  );
}
