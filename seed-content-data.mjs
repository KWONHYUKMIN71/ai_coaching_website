import { drizzle } from "drizzle-orm/mysql2";
import { contentSections, contentItems } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedContentData() {
  console.log("🌱 Seeding content data...");

  try {
    // 1. 개인 코칭 섹션 생성
    const [personalSection] = await db.insert(contentSections).values({
      sectionType: "personal",
      titleKo: "당신이 중심입니다: 코칭의 3가지 원칙",
      titleZh: "以您为中心：辅导的3个原则",
      titleEn: "You Are the Center: 3 Principles of Coaching",
      descriptionKo: "독구는 그 다음 문제입니다. 당신의 생각과 목표를 먼저 정리합니다.",
      descriptionZh: "工具是次要问题。首先整理您的想法和目标。",
      descriptionEn: "Tools are secondary. We organize your thoughts and goals first.",
      displayOrder: 1,
      isActive: "active",
    }).$returningId();

    console.log("✅ Personal coaching section created:", personalSection);

    // 2. 개인 코칭 하위 항목 생성
    await db.insert(contentItems).values([
      {
        sectionId: personalSection.id,
        iconName: "User",
        titleKo: "개인의 목표와 사고 구조 먼저 정리",
        titleZh: "首先整理个人目标和思维结构",
        titleEn: "Organize Personal Goals and Thinking Structure First",
        contentKo: "독구는 그 다음 문제입니다. 당신의 생각을 먼저 문제입니다.",
        contentZh: "工具是次要问题。首先是您的想法。",
        contentEn: "Tools are secondary. Your thoughts come first.",
        displayOrder: 1,
      },
      {
        sectionId: personalSection.id,
        iconName: "CheckCircle",
        titleKo: "\"진짜 AI가 필요한지\"부터 판단",
        titleZh: "首先判断\"是否真的需要AI\"",
        titleEn: "Determine \"Do You Really Need AI\" First",
        contentKo: "AI가 만능 해결사는 아닙니다. 현재 상황에서 AI가 현실 상황에서 AI가 진짜 필요한지 함께 진단합니다.",
        contentZh: "AI不是万能的解决方案。我们一起诊断在当前情况下是否真的需要AI。",
        contentEn: "AI is not a universal solution. We diagnose together whether AI is really needed in your current situation.",
        displayOrder: 2,
      },
      {
        sectionId: personalSection.id,
        iconName: "TrendingUp",
        titleKo: "필요할 때마다 다음 단계로 진행",
        titleZh: "根据需要进入下一阶段",
        titleEn: "Move to the Next Stage as Needed",
        contentKo: "1차 미팅 후, 상황 필요하면 다음 단계로 진행합니다. 불필요한 과정은 건너뜁니다.",
        contentZh: "第一次会议后，如果需要，我们将进入下一阶段。跳过不必要的过程。",
        contentEn: "After the first meeting, we move to the next stage if needed. We skip unnecessary processes.",
        displayOrder: 3,
      },
    ]);

    console.log("✅ Personal coaching items created");

    // 3. 기업 코칭 섹션 생성
    const [corporateSection] = await db.insert(contentSections).values({
      sectionType: "corporate",
      titleKo: "기업의 성장을 위한 맞춤형 AI 코칭",
      titleZh: "为企业增长量身定制的AI辅导",
      titleEn: "Customized AI Coaching for Corporate Growth",
      descriptionKo: "조직의 목표와 현황을 분석하여 실질적인 AI 도입 전략을 수립합니다.",
      descriptionZh: "分析组织的目标和现状，制定实际的AI引入策略。",
      descriptionEn: "We analyze organizational goals and current status to establish a practical AI adoption strategy.",
      displayOrder: 2,
      isActive: "active",
    }).$returningId();

    console.log("✅ Corporate coaching section created:", corporateSection);

    // 4. 기업 코칭 하위 항목 생성
    await db.insert(contentItems).values([
      {
        sectionId: corporateSection.id,
        iconName: "Briefcase",
        titleKo: "조직 진단 및 AI 준비도 평가",
        titleZh: "组织诊断和AI准备度评估",
        titleEn: "Organizational Diagnosis and AI Readiness Assessment",
        contentKo: "현재 조직의 업무 프로세스와 데이터 현황을 분석하여 AI 도입 가능성을 평가합니다.",
        contentZh: "分析当前组织的业务流程和数据状况，评估AI引入的可能性。",
        contentEn: "We analyze current organizational workflows and data status to assess AI adoption feasibility.",
        displayOrder: 1,
      },
      {
        sectionId: corporateSection.id,
        iconName: "Users",
        titleKo: "팀별 맞춤형 교육 프로그램",
        titleZh: "按团队定制的培训计划",
        titleEn: "Team-Specific Training Programs",
        contentKo: "각 부서의 특성에 맞는 AI 활용 교육을 제공하여 실무 적용력을 높입니다.",
        contentZh: "提供适合各部门特点的AI应用培训，提高实际应用能力。",
        contentEn: "We provide AI utilization training tailored to each department's characteristics to enhance practical application.",
        displayOrder: 2,
      },
      {
        sectionId: corporateSection.id,
        iconName: "BarChart",
        titleKo: "성과 측정 및 지속적 개선",
        titleZh: "绩效测量和持续改进",
        titleEn: "Performance Measurement and Continuous Improvement",
        contentKo: "AI 도입 후 성과를 측정하고 지속적인 개선 방안을 제시합니다.",
        contentZh: "测量AI引入后的绩效，并提出持续改进方案。",
        contentEn: "We measure performance after AI adoption and suggest continuous improvement strategies.",
        displayOrder: 3,
      },
    ]);

    console.log("✅ Corporate coaching items created");

    console.log("🎉 Content data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding content data:", error);
    throw error;
  }
}

seedContentData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
