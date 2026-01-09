import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  instructors, 
  InsertInstructor,
  proposals,
  InsertProposal,
  inquiries,
  InsertInquiry,
  activityLogs,
  InsertActivityLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== Instructors ====================

export async function getAllInstructors() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(instructors);
}

export async function getInstructorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(instructors).where(eq(instructors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertInstructor(instructor: Partial<InsertInstructor> & { id?: number; name?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (instructor.id) {
    // For updates, remove id from the set object
    const { id, ...updateData } = instructor;
    await db.update(instructors).set(updateData).where(eq(instructors.id, id));
    return id;
  } else {
    // For inserts, name is required
    if (!instructor.name) {
      throw new Error("Name is required for new instructor");
    }
    const result = await db.insert(instructors).values(instructor as InsertInstructor);
    return Number(result[0].insertId);
  }
}

// ==================== Proposals ====================

export async function getAllProposals() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(proposals);
}

export async function getProposalByType(type: "personal" | "corporate") {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(proposals).where(eq(proposals.type, type)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProposal(proposal: Partial<InsertProposal> & { id?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (proposal.id) {
    // For updates, remove id from the set object
    const { id, ...updateData } = proposal;
    await db.update(proposals).set(updateData).where(eq(proposals.id, id));
    return id;
  } else {
    // For inserts, required fields must be present
    if (!proposal.type || !proposal.title || !proposal.fileUrl || !proposal.fileKey) {
      throw new Error("Required fields missing for new proposal");
    }
    const result = await db.insert(proposals).values(proposal as InsertProposal);
    return Number(result[0].insertId);
  }
}

// ==================== Inquiries ====================

export async function getAllInquiries() {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function getInquiryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createInquiry(inquiry: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(inquiry);
  return Number(result[0].insertId);
}

export async function updateInquiryStatus(id: number, status: "new" | "processing" | "completed", adminNotes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set({ status, adminNotes }).where(eq(inquiries.id, id));
}

// ==================== Activity Logs ====================

export async function createActivityLog(log: InsertActivityLog) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(activityLogs).values(log);
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
}

export async function getActivityLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  return await db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp)).limit(limit);
}

export async function getActivityStats(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return { totalVisits: 0, uniqueIps: 0, pageViews: {} };
  
  const logs = await db.select()
    .from(activityLogs)
    .where(sql`${activityLogs.timestamp} >= ${startDate} AND ${activityLogs.timestamp} <= ${endDate}`);
  
  const uniqueIps = new Set(logs.map(log => log.ipAddress).filter(Boolean));
  const pageViews: Record<string, number> = {};
  
  logs.forEach(log => {
    if (log.pagePath) {
      pageViews[log.pagePath] = (pageViews[log.pagePath] || 0) + 1;
    }
  });
  
  return {
    totalVisits: logs.length,
    uniqueIps: uniqueIps.size,
    pageViews,
  };
}
