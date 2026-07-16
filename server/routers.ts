import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendContactEmail } from "./email";
import { z } from "zod";

const contactSchema = z.object({
  type: z.enum(["contact", "configurator", "b2b", "b2g"]),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  // Konfigurator
  holsterType: z.string().optional(),
  weapon: z.string().optional(),
  color: z.string().optional(),
  side: z.string().optional(),
  options: z.array(z.string()).optional(),
  // B2B
  company: z.string().optional(),
  businessType: z.string().optional(),
  orderVolume: z.string().optional(),
  customerNumber: z.string().optional(),
  reorderItems: z.string().optional(),
  // B2G
  authority: z.string().optional(),
  authorityType: z.string().optional(),
  quantity: z.string().optional(),
  classification: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    send: publicProcedure
      .input(contactSchema)
      .mutation(async ({ input }) => {
        try {
          await sendContactEmail(input);
          return { success: true, message: "E-Mail erfolgreich gesendet." };
        } catch (error) {
          console.error("[Email] Failed to send:", error);
          throw new Error("E-Mail konnte nicht gesendet werden. Bitte versuche es erneut.");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
