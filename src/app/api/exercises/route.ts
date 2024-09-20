import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //returns all exercises for now, but could add param for filtering by muscle group later
  try {
    // const url = new URL(request.url);
    // const queryParams = url.searchParams;

    const exercises = await prisma.exercises.findMany();

    return NextResponse.json({
      exercises: exercises,
    });
  } catch (error) {
    console.error("Error retrieving workouts:", error);
  }
}

// don't want to add a POST since this table should not be altered by the user
