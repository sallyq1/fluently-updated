import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";

export async function GET(req: Request) {

  const data = await db.query.courses.findMany();

  return NextResponse.json(data);
}

export async function POST(req: Request) {

  const body = await req.json();

  const data = await db
    .insert(courses)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
}
