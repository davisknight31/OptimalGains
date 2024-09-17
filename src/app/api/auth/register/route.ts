import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { loginUser, User } from "@/app/types/user";

export async function POST(request: NextRequest) {
  //create a user
  try {
    const body = await request.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await prisma.users.create({
      data: {
        username: body.username,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        createdAt: body.createdAt || new Date(),
      },
    });

    const safeUser: loginUser = {
      userId: newUser.userId,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json({
      message: "User created successfully",
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2002") {
        if (error.meta?.target == "username") {
          return NextResponse.json(
            { error: "User with this username already exists" },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            { error: "User with this email already exists" },
            { status: 409 }
          );
        }
      }
    }

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

// export async function POST(request: Request) {
//   const data = await request.json();
//   // Add logic to create a new user
//   const newUser = await createUser(data);
//   return NextResponse.json(newUser);
// }
