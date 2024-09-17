import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const requestRoutineId = queryParams.get("routineId");
    if (requestRoutineId) {
      const routineWorkouts = await prisma.workouts.findMany({
        where: {
          routineId: parseInt(requestRoutineId),
        },
      });

      return NextResponse.json({
        workouts: routineWorkouts,
      });
    }
  } catch (error) {
    console.error("Error retrieving workouts:", error);
  }
}

export async function POST(request: NextRequest) {
  //create a workout
  try {
    const body = await request.json();

    const newWorkout = await prisma.workouts.create({
      data: {
        routineId: body.routineId,
        workoutName: body.workoutName,
        positionInRoutine: body.positionInRoutine,
      },
    });

    return NextResponse.json({
      message: "Workout created successfully",
      workout: newWorkout,
    });
  } catch (error: any) {
    console.error("Error creating workout:", error);

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
