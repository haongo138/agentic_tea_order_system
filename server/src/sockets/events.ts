import { getIO } from "./index";

interface OrderWithBranch {
  readonly id: number;
  readonly branchId: number;
  readonly customerId: number | null;
  readonly [key: string]: unknown;
}

export function emitNewOrder(order: OrderWithBranch): void {
  try {
    const io = getIO();
    if (!io) {
      return;
    }

    const payload = { ...order };

    io.to(`branch:${order.branchId}`).emit("new-order", payload);
    io.to("admin").emit("new-order", payload);

    console.log(
      `[socket] Emitted new-order for order #${order.id} to branch:${order.branchId} and admin`
    );
  } catch {
    // No-op: socket emission should never break request flow
  }
}

export function emitOrderStatusChanged(order: OrderWithBranch): void {
  try {
    const io = getIO();
    if (!io) {
      return;
    }

    const payload = { ...order };

    io.to(`branch:${order.branchId}`).emit("order-status-changed", payload);
    if (order.customerId !== null) {
      io.to(`customer:${order.customerId}`).emit("order-status-changed", payload);
    }

    console.log(
      `[socket] Emitted order-status-changed for order #${order.id} to branch:${order.branchId}${order.customerId !== null ? ` and customer:${order.customerId}` : " (guest order)"}`
    );
  } catch {
    // No-op: socket emission should never break request flow
  }
}
