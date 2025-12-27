import { NextResponse } from 'next/server';
import {fetchFromSpreadsheet} from '@/app/utils/spreadsheet'

import { classifyWebsites } from '@/app/utils/gemini2';

async function formatData(aiRes, SpreadSheetData){
  let Data = []
  aiRes.forEach((item) => {
    const obj = SpreadSheetData.find((obj) => obj.url === item.url)
    
    if(obj){
      obj.categories = item.categories
      Data.push(obj)
    }
  })
  console.log('formatted data', Data)
  return Data
}


export async function GET() {
  const SpreadSheetData = await fetchFromSpreadsheet()

  let aiRes;
  let data
  if (SpreadSheetData.length > 5) {
    // Split into chunks of 5
    const chunks = [];
    for (let i = 0; i < SpreadSheetData.length; i += 5) {
      chunks.push(SpreadSheetData.slice(i, i + 5));
    }
    // Process each chunk concurrently
    const promises = chunks.map(async (chunk) => await classifyWebsites(chunk));
    const results = await Promise.all(promises);
    aiRes = results.flat();
  } else {
    aiRes = await classifyWebsites(SpreadSheetData);
  }
  
  // if (aiRes && aiRes.length !== 0 && SpreadSheetData && SpreadSheetData.length !== 0){
  //   data = await formatData(aiRes, SpreadSheetData)
  // } else{
  //   console.log(aiRes)
  // }

  // The console.log inside fetchFromSpreadsheet will now print to your VS Code terminal
  // where `npm run dev` is running.
  return NextResponse.json({ message: 'Done!', data: aiRes });
}


