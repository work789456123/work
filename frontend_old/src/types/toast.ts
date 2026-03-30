import type { ReactNode } from "react";

export type ToasterToast = {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
};

export type ToastState = {
  toasts: ToasterToast[];
};

export type ToastAction =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };
