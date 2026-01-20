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

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("aiTrend router", () => {
  it("should get AI trend section data", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.aiTrend.get();

    expect(result).toBeDefined();
    expect(result?.titleKo).toBeDefined();
    expect(result?.titleZh).toBeDefined();
    expect(result?.titleEn).toBeDefined();
    expect(result?.linkUrl).toBeDefined();
  });

  it("should update AI trend section data", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First get the existing data to get the id
    const existing = await caller.aiTrend.get();
    if (!existing) {
      throw new Error("No AI trend section found");
    }

    const updateData = {
      id: existing.id,
      titleKo: "업데이트된 AI 트렌드 제목",
      titleZh: "更新的AI趋势标题",
      titleEn: "Updated AI Trend Title",
      subtitleKo: "업데이트된 부제목",
      subtitleZh: "更新的副标题",
      subtitleEn: "Updated Subtitle",
      linkUrl: "https://updated-link.com",
    };

    const result = await caller.aiTrend.update(updateData);

    expect(result.success).toBe(true);

    // Verify the update
    const updated = await caller.aiTrend.get();
    expect(updated?.titleKo).toBe(updateData.titleKo);
    expect(updated?.titleZh).toBe(updateData.titleZh);
    expect(updated?.titleEn).toBe(updateData.titleEn);
    expect(updated?.linkUrl).toBe(updateData.linkUrl);
  });
});
