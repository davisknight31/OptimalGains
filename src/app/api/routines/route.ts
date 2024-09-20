import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const requestUserId = queryParams.get("userId");
    if (requestUserId) {
      const userRoutines = await prisma.routines.findMany({
        where: {
          userId: parseInt(requestUserId),
        },
      });

      return NextResponse.json({
        routines: userRoutines,
      });
    }
  } catch (error) {
    console.error("Error retrieving routines:", error);
  }
}

export async function POST(request: NextRequest) {
  //create a routine
  try {
    const body = await request.json();

    const newRoutine = await prisma.routines.create({
      data: {
        userId: body.userId,
        routineName: body.routineName,
        lengthInDays: body.lengthInDays,
      },
    });

    return NextResponse.json({
      message: "Routine created successfully",
      routine: newRoutine,
    });
  } catch (error: any) {
    console.error("Error creating routine:", error);

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