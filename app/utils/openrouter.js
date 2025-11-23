import { NextResponse } from "next/server";

const apikey = process.env.OPENROUTER_API_KEY 
const backupModels = ['z-ai/glm-4.5-air:free', 'tngtech/deepseek-r1t2-chimera:free', 'openai/gpt-oss-20b:free', 'nvidia/nemotron-nano-12b-v2-vl:free']


export const OpenRouter = async (SiteDescription, modelName = "kwaipilot/kat-coder-pro:free") => {
  const modelsToTry = [modelName, ...backupModels];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apikey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: `Given the following description of a website, Summarize the description such that it must be lesser than 110 characters(letters).
                And remember that you DONOT have include any extra text rather than the summarized description. Like the length of summarize description, etc.

                Description: ${SiteDescription}`,
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textOutput = data?.choices[0]?.message?.content;
        if (textOutput) {
          return textOutput;
        }
      } else {
        const errorText = await response.text();
        console.error(`API Error with model ${model}:`, errorText);
      }
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
    }
  }

  // If all models fail, return default message
  return 'No AI description found!';
};

