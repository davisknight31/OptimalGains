import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const requestPeriodWorkoutId = queryParams.get("periodWorkoutId");
    if (requestPeriodWorkoutId) {
      const periodWorkoutExercises = await prisma.periodExercises.findMany({
        where: {
          periodWorkoutId: parseInt(requestPeriodWorkoutId),
        },
      });

      return NextResponse.json({
        periodExercises: periodWorkoutExercises,
      });
    }
  } catch (error) {
    console.error("Error retrieving period exercises:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newPeriodExercise = await prisma.periodExercises.create({
      data: {
        periodWorkoutId: body.periodWorkoutId,
        workoutExerciseId: body.workoutExerciseId,
      },
    });

    return NextResponse.json({
      message: "Period exercise created successfully",
      periodExercise: newPeriodExercise,
    });
  } catch (error: any) {
    console.error("Error creating period exercise:", error);

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
