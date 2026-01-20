import { drizzle } from "drizzle-orm/mysql2";
import { aiTrendSection } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedAiTrendData() {
  console.log("Seeding AI Trend Section data...");

  // Check if data already exists
  const existing = await db.select().from(aiTrendSection);
  
  if (existing.length > 0) {
    console.log("AI Trend Section data already exists. Updating...");
    await db
      .update(aiTrendSection)
      .set({
        titleKo: "AI 최신 트렌드 소개",
        titleZh: "AI最新趋势介绍",
        titleEn: "Latest AI Trends",
        subtitleKo: "매주 업데이트되는 AI 트렌드와 인사이트를 확인하세요",
        subtitleZh: "查看每周更新的AI趋势和见解",
        subtitleEn: "Check out weekly updated AI trends and insights",
        linkUrl: "https://ai-trend-platform.fplusai.biz/",
      });
  } else {
    console.log("Inserting new AI Trend Section data...");
    await db.insert(aiTrendSection).values({
      titleKo: "AI 최신 트렌드 소개",
      titleZh: "AI最新趋势介绍",
      titleEn: "Latest AI Trends",
      subtitleKo: "매주 업데이트되는 AI 트렌드와 인사이트를 확인하세요",
      subtitleZh: "查看每周更新的AI趋势和见解",
      subtitleEn: "Check out weekly updated AI trends and insights",
      linkUrl: "https://ai-trend-platform.fplusai.biz/",
    });
  }

  console.log("✅ AI Trend Section data seeded successfully!");
}

seedAiTrendData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding AI trend data:", error);
    process.exit(1);
  });
