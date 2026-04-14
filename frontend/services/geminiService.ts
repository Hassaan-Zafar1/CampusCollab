
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize Gemini assistant response using the recommended pattern with direct process.env.API_KEY access
export const getGeminiAssistantResponse = async (userMessage: string) => {
  try {
    // Creating instance inside function to ensure fresh API key context if applicable
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: "You are 'NED Collab AI', a helpful and friendly digital assistant for NED University students. You help them with academic queries, provide information about the NED Campus Collab platform, and offer advice on engineering and technology subjects. Keep your tone encouraging and professional.",
        temperature: 0.7,
      },
    });

    // Fix: Accessing .text property as it is a getter, not a method
    return response.text || "I'm sorry, I couldn't process that. Can you try again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong. Please check your connection and try again later.";
  }
};
