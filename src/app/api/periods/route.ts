import prisma from "@/app/lib/prisma";
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
