import { connectDB } from "@/app/utils/connect";
import { WebModel } from "@/models/website";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { arr } = await request.json();
  if (!arr || !Array.isArray(arr) || arr.length == 0) {
    return NextResponse.json({
      message: "not a valid data type",
      status: 400,
    });
  }

  console.log("goint to add: ", arr);
  try {
    await connectDB();
    const added = await WebModel.insertMany(arr, { ordered: false });
    console.log("added data: ", added);
    return NextResponse.json({ message: "all SHEET data added!", status: 200 });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return NextResponse.json({ message: "Data added, duplicates skipped!", status: 200 });
    }
    return NextResponse.json({ message: error.message, status: 500 });
  }
}
