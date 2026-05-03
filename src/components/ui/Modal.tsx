"use client";
import { Fragment, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  size = "md",
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <Fragment>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "w-full bg-virel-dark-card border border-virel-dark-border rounded-2xl shadow-2xl animate-slide-up",
            sizeClasses[size],
            className
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between p-6 border-b border-virel-dark-border">
              <div>
                {title && (
                  <h2 className="text-xl font-semibold text-white">{title}</h2>
                )}
                {description && (
                  <p className="text-white/60 mt-1 text-sm">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors ml-4 mt-0.5"
              >
                <X size={20} />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
          {actions && (
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
              {actions}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
