"use server";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getChatResponse(message: string, history: any[], profile: any) {
  try {
    // Define the system message
    const systemMessage = {
      role: "system" as const,
      content: `You are MedClarity AI, a medical assistant. User: ${profile.age}yo ${profile.sex}.`,
    };

    // Format history with explicit role typing
    const formattedHistory = history.map((m: any) => ({
      role: (m.role === "ai" ? "assistant" : "user") as "assistant" | "user",
      content: String(m.content),
    }));

    const response = await groq.chat.completions.create({
      messages: [
        systemMessage,
        ...formattedHistory,
        { role: "user" as const, content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
    });

    return response.choices[0]?.message?.content || "No response generated.";
  } catch (error: any) {
    console.error("Groq Build Error:", error);
    return "Service temporarily unavailable.";
  }
}