"use server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function interpretFile(base64File: string, fileType: string, profile: any) {
  if (fileType === "application/pdf") {
    return { error: "PDF detected! Please upload a JPG or PNG screenshot of the report instead (Groq Vision doesn't read raw PDFs yet)." };
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze this medical report for a ${profile.age}yo ${profile.sex}. Explain findings simply.` },
            { type: "image_url", image_url: { url: base64File } },
          ],
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });

    return { text: response.choices[0]?.message?.content || "Could not read report." };
  } catch (error) {
    return { error: "Analysis failed. Please ensure the image is clear and under 4MB." };
  }
}
