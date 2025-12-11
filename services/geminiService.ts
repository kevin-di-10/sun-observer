import { GoogleGenAI } from "@google/genai";
import { SunDataResponse, LocationInput } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchSunData = async (location: LocationInput, date: string): Promise<SunDataResponse> => {
  const modelId = "gemini-2.5-flash";
  
  const locationString = location.type === 'coords' 
    ? `latitude: ${location.lat}, longitude: ${location.lng}` 
    : `location: "${location.query}"`;

  const prompt = `
    Target Location: ${locationString}.
    Target Date: ${date}.
    
    Act as a professional landscape photographer and meteorologist.
    
    1. Identify the city/location name explicitly.
    2. Find the EXACT sunrise and sunset times for the Target Date at this location.
    3. Determine the Golden Hour times for that date.
    4. Analyze the weather for that specific date. 
       - If the date is in the PAST: Retrieve historical weather records (clouds, visibility) for that day.
       - If the date is TODAY or FUTURE: Use current forecast.
    5. Search for the BEST specific local spots (parks, viewpoints, beaches, hills) nearby to watch the Sunrise and Sunset.
    6. Rate the quality of the sunrise/sunset viewing experience (0-100).
       - For PAST dates: Rate it based on what the weather actually was.
       - For FUTURE dates: Rate based on forecast.
    7. Provide specific advice for photographers/observers.

    Return the result as a strictly formatted JSON object. 
    DO NOT use Markdown code blocks. Just return the raw JSON string.
    
    JSON Structure:
    {
      "locationName": "City, Region",
      "date": "The Target Date formatted readable (e.g., Oct 12, 2023)",
      "weather": {
        "temp": "temperature (with unit)",
        "condition": "short summary",
        "cloudCover": "percentage or description",
        "visibility": "distance"
      },
      "goldenHourMorning": "time range",
      "goldenHourEvening": "time range",
      "sunrise": {
        "time": "HH:MM AM/PM",
        "qualityScore": number (0-100),
        "qualityDescription": "short punchy verdict",
        "advice": "specific tip",
        "spots": [
          { "name": "Spot Name", "description": "Why it's good", "distance": "approx distance", "rating": "4.5" }
        ]
      },
      "sunset": {
        "time": "HH:MM AM/PM",
        "qualityScore": number (0-100),
        "qualityDescription": "short punchy verdict",
        "advice": "specific tip",
        "spots": [
          { "name": "Spot Name", "description": "Why it's good", "distance": "approx distance", "rating": "4.5" }
        ]
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We cannot use responseSchema with googleSearch, so we rely on the prompt to format JSON.
      },
    });

    const text = response.text || "";
    
    // Extract Sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
      ?.map((chunk) => chunk.web)
      .filter((web) => web !== undefined && web !== null)
      .map((web) => ({ title: web.title || "Source", uri: web.uri || "#" })) 
      || [];

    // Clean up potential markdown formatting if the model ignores the instruction
    let jsonString = text.trim();
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.replace(/^```json/, "").replace(/```$/, "");
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```/, "").replace(/```$/, "");
    }

    const data = JSON.parse(jsonString) as SunDataResponse;
    
    // Attach sources to the data object for display
    data.sources = sources;

    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze sun data. Please try again.");
  }
};