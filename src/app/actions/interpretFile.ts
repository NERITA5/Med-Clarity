"use server";
import Groq from "groq-sdk";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function interpretFile(base64File: string, fileType: string, profile: any) {
  const { userId } = await auth();
  if (!userId) return { error: "Auth failed" };

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze lab for ${profile.age}yo ${profile.sex}.` },
            { type: "image_url", image_url: { url: base64File } },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview",
    });

    const aiResult = response.choices[0]?.message?.content || "No result";

    // DEBUG: We are going to try an upsert or a direct create
    // This ensures we link to the Clerk ID properly
    const savedReport = await prisma.labReport.create({
      data: {
        userId: userId,
        aiInterpretation: aiResult,
        rawText: "Vision Analysis",
        imageUrl: "Processed",
      }
    });

    console.log("Database Save Success:", savedReport.id);
    return { text: aiResult };
  } catch (error: any) {
    console.error("CRITICAL DATABASE ERROR:", error.message);
    return { error: `Analysis worked but DB Save failed: ${error.message}` };
  }
}
