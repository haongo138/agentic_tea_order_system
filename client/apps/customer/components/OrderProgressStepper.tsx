"use client";

import {
  ShoppingCart,
  CookingPot,
  CircleCheck,
  Truck,
  PackageCheck,
  Star,
  XCircle,
} from "lucide-react";
import type { OrderStatus } from "@/lib/types";

interface ProgressStep {
  readonly key: string;
  readonly label: string;
  readonly icon: typeof ShoppingCart;
}

const PROGRESS_STEPS: readonly ProgressStep[] = [
  { key: "pending", label: "Chờ Xử Lý", icon: ShoppingCart },
  { key: "preparing", label: "Đang Pha Chế", icon: CookingPot },
  { key: "ready", label: "Sẵn Sàng", icon: CircleCheck },
  { key: "delivering", label: "Đang Giao Hàng", icon: Truck },
  { key: "delivered", label: "Đã Giao", icon: PackageCheck },
  { key: "completed", label: "Hoàn Thành", icon: Star },
] as const;

const STATUS_TO_STEP: Record<string, number> = {
  pending: 0,
  preparing: 1,
  ready: 2,
  delivering: 3,
  delivered: 4,
  completed: 5,
  // Legacy statuses (before migration)
  received: 0,
  prepared: 2,
  collected: 4,
  paid: 5,
};

interface OrderProgressStepperProps {
  readonly currentStatus: OrderStatus;
  readonly className?: string;
}

export function OrderProgressStepper({
  currentStatus,
  className = "",
}: OrderProgressStepperProps) {
  const isCancelled = currentStatus === "cancelled";
  const currentStepIndex = STATUS_TO_STEP[currentStatus] ?? -1;

  if (isCancelled) {
    return (
      <div className={`flex items-center justify-center gap-3 py-6 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
        <span className="text-sm font-medium text-red-600">Đơn hàng đã bị hủy</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-start justify-between relative">
        {/* Connector line behind steps */}
        <div className="absolute top-5 left-[calc(8.33%)] right-[calc(8.33%)] h-0.5 bg-lam-cream-200" />
        <div
          className="absolute top-5 left-[calc(8.33%)] h-0.5 bg-lam-green-600 transition-all duration-500"
          style={{
            width:
              currentStepIndex === 0
                ? "0%"
                : `${(currentStepIndex / (PROGRESS_STEPS.length - 1)) * (100 - 16.66)}%`,
          }}
        />

        {PROGRESS_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center flex-1"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-lam-green-700 text-white shadow-md"
                    : isActive
                      ? "bg-lam-green-600 text-white ring-4 ring-lam-green-200 shadow-lg"
                      : "bg-lam-cream-100 text-lam-green-400/40 border border-lam-cream-300"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <span
                className={`mt-2 text-xs text-center font-medium leading-tight ${
                  isCompleted
                    ? "text-lam-green-700"
                    : isActive
                      ? "text-lam-green-800 font-semibold"
                      : "text-lam-green-400/50"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden space-y-0">
        {PROGRESS_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isLast = index === PROGRESS_STEPS.length - 1;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isCompleted
                      ? "bg-lam-green-700 text-white"
                      : isActive
                        ? "bg-lam-green-600 text-white ring-3 ring-lam-green-200"
                        : "bg-lam-cream-100 text-lam-green-400/40 border border-lam-cream-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-6 my-1 ${
                      isCompleted ? "bg-lam-green-600" : "bg-lam-cream-200"
                    }`}
                  />
                )}
              </div>
              <div className={`pt-1.5 ${isLast ? "pb-0" : "pb-4"}`}>
                <span
                  className={`text-sm font-medium ${
                    isCompleted
                      ? "text-lam-green-700"
                      : isActive
                        ? "text-lam-green-800 font-semibold"
                        : "text-lam-green-400/50"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
