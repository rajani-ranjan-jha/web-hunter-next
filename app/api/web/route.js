import { connectDB } from "@/app/utils/connect";
import { WebModel } from "@/models/website";
import { NextResponse } from "next/server";

// Get all the web data
export async function GET(request) {
  await connectDB();
  try {
    const websites = await WebModel.find({});
    if (!websites || websites.length === 0) {
      // console.log("NOT FOUND websites!");
      return NextResponse.json({
        message: "no web data found on the server!",
        status: 404,
      });
    }
    // console.log("found websites!");
    return NextResponse.json({
      message: "data received successfully!",
      status: 200,
      data: websites,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error, status: 500 });
  }
}

// Add a new web data
export async function POST(request) {
  const { name, url, description, tags } = await request.json();
  if (!name || !url || !description || !tags) {
    return NextResponse.json({
      message: "all fields are required",
      status: 401,
    });
  }

  // console.log("server: ", { name, url, description, tags });

  try {
    await connectDB();
    const alreadyExists = await WebModel.findOne({ url: url });

    if (alreadyExists) {
      console.log(alreadyExists);
      return NextResponse.json({
        message: "this site is already present!",
        status: 409,
      });
    }
    const NewWebsite = new WebModel({
      name: name,
      url: url,
      description: description,
      tags: tags,
    });
    await NewWebsite.save();

    // WebModel.insertMany()

    return NextResponse.json({
      message: "new data added successfully!",
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error, status: 500 });
  }
}

// Update a web data
export async function PUT(request) {
  const { web_id, name, url, description, tags } = await request.json();
  console.log("TO UPDATE:", { web_id, name, url, description, tags });

  try {
    await connectDB();
    // const Web = await WebModel.findOne({_id: web_id})
    const UpdatedWeb = await WebModel.findByIdAndUpdate(
      web_id,
      { name: name, url: url, description: description, tags: tags },
      { new: true }
    );

    if (UpdatedWeb) {
      console.log("UPDATED: ", UpdatedWeb);
    }
    return NextResponse.json({
      message: "data updated successfully!",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "unable to update, interneal server error!",
      status: 500,
    });
  }
}

// Delete a web data
export async function DELETE(request) {
  const { web_id } = await request.json();

  try {
    await connectDB();
    // const Web = await WebModel.findOne({_id: web_id})
    const DeleteWeb = await WebModel.findByIdAndDelete(web_id);

    if (!DeleteWeb) {
      return NextResponse.json({
        message: "no web data found with the given id",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "data deleted successfully!",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "unable to update, interneal server error!",
      status: 500,
    });
  }
}
