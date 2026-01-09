import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("inquiry.create", () => {
  it("creates a new inquiry with valid data", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiry.create({
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1234-5678",
      type: "personal",
      message: "개인 코칭에 관심이 있습니다.",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("creates a corporate inquiry", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiry.create({
      name: "김기업",
      email: "kim@company.com",
      phone: "02-1234-5678",
      type: "corporate",
      message: "기업 코칭 프로그램 문의드립니다.",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });
});

describe("inquiry.updateStatus", () => {
  it("updates inquiry status from new to processing", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create an inquiry first
    const inquiry = await caller.inquiry.create({
      name: "테스트",
      email: "test@example.com",
      phone: "010-0000-0000",
      type: "personal",
      message: "테스트 문의",
    });

    // Update status
    const result = await caller.inquiry.updateStatus({
      id: inquiry.id,
      status: "processing",
    });

    expect(result.success).toBe(true);
  });
});

describe("inquiry.updateStatus with notes", () => {
  it("updates inquiry status and adds admin notes", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create an inquiry first
    const inquiry = await caller.inquiry.create({
      name: "테스트",
      email: "test@example.com",
      phone: "010-0000-0000",
      type: "personal",
      message: "테스트 문의",
    });

    // Update status with notes
    const result = await caller.inquiry.updateStatus({
      id: inquiry.id,
      status: "processing",
      adminNotes: "고객에게 연락 완료",
    });

    expect(result.success).toBe(true);
  });
});
