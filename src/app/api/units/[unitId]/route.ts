import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { unitId } }: { params: { unitId: number } },
) {
  
  const data = await db.query.units.findFirst({
    where: eq(units.id, unitId),
  });
  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params: { unitId } }: { params: { unitId: number } },
) {


  const body = await req.json();

  const data = await db
    .update(units)
    .set({
      ...body,
    })
    .where(eq(units.id, unitId))
    .returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(
  req: Request,
  { params: { unitId } }: { params: { unitId: number } },
) {


  const data = await db.delete(units).where(eq(units.id, unitId)).returning();

  return NextResponse.json(data[0]);
}
