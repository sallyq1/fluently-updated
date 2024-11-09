import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { lessonId } }: { params: { lessonId: number } },
) {
 

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  });
  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params: { lessonId } }: { params: { lessonId: number } },
) {

  const body = await req.json();

  const data = await db
    .update(lessons)
    .set({
      ...body,
    })
    .where(eq(lessons.id, lessonId))
    .returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(
  req: Request,
  { params: { lessonId } }: { params: { lessonId: number } },
) {
  

  const data = await db
    .delete(lessons)
    .where(eq(lessons.id, lessonId))
    .returning();

  return NextResponse.json(data[0]);
}
