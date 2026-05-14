import { Request, Response } from "express";
import prisma from "../prisma";
import { getAuth } from "@clerk/express";

// Helper to get or create user based on Clerk ID
const getOrCreateUser = async (clerkId: string) => {
  return await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      name: "Vitalis User", // In a real app, sync this from Clerk webhook
      email: `${clerkId}@placeholder.com`, // Sync from webhook
    },
  });
};

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const clerkId = getAuth(req).userId as string;
    const user = await getOrCreateUser(clerkId);

    // Fetch user's data
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayLog = await prisma.healthLog.findFirst({
      where: { userId: user.id, createdAt: { gte: todayStart } },
    });

    const weeklyLogs = await prisma.healthLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 7,
    });

    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
    });

    const insights = await prisma.aIInsight.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    res.json({
      status: "success",
      data: {
        todayLog: todayLog || { calories: 0, waterIntake: 0, sleepHours: 0, sleepQuality: 0, heartRate: 0, mood: "neutral", stressLevel: 0, activityScore: 0 },
        weeklyLogs: weeklyLogs.reverse(), // oldest to newest for charts
        habits,
        insights,
        wellnessScore: 82, // AI computed later
        streakDays: 12,
        xpTotal: 2450,
        level: 7,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const addWater = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const clerkId = getAuth(req).userId as string;
    const user = await getOrCreateUser(clerkId);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Upsert today's log
    const todayLog = await prisma.healthLog.findFirst({
      where: { userId: user.id, createdAt: { gte: todayStart } },
    });

    if (todayLog) {
      const updated = await prisma.healthLog.update({
        where: { id: todayLog.id },
        data: { waterIntake: todayLog.waterIntake + amount },
      });
      res.json({ status: "success", data: updated });
    } else {
      const created = await prisma.healthLog.create({
        data: { userId: user.id, waterIntake: amount },
      });
      res.json({ status: "success", data: created });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update water intake" });
  }
};

export const logMood = async (req: Request, res: Response) => {
  try {
    const { mood } = req.body;
    const clerkId = getAuth(req).userId as string;
    const user = await getOrCreateUser(clerkId);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayLog = await prisma.healthLog.findFirst({
      where: { userId: user.id, createdAt: { gte: todayStart } },
    });

    if (todayLog) {
      const updated = await prisma.healthLog.update({
        where: { id: todayLog.id },
        data: { mood },
      });
      res.json({ status: "success", data: updated });
    } else {
      const created = await prisma.healthLog.create({
        data: { userId: user.id, mood },
      });
      res.json({ status: "success", data: created });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to log mood" });
  }
};

export const logMetrics = async (req: Request, res: Response) => {
  try {
    const { sleepHours, heartRate, activityScore, waterIntake } = req.body;
    const clerkId = getAuth(req).userId as string;
    const user = await getOrCreateUser(clerkId);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayLog = await prisma.healthLog.findFirst({
      where: { userId: user.id, createdAt: { gte: todayStart } },
    });

    const updateData: any = {};
    if (sleepHours !== undefined) updateData.sleepHours = sleepHours;
    if (heartRate !== undefined) updateData.heartRate = heartRate;
    if (activityScore !== undefined) updateData.activityScore = activityScore;
    if (waterIntake !== undefined) updateData.waterIntake = waterIntake;

    if (todayLog) {
      const updated = await prisma.healthLog.update({
        where: { id: todayLog.id },
        data: updateData,
      });
      res.json({ status: "success", data: updated });
    } else {
      const created = await prisma.healthLog.create({
        data: { userId: user.id, ...updateData },
      });
      res.json({ status: "success", data: created });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update metrics" });
  }
};
