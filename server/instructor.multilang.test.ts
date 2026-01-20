import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-admin",
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
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("instructor.update with multilingual fields", () => {
  it("updates instructor with Korean, Chinese, and English data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get existing instructor
    const instructors = await caller.instructor.getAll();
    expect(instructors.length).toBeGreaterThan(0);
    
    const instructor = instructors[0];
    expect(instructor).toBeDefined();

    // Update with multilingual data
    await caller.instructor.update({
      id: instructor!.id,
      nameKo: "홍길동 테스트",
      nameZh: "洪吉东测试",
      nameEn: "John Hong Test",
      titleKo: "AI 코칭 전문가 (테스트)",
      titleZh: "AI教练专家（测试）",
      titleEn: "AI Coaching Expert (Test)",
      bioKo: "한국어 소개 테스트",
      bioZh: "中文简介测试",
      bioEn: "English bio test",
      expertiseKo: "한국어 전문분야",
      expertiseZh: "中文专业领域",
      expertiseEn: "English expertise",
    });

    // Verify update
    const updatedInstructors = await caller.instructor.getAll();
    const updatedInstructor = updatedInstructors[0];

    expect(updatedInstructor?.nameKo).toBe("홍길동 테스트");
    expect(updatedInstructor?.nameZh).toBe("洪吉东测试");
    expect(updatedInstructor?.nameEn).toBe("John Hong Test");
    expect(updatedInstructor?.titleKo).toBe("AI 코칭 전문가 (테스트)");
    expect(updatedInstructor?.titleZh).toBe("AI教练专家（测试）");
    expect(updatedInstructor?.titleEn).toBe("AI Coaching Expert (Test)");
    expect(updatedInstructor?.bioKo).toBe("한국어 소개 테스트");
    expect(updatedInstructor?.bioZh).toBe("中文简介测试");
    expect(updatedInstructor?.bioEn).toBe("English bio test");
    expect(updatedInstructor?.expertiseKo).toBe("한국어 전문분야");
    expect(updatedInstructor?.expertiseZh).toBe("中文专业领域");
    expect(updatedInstructor?.expertiseEn).toBe("English expertise");
  });

  it("allows partial updates of multilingual fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const instructors = await caller.instructor.getAll();
    const instructor = instructors[0];
    expect(instructor).toBeDefined();

    // Update only Korean fields
    await caller.instructor.update({
      id: instructor!.id,
      nameKo: "부분 업데이트",
      titleKo: "부분 업데이트 테스트",
    });

    const updatedInstructors = await caller.instructor.getAll();
    const updatedInstructor = updatedInstructors[0];

    expect(updatedInstructor?.nameKo).toBe("부분 업데이트");
    expect(updatedInstructor?.titleKo).toBe("부분 업데이트 테스트");
    // Other fields should remain unchanged
    expect(updatedInstructor?.nameZh).toBeDefined();
    expect(updatedInstructor?.nameEn).toBeDefined();
  });
});
