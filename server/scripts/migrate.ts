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

const MIGRATIONS_DIR = path.resolve(__dirname, "../supabase/migrations");

async function migrate(): Promise<void> {
  const sql = postgres(DATABASE_URL!, { max: 1 });

  try {
    // Create migrations tracking table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Get already-executed migrations
    const executed = await sql<{ name: string }[]>`
      SELECT name FROM _migrations ORDER BY name
    `;
    const executedSet = new Set(executed.map((r) => r.name));

    // Read migration files sorted by name
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migration files found.");
      return;
    }

    // If --baseline flag is passed, mark all migrations as applied without running them
    const isBaseline = process.argv.includes("--baseline");

    let applied = 0;
    for (const file of files) {
      if (executedSet.has(file)) {
        console.log(`  SKIP  ${file} (already applied)`);
        continue;
      }

      if (isBaseline) {
        console.log(`  BASE  ${file} (marked as applied)`);
        await sql`INSERT INTO _migrations (name) VALUES (${file})`;
        applied++;
        continue;
      }

      const filePath = path.join(MIGRATIONS_DIR, file);
      const content = fs.readFileSync(filePath, "utf-8");

      console.log(`  RUN   ${file}`);
      await sql.unsafe(content);
      await sql`INSERT INTO _migrations (name) VALUES (${file})`;
      applied++;
      console.log(`  DONE  ${file}`);
    }

    console.log(
      applied > 0
        ? `\nApplied ${applied} migration(s).`
        : "\nAll migrations already up to date."
    );
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
