import { cache } from "react";

import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import db from "./drizzle";
import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
  userSubscription,
} from "./schema";

interface AnalyticsData {
  totalChallengesAttempted: number;
  totalChallengesCompleted: number;
  totalTimeSpent: number;
  totalInteractions: number;
  averageScore: number;
  heartsLeft: number;
}


export const saveAnalyticsData = async (analyticsData:AnalyticsData) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Upsert analytics data to the user progress table (or a dedicated analytics table)
  await db
    .update(userProgress)
    .set({
      analyticsData: JSON.stringify(analyticsData), 
    })
    .where(eq(userProgress.userId, userId));
};

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});

export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) return [];

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((units) => {
    const lessonWithCompletedStatus = units.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false };
      }
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });

      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...units, lessons: lessonWithCompletedStatus };
  });

  return normalizedData;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  });

  return data;
});

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const firstUnCompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(
            (progress) => progress.completed === false,
          )
        );
      });
    });

  return {
    activeLesson: firstUnCompletedLesson,
    activeLessonId: firstUnCompletedLesson?.id,
  };
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) {
    return null;
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return {
    ...data,
    challenges: normalizedChallenges,
  };
});

const DAT_IN_MS = 86_400_000;
export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed,
  );

  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100,
  );

  return percentage;
});

export const getUserSubscription = cache(async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!data) return null;

  // Add plus day free
  const isActive =
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd.getTime() + DAT_IN_MS > Date.now();

  return {
    ...data,
    isActive: !!isActive,
  };
});

export const getTopTenUsers = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  });

  return data;
});

// export const saveAnalytics = async (analyticsData) => {
//   const { userId } = await auth();

//   if (!userId) {
//     throw new Error("Unauthorized");
//   }

//   const currentUserProgress = await db.query.userProgress.findFirst({
//     where: eq(userProgress.userId, userId),
//   });

//   if (!currentUserProgress) {
//     throw new Error("User progress not found");
//   }

//   // Update user progress with the new analytics data
//   await db
//     .update(userProgress)
//     .set({
//       totalChallengesAttempted:
//         (currentUserProgress.totalChallengesAttempted || 0) +
//         (analyticsData.totalChallengesAttempted || 0),
//       totalChallengesCompleted:
//         (currentUserProgress.totalChallengesCompleted || 0) +
//         (analyticsData.totalChallengesCompleted || 0),
//       totalTimeSpent:
//         (currentUserProgress.totalTimeSpent || 0) + (analyticsData.totalTimeSpent || 0),
//       totalInteractions:
//         (currentUserProgress.totalInteractions || 0) +
//         (analyticsData.totalInteractions || 0),
//       averageScore: analyticsData.averageScore || currentUserProgress.averageScore,
//       hearts: analyticsData.heartsLeft || currentUserProgress.hearts,
//     })
//     .where(eq(userProgress.userId, userId));
// };

// export const getIsAdmin = cache(async () => {
//   const { userId } = auth();

//   if (!userId) {
//     return false;
//   }

//   const isAdmin = await db.query.admin.findFirst({
//     where: eq(admin.userId, userId),
//   });

//   return !!isAdmin;
// });
