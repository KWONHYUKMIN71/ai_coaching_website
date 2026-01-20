import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 강사 정보 테이블
 * 강사의 프로필, 사진, 경력 등을 저장합니다.
 */
export const instructors = mysqlTable("instructors", {
  id: int("id").autoincrement().primaryKey(),
  // Legacy fields (kept for backward compatibility)
  name: varchar("name", { length: 100 }),
  title: varchar("title", { length: 200 }),
  bio: text("bio"),
  expertise: text("expertise"),
  // Multilingual fields
  nameKo: varchar("nameKo", { length: 100 }),
  nameZh: varchar("nameZh", { length: 100 }),
  nameEn: varchar("nameEn", { length: 100 }),
  titleKo: varchar("titleKo", { length: 200 }),
  titleZh: varchar("titleZh", { length: 200 }),
  titleEn: varchar("titleEn", { length: 200 }),
  bioKo: text("bioKo"),
  bioZh: text("bioZh"),
  bioEn: text("bioEn"),
  expertiseKo: text("expertiseKo"),
  expertiseZh: text("expertiseZh"),
  expertiseEn: text("expertiseEn"),
  // Other fields
  photoUrl: varchar("photoUrl", { length: 500 }),
  photoKey: varchar("photoKey", { length: 500 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  profileLink: varchar("profileLink", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Instructor = typeof instructors.$inferSelect;
export type InsertInstructor = typeof instructors.$inferInsert;

/**
 * 제안서 테이블
 * 개인 코칭 및 기업 코칭 제안서 PDF 파일 정보를 저장합니다.
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["personal", "corporate"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileName: varchar("fileName", { length: 200 }),
  fileSize: int("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * 문의 테이블
 * 고객의 문의 사항을 저장합니다.
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  type: mysqlEnum("type", ["personal", "corporate"]).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "processing", "completed"]).default("new").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * 활동 로그 테이블
 * 사용자의 접속 현황 및 활동을 기록합니다.
 */
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  ipAddress: varchar("ipAddress", { length: 100 }),
  userAgent: text("userAgent"),
  pageUrl: varchar("pageUrl", { length: 500 }),
  pagePath: varchar("pagePath", { length: 500 }),
  referrer: varchar("referrer", { length: 500 }),
  action: varchar("action", { length: 100 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

/**
 * 콘텐츠 섹션 테이블 (다국어 지원)
 * 개인 코칭 및 기업 코칭 섹션의 제목과 설명을 저장합니다.
 */
export const contentSections = mysqlTable("contentSections", {
  id: int("id").autoincrement().primaryKey(),
  sectionType: mysqlEnum("sectionType", ["personal", "corporate"]).notNull().unique(),
  titleKo: varchar("titleKo", { length: 200 }).notNull(),
  titleZh: varchar("titleZh", { length: 200 }).notNull(),
  titleEn: varchar("titleEn", { length: 200 }).notNull(),
  descriptionKo: text("descriptionKo").notNull(),
  descriptionZh: text("descriptionZh").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: mysqlEnum("isActive", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = typeof contentSections.$inferInsert;

/**
 * 콘텐츠 항목 테이블 (다국어 지원)
 * 각 섹션의 하위 항목(아이콘, 제목, 내용)을 저장합니다.
 */
export const contentItems = mysqlTable("contentItems", {
  id: int("id").autoincrement().primaryKey(),
  sectionId: int("sectionId").notNull(), // contentSections.id 참조
  iconName: varchar("iconName", { length: 50 }).notNull(),
  titleKo: varchar("titleKo", { length: 200 }).notNull(),
  titleZh: varchar("titleZh", { length: 200 }).notNull(),
  titleEn: varchar("titleEn", { length: 200 }).notNull(),
  contentKo: text("contentKo").notNull(),
  contentZh: text("contentZh").notNull(),
  contentEn: text("contentEn").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = typeof contentItems.$inferInsert;


/**
 * AI Trend Section table
 * Stores AI trend section information with multilingual support
 */
export const aiTrendSection = mysqlTable("aiTrendSection", {
  id: int("id").autoincrement().primaryKey(),
  titleKo: text("titleKo"),
  titleZh: text("titleZh"),
  titleEn: text("titleEn"),
  subtitleKo: text("subtitleKo"),
  subtitleZh: text("subtitleZh"),
  subtitleEn: text("subtitleEn"),
  linkUrl: varchar("linkUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiTrendSection = typeof aiTrendSection.$inferSelect;
export type InsertAiTrendSection = typeof aiTrendSection.$inferInsert;
