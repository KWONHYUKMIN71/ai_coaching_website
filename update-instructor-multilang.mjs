import { drizzle } from "drizzle-orm/mysql2";
import { instructors } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function updateInstructorMultilang() {
  console.log("Updating instructor with multilingual data...");

  const existingInstructors = await db.select().from(instructors);
  
  if (existingInstructors.length === 0) {
    console.log("No instructors found!");
    return;
  }

  const instructor = existingInstructors[0];

  await db
    .update(instructors)
    .set({
      // Korean
      nameKo: "홍길동",
      titleKo: "AI 코칭 전문가 | 경영학 박사",
      bioKo: `20년 이상의 경영 컨설팅 및 코칭 경험을 보유한 AI 코칭 전문가입니다. 
      
개인과 기업의 AI 역량 강화를 위한 맞춤형 코칭 프로그램을 제공하며, 실질적인 성과 창출에 중점을 두고 있습니다.

국내외 다수의 기업 및 개인 고객과 함께 성공적인 AI 전환을 이루어왔으며, 체계적이고 실용적인 접근 방식으로 높은 만족도를 받고 있습니다.`,
      expertiseKo: `• AI 리더십 및 조직 혁신
• 디지털 전환 전략 수립
• 개인 역량 개발 및 커리어 코칭
• 기업 교육 프로그램 설계 및 운영`,
      
      // Chinese
      nameZh: "洪吉东",
      titleZh: "AI教练专家 | 工商管理博士",
      bioZh: `拥有20多年经营咨询和教练经验的AI教练专家。

为个人和企业提供量身定制的AI能力提升教练计划，注重创造实质性成果。

与国内外众多企业和个人客户一起成功实现了AI转型，以系统化和实用的方法获得了高度满意。`,
      expertiseZh: `• AI领导力和组织创新
• 数字化转型战略制定
• 个人能力开发和职业教练
• 企业教育计划设计和运营`,
      
      // English
      nameEn: "John Hong",
      titleEn: "AI Coaching Expert | Ph.D. in Business Administration",
      bioEn: `An AI coaching expert with over 20 years of experience in business consulting and coaching.

Provides customized coaching programs to enhance AI capabilities for individuals and businesses, with a focus on achieving tangible results.

Has successfully guided numerous domestic and international corporate and individual clients through AI transformation, earning high satisfaction through systematic and practical approaches.`,
      expertiseEn: `• AI Leadership and Organizational Innovation
• Digital Transformation Strategy Development
• Personal Capability Development and Career Coaching
• Corporate Training Program Design and Implementation`,
    })
    .where(eq(instructors.id, instructor.id));

  console.log("✅ Instructor multilingual data updated successfully!");
}

updateInstructorMultilang()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error updating instructor:", error);
    process.exit(1);
  });
