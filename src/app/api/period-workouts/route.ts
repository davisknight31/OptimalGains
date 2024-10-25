import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const requestPeriodId = queryParams.get("periodId");
    if (requestPeriodId) {
      const periodWorkouts = await prisma.periodWorkouts.findMany({
        where: {
          periodId: parseInt(requestPeriodId),
        },
      });

      return NextResponse.json({
        periodWorkouts: periodWorkouts,
      });
    }
  } catch (error) {
    console.error("Error retrieving period workouts:", error);
  }
}

export async function POST(request: NextRequest) {
  //create a routine
  try {
    const body = await request.json();

    const newPeriodWorkout = await prisma.periodWorkouts.create({
      data: {
        periodId: body.periodId,
        workoutId: body.workoutId,
        periodWorkoutName: body.periodWorkoutName,
      },
    });

    return NextResponse.json({
      message: "Period workout created successfully",
      periodWorkout: newPeriodWorkout,
    });
  } catch (error: any) {
    console.error("Error creating period workout:", error);

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
