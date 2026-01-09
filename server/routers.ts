import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

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
        name: z.string().optional(),
        title: z.string().optional(),
        bio: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        expertise: z.string().optional(),
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
