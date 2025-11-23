import { GetDataUsingURL } from "@/app/utils/cheerio"
import { NextResponse } from "next/server"

export async function POST(request){
    try {
        
        const {url} = await request.json()
        // console.log("URL:",url)
        const result = await GetDataUsingURL(url)
        return NextResponse.json({message: "Got the info of the site using the URL", data: result, status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Internal server error", status: 500})
    }
}