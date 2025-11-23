
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/utils/connect";
import { UserModel } from "@/models/UserModel";


export async function POST(request) {
  const { username, email, password } = await request.json();
  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const existingByEmail = await UserModel.findOne({email});
    if (existingByEmail) {
      return NextResponse.json(
        { error: "This email already exist"},
        { status: 400 }
      );
    }

    const existingByUsername = await UserModel.findOne({ username });
    if (existingByUsername) {
      return NextResponse.json(
        { error: "This username already exist" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully"},
      { status: 200 }
    );
  } catch (error) {
    console.error("User Creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
