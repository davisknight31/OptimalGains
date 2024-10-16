import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const requestUserId = queryParams.get("userId");
    if (requestUserId) {
      const userPeriods = await prisma.periods.findMany({
        where: {
          userId: parseInt(requestUserId),
        },
      });

      return NextResponse.json({
        periods: userPeriods,
      });
    }
  } catch (error) {
    console.error("Error retrieving periods:", error);
  }
}

export async function POST(request: NextRequest) {
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

export async function PUT(request: NextRequest) {
  //update a period

  //if param disable current active is true, then disable, otherwise do other logic
  try {
    const body = await request.json();
    if (body.setInactive) {
      const activePeriod = await prisma.periods.findFirst({
        where: {
          active: true,
        },
      });

      if (activePeriod) {
        await prisma.periods.update({
          where: {
            periodId: activePeriod?.periodId,
            active: true,
          },
          data: {
            active: false,
          },
        });
        return NextResponse.json({
          message: "Period successfully set to inactive",
        });
      }
    }

    return NextResponse.json({
      message: "Period successfully updated",
    });
  } catch (error: any) {
    console.error("Error updating period:", error);

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
