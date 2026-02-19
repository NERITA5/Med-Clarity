"use server";
import Groq from "groq-sdk";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function interpretFile(base64File: string, fileType: string, profile: any) {
  // 1. Security Check: Get the user from Clerk
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to analyze reports." };
  }

  if (fileType === "application/pdf") {
    return { error: "PDF detected! Please upload a JPG or PNG instead." };
  }

  try {
    // 2. AI Analysis
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze this medical report for a ${profile.age}yo ${profile.sex}. Explain findings simply and clearly.` },
            { type: "image_url", image_url: { url: base64File } },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview", // Note: Ensure you use a vision-capable model
    });

    const aiResult = response.choices[0]?.message?.content || "Could not read report.";

    // 3. Database Save: Persist to Neon via Prisma
    await prisma.labReport.create({
      data: {
        userId: userId, // Links the report to the user
        analysis: aiResult,
        status: "COMPLETED",
        // Add other fields if your schema requires them (e.g., fileUrl)
      }
    });

    return { text: aiResult };
  } catch (error) {
    console.error("Analysis Error:", error);
    return { error: "Analysis failed. Please ensure the image is clear and under 4MB." };
  }
}