import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

const processFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const extractDocumentData = async (file: File): Promise<ExtractedData> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API_KEY not found. Returning mock data.");
      // Fallback for demo purposes if no key is present
      return new Promise(resolve => setTimeout(() => resolve({
        name: "Rahul Sharma",
        dob: "1990-05-15",
        aadhaarNumber: "1234 1234 1234"
      }), 2000));
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await processFileToBase64(file);
    const mimeType = file.type;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Extract the Name, Date of Birth (YYYY-MM-DD format), and Aadhaar Number from this ID document. If it is an Aadhaar card, extract the 12 digit number."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            dob: { type: Type.STRING, description: "YYYY-MM-DD" },
            aadhaarNumber: { type: Type.STRING }
          },
          required: ["name", "dob", "aadhaarNumber"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ExtractedData;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
