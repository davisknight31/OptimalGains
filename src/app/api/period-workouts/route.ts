import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //create a routine
  try {
    const body = await request.json();

    const activePeriod = await prisma.periods.findFirst({
      where: {
        userId: body.userId,
        active: true,
      },
    });

    if (activePeriod) {
      return NextResponse.json({
        error: "You already have an active period.",
        period: activePeriod,
      });
    }

    const newPeriod = await prisma.periods.create({
      data: {
        userId: body.userId,
        routineId: body.routineId,
        periodName: body.periodName,
        lengthInWeeks: body.lengthInWeeks,
      },
    });

    return NextResponse.json({
      message: "Period created successfully",
      period: newPeriod,
    });
  } catch (error: any) {
    console.error("Error creating period:", error);

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
