import { GoogleGenAI } from "@google/genai";

const generateDescription = async (title: string): Promise<string> => {
    // FIX: API Key is checked at the beginning of the function call.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY for Gemini is not set. Description generation will not work.");
        return Promise.reject("API Key not configured.");
    }
    
    // FIX: GoogleGenAI client is initialized only when needed and with a valid API key.
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Genera una descripción breve, atractiva y amigable para un anuncio en una plataforma de comercio hiperlocal en Antofagasta, Chile. El título del anuncio es "${title}". La descripción debe ser concisa (2-3 frases), resaltar que es un producto/servicio local y tener un tono positivo y comunitario. No uses hashtags.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate description from Gemini.");
    }
};

export const geminiService = {
    generateDescription,
};
