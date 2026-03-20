import cron from "node-cron";
import { db } from "../db";
import { orders } from "../db/schema";
import { eq, and, lte, sql } from "drizzle-orm";
import { env } from "../config/env";
import { emitOrderStatusChanged } from "../sockets/events";

async function autoDeliverOrders(): Promise<void> {
  try {
    const thresholdMinutes = env.AUTO_DELIVERY_MINUTES;

    // Find all orders in "delivering" status where orderDate is >= threshold minutes ago
    const staleOrders = await db
      .select({
        id: orders.id,
        branchId: orders.branchId,
        customerId: orders.customerId,
        status: orders.status,
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, "delivering"),
          lte(orders.orderDate, sql`NOW() - INTERVAL '${sql.raw(String(thresholdMinutes))} minutes'`)
        )
      );

    if (staleOrders.length === 0) {
      return;
    }

    console.log(
      `[scheduler] Found ${staleOrders.length} order(s) in "delivering" for >= ${thresholdMinutes} min`
    );

    for (const order of staleOrders) {
      const [updated] = await db
        .update(orders)
        .set({ status: "delivered", updatedAt: new Date() })
        .where(eq(orders.id, order.id))
        .returning();

      if (updated) {
        emitOrderStatusChanged(updated);
        console.log(`[scheduler] Order #${order.id} auto-updated to "delivered"`);
      }
    }
  } catch (err) {
    console.error("[scheduler] Error in auto-deliver job:", err);
  }
}

export function startOrderScheduler(): void {
  // Run every minute
  cron.schedule("* * * * *", autoDeliverOrders);
  console.log(
    `[scheduler] Auto-delivery job started (threshold: ${env.AUTO_DELIVERY_MINUTES} min)`
  );
}
