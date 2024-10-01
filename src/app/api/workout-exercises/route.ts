import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const requestWorkoutId = queryParams.get("workoutId");
    if (requestWorkoutId) {
      const workoutExercises = await prisma.workoutExercises.findMany({
        where: {
          workoutId: parseInt(requestWorkoutId),
        },
      });

      return NextResponse.json({
        workoutExercises: workoutExercises,
      });
    }
  } catch (error) {
    console.error("Error retrieving workouts:", error);
  }
}

export async function POST(request: NextRequest) {
  //create a workout exercise
  try {
    const body = await request.json();

    const newWorkoutExercise = await prisma.workoutExercises.create({
      data: {
        workoutId: body.workoutId,
        exerciseId: body.exerciseId,
        sets: body.sets,
        positionInWorkout: body.positionInWorkout,
      },
    });

    return NextResponse.json({
      message: "Workout exercise created successfully",
      workoutExercise: newWorkoutExercise,
    });
  } catch (error: any) {
    console.error("Error creating workout exercise:", error);

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

export async function PUT(request: NextRequest) {
  //update a workout exericse
  try {
    const body = await request.json();

    const updatedWorkoutExercise = await prisma.workoutExercises.update({
      where: {
        workoutExerciseId: body.workoutExerciseId,
      },
      data: {
        exerciseId: body.exerciseId,
        sets: body.sets,
        positionInWorkout: body.positionInWorkout,
      },
    });

    return NextResponse.json({
      message: "Workout exercise updated successfully",
      workoutExercise: updatedWorkoutExercise,
    });
  } catch (error: any) {
    console.error("Error updating workout exercise:", error);

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
