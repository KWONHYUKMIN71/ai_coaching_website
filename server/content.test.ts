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

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
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

describe("content.getSections", () => {
  it("should return all content sections", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const sections = await caller.content.getSections();

    expect(sections).toBeDefined();
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThan(0);
    
    // Check if personal and corporate sections exist
    const personalSection = sections.find(s => s.sectionType === "personal");
    const corporateSection = sections.find(s => s.sectionType === "corporate");
    
    expect(personalSection).toBeDefined();
    expect(corporateSection).toBeDefined();
    
    // Check multilingual fields
    if (personalSection) {
      expect(personalSection.titleKo).toBeDefined();
      expect(personalSection.titleZh).toBeDefined();
      expect(personalSection.titleEn).toBeDefined();
    }
  });
});

describe("content.getSectionByType", () => {
  it("should return personal coaching section", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const section = await caller.content.getSectionByType({ type: "personal" });

    expect(section).toBeDefined();
    if (section) {
      expect(section.sectionType).toBe("personal");
      expect(section.titleKo).toBeDefined();
      expect(section.titleZh).toBeDefined();
      expect(section.titleEn).toBeDefined();
    }
  });

  it("should return corporate coaching section", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const section = await caller.content.getSectionByType({ type: "corporate" });

    expect(section).toBeDefined();
    if (section) {
      expect(section.sectionType).toBe("corporate");
      expect(section.titleKo).toBeDefined();
      expect(section.titleZh).toBeDefined();
      expect(section.titleEn).toBeDefined();
    }
  });
});

describe("content.getItemsBySectionId", () => {
  it("should return content items for a section", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get a section
    const section = await caller.content.getSectionByType({ type: "personal" });
    
    if (section) {
      const items = await caller.content.getItemsBySectionId({ sectionId: section.id });

      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBe(3); // Should have 3 items
      
      // Check multilingual fields and icon
      items.forEach(item => {
        expect(item.iconName).toBeDefined();
        expect(item.titleKo).toBeDefined();
        expect(item.titleZh).toBeDefined();
        expect(item.titleEn).toBeDefined();
        expect(item.contentKo).toBeDefined();
        expect(item.contentZh).toBeDefined();
        expect(item.contentEn).toBeDefined();
      });
    }
  });
});

describe("content.updateSection", () => {
  it("should update section with multilingual content", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.content.updateSection({
      type: "personal",
      titleKo: "테스트 제목",
      titleZh: "测试标题",
      titleEn: "Test Title",
      descriptionKo: "테스트 설명",
      descriptionZh: "测试描述",
      descriptionEn: "Test Description",
    });

    expect(result).toEqual({ success: true });
    
    // Verify the update
    const section = await caller.content.getSectionByType({ type: "personal" });
    expect(section?.titleKo).toBe("테스트 제목");
    expect(section?.titleZh).toBe("测试标题");
    expect(section?.titleEn).toBe("Test Title");
  });
});

describe("content.updateItem", () => {
  it("should update content item with multilingual content", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get a section and its items
    const section = await caller.content.getSectionByType({ type: "personal" });
    if (!section) {
      throw new Error("Section not found");
    }

    const items = await caller.content.getItemsBySectionId({ sectionId: section.id });
    if (items.length === 0) {
      throw new Error("No items found");
    }

    const firstItem = items[0];

    const result = await caller.content.updateItem({
      id: firstItem.id,
      iconName: "Target",
      titleKo: "테스트 항목",
      titleZh: "测试项目",
      titleEn: "Test Item",
      contentKo: "테스트 내용",
      contentZh: "测试内容",
      contentEn: "Test Content",
      displayOrder: firstItem.displayOrder,
    });

    expect(result).toEqual({ success: true });
    
    // Verify the update
    const updatedItems = await caller.content.getItemsBySectionId({ sectionId: section.id });
    const updatedItem = updatedItems.find(i => i.id === firstItem.id);
    
    expect(updatedItem?.titleKo).toBe("테스트 항목");
    expect(updatedItem?.titleZh).toBe("测试项目");
    expect(updatedItem?.titleEn).toBe("Test Item");
    expect(updatedItem?.iconName).toBe("Target");
  });
});
