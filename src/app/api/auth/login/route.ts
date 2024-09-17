import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { loginUser } from "@/app/types/user";

export async function POST(request: NextRequest) {
  //login a user
  try {
    const body = await request.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        username: body.username,
      },
    });

    if (user) {
      const passwordsAreEqual = await bcrypt.compare(
        body.password,
        user.password
      );

      if (passwordsAreEqual) {
        const safeUser: loginUser = {
          userId: user.userId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
        };

        return NextResponse.json({
          message: "User authenticated successfully",
          user: safeUser,
        });
      }
    }
  } catch (error: any) {
    console.error("Error authenticating:", error);
  }
}
