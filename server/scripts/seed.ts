import * as fs from "fs";
import * as path from "path";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const SEED_FILE = path.resolve(__dirname, "seed.sql");

async function seed(): Promise<void> {
  const sql = postgres(DATABASE_URL!, { max: 1 });

  try {
    const content = fs.readFileSync(SEED_FILE, "utf-8");

    console.log("Seeding database...\n");
    await sql.unsafe(content);
    console.log("Database seeded successfully!");

    // Print summary
    const tables = [
      "accounts", "customers", "branches", "product_categories", "sizes",
      "toppings", "vouchers", "products", "employees", "branch_product_status",
      "orders", "order_details", "order_toppings", "reviews", "news",
      "media", "loyalty_history", "customer_vouchers",
    ];

    console.log("\nRecord counts:");
    for (const table of tables) {
      const result = await sql.unsafe(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${result[0].count}`);
    }
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seed();
