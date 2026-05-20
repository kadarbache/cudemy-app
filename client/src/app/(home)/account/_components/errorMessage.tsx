import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import React from "react";

export type MessageVariant = "info" | "warning" | "error";

interface ErrorMessageProps {
  errorMessage: string | undefined;
  variant?: MessageVariant;
}

const variantStyles = {
  error: {
    container: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
    iconColor: "text-red-500",
    Icon: AlertCircle,
  },
  warning: {
    container:
      "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-500",
    Icon: AlertTriangle,
  },
  info: {
    container:
      "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    iconColor: "text-blue-500",
    Icon: Info,
  },
};

export default function ErrorMessage({
  errorMessage,
  variant = "error",
}: ErrorMessageProps) {
  if (!errorMessage) return null;

  const style = variantStyles[variant] || variantStyles.error;
  const { Icon, container, iconColor } = style;

  return (
    <div
      className={`mx-6 mb-4 p-3 border rounded-lg flex items-start gap-3 transition-all duration-200 ${container}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <p className="text-sm font-medium">{errorMessage}</p>
    </div>
  );
}
