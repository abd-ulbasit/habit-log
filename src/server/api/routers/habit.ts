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
  createTrcking: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.tracking.create({
        data: {
          habitId: input.habitId,
          date: new Date(),
        },
      });
    }),
  UpdateTracking: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // const tracking = await ctx.prisma.tracking.findUnique();
      const tracking = await ctx.prisma.tracking.findUnique({
        where: { id: input.id },
      });
      if (!tracking) return;
      return await ctx.prisma.tracking.update({
        where: {
          id: input.id,
        },
        data: {
          completed: !tracking.completed,
          date: new Date(),
        },
      });
    }),
  deleteHabit: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.habit.delete({
        where: {
          id: input.id,
        },
      });
    }),
  addPomodoroSession: protectedProcedure.mutation(async ({ ctx }) => {
    let pomodoro = await ctx.prisma.habit.findFirst({
      where: {
        userId: ctx.session.user.id,
        name: "POMODORO",
      },
    });
    if (!pomodoro) {
      pomodoro = await ctx.prisma.habit.create({
        data: {
          name: "POMODORO",
          userId: ctx.session.user.id,
        },
      });
    }
    return await ctx.prisma.tracking.create({
      data: {
        date: new Date(),
        habitId: pomodoro.id,
        completed: true,
      },
    });
  }),
});
