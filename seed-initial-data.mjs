import { drizzle } from "drizzle-orm/mysql2";
import { instructors, proposals } from "./drizzle/schema.js";
import { storagePut } from "./server/storage.js";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";

const db = drizzle(process.env.DATABASE_URL);

async function seedData() {
  console.log("Starting data seeding...");

  try {
    // 1. Upload instructor photo to S3
    console.log("Uploading instructor photo...");
    const instructorPhotoBuffer = readFileSync("./instructor_photo.jpg");
    const instructorPhotoKey = `instructors/photo-${nanoid()}.jpg`;
    const { url: instructorPhotoUrl } = await storagePut(
      instructorPhotoKey,
      instructorPhotoBuffer,
      "image/jpeg"
    );
    console.log("Instructor photo uploaded:", instructorPhotoUrl);

    // 2. Insert instructor data
    console.log("Inserting instructor data...");
    await db.insert(instructors).values({
      name: "권혁민",
      title: "AI 코칭 전문가",
      bio: "인공지능 분야의 전문가로서 개인과 기업을 대상으로 AI 활용 전략 코칭을 제공하고 있습니다. 최신 AI 트렌드를 반영한 실무 중심의 교육으로 고객의 성공적인 AI 도입을 지원합니다.",
      photoUrl: instructorPhotoUrl,
      photoKey: instructorPhotoKey,
      email: "kinghm10@naver.com",
      phone: "",
      expertise: "AI 코칭, 기업 컨설팅, 실행형 AI (AGENT), 생성형 AI",
    });
    console.log("Instructor data inserted");

    // 3. Upload personal proposal PDF to S3
    console.log("Uploading personal proposal PDF...");
    const personalPdfBuffer = readFileSync("./personal_proposal.pdf");
    const personalPdfKey = `proposals/personal-${nanoid()}.pdf`;
    const { url: personalPdfUrl } = await storagePut(
      personalPdfKey,
      personalPdfBuffer,
      "application/pdf"
    );
    console.log("Personal proposal PDF uploaded:", personalPdfUrl);

    // 4. Insert personal proposal data
    console.log("Inserting personal proposal data...");
    await db.insert(proposals).values({
      type: "personal",
      title: "개인 코칭 제안서",
      description: "당신이 중심입니다: 코칭의 3가지 원칙",
      fileUrl: personalPdfUrl,
      fileKey: personalPdfKey,
      fileName: "개인코칭제안서.pdf",
      fileSize: personalPdfBuffer.length,
    });
    console.log("Personal proposal data inserted");

    // 5. Upload corporate proposal PDF to S3
    console.log("Uploading corporate proposal PDF...");
    const corporatePdfBuffer = readFileSync("./corporate_proposal.pdf");
    const corporatePdfKey = `proposals/corporate-${nanoid()}.pdf`;
    const { url: corporatePdfUrl } = await storagePut(
      corporatePdfKey,
      corporatePdfBuffer,
      "application/pdf"
    );
    console.log("Corporate proposal PDF uploaded:", corporatePdfUrl);

    // 6. Insert corporate proposal data
    console.log("Inserting corporate proposal data...");
    await db.insert(proposals).values({
      type: "corporate",
      title: "기업 코칭 제안서",
      description: "기업의 AI, 새로운 시대를 열다",
      fileUrl: corporatePdfUrl,
      fileKey: corporatePdfKey,
      fileName: "기업코칭제안서.pdf",
      fileSize: corporatePdfBuffer.length,
    });
    console.log("Corporate proposal data inserted");

    console.log("✅ Data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during data seeding:", error);
    process.exit(1);
  }
}

seedData();
