import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const habitRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const habit = await ctx.prisma.habit.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
      const tracking = await ctx.prisma.tracking.create({
        data: {
          date: new Date(),
          completed: false,
          habitId: habit.id,
        },
      });
      return {
        ...habit,
        tracking,
      };
    }),
  getall: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.habit.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        Completed: true,
      },
    });
  }),
  createOrUpdateTracking: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // const tracking = await ctx.prisma.tracking.findUnique();
    }),
});
