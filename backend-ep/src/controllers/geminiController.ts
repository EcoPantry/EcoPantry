import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const model = "gemma-3-1b-it";

export const getRecipeTips = async (req: Request, res: Response) => {
  try {
    const { title, ingredients, instructions } = req.body;
    if (!title || !Array.isArray(ingredients) || !Array.isArray(instructions)) {
      res.status(400).json({ error: "Missing or invalid input fields" });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
Given an ingredient list, and a set of instructions for a recipe. Come up with a difficulty rating on how easy it is to make the recipe - 1 to 5 with 1 being easy, and 5 being difficult.

Assess the difficulty based on the ingredients, preparation, skills and techniques required to prepare the dish for a home cook.

Provide a short summary of the assessed difficulty. Followed by a mini-glossary on techniques/skills found in the instructions to help home cooks understand the recipe better. 

Output in JSON: {
difficulty: (number from 1 to 5)
justification: (1 - 3 lines)
mini-glossary: (unordered list)
}

Input: {
title: (title of dish)
ingredients: [array of strings]
instructions: [array of strings]
}
`;

    const contents = [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            text: JSON.stringify({ title, ingredients, instructions }),
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config: { responseMimeType: "text/plain" },
      contents,
    });

    let result = "";
    for await (const chunk of response) {
      result += chunk.text;
    }

    // Try to parse JSON from the result
    let jsonStart = result.indexOf("{");
    let jsonEnd = result.lastIndexOf("}");
    let json = null;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        json = JSON.parse(result.slice(jsonStart, jsonEnd + 1));
        res.status(200).json(json);
        return;
      } catch {
        // fallback: return raw text
        res.status(400).json({
          error: "Failed to parse JSON from Gemini response",
        });
        return;
      }
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to get recipe tips" });
  }
};
