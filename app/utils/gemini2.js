import { GoogleGenerativeAI } from "@google/generative-ai";
import { allCategories } from "@/public/categories";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function extractJson(text) {
  // Remove ```json or ``` wrappers if present
  return text
    .replace(/```json\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

// function verifyAllfields(SheetData){
//     return SheetData.filter(data =>
//         data.URL != null && data.TITLE != null && data.DESCRIPTION != null
//     );
// }

export async function classifyWebsites(data) {
  if (data.length == 0) return "Data is empty(gemini)";
  const inputData = Array.isArray(data) ? data : [data];
  // const veryfiedInputData = verifyAllfields(inputData)

  const prompt = `
You are an expert website classifier.

TASK:
- Classify each website into ONE OR MORE categories.
- Categories MUST be chosen ONLY from the allowed list.
- If multiple categories apply, return all relevant ones (don't choose more than 5 category for a particular entry).
- You must have to return atleast one category for an entry.

ALLOWED CATEGORIES:
${JSON.stringify(allCategories)}

INPUT DATA:
${JSON.stringify(inputData, null, 2)}


OUTPUT FORMAT:
[
  {
    "url": "string",
    "name": "string",
    "description": "string",
    "tags": ["Category1", "Category2"]
  }
]`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const cleanedJson = extractJson(rawText);
    // console.log("AI modified ouput: ", cleanedJson)
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Gemini classification error:", error);
    throw error;
  }
}

