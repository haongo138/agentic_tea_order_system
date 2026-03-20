"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSocket } from "./socket-context";
import { formatCurrency } from "@/lib/mock-data";

export interface Notification {
  readonly id: string;
  readonly type: "new_order" | "status_change";
  readonly title: string;
  readonly message: string;
  readonly orderId: number;
  readonly timestamp: number;
  readonly read: boolean;
}

interface NotificationState {
  readonly notifications: readonly Notification[];
}

type NotificationAction =
  | { type: "ADD"; notification: Notification }
  | { type: "MARK_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "DISMISS"; id: string };

function reducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        notifications: [action.notification, ...state.notifications].slice(
          0,
          50
        ),
      };
    case "MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      };
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "DISMISS":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
  }
}

interface NotificationContextValue {
  readonly notifications: readonly Notification[];
  readonly unreadCount: number;
  readonly markRead: (id: string) => void;
  readonly markAllRead: () => void;
  readonly dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markRead: () => {},
  markAllRead: () => {},
  dismiss: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocket();
  const [state, dispatch] = useReducer(reducer, { notifications: [] });

  useEffect(() => {
    if (!socket) return;

    function handleNewOrder(order: {
      id: number;
      totalPayment: string;
      customerId: number;
    }) {
      dispatch({
        type: "ADD",
        notification: {
          id: `order-${order.id}-${Date.now()}`,
          type: "new_order",
          title: "Đơn Hàng Mới",
          message: `Đơn #${order.id} — ${formatCurrency(order.totalPayment)} từ khách #${order.customerId}`,
          orderId: order.id,
          timestamp: Date.now(),
          read: false,
        },
      });
    }

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, [socket]);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    dispatch({ type: "MARK_READ", id });
  }, []);

  const markAllRead = useCallback(() => {
    dispatch({ type: "MARK_ALL_READ" });
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "DISMISS", id });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount,
        markRead,
        markAllRead,
        dismiss,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
