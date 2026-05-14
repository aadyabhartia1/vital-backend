import { Request, Response } from "express";
import OpenAI from "openai";
import prisma from "../prisma";
import { getAuth } from "@clerk/express";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithAssistant = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const clerkId = getAuth(req).userId;

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Fetch user context for the AI
    const recentLogs = await prisma.healthLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
    });

    // Construct context string
    let contextStr = `User context:\n`;
    if (recentLogs.length > 0) {
      const latest = recentLogs[0];
      contextStr += `- Latest log: Calories: ${latest.calories}, Water: ${latest.waterIntake}L, Sleep: ${latest.sleepHours}h (Quality: ${latest.sleepQuality}%), Mood: ${latest.mood}, Stress: ${latest.stressLevel}/100, Activity: ${latest.activityScore}/100.\n`;
    }
    if (habits.length > 0) {
      contextStr += `- Habits: ${habits.map((h) => `${h.title} (${h.completed ? "Done" : "Pending"})`).join(", ")}\n`;
    }

    const systemPrompt = `You are Vitalis, a highly advanced, premium AI health assistant.
You provide concise, actionable, and encouraging health advice based on user data.
Always respond in markdown, use bullet points where helpful, and maintain a friendly but professional "expert" tone.
${contextStr}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast and cheap model for dev
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    res.json({
      status: "success",
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
};
