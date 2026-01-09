import { drizzle } from "drizzle-orm/mysql2";
import { instructors } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// Update instructor with profile link
const result = await db.update(instructors)
  .set({ profileLink: "https://jrozqxgv.manus.space/" })
  .where(eq(instructors.id, 1));

console.log("✅ Instructor profile link updated successfully!");
process.exit(0);
