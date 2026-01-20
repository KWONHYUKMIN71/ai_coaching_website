import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Instructor router
  instructor: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllInstructors();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getInstructorById(input.id);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        // Legacy fields
        name: z.string().optional(),
        title: z.string().optional(),
        bio: z.string().optional(),
        expertise: z.string().optional(),
        // Multilingual fields
        nameKo: z.string().optional(),
        nameZh: z.string().optional(),
        nameEn: z.string().optional(),
        titleKo: z.string().optional(),
        titleZh: z.string().optional(),
        titleEn: z.string().optional(),
        bioKo: z.string().optional(),
        bioZh: z.string().optional(),
        bioEn: z.string().optional(),
        expertiseKo: z.string().optional(),
        expertiseZh: z.string().optional(),
        expertiseEn: z.string().optional(),
        // Other fields
        email: z.string().optional(),
        phone: z.string().optional(),
        profileLink: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.upsertInstructor(input);
      }),
    
    uploadPhoto: protectedProcedure
      .input(z.object({
        id: z.number(),
        photoBase64: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.photoBase64, 'base64');
        const ext = input.mimeType.split('/')[1];
        const photoKey = `instructors/photo-${nanoid()}.${ext}`;
        const { url } = await storagePut(photoKey, buffer, input.mimeType);
        
        await db.upsertInstructor({
          id: input.id,
          photoUrl: url,
          photoKey: photoKey,
        });
        
        return { url, key: photoKey };
      }),
  }),

  // Proposal router
  proposal: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllProposals();
    }),
    
    getByType: publicProcedure
      .input(z.object({ type: z.enum(["personal", "corporate"]) }))
      .query(async ({ input }) => {
        return await db.getProposalByType(input.type);
      }),
    
    upload: protectedProcedure
      .input(z.object({
        type: z.enum(["personal", "corporate"]),
        title: z.string(),
        description: z.string().optional(),
        fileBase64: z.string(),
        fileName: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileBase64, 'base64');
        const proposalKey = `proposals/${input.type}-${nanoid()}.pdf`;
        const { url } = await storagePut(proposalKey, buffer, 'application/pdf');
        
        // Check if proposal already exists
        const existing = await db.getProposalByType(input.type);
        
        const proposalId = await db.upsertProposal({
          id: existing?.id,
          type: input.type,
          title: input.title,
          description: input.description || '',
          fileUrl: url,
          fileKey: proposalKey,
          fileName: input.fileName,
          fileSize: buffer.length,
        });
        
        return { id: proposalId, url, key: proposalKey };
      }),
  }),

  // Inquiry router
  inquiry: router({
    getAll: protectedProcedure.query(async () => {
      return await db.getAllInquiries();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getInquiryById(input.id);
      }),
    
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        type: z.enum(["personal", "corporate"]),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createInquiry(input);
        
        // Send notification to owner
        const inquiryTypeLabel = input.type === "personal" ? "개인 코칭" : "기업 코칭";
        const notificationTitle = `[AI코칭 문의] ${inquiryTypeLabel}`;
        const notificationContent = `
이름: ${input.name}
이메일: ${input.email}
전화번호: ${input.phone || '미입력'}

문의 내용:
${input.message}
        `.trim();
        
        try {
          await notifyOwner({
            title: notificationTitle,
            content: notificationContent,
          });
        } catch (error) {
          console.error('[Inquiry] Failed to send notification:', error);
          // Don't fail the inquiry creation if notification fails
        }
        
        return { id };
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "processing", "completed"]),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateInquiryStatus(input.id, input.status, input.adminNotes);
        return { success: true };
      }),
  }),

  // Content router
  content: router({
    getSections: publicProcedure.query(async () => {
      return await db.getAllContentSections();
    }),
    
    getSectionByType: publicProcedure
      .input(z.object({ type: z.enum(["personal", "corporate"]) }))
      .query(async ({ input }) => {
        return await db.getContentSectionByType(input.type);
      }),
    
    getItemsBySectionId: publicProcedure
      .input(z.object({ sectionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getContentItemsBySectionId(input.sectionId);
      }),
    
    updateSection: protectedProcedure
      .input(z.object({
        type: z.enum(["personal", "corporate"]),
        titleKo: z.string(),
        titleZh: z.string(),
        titleEn: z.string(),
        descriptionKo: z.string(),
        descriptionZh: z.string(),
        descriptionEn: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { type, ...data } = input;
        await db.updateContentSection(type, data);
        return { success: true };
      }),
    
    updateItem: protectedProcedure
      .input(z.object({
        id: z.number(),
        iconName: z.string(),
        titleKo: z.string(),
        titleZh: z.string(),
        titleEn: z.string(),
        contentKo: z.string(),
        contentZh: z.string(),
        contentEn: z.string(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateContentItem(input.id, input);
        return { success: true };
      }),
  }),

  // Activity log router
  activity: router({
    log: publicProcedure
      .input(z.object({
        pageUrl: z.string(),
        pagePath: z.string(),
        referrer: z.string().optional(),
        action: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ipAddress = ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string || 'unknown';
        const userAgent = ctx.req.headers['user-agent'] || 'unknown';
        
        await db.createActivityLog({
          ipAddress,
          userAgent,
          pageUrl: input.pageUrl,
          pagePath: input.pagePath,
          referrer: input.referrer,
          action: input.action,
        });
        
        return { success: true };
      }),
    
    getLogs: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getActivityLogs(input.limit);
      }),
    
    getStats: protectedProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ input }) => {
        return await db.getActivityStats(input.startDate, input.endDate);
      }),
  }),
});

export type AppRouter = typeof appRouter;
