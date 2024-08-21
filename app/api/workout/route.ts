import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  times: z.number().int().positive(),
  weight: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  if (prisma === null) {
    return NextResponse.json(
      { message: "Prisma is not enabled" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const validataion = createWorkoutSchema.safeParse(body);

  if (!validataion.success)
    return NextResponse.json(validataion.error.errors, { status: 400 });

  const newWorkout = await prisma.workout.create({
    data: {
      name: body.name,
      description: body.description,
      times: body.times,
      weight: body.weight,
    },
  });

  return NextResponse.json(newWorkout, { status: 201 });
}
