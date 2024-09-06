import { NextResponse } from "next/server";
// import { getUsers } from "@/api/db/users"; // Example database function

// export async function GET() {
//   const users = await getUsers();
//   return NextResponse.json(users);
// }

export async function GET() {
  const users = [
    {
      name: "John",
    },
    {
      name: "Jane",
    },
  ];

  return NextResponse.json(users);
}

// export async function POST(request: Request) {
//   const data = await request.json();
//   // Add logic to create a new user
//   const newUser = await createUser(data);
//   return NextResponse.json(newUser);
// }
