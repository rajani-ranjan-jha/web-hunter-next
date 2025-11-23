import { connectDB } from "@/app/utils/connect";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({
        message: "email is required!",
        success: false,
      });
    }

    await connectDB();
    const user = await UserModel.findOne({ email: email });
    const isAdmin = user.role == "admin";

    return NextResponse.json({
      message: "user status received!",
      success: isAdmin,
    });
  } catch (error) {
    console.error(error);
  }
}
