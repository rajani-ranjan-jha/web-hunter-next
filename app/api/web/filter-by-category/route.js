import { connectDB } from "@/app/utils/connect"
import { WebModel } from "@/models/website"
import { NextResponse } from "next/server"

// filter by category name(tag name)
export async function POST(request){
    const {category_name} = await request.json()
    if(!category_name){
        return NextResponse.json({message: "category name must be provided", status: 400})
    }

    await connectDB()
    try {
        const websites = await WebModel.find({});
        // const Filtered = await websites.filter((web) => web.tags.includes(category_name))
        const Filtered = websites.filter((item) =>
          item.tags.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === category_name)
        )
        if (!Filtered || Filtered.length === 0) {
          // console.log("NOT FOUND websites!");
          return NextResponse.json({
            message: "No data found with this category name",
            status: 404,
          });
        }
        // console.log("found websites!");
        return NextResponse.json({
          message: "data received successfully!",
          status: 200,
          data: Filtered,
        });
      } catch (error) {
        console.log(error)
        return NextResponse.json({message: error, status: 500})
        
      }
}