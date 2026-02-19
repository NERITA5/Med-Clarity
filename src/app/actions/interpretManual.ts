"use server";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function interpretManualResults(results: string, profile: any) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a medical lab expert for MedClarity. 
          Analyze the user's lab results given their profile: ${profile.age}yo ${profile.sex}, ${profile.weight}kg.
          Explain what the numbers mean simply. Always end with: "Consult a doctor for a formal diagnosis."`
        },
        {
          role: "user",
          content: `Here are my results: ${results}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Lower temperature for more accurate medical facts
    });

    return { text: completion.choices[0]?.message?.content || "Analysis failed." };

  } catch (error: any) {
    console.error("Groq Manual Error:", error);
    return { error: "Could not analyze results right now. Please try again." };
  }
}