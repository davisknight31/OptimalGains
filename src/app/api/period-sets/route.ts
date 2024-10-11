import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const requestPeriodExerciseId = queryParams.get("periodExerciseId");
    if (requestPeriodExerciseId) {
      const periodExerciseSets = await prisma.periodSets.findMany({
        where: {
          periodExerciseId: parseInt(requestPeriodExerciseId),
        },
      });

      return NextResponse.json({
        periodSets: periodExerciseSets,
      });
    }
  } catch (error) {
    console.error("Error retrieving period sets:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newPeriodSet = await prisma.periodSets.create({
      data: {
        periodExerciseId: body.periodExerciseId,
        setNumber: body.setNumber,
        targetReps: body.targetReps,
        actualReps: body.actualReps,
        weight: body.weight,
      },
    });

    return NextResponse.json({
      message: "Period set created successfully",
      periodSet: newPeriodSet,
    });
  } catch (error: any) {
    console.error("Error creating period set:", error);

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
