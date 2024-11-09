import { auth } from "@clerk/nextjs";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

interface AnalyticsData {
  totalChallengesAttempted: number;
  totalChallengesCompleted: number;
  totalTimeSpent: number;
  totalInteractions: number;
  averageScore: number;
  heartsLeft: number;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const body: { analyticsData: AnalyticsData } = await req.json();

    await db
      .update(userProgress)
      .set({
        analyticsData: JSON.stringify(body.analyticsData), // Convert the object to a string if you store it as a single JSON field
      })
      .where(eq(userProgress.userId, userId));

    return new Response(JSON.stringify({ message: "Analytics data saved successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving analytics data:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
